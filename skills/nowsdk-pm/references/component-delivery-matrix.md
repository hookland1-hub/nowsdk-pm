# ServiceNow component & delivery-channel matrix

This is **not a filter**. Use it to recommend the best-fit ServiceNow object for each requirement and
to **annotate its delivery channel** in the design document. Always ground the exact API/behavior in
the official `now-sdk explain` before authoring.

## Delivery channels
- **Fluent SDK (offline)** — authored in `*.now.ts`, `now-sdk build` → Update Set XML, **no instance
  auth**. Importable via *Retrieved Update Sets*. (One packaging option — see
  `offline-update-set-workflow.md`.)
- **Now SDK (with instance auth)** — the same Fluent objects, pushed live via `now-sdk install` /
  `deploy`, plus any operation that needs a connected instance.
- **On-platform / GUI** — authored in the instance UI: App Engine Studio, **UI Builder** (Next
  Experience), Flow Designer, Catalog Builder, Performance Analytics, etc. Some objects have **no**
  Fluent representation and must be built here.

> Recommendation rule: pick the object that is genuinely best for the requirement; then state its
> channel. Flag objects that require **SDK auth** or **on-platform** authoring — those are the gaps a
> delivery team fills. Never substitute an inferior offline alternative just to stay offline.

## Fluent-authorable components (Channel: Fluent offline, or SDK with auth)
| Component | Fluent API | Record table | Notes |
|---|---|---|---|
| Tables & columns | `Table()` | `sys_db_object`, `sys_dictionary` | `autoNumber:{prefix,number,numberOfDigits}` (needs a `number` column) |
| Choice lists | choice columns | `sys_choice` / `sys_choice_set` | value + label (labels configurable later) |
| Roles | `Role()` | `sys_user_role` | `containsRoles` hierarchy |
| ACLs | `Acl()` | `sys_security_acl` (+ `_role`) | `type:'record'` and `type:'ux_route'` |
| App menu & modules | `ApplicationMenu()`, `Record({table:'sys_app_module'})` | `sys_app_application`, `sys_app_module` | URL module = `link_type:'DIRECT'` + `query` |
| Workspace (Now Experience) | `Workspace()` | `sys_ux_*` | landing/list pages auto-generated; **deep UI Builder customization is on-platform** |
| Workspace list config | `UxListMenuConfig()` | `sys_ux_list_menu_config`, `sys_ux_list*` | categories + lists + encoded queries |
| Visibility/applicability | `Applicability()` | `sys_ux_applicability` | role-based visibility |
| Dashboards | `Dashboard()` | `par_dashboard*` | widgets, single-score, charts |
| Script Include | `ScriptInclude()` | `sys_script_include` | server JS; `accessibleFrom`/`callerAccess` for cross-scope |
| Business Rule | `BusinessRule()` | `sys_script` | before/after/async/display |
| Client Script | `ClientScript()` | `sys_script_client` | classic UI |
| UI Action / UI Policy | `UiAction()`, `UiPolicy()` | `sys_ui_action`, `sys_ui_policy` | buttons (form/list/list-choice), field rules |
| Form / List layout | `Form()`, `List()` | `sys_ui_form/section/element`, `sys_ui_list` | classic UI |
| Classic UI Page | `UiPage()` | `sys_ui_page` | Jelly/HTML or React |
| Service Portal | `ServicePortal()`, `SPPage()`, `SPWidget()`, `SPTheme()`, `SPMenu()` | `sp_*` | custom single-page UX, Fluent-authorable (offline) |
| System property | `Property()` | `sys_properties` | configurable settings |
| Scheduled job | `ScheduledScript()` | `sysauto_script` | periodic server script |
| Flow (code-first) | `Flow()` | `sys_hub_flow` | confirm scope with `explain`; visual authoring is on-platform |
| Data Policy | `DataPolicy()` | `sys_data_policy2` (+ `_rule`) | mandatory/read-only enforced across UI + import + API |
| Email notification | `EmailNotification()` | `sysevent_email_action` | event/record notifications (see `email-notification-guide`) |
| Service Catalog item & rules | `CatalogItem()`, `CatalogClientScript()`, `CatalogUiPolicy()`, `CatalogItemRecordProducer()` | `sc_cat_item`, `catalog_script_client`, `catalog_ui_policy`, `sc_cat_item_producer` | items + variables + client scripts/UI policies; confirm each via `explain` |
| ATF test | `Test()` | `sys_atf_test` | `Test(input, fn)` with `atf.server/form/...` steps — `explain test-api` |
| Outbound REST integration | `RestMessage()` | `sys_rest_message` (+ `sys_rest_message_fn`) | base URL + shared auth/headers + callable HTTP functions (**4.8**) |
| Connection & Credential Alias | `Alias()`, `AliasTemplate()` | `sys_alias`, `sys_alias_templates` | named connection/credential handle + wizard template (**4.8**) |
| Retry policy | `RetryPolicy()` | `sys_retry_policy` | transient-failure strategy for outbound connections (**4.8**) |
| Data Lookup | `DataLookup()` | `dl_definition` | auto-copy field values matcher → target on conditions (**4.8**) |
| Playbook | `PlaybookDefinition()` | `sys_pd_process_definition` | guided multi-step process: lanes, activities, triggers, in/out (**4.8**) |
| User Criteria | `UserCriteria()` | `user_criteria` | reusable access condition (catalog/KB/portal visibility) (**4.8**) |

