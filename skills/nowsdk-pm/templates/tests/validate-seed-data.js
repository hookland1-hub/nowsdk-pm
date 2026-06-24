/*
 * Generic seed-data validator (TEMPLATE).
 * Validates the ServiceNow XML data unload produced by generate-seed-data.js.
 */
const fs = require('fs')
const path = require('path')

const p = process.argv[2]
if (!p) throw new Error('Usage: node tests/validate-seed-data.js <path-to-seed-data-xml>')
const full = path.resolve(p)
if (!fs.existsSync(full)) throw new Error(`Seed data XML not found: ${full}`)
const xml = fs.readFileSync(full, 'utf8')
function assert(c, m) { if (!c) throw new Error(m) }

assert(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'seed XML must declare UTF-8')
assert(xml.includes('<unload unload_date='), 'seed XML must use the ServiceNow unload format')
assert(!xml.includes('sys_user_role_contains'), 'seed data must not alter platform role containment')

const ids = [...xml.matchAll(/<sys_id>([0-9a-f]{32})<\/sys_id>/g)].map((m) => m[1])
assert(ids.length > 0, 'seed XML must contain at least one record')
assert(ids.length === new Set(ids).size, 'seed sys_ids must be unique')

console.log(`Seed data validation passed with ${ids.length} records.`)
