# Fluent language reference (DSL, helpers, server modules) — distilled from the official SDK docs

Curated from the **Fluent Language** hub + `fluent-overview` / `module-guide` / `data-helpers-guide`
(`servicenow.github.io/sdk`). Confirm exact shapes with `now-sdk explain <topic>`.

## What Fluent is
A **TypeScript DSL** for defining the metadata records (`sys_metadata`) that make up an app — code-driven instead
of form-based. Metadata lives in `*.now.ts` files organized by feature (`src/fluent/tables/`, `…/business-rules/`),
importing APIs from **`@servicenow/sdk/core`**; `index.now.ts` re-exports every `*.now.ts`. **Two-way sync**: changes
made in platform UIs can sync back into source and vice versa. (Source: `fluent-overview`.)

## Cross-cutting helpers (apply across all APIs)
- **`Now.ID['key']`** — stable, human-readable identity → a deterministic sys_id (re-builds match). See keys file.
- **`Now.include('relative/path.ext')`** — inline an external file (server JS, client JS, HTML, CSS) into a record
  **string** field at build time (keeps real source files for IDE support).
- **`Now.ref(...)`** — reference a record in another table not defined in the current file.
- **`Now.attach('image')`** — attach an image to a record at build time (writes `sys_attachment` + `_doc` records).
- **`Now.del()`** — mark a record for **deletion**; removed from the target on deploy.
- **`$override`** — escape hatch on any constructor to set a field not exposed by the typed API surface
  (`override-guide`). Use sparingly; prefer typed properties.

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

## Demo / seed data
Use the `Record` API with `$meta: { installMethod: 'demo' }` for sample data (loads only as demo). For the offline
no-auth path, seed data is shipped separately as an XML data unload (see `offline-update-set-workflow.md`).

See also `sdk-fluent-capabilities.md` (4.8 APIs + what's new).