Column types: `StringColumn`, `MultiLineTextColumn`, `ChoiceColumn`, `BooleanColumn`, `IntegerColumn`,
`DateColumn`/`DateTimeColumn`, `ReferenceColumn` (`cascadeRule`), `ListColumn` (Glide List). Add indexes.

Helpers / cross-cutting (confirm with `explain`): **`Now.del()`** marks a record for deletion (removed on
deploy); **`$override`** sets any field not exposed by the typed API; **`Table` `augments`** extends an existing
platform/cross-scope table by adding columns (+ `createAccessControls`, `userRole`). New 4.8 APIs and these
helpers are detailed in **`sdk-fluent-capabilities.md`** (validated through SDK 4.8.1).

## On-platform / GUI-authored components (Channel: on-platform)
Recommend these when they are the best fit; note that they are authored in the instance (App Engine
Studio / UI Builder / etc.) — partially or fully outside the Fluent SDK.

| Component | Where authored | Record(s) | Note |
|---|---|---|---|
| UX (Next Experience) **experiences, pages, components, macroponents** | **UI Builder** | `sys_ux_app_config`, `sys_ux_page`, `sys_ux_screen`, `sys_ux_macroponent`, `sys_ux_component` | Rich workspace/portal-experience UIs; not authored in Fluent. Fluent can scaffold the workspace shell; the page/component design is on-platform. |
| Visual **Flow / Subflow / Action** | **Flow Designer** | `sys_hub_flow`, `sys_hub_action_type_base` | Code-first flows may be expressible via `Flow()`; complex visual flows are built in Flow Designer. |
| **Service Catalog** rich design / curation | **Catalog Builder** | `sc_cat_item`, `item_option_new`, … | Core catalog objects ARE Fluent (see the Fluent table above — `CatalogItem()` etc.); Catalog Builder is for visual curation/complex item UX. |
| **Performance Analytics** (indicators, widgets) | **PA GUI** | `pa_*` | On-platform configuration. |
| **Email template (rich design)** | GUI | `sys_email_template` | The notification itself is Fluent (`EmailNotification()` → `sysevent_email_action`); rich HTML template design is on-platform. |
| **Assignment rules, SLAs, Connect/Agent config**, etc. | GUI | various | Process configuration, on-platform. |
| App settings authored in **App Engine Studio** | App Engine Studio | various | Studio orchestrates many of the above. |

> Always verify with `explain` whether a given object has a Fluent API — the SDK keeps expanding.
> If it does, prefer Fluent (offline or with auth); if not, mark it **on-platform** and describe the
> work needed.

## Cross-cutting helpers (Fluent)
- `Now.ID['stable_key']` → deterministic sys_id (re-builds match).
- `Now.include('relative/path.ext')` → inline external files (server/client JS, HTML, CSS).
- `index.now.ts` must `export * from './<each>.now'`.
- Scope protection: `now.config.json accessControls { restrictTableAccess, runtimeAccessTracking }` +
  ScriptInclude `accessibleFrom`/`callerAccess`.
