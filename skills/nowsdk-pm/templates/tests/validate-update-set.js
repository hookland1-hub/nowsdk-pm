/*
 * Generic update-set validator (TEMPLATE).
 * Validates the packaged Update Set XML produced by the offline converter.
 * Records live HTML-escaped inside <payload>, so a table tag appears as
 * `&lt;<table>` and each maps to a <name><table>_<32hex></name>.
 */
const fs = require('fs')
const path = require('path')

const p = process.argv[2]
if (!p) throw new Error('Usage: node tests/validate-update-set.js <path-to-update-set-xml>')
const full = path.resolve(p)
if (!fs.existsSync(full)) throw new Error(`Update set XML not found: ${full}`)
const xml = fs.readFileSync(full, 'utf8')
function assert(c, m) { if (!c) throw new Error(m) }

assert(xml.includes('<sys_remote_update_set'), 'missing <sys_remote_update_set> wrapper')
assert(xml.includes('<sys_update_xml'), 'missing <sys_update_xml> records')
assert(xml.includes('&lt;sys_app') || xml.includes('<name>sys_app_'), 'must include the sys_app record (self-contained app)')

// Role containment is intentionally excluded from offline update sets.
assert(!xml.includes('sys_user_role_contains'), 'must NOT include sys_user_role_contains records')

const count = (xml.match(/<sys_update_xml/g) || []).length
assert(count >= 1, `expected at least 1 sys_update_xml record, found ${count}`)

console.log(`Update set validation passed with ${count} sys_update_xml records.`)
