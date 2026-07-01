#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const TABLE_TYPES = {
  sys_app: 'Custom Application',
  sys_store_app: 'Store Application',
  sys_user_role: 'Role',
  sys_security_acl: 'Access Control',
  sys_script: 'Business Rule',
  sys_script_client: 'Client Script',
  sys_script_include: 'Script Include',
  sys_ui_action: 'UI Action',
  sys_ui_policy: 'UI Policy',
  sys_module: 'Module',
  sys_app_module: 'Module',
  sys_app_application: 'Application Menu',
  sys_properties: 'System Property',
  sys_ws_definition: 'Scripted REST API',
  sys_ws_operation: 'Scripted REST Resource',
  sys_ws_version: 'Scripted REST Version',
  sys_flow: 'Flow',
  sys_hub_flow: 'Flow',
  sys_atf_test: 'ATF Test',
  sys_db_object: 'Table',
  sys_dictionary: 'Dictionary Entry',
  sys_ux_page_registry: 'Workspace',
  sys_ux_list_menu_config: 'Workspace List Menu',
  sys_ux_list_category: 'Workspace List Category',
  sys_ux_list: 'Workspace List',
  sys_ux_applicability: 'Applicability',
  sys_ux_applicability_m2m_list: 'Applicability',
  par_dashboard: 'Dashboard',
}

const EXCLUDED_UPDATE_TABLES = new Set([
  'sys_user_role_contains',
])

// Source->artifact bookkeeping the SDK appends *inside* BYOUI (React/Vue) `sys_ui_page` and
// `sys_ux_lib_asset` payloads (siblings of the primary element within <record_update>). These
// `sn_glider_source_artifact` / `_m2m` rows belong to the Glider source-artifact framework — a
// dev-sync convenience, NOT needed to render the page. On a target that lacks that framework they
// fail to commit (in two waves: the `_m2m` join first, then the parent record). Strip them for a
// clean no-auth offline import. The source-zip `sys_attachment`/`sys_attachment_doc` are left in
// place (base tables: they commit cleanly and are harmless once orphaned).
const STRIPPED_EMBEDDED_TABLES = ['sn_glider_source_artifact_m2m', 'sn_glider_source_artifact']

function stripEmbeddedBookkeeping(xml) {
  let result = xml
  let removed = 0
  for (const table of STRIPPED_EMBEDDED_TABLES) {
    const paired = new RegExp(`[\\t ]*<${table}\\b[^>]*>[\\s\\S]*?<\\/${table}>\\s*\\n?`, 'g')
    const selfClosing = new RegExp(`[\\t ]*<${table}\\b[^>]*\\/>\\s*\\n?`, 'g')
    result = result.replace(paired, () => ((removed += 1), ''))
    result = result.replace(selfClosing, () => ((removed += 1), ''))
  }
  return { xml: result, removed }
}

function usage() {
  console.error(
    'Usage: node tools/sdk-dist-to-update-set.js <dist/app> <output.xml> [update-set-name] [--include=spec,...]'
  )
  console.error(
    '  --include  Delta mode. Comma-separated list of table names or prefixes ending with "*"'
  )
  console.error(
    '             (e.g. --include=sp_*,sys_script_include). Only matching records are emitted;'
  )
  console.error(
    '             the sys_app record is used for header metadata but emitted only if it matches.'
  )
  console.error(
    '  --version  Package version shown in the update-set description (default: the sys_app version).'
  )
  console.error(
    '  --notes    Free-text note of what this (re)build adds/changes — shown in the description.'
  )
  process.exit(2)
}

const rawArgs = process.argv.slice(2)
const flagArgs = rawArgs.filter((arg) => arg.startsWith('--'))
const positionalArgs = rawArgs.filter((arg) => !arg.startsWith('--'))
const [distAppDirArg, outputFileArg, updateSetNameArg] = positionalArgs
if (!distAppDirArg || !outputFileArg) usage()

const includeFlag = flagArgs.find((arg) => arg.startsWith('--include='))
const includeSpec = includeFlag
  ? includeFlag
      .slice('--include='.length)
      .split(',')
      .map((spec) => spec.trim())
      .filter(Boolean)
  : []
const deltaMode = includeSpec.length > 0

function isIncludedTable(table) {
  if (!deltaMode) return true
  return includeSpec.some((spec) =>
    spec.endsWith('*') ? table.startsWith(spec.slice(0, -1)) : table === spec
  )
}

const distAppDir = path.resolve(distAppDirArg)
const outputFile = path.resolve(outputFileArg)
if (!fs.existsSync(distAppDir) || !fs.statSync(distAppDir).isDirectory()) {
  throw new Error(`Input directory not found: ${distAppDir}`)
}

function guid() {
  return crypto.randomBytes(16).toString('hex')
}

function serviceNowDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function listXmlFiles(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name === 'dictionary') {
      continue
    }
    if (entry.isDirectory()) {
      files.push(...listXmlFiles(fullPath))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.xml')) {
      files.push(fullPath)
    }
  }
  return files.sort((a, b) => {
    const aScope = a.includes(`${path.sep}scope${path.sep}`) ? 0 : 1
    const bScope = b.includes(`${path.sep}scope${path.sep}`) ? 0 : 1
    return aScope - bScope || a.localeCompare(b)
  })
}

function tagValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`))
  if (!match) return ''
  return match[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/u, '$1').trim()
}

function tagDisplayValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}\\s+[^>]*display_value="([^"]*)"[^>]*>`))
  return match ? match[1] : ''
}

function parseRecord(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  const tableMatch =
    xml.match(/<record_update\b[^>]*\btable="([^"]+)"/) ||
    xml.match(/<record_update\b[^>]*>\s*<([a-z0-9_]+)\b/i)
  if (!tableMatch) {
    throw new Error(`Not a record_update XML file: ${filePath}`)
  }

  const table = tableMatch[1]
  // Action declared on the inner record element (INSERT_OR_UPDATE | DELETE).
  // Removed records are emitted by the SDK as action="DELETE"; this must be
  // propagated to the sys_update_xml.action field or commit would re-create them.
  const innerActionMatch = xml.match(new RegExp(`<${table}\\b[^>]*\\baction="([^"]+)"`))
  const recordAction = innerActionMatch ? innerActionMatch[1] : 'INSERT_OR_UPDATE'
  const sysId = tagValue(xml, 'sys_id') || guid()
  const updateName = tagValue(xml, 'sys_update_name') || `${table}_${sysId}`
  const targetName =
    tagValue(xml, 'sys_name') ||
    tagValue(xml, 'title') ||
    tagValue(xml, 'name') ||
    tagDisplayValue(xml, 'sys_scope') ||
    updateName

  // Metadata above is read from the primary element; strip embedded source-artifact
  // bookkeeping from the payload that actually gets committed.
  const stripped = stripEmbeddedBookkeeping(xml)

  return {
    filePath,
    xml,
    payloadXml: stripped.xml,
    strippedCount: stripped.removed,
    table,
    sysId,
    updateName,
    targetName,
    recordAction,
    type: TABLE_TYPES[table] || table,
    replaceOnUpgrade: tagValue(xml, 'sys_replace_on_upgrade') || 'false',
  }
}

const parsedRecords = listXmlFiles(distAppDir).map(parseRecord)
const excludedRecords = parsedRecords.filter((record) => EXCLUDED_UPDATE_TABLES.has(record.table))
const records = parsedRecords.filter((record) => !EXCLUDED_UPDATE_TABLES.has(record.table))
if (records.length === 0) {
  throw new Error(`No XML files found under ${distAppDir}`)
}

const appRecord =
  records.find((record) => record.table === 'sys_app') ||
  records.find((record) => record.table === 'sys_store_app')

if (!appRecord) {
  throw new Error('No sys_app or sys_store_app XML found. Build output is not a complete application package.')
}

// In delta mode only the whitelisted records are emitted. The sys_app record is
// still used above for header metadata but is not emitted unless it matches.
const emittedRecords = records.filter((record) => isIncludedTable(record.table))
if (deltaMode && emittedRecords.length === 0) {
  throw new Error(`No records matched --include=${includeSpec.join(',')} under ${distAppDir}`)
}

const appXml = appRecord.xml
const appId = tagValue(appXml, 'sys_id') || appRecord.sysId
const appScope = tagValue(appXml, 'scope') || tagValue(appXml, 'sys_code') || 'global'
const appName = tagValue(appXml, 'name') || updateSetNameArg || appScope
const appVersion = tagValue(appXml, 'version') || '1.0.0'
const updateSetName = updateSetNameArg || `${appName} ${appVersion}`
const now = serviceNowDate()
const remoteUpdateSetId = guid()
const remoteSysId = guid()

