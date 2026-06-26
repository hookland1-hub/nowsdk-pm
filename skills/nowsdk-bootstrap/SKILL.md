---
name: nowsdk-bootstrap
description: Use when the user wants to set up / scaffold a ServiceNow Now SDK workspace for a scoped application — ready to deliver either live via the standard Now SDK (with auth — install/deploy) or fully offline as a no-auth Update Set XML (build → converter → Retrieved Update Sets). Scaffolds the project (Fluent, converter, validators, scripts, now.config); the skill itself never connects to or authenticates against an instance.
---

# NowSdkBootstrap — scaffold a Now SDK workspace (deliver live or offline)

Scaffold a real **Now SDK workspace** for a scoped app, ready to deliver **either way**: push it live with
the **standard Now SDK** (with instance auth — `now-sdk install`/`deploy`), or package it **offline** into a
single importable `sys_remote_update_set` **Update Set XML** (no credentials). The scaffold is a standard
Now SDK project **plus** the offline converter/validators that make the no-auth path possible.

This skill **creates files only** — it scaffolds from this plugin's bundled templates and explains the next
steps. It does **not** connect to or authenticate against any instance.

## Constraint (the skill never authenticates for you)
This skill scaffolds files and **never connects to an instance or asks for credentials** — it does not itself
run `now-sdk auth`/`install`/`deploy`. You choose the delivery channel: the **offline** path (local build →
converter → Update Set XML → *Retrieved Update Sets*), or the **live** path where **you** run
`now-sdk install`/`deploy` against your own authenticated session.

## Steps

### 1. Prerequisites (check, then guide)
- `node --version` and `npm --version` (Node LTS or newer).
- `npx @servicenow/sdk --version` — the Now SDK CLI (installed as a project dependency).
- Recommended companion plugins: the official **ServiceNow SDK** plugin (provides `now-sdk explain`)
  and **superpowers**. Report which are present; if missing, point to the README install steps.
  Missing companion plugins do not block a Node build.

### 2. Collect inputs
- Application **scope** `x_<vendor>_<app>` (lowercase) and human **name**.
- Compute a stable scopeId:
  `node -e "console.log(require('crypto').createHash('md5').update('<scope>').digest('hex'))"`.

### 3. Scaffold the project (from this skill's sibling `../nowsdk-pm/templates/`)
Create, in the target project folder:
```
now.config.json            # from templates/now.config.json (set scope, scopeId, name)
package.json               # from templates/package.json (rename, set output filenames)
tools/sdk-dist-to-update-set.js   # generic offline converter (DELETE-handling + --include delta)
tools/generate-seed-data.js       # generic seed generator (customize SCOPE + dataset)
tests/validate-source.js
tests/validate-update-set.js
tests/validate-seed-data.js
src/fluent/index.now.ts    # create: re-export your *.now.ts metadata files
src/server/                # server scripts (Script Includes, widget assets)
docs/offline-update-set-workflow.md   # copy from ../nowsdk-pm/references/offline-update-set-workflow.md
```
Also create a minimal `src/server/tsconfig.json` referenced by `now.config.json`.

### 4. First Fluent metadata
Add at least one `Table()`, the application roles + ACLs, and `index.now.ts` exporting them
(`export * from './<file>.now'`). Consult `now-sdk explain <topic>` for exact API shapes.

### 5. Build & package sequence (no auth)
```
npm install
npm test                  # source validation
npm run build             # now-sdk build → dist/app
npm run package:update-set
npm run verify:update-set
npm run seed:xml          # optional
npm run verify:seed       # optional
npm run pack:sdk          # optional source ZIP (NOT an update set)
```

### 6. Deliver — pick the channel
- **Offline (no-auth):** import `target/update_set.xml` via **System Update Sets → Retrieved Update Sets →
  Import Update Set from XML → Preview → Commit**. Import any seed XML from a list (**Import XML**), not as
  an update set.
- **Live (with auth):** the same Fluent app deploys via the standard Now SDK — **you** run
  `now-sdk install` / `now-sdk deploy` against your authenticated instance (outside this skill).

## Reference
The full method, capability matrix, gotchas, converter behavior, and troubleshooting are in
`../nowsdk-pm/references/offline-update-set-workflow.md` — read it before changing packaging behavior.
