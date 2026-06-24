---
name: nowsdk-bootstrap
description: Use when the user wants to set up / scaffold an offline, no-auth ServiceNow Now SDK project that builds a scoped application into an importable Update Set XML — recreating the proven workspace (converter, validators, package scripts, now.config) without any instance authentication.
---

# NowSdkBootstrap — scaffold the offline no-auth Now SDK workspace

This is the **offline no-auth delivery accelerator** — **one** of the delivery options for a
ServiceNow app (the others being a Now SDK build with instance auth, or on-platform authoring). Use it
when offline Update Set XML delivery is the right fit.

Recreate the proven environment that builds a ServiceNow scoped app locally and packages it into a
single importable `sys_remote_update_set` XML — **no `now-sdk auth/install/deploy`, no credentials**.

This skill scaffolds files from this plugin's bundled templates and explains the next steps. It does
**not** connect to any instance.

## Non-negotiable constraint
Do **not** run, or ask the user for credentials for: `now-sdk auth`, `now-sdk install`,
`now-sdk deploy`. The entire flow is local build + offline Update Set XML packaging.

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

### 6. Deliver
Import `target/update_set.xml` on the instance via **System Update Sets → Retrieved Update Sets →
Import Update Set from XML → Preview → Commit**. Import any seed XML from a list (**Import XML**), not
as an update set.

## Reference
The full method, capability matrix, gotchas, converter behavior, and troubleshooting are in
`../nowsdk-pm/references/offline-update-set-workflow.md` — read it before changing packaging behavior.