// Human-readable versioning + auto contents declaration for the update-set description, so the
// Retrieved Update Sets list / Preview page make incremental rebuilds and full re-imports
// unambiguous (which version, FULL vs DELTA, what changed, and exactly what the package includes).
const versionFlag = flagArgs.find((arg) => arg.startsWith('--version='))
const notesFlag = flagArgs.find((arg) => arg.startsWith('--notes='))
const packageVersion = (versionFlag ? versionFlag.slice('--version='.length).trim() : '') || appVersion
const notes = notesFlag ? notesFlag.slice('--notes='.length).trim().replace(/^["']|["']$/g, '') : ''
const contentsByType = emittedRecords.reduce((acc, record) => {
  acc[record.type] = (acc[record.type] || 0) + 1
  return acc
}, {})
const contentsSummary = Object.entries(contentsByType)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([type, count]) => `${type}×${count}`)
  .join(', ')
const packageKind = deltaMode ? `DELTA (--include=${includeSpec.join(',')})` : 'FULL'
const descriptionParts = [`${updateSetName} · v${packageVersion} · ${packageKind} · generated ${now}`]
if (notes) descriptionParts.push(notes)
descriptionParts.push(`Includes ${emittedRecords.length} record(s): ${contentsSummary}`)
const updateSetDescription = descriptionParts.join(' | ')

const lines = []
lines.push('<?xml version="1.0" encoding="UTF-8"?>')
lines.push(`<unload unload_date="${escapeXml(now)}">`)
lines.push('<sys_remote_update_set action="INSERT_OR_UPDATE">')
lines.push(`<application display_value="${escapeXml(appName)}">${escapeXml(appId)}</application>`)
lines.push(`<application_name>${escapeXml(appName)}</application_name>`)
lines.push(`<application_scope>${escapeXml(appScope)}</application_scope>`)
lines.push(`<application_version>${escapeXml(appVersion)}</application_version>`)
lines.push('<collisions/>')
lines.push('<commit_date/>')
lines.push('<deleted/>')
lines.push(`<description>${escapeXml(updateSetDescription)}</description>`)
lines.push('<inserted/>')
lines.push(`<name>${escapeXml(updateSetName)}</name>`)
lines.push('<origin_sys_id/>')
lines.push('<release_date/>')
lines.push(`<remote_sys_id>${escapeXml(remoteSysId)}</remote_sys_id>`)
lines.push('<state>loaded</state>')
lines.push('<summary/>')
lines.push('<sys_created_by>admin</sys_created_by>')
lines.push(`<sys_created_on>${escapeXml(now)}</sys_created_on>`)
lines.push(`<sys_id>${escapeXml(remoteUpdateSetId)}</sys_id>`)
lines.push('<sys_mod_count>0</sys_mod_count>')
lines.push('<sys_updated_by>admin</sys_updated_by>')
lines.push(`<sys_updated_on>${escapeXml(now)}</sys_updated_on>`)
lines.push('<update_set display_value=""/>')
lines.push('<update_source display_value=""/>')
lines.push('<updated/>')
lines.push('</sys_remote_update_set>')

for (const record of emittedRecords) {
  lines.push('<sys_update_xml action="INSERT_OR_UPDATE">')
  lines.push(`<action>${escapeXml(record.recordAction)}</action>`)
  lines.push(`<application display_value="${escapeXml(appName)}">${escapeXml(appId)}</application>`)
  lines.push('<category>customer</category>')
  lines.push('<comments/>')
  lines.push(`<name>${escapeXml(record.updateName)}</name>`)
  lines.push(`<payload>${escapeXml(record.payloadXml)}</payload>`)
  lines.push(
    `<remote_update_set display_value="${escapeXml(updateSetName)}">${escapeXml(remoteUpdateSetId)}</remote_update_set>`
  )
  lines.push(`<replace_on_upgrade>${escapeXml(record.replaceOnUpgrade)}</replace_on_upgrade>`)
  lines.push('<sys_created_by>admin</sys_created_by>')
  lines.push(`<sys_created_on>${escapeXml(now)}</sys_created_on>`)
  lines.push(`<sys_id>${guid()}</sys_id>`)
  lines.push('<sys_mod_count>0</sys_mod_count>')
  lines.push('<sys_updated_by>admin</sys_updated_by>')
  lines.push(`<sys_updated_on>${escapeXml(now)}</sys_updated_on>`)
  lines.push('<table/>')
  lines.push(`<target_name>${escapeXml(record.targetName)}</target_name>`)
  lines.push(`<type>${escapeXml(record.type)}</type>`)
  lines.push('<update_domain>global</update_domain>')
  lines.push('<update_set display_value=""/>')
  lines.push('<view/>')
  lines.push('</sys_update_xml>')
}

lines.push('</unload>')

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8')

console.log(`Wrote ${outputFile}`)
console.log(`Update set: ${updateSetName} · v${packageVersion} · ${packageKind}`)
console.log(`Description: ${updateSetDescription}`)
if (deltaMode) {
  const byTable = emittedRecords.reduce((acc, record) => {
    acc[record.table] = (acc[record.table] || 0) + 1
    return acc
  }, {})
  console.log(`Delta mode --include=${includeSpec.join(',')}`)
  console.log(`Included ${emittedRecords.length} SDK XML record(s) of ${records.length} total.`)
  console.log(
    `By table: ${Object.keys(byTable)
      .sort()
      .map((table) => `${table}=${byTable[table]}`)
      .join(', ')}`
  )
} else {
  console.log(`Included ${emittedRecords.length} SDK XML record(s).`)
}
if (excludedRecords.length > 0) {
  console.log(
    `Excluded ${excludedRecords.length} SDK XML record(s): ${[...new Set(excludedRecords.map((record) => record.table))].join(', ')}.`
  )
}
const strippedTotal = emittedRecords.reduce((sum, record) => sum + (record.strippedCount || 0), 0)
if (strippedTotal > 0) {
  console.log(
    `Stripped ${strippedTotal} embedded source-artifact bookkeeping block(s) (${STRIPPED_EMBEDDED_TABLES.join(', ')}) from BYOUI payloads.`
  )
}
