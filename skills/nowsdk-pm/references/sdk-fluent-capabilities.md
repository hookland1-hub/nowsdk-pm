# Now SDK — Fluent capabilities knowledge (validated through 4.8.1)

What this app's design can rely on, grounded in `now-sdk explain` (4.8.1) and the official release notes
on GitHub (`ServiceNow/sdk`). **Always re-confirm the exact shape with `explain <topic>`** before authoring —
the SDK keeps expanding; treat this as a map, not a substitute. Anything not confirmable is an Open point.

> **Validation discipline:** `explain` is authoritative but not exhaustive. Confirm API names/tables with
> `explain`, cross-check behavior with the official release notes, and escalate to ServiceNow product docs /
> community when silent or ambiguous — never assert an uncitable platform behavior. (See SKILL operating rule 1.)

## What's new (validated): 4.7 → 4.8

### New Fluent APIs in 4.8.0 — all author to records → offline-packageable, or push with auth
| API (export) | Record table(s) | What it creates | `explain` topic |
|---|---|---|---|
| `Alias()` | `sys_alias` | Connection & Credential Alias — named handle for a connection+credential pair (no hard-coded instance values). Refs: `configurationTemplate`, `retryPolicy`, `parent`. | `alias-api` |
| `AliasTemplate()` | `sys_alias_templates` | Reusable alias template that drives the connection-setup wizard UI. | `aliastemplate-api` |
| `RetryPolicy()` | `sys_retry_policy` | Transient-failure handling for outbound connections: strategy, attempts, wait interval, max elapsed, conditions. | `retrypolicy-api` |
| `RestMessage()` | `sys_rest_message` (+ `sys_rest_message_fn`) | Outbound HTTP integration: base URL, shared auth/headers, callable HTTP functions invoked via `sn_ws.RESTMessageV2`. | `restmessage-api` |
| `DataLookup()` | `dl_definition` | Data Lookup: auto-copies field values from a matching record to a target when match conditions are met. | `datalookup-api` |
| `PlaybookDefinition()` | `sys_pd_process_definition` | ServiceNow Playbook: guided multi-step process on a record — lanes, activities, triggers, inputs/outputs, inline `startRule`. | `playbook-api` |
| `UserCriteria()` | `user_criteria` | Reusable access condition (which users can see catalog items, KB articles, portal topics, etc.). | `usercriteria-api` |

### Helpers & type-system changes
- **`Now.del()`** (`now-del-guide`) — marks a record for **deletion**: on deploy the record is removed from the
  target instance. The explicit Fluent way to ship a deletion (offline: it surfaces as an `action="DELETE"`
  record; see the offline workflow's DELETE/keystore notes).
- **ACL `field`** (`acl-api`) — typed `keyof FullSchema<T> | SystemColumns | '*'`; per 4.8.0 release notes also
  accepts a custom column-name string for field-level ACLs.
- **`ScheduledScript` `$meta`** — one-time execution support (4.8.0 release notes; `$meta` install-method control).
- **`DataPolicy` / `UserPreference` `$override`** — merge-mode control (4.8.0 release notes).
- CLI: **`now-sdk query <table>`** — read-only Table REST API query from the terminal (**requires auth**;
  not part of the offline no-auth flow). `now-sdk install` aliases `deploy`.

### Also from 4.7.0 (worth using; confirm with `explain`)
- **`$override`** (`override-guide`) — universal field override escape hatch: set any field not otherwise exposed
  by the typed API surface.
- **`DataPolicy()`** → `sys_data_policy2` (+ rule) — mandatory/read-only enforced across UI, import and API.
- **`Table` `augments`** — extend an existing platform/cross-scope table by adding columns (only `schema`
  configurable when `augments` is set); plus `createAccessControls` and `userRole`.
- **Flow authoring** — Stages (with diagnostics), `TryCatch`, `DoInParallel`, `AppendToFlowVariables`, action
  outputs + error evaluation.
- CLI — OAuth `client_credentials` for CI/CD via env vars; `transform` can target specific tables; faster startup.

### 4.8.1 (patch — no new features)
Fixes only: Flow/Action creating a single record (was multiple), snapshot regeneration, missing internal names,
datapills inside `DoInParallel`/`TryCatch`, `FieldListColumn.dependent` now optional, transitive-dependency
security, and credential-logging fix in `query`.

## Delivery channel of the new objects
All the new APIs are **Fluent-authorable** → build to `dist/app` records and ship either **offline** (converter →
Update Set XML, no auth) or **live** (`now-sdk install`/`deploy`, with auth). Integration objects
(`RestMessage`/`Alias`/`AliasTemplate`/`RetryPolicy`) and `UserCriteria`/`PlaybookDefinition`/`DataLookup` were
commonly built on-platform before — they are now part of the Fluent surface; prefer Fluent and annotate the channel.

## Sources
- `now-sdk explain` at **@servicenow/sdk 4.8.1** (topic peeks/signatures, captured during this audit).
- Official release notes: `github.com/ServiceNow/sdk` releases for **4.7.0**, **4.8.0**, **4.8.1**.
