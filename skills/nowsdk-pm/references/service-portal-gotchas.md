# Service Portal & packaging gotchas (hard-won)

Internalize these before designing/authoring portal widgets or the offline package — each one
cost real debugging time in production deliveries.

## Service Portal (Fluent)
1. **`SPPage` takes no top-level `$id`.** It is keyed by `pageId`. The nested `containers`,
   `rows`, `columns`, `instances` **do** use `$id: Now.ID[...]`. A top-level `$id` fails the build.
2. **Widget client script must be a bare named function**: `function controller() { var c = this; … }`.
   The form `api.controller = function(){}` is **rejected** by the build. Inject services as
   parameters: `function controller(spModal, $window) { … }`.
3. **Browser globals are blocked** in client scripts (`no-restricted-globals`): no `window`,
   `document`, `alert`, `confirm`. Use injected Angular services (`spModal`, `$window`, `$document`).
4. **`customCss` is served AS-IS and is NOT Sass-compiled.** Put **plain CSS only** in the
   `.scss`/css file — no nesting, no `$variables`, no `@each`, no `#{}`. Any Sass syntax makes the
   browser discard the **entire** stylesheet (symptom: unstyled plain text). Theme via CSS custom
   properties (`--var`) set on modifier classes (valid plain CSS).
5. **Bootstrap 3** classes (`panel`, `btn btn-*`, `nav nav-tabs`, grid) are available globally.
6. **Widget server script runs in the app scope**: it can call same-scope Script Includes directly
   (no GlideAjax). `data.*` → client `c.data.*`; `c.server.update()` round-trips, and the posted
   `data` arrives server-side as `input`.

## Offline packaging / converter
7. **Exclude `sys_user_role_contains`** from the offline update set: its uniqueness is on the role
   pair (not the row sys_id), causing non-blocking duplicate-key warnings on re-commit. Keep the
   role hierarchy in Fluent source; validate containment manually post-install.
8. **Records are HTML-escaped inside `<payload>`**: a table tag appears as `&lt;<table>` and each
   maps to a `<name><table>_<32hex></name>`. Validators must match the escaped form.
9. **Propagate DELETE actions.** When you remove a previously-built record, the SDK emits a record
   with `action="DELETE"`. The converter must set the `sys_update_xml` `<action>DELETE</action>`
   accordingly, otherwise commit would re-create the record instead of deleting it.
10. **Incremental build keeps a keystore** (`src/fluent/generated/keys.ts`) that tracks deletions
    (`deleted: true`). Do not delete it casually — it preserves stable sys_ids and the delete records.
11. **SDK ZIP (`now-sdk pack`) is not an Update Set.** Import the generated `sys_remote_update_set`
    XML via *Retrieved Update Sets → Import from XML*; never import the ZIP there.

## Platform patterns
- **Scoped GlideRecord enforces ACLs by default** — portal widgets that write via `new GlideRecord`
  respect the record ACLs; no bypass.
- **Logical deletion**: carry an `active` flag; consumers/automations filter `active=true`;
  "delete" sets `active=false`.
- **Auto-number**: a `number` String column + table `autoNumber` config (Number Maintenance).
- **Retention / GDPR**: a `Date` column for expiry + a report (filtered list/module, since
  `sys_report` is not Fluent-declarable) + revalidate/delete actions.
- **Self-contained app**: the converter includes the `sys_app` record, so a clean instance gets the
  scoped app created on commit — one Update Set deploys the whole app.
