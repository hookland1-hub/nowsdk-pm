# Fluent capability matrix — what builds OFFLINE to an Update Set XML

Everything below is declarable in **Fluent** (`*.now.ts`) and compiles via `now-sdk build`
into `dist/app` XML with **no instance authentication**, then packs into one
`sys_remote_update_set` XML. Use this to keep proposals grounded: only design components that
are offline-buildable; flag anything that needs the UI Builder editor on a live instance.

| Capability | Fluent API | Record table | Notes |
|---|---|---|---|
| Tables & columns | `Table()` | `sys_db_object`, `sys_dictionary` | column types below; `index`/composite indexes; `autoNumber:{prefix,number,numberOfDigits}` (needs a `number` column) |
| Choice lists | choice columns | `sys_choice` / `sys_choice_set` | value + label; labels configurable later without code |
| Roles | `Role()` | `sys_user_role` | `containsRoles` for hierarchy |
| ACLs | `Acl()` | `sys_security_acl` (+ `_role`) | `type:'record'` (read/create/write/delete) and `type:'ux_route'` (`name:'<workspace-path>.*'`) |
| App menu & modules | `ApplicationMenu()`, `Record({table:'sys_app_module'})` | `sys_app_application`, `sys_app_module` | backend nav; URL module = `link_type:'DIRECT'` + `query:'<relative url>'` |
| Workspace (Now Experience) | `Workspace()` | `sys_ux_*` (page registry, app config, route…) | landing path, tables |
| Workspace list config | `UxListMenuConfig()` | `sys_ux_list_menu_config`, `sys_ux_list*` | categories + lists + encoded queries |
| Visibility/applicability | `Applicability()` | `sys_ux_applicability` | role-based list/detail visibility |
| Dashboards | `Dashboard()` | `par_dashboard*` | widgets, single-score, charts |
| Script Include | `ScriptInclude()` | `sys_script_include` | server JS via `Now.include`; `accessibleFrom` + `callerAccess` for cross-scope |
| Business Rule | `BusinessRule()` | `sys_script` | server logic (before/after/async/display) |
| Client Script | `ClientScript()` | `sys_script_client` | classic UI |
| UI Action / UI Policy | `UiAction()`, `UiPolicy()` | `sys_ui_action`, `sys_ui_policy` | buttons (form/list/list-choice), field rules |
| Form / List layout | `Form()`, `List()` | `sys_ui_form/section/element`, `sys_ui_list` | classic UI layout |
| Classic UI Page | `UiPage()` | `sys_ui_page` | Jelly/HTML or React |
| Service Portal | `ServicePortal()` | `sp_portal` | `urlSuffix` → `/<suffix>` |
| Portal page | `SPPage()` | `sp_page` | containers→rows→columns→instances |
| Portal widget | `SPWidget()` | `sp_widget` | server/client/html/css via `Now.include` |
| Portal theme / menu / provider | `SPTheme()`, `SPMenu()`, `SPAngularProvider()` | `sp_theme`, `sp_instance_menu`, `sp_angular_provider` | branding/nav/directives |
| System property | `Property()` | `sys_properties` | configurable settings read via `gs.getProperty()` |
| Scheduled job | `ScheduledScript()` | `sysauto_script` | periodic server script (e.g. retention sweeps) |
| Flows | `Flow()` | `sys_hub_flow` | consult `explain` |
| ATF tests | `AtfTest()` | `sys_atf_test` | consult `explain` |

### Column types
`StringColumn`, `MultiLineTextColumn`, `ChoiceColumn`, `BooleanColumn`, `IntegerColumn`,
`DateColumn`/`DateTimeColumn`, `ReferenceColumn` (→ table, `cascadeRule`), `ListColumn` (Glide List,
multi-value reference). Add indexes for lookup/filter fields.

### NOT offline-buildable (require UI Builder on a live instance → break no-auth)
Custom **UX Builder** pages/components/macroponents (`sys_ux_page`, `sys_ux_component`,
`sys_ux_macroponent`). For a fully custom single-page UX offline, use **Service Portal**
(`SPPage`+`SPWidget`) or a classic **UiPage** instead.

### Cross-cutting helpers
- `Now.ID['stable_key']` → deterministic `$id`/sys_id (re-builds match the same records).
- `Now.include('relative/path.ext')` → inline external files (server JS, client JS, HTML, CSS).
- `index.now.ts` must `export * from './<each>.now'` so every metadata file is built.

### `now.config.json` scope protection (optional)
`accessControls: { restrictTableAccess: true, runtimeAccessTracking: "enforcing" }` +
ScriptInclude `accessibleFrom:'public'` with `callerAccess:'restriction'` (grant cross-scope
access only to explicitly authorized consumer scopes).

> Always confirm exact API shapes with the official `now-sdk explain <topic>` before authoring.
