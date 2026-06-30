# Fluent language reference (DSL, helpers, server modules) — distilled from the official SDK docs

Curated from the **Fluent Language** hub + `fluent-overview` / `module-guide` / `data-helpers-guide`
(`servicenow.github.io/sdk`). Confirm exact shapes with `now-sdk explain <topic>`.

## What Fluent is
A **TypeScript DSL** for defining the metadata records (`sys_metadata`) that make up an app — code-driven instead
of form-based. Metadata lives in `*.now.ts` files organized by feature (`src/fluent/tables/`, `…/business-rules/`),
importing APIs from **`@servicenow/sdk/core`**; `index.now.ts` re-exports every `*.now.ts`. Source ↔ instance is not
a live auto-sync: **`now-sdk transform`** pulls existing instance metadata (XML) into Fluent source (brownfield/
one-time), and **`build` + `install`/`deploy`** (or the offline Update Set) pushes Fluent to the instance.
(Source: `fluent-overview`, `developing-apps-guide`.)

## Cross-cutting helpers (apply across all APIs)
- **`Now.ID['key']`** — stable, human-readable identity → a deterministic sys_id (re-builds match). See keys file.
  **It resolves to a sys_id ONLY in `$id` position.** Used as a **field value** inside `Record().data` it is
  serialized verbatim as the **raw key string** (not the sys_id) → Update Set Preview then fails with
  *"Could not find a record in `<table>` for column `<col>`"*. For a reference in a value position use **`Now.ref()`**.
  (Build-verified: typed builders like `Acl`/`Table` resolve refs; the generic `Record()` does **not** resolve a bare
  `Now.ID[...]` value.)
- **`Now.include('relative/path.ext')`** — inline an external file (server JS, client JS, HTML, CSS) into a record
  **string** field at build time (keeps real source files for IDE support).
- **`Now.ref(table, sysIdOrNowIdKey)`** (or `Now.ref(table, { coalesceKey: value })`) — the **first-class way to set a
  reference in a value position**; resolves to the target sys_id at build time. The guid arg accepts a real sys_id **or
  a `Now.ID` key string** of a record defined in your project, e.g. `data: { parent: Now.ref('sys_user_group', 'grp_parent') }`.
  Prefer this over hardcoding sys_ids read from `keys.ts`. (Source: `now-ref-guide`.)
- **`Now.attach('image')`** — attach an image to a record at build time (writes `sys_attachment` + `_doc` records).
- **`Now.del()`** — mark a record for **deletion**; removed from the target on deploy.
- **`$override`** — escape hatch on any constructor to set a field not exposed by the typed API surface
  (`override-guide`). Use sparingly; prefer typed properties.

## Declarative-subset rules (`*.now.ts` is NOT general TypeScript)
A `*.now.ts` file is parsed by the Fluent compiler into a constrained, **declarative** subset — not executed as
general TS. Build-verified on 4.8.1:
- **No helper functions / no typed params.** A `function f(k: string) { … }` to DRY up records fails with
  `TS154: Node kind "StringKeyword" is not allowed in Fluent files` + `TS262: Unsupported statement in Fluent source file`.
  Expand to explicit, fully-literal calls instead.
- **`Now.ID[...]` keys must be statically resolvable to a string literal.** `Now.ID['literal']` ✅ and even
  `const k = 'literal'; Now.ID[k]` ✅ (the analyzer traces the const). But a **non-traceable** key — a function
  parameter or runtime expression — fails: `Invalid argument to element access expression: IdentifierShape` +
  `Failed to parse property`. So the limit is *functions / typed params / runtime-computed keys*, **not** all locals.
- **Plain top-level `const X = 'literal'` bindings ARE allowed**, including in value positions
  (`const ROLE = 'x_scope.viewer'` then `roles: [ROLE]`). To generate many similar records, emit literal code from a
  Node script (e.g. `tools/generate-*.js`) rather than looping inside the `.now.ts`.

## Data helpers (typed values for `Record()` data fields — global, no import)
Source: `data-helpers-guide`. All give type-safe field IntelliSense with a generic table parameter.
- **`Duration({days,hours,minutes,seconds})`** → `DurationColumn` (e.g. SLA timers).
- **`Time({hours,minutes}, 'tz?')`** → `TimeColumn` (time-of-day, UTC + optional tz).
- **`TemplateValue<'table'>({...})`** → `TemplateValueColumn` (encoded-query-format value, type-safe fields).
- **`FieldList<'table'>(['name','description'])`** → `FieldListColumn` / `SlushBucketColumn` (comma field list, dot-walk).

## Server-side code: ES modules vs `Now.include()` (important best practice)
Source: `module-guide`. **JS/TS ES modules in `src/server/` are the modern, preferred way** for server logic.
- **Use a module function** (export a function) for APIs that accept a **function** type: `BusinessRule`,
  `ScriptAction`, `UiAction`, `RestApi` handlers, `ScheduledScript`, `CatalogItemRecordProducer`.
- **Use `Now.include()` (string)** for **string-only** APIs: `ScriptInclude`, `ClientScript`, `UiPolicy`,
  `CatalogClientScript`, `SPWidget`, and `Record` data values.
- **In module files Glide APIs are NOT auto-available** — `import { gs, GlideRecord } from '@servicenow/glide'`
  (namespaced APIs via `@servicenow/glide/scopeName`). In Script Include classes Glide is auto-available (don't
  import). Server scripts consuming a module use CommonJS `require('path/to/module')`.
- **Constraints:** modules are scope-only (no cross-scope sharing), no Node.js APIs, only a subset of ECMAScript;
  prefer `GlideDateTime` over `gs.nowDateTime()` in scoped apps. **Pattern:** put logic in modules, then bridge via a
  lightweight Script Include when a platform feature requires a named script include.
- **Module anti-patterns (from `module-guide`):** in a module, **never** reference a Script Include via the global
  scope prefix — `new x_scope.MyUtils()` throws `x_scope is not defined` at runtime; `import { MyUtils } from
  '@servicenow/glide/x_scope'` instead. Don't assume a Glide method exists from its name — use only methods defined
  in the `@servicenow/glide` type definitions. In Script Include class files (`Class.create`), do **not** import
  Glide (auto-available there).

## Demo / seed data
Use the `Record` API with `$meta: { installMethod: 'demo' }` for sample data (loads only as demo). For the offline
no-auth path, seed data is shipped separately as an XML data unload (see `offline-update-set-workflow.md`).

See also `sdk-fluent-capabilities.md` (4.8 APIs + what's new).
