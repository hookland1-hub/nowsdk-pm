/*
 * Generic source validator (TEMPLATE).
 * Runs BEFORE `now-sdk build`. Add project-specific assertions (expected tables,
 * roles, choices, ACL patterns, portal/widget ids) as your app grows — keeping
 * validators ahead of risky packaging behavior is what makes the workflow reliable.
 */
const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')

function assert(cond, msg) { if (!cond) throw new Error(msg) }
function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

const cfgText = fs.existsSync(path.join(root, 'now.config.json'))
  ? fs.readFileSync(path.join(root, 'now.config.json'), 'utf8')
  : ''
assert(cfgText, 'now.config.json must exist at the project root')
const cfg = JSON.parse(cfgText)
assert(/^x_[a-z0-9_]+$/.test(cfg.scope || ''), 'scope must look like x_<vendor>_<app>')
assert(/^[0-9a-f]{32}$/.test(cfg.scopeId || ''), 'scopeId must be a stable 32-char hex sys_id')
assert(cfg.name && String(cfg.name).trim().length > 0, 'app name must be set')

const fluentFiles = walk(path.join(root, 'src', 'fluent')).filter((f) => f.endsWith('.now.ts'))
assert(fluentFiles.length > 0, 'at least one src/fluent/*.now.ts file must exist')
const indexFile = path.join(root, 'src', 'fluent', 'index.now.ts')
assert(fs.existsSync(indexFile), 'src/fluent/index.now.ts (entrypoint) must exist')
const indexSrc = fs.readFileSync(indexFile, 'utf8')
assert(indexSrc.includes('export *'), 'index.now.ts must re-export the metadata modules (export * from ...)')

console.log(`Source validation passed for ${fluentFiles.length} fluent files (scope ${cfg.scope}).`)
