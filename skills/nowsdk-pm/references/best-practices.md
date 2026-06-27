# ServiceNow Now SDK — best practices (distilled from the official guides)

Curated from the official **Guides** hub (`servicenow.github.io/sdk/category/guides`). These are best-practice rules
to bake into the design; confirm specifics with `now-sdk explain <topic>` and the cited guides.

## Development workflow (`developing-apps-guide`)
- **Scaffold non-interactively** (agent-friendly):
  `npx @servicenow/sdk init --appName "My App" --packageName "my-app" --scopeName "x_company_app" --template "base"`
  then `npm install`. Scope must be `x_<company_code>_<app_name>`.
- **Cycle:** Write (`*.now.ts`) → **Build** (`npm run build`, compiles + validates) → Deploy (`npm run deploy`).
- **Always build before deploying** — a failed build leaves prior artifacts intact; deploying without rebuilding
  ships stale output. Prefer **npm scripts** over raw CLI (apps may have extra build steps).
- Use `now-sdk transform` to convert existing instance XML into Fluent when migrating; `now-sdk dependencies` to
  fetch TS definitions for platform APIs.

## Security (`security-guide`) — design rules
- **One ACL per operation** (separate `read`/`create`/`write`/`delete`); table-level uses `type:'record'` with no
  `field`, field-level names the column. The **"trinity"**: roles AND condition AND script must all pass.
- **`decisionType`**: Deny-Unless (`'deny'`, evaluated first) paired with Allow (`'allow'`, needs ≥1 match) for full
  control. `adminOverrides: true` lets admins bypass.
- **Use the `roles` property for role checks — not scripts**; reserve scripts for real business logic
  (ownership/status). Query ACLs (`query_match`/`query_range`) guard against blind-query attacks.
- **Roles:** always scope-prefixed `x_scope.role_name` (never unscoped); immutable after creation; use
  `containsRoles` for hierarchy (fluent objects or sys_ids).
- **Server data access honors ACLs only with `GlideRecordSecure`** — plain `GlideRecord` runs with system access and
  **bypasses** record ACLs (see `service-portal-gotchas.md`).
- **Evaluation order:** define roles → create ACLs → extract reusable Security Attributes → apply data filters.
- **Avoid:** scripts for simple role checks; hardcoded user IDs/names in scripts or filters; omitting the role layer
  before row-level filters.

## Server logic (`module-guide`, `fluent-overview`)
- Put reusable logic in **ES modules** under `src/server/` (import Glide from `@servicenow/glide`), bridge via a
  lightweight **Script Include** when a platform feature needs a named SI; use `Now.include()` only for string-only
  APIs. (Full rules in `fluent-language-reference.md`.)

## Identity & deploys (`keys-file`, CI)
- **Commit `src/fluent/generated/keys.ts`** (identity source of truth); never regenerate it for an app already
  committed to an instance — sys_id churn causes duplicate-key errors on re-import. Gate CI with
  `now-sdk build --frozenKeys`. (Full detail in `configuration-reference.md`.)

## Data & migration (`importing-data-guide`, `encoded-query-guide`, `table-augments-guide`)
- **Encoded queries:** build well-formed strings (`field=value^…`, `^OR`, `^EQ`); prefer indexed fields in
  conditions/filters.
- **Importing data:** use Data Sources → staging tables → Import Sets/Transform Maps (`ImportSet()`); keep seed/demo
  data non-personal and separate from the app.
- **Extending platform/cross-scope tables:** use `Table` **`augments`** (only `schema` configurable) instead of
  copying tables; declare cross-scope needs with `CrossScopePrivilege()`.

## Anti-patterns (e.g. `playbook-anti-patterns-guide`)
- Don't encode ordering/branching logic where the DSL provides structured constructs (lanes/stages/decisions,
  `TryCatch`/`DoInParallel`); follow the patterns guides. Keep each metadata object single-responsibility.
- Don't invent platform behavior — when `explain` is silent/ambiguous, validate against official docs then community
  (SKILL operating rule 1); record unverifiable items as Open points.
