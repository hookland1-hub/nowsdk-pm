# ServiceNow scoped-app component checklist (A→Z, step 0 → delivery)

Use this to ensure the design covers every component needed for a working app. Tick what applies;
mark N/A with a reason. Each item maps to a Fluent capability (see `fluent-capability-matrix.md`).

## Step 0 — Foundations
- [ ] Application scope decided: `x_<vendor>_<app>` (lowercase) + stable `scopeId` (md5 of scope)
- [ ] `now.config.json` (scope, scopeId, name, tsconfig; optional `accessControls`)
- [ ] Project scaffold (`src/fluent`, `src/server`, `tools`, `tests`, `index.now.ts`)
- [ ] Prerequisites: Node + `@servicenow/sdk`; official `now-sdk explain` skill; superpowers

## Data model
- [ ] Tables (`Table()`) with display field, audit, indexes
- [ ] Columns (string/choice/boolean/integer/date/reference/list)
- [ ] Choice lists (value → label)
- [ ] Relationships (reference / Glide List / M2M assignment tables)
- [ ] Auto-number (`number` column + `autoNumber`) where an identifier is needed
- [ ] Retention/date fields + governance for personal data (GDPR), if applicable
- [ ] Logical deletion (`active` flag) policy

## Security
- [ ] Application roles (`Role()`) + inheritance (`containsRoles`)
- [ ] Record ACLs per table per operation (read/create/write/delete)
- [ ] `ux_route` ACL for workspace access (if a workspace exists)
- [ ] Scope protection / cross-scope access policy (if exposing an API)

## Business logic
- [ ] Script Include(s) — reusable server logic / integration API (read-only single access point)
- [ ] Business Rules (before/after/async) for data integrity & automation
- [ ] UI Actions / UI Policies (buttons, field rules; list-choice for bulk)
- [ ] Scheduled jobs (`ScheduledScript`) for periodic tasks (e.g. retention sweeps)
- [ ] System properties (`Property`) for configurable behavior

## User interface
- [ ] Consultation surface: Configurable Workspace lists / Service Portal console
- [ ] Management surface: Workspace CRUD / Service Portal management
- [ ] Application menu + modules (backend navigation; URL module to a portal page if useful)
- [ ] Dashboards (KPIs) if needed
- [ ] Service Portal (portal/pages/widgets) for custom single-page UX — remember the SP gotchas
- [ ] Classic Form/List/UI Page where appropriate
- [ ] Note: custom UX Builder pages are NOT offline-buildable (use Service Portal / UiPage)

## Data & quality
- [ ] Seed/reference data (non-personal) as a separate XML data unload
- [ ] Import strategy for operational data (Import Sets / Transform Maps)
- [ ] Validators (source / update-set / seed) — keep them ahead of risky packaging

## Test
- [ ] ATF: ACL regression, functional Script Include, relationship integrity

## Release & delivery
- [ ] Offline build → converter → single `sys_remote_update_set` XML (self-contained, includes `sys_app`)
- [ ] Optional delta packaging (`--include=...`) for already-deployed apps; DELETE-record handling
- [ ] Import procedure (Retrieved Update Sets → Import from XML → Preview → Commit)
- [ ] Seed import (list → Import XML), post-commit
- [ ] Role assignment + target plugin prerequisites (Service Portal / Now Experience)
- [ ] Operational guide / documentation for the client
- [ ] Open points captured & owner assigned
