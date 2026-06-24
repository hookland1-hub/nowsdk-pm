#!/usr/bin/env node
/*
 * Generic seed/demo data generator (TEMPLATE).
 *
 * Emits a ServiceNow XML data unload file (NOT an update set) with deterministic
 * sys_ids and NON-PERSONAL demo data. Import it from any list:
 *   right-click a column header > Import XML.
 *
 * Customize SCOPE and the dataset below for your tables. Keep demo data
 * non-personal (use example.invalid emails and fake numbers).
 */
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const outputFileArg = process.argv[2]
if (!outputFileArg) {
  console.error('Usage: node tools/generate-seed-data.js <output.xml>')
  process.exit(2)
}
const outputFile = path.resolve(outputFileArg)

// TODO: set your application scope prefix, e.g. 'x_acme_app'
const SCOPE = 'x_scope_app'

function sysId(key) {
  return crypto.createHash('md5').update(`${SCOPE}-seed:${key}`).digest('hex')
}
function serviceNowDate(d = new Date()) {
  const p = (v) => String(v).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
function escapeXml(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
function fieldXml(name, raw) {
  if (raw && typeof raw === 'object' && Object.hasOwn(raw, 'value')) {
    return `<${name} display_value="${escapeXml(raw.display)}">${escapeXml(raw.value)}</${name}>`
  }
  return `<${name}>${escapeXml(raw)}</${name}>`
}
function recordXml(table, record, now) {
  const lines = [`<${table} action="INSERT_OR_UPDATE">`]
  lines.push(fieldXml('sys_id', record.sys_id))
  lines.push(fieldXml('sys_created_by', 'admin'))
  lines.push(fieldXml('sys_created_on', now))
  lines.push(fieldXml('sys_mod_count', 0))
  lines.push(fieldXml('sys_updated_by', 'admin'))
  lines.push(fieldXml('sys_updated_on', now))
  for (const [field, value] of Object.entries(record.fields)) lines.push(fieldXml(field, value))
  lines.push(`</${table}>`)
  return lines.join('\n')
}

// ---- Example dataset (replace with your own) -------------------------------
// One demo table `<SCOPE>_demo` with two non-personal rows.
const demo = [
  { key: 'demo_1', name: 'Demo record A', email: 'demo-a@example.invalid', active: true },
  { key: 'demo_2', name: 'Demo record B', email: 'demo-b@example.invalid', active: true },
]

const now = serviceNowDate()
const lines = ['<?xml version="1.0" encoding="UTF-8"?>', `<unload unload_date="${escapeXml(now)}">`]
for (const r of demo) {
  lines.push(
    recordXml(`${SCOPE}_demo`, {
      sys_id: sysId(r.key),
      fields: { name: r.name, email: r.email, active: r.active },
    }, now)
  )
}
lines.push('</unload>')

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8')
console.log(`Wrote ${outputFile}`)
console.log(`Included ${demo.length} seed record(s).`)
