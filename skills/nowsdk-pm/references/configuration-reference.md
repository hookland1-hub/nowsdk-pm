# Configuration reference (now.config.json, keys file, CI) — distilled from the official SDK docs

Curated from the official **Configuration** hub (`servicenow.github.io/sdk/category/configuration`). Use it to
design correct project config; confirm exact current options with `now-sdk explain` and the docs pages cited.

## `now.config.json` (project configuration)
Source: `servicenow.github.io/sdk/config/now-config-reference`.

**Required**
- `scope` (string, `^((x|sn)_[a-z0-9_]+|global)$`, 4–18 chars) — app scope, e.g. `x_acme_app`.
- `scopeId` (string, 32-hex or `global`) — stable scope sys_id (md5 of the scope is the conventional source).

**Core**
- `name` (3–100), `description`, `active` (bool), `type` (default `"package"`).

**Build & source dirs** (defaults): `fluentDir` `src/fluent`, `clientDir` `src/client`, `serverModulesDir`
`src/server`, `metadataDir` `metadata`, `appOutputDir` `dist/app`, `packOutputDir` `target`, `staticContentDir`
`dist/static`, `generatedDir` `generated`, `tsconfigPath` (server transpile config).

**Language**: `jsLevel` (`es_latest` default | `helsinki_es5` | `traditional`), `defaultLanguage` (`en`, BCP-47).

**Access & security** — `accessControls` object:
`canEditInStudio` (true), `hideOnUI` (false), `private` (false), `restrictTableAccess` (false),
`runtimeAccessTracking` (`none`|`permissive` default|`enforcing`), `scopedAdministration` (false),
`trackable` (true), `uninstallBlocked` (false), `userRole` (string). For scope protection set
`restrictTableAccess: true` + `runtimeAccessTracking: 'enforcing'`.

**Runtime & policies**: `applicationRuntimePolicy` (`none`|`tracking`|`enforcing`), `performancePolicy`,
`wildcardPolicy` (arl/network/record/scripting pillars), `networkPolicies[]`.

**Dependencies & modules**: `dependencies` (per-scope `{roles, tables}` arrays or `"*"`), `trustedModules[]`,
`packageResolverVersion` (`1.0.0`|`2.0.0`), `modulePaths`, `serverModulesInclude/ExcludePatterns`
(excludes `**/*.test.ts` by default), `linter.module.enabled` (true), `scripts.prebuild` (custom build tasks).

**Licensing**: `licensing` (`licensable`, `enforceLicense` `none|log|enforce`, `licenseModel`, `licenseCategory`).

**Other**: `logo`/`menu`/`guidedSetupGuid` (32-hex), `tableOutputFormat` (`bootstrap`|`component`),
`excludeFilePatterns`, `staticContentPaths`, `taxonomy` (table→folder mapping).

## Keys file (`src/fluent/generated/keys.ts`)
Source: `servicenow.github.io/sdk/config/keys-file`. Auto-generated registry mapping `Now.ID['name']` → 32-hex sys_id.
- **Explicit keys**: developer-chosen (kebab-case) → table + sys_id; sys_id stabilized on first build.
- **Composite keys**: auto-managed for child/descendant records (columns, documentation, choices) — don't touch.
- **Deleted keys**: track removed records, prevent sys_id reuse, enable clean uninstalls.
- **Best practices (critical):** commit `keys.ts` to version control — it's the **identity source of truth**; never
  hand-edit except to fix a mapping; **renaming a key creates a NEW record and orphans the old one** (sys_id
  stability matters across deploys — this is why re-import to the same instance must reuse the same keystore).

## CI / CD integration
Source: `servicenow.github.io/sdk/config/ci-integration`.
- **Frozen keys (pre-merge gate):** `now-sdk build --frozenKeys` fails the build if `keys.ts` differs from what the
  current Fluent code would generate — prevents silent regeneration and duplicate records with mismatched sys_ids.
- **Non-interactive auth:** set `SN_SDK_NODE_ENV=SN_SDK_CI_INSTALL`, then either
  - Basic: `SN_SDK_AUTH_TYPE=basic` + `SN_SDK_INSTANCE_URL`, `SN_SDK_USER`, `SN_SDK_USER_PWD`; or
  - OAuth: `SN_SDK_AUTH_TYPE=oauth` + `SN_SDK_INSTANCE_URL`, `SN_SDK_OAUTH_CLIENT_ID`, `SN_SDK_OAUTH_CLIENT_SECRET`
    (one-time instance setup: OAuth Application Registry with `client_credentials`, system property
    `glide.oauth.inbound.client.credential.grant_type.enabled=true`, service user `Identity Type=Human`).
- **Pipeline order:** `now-sdk build --frozenKeys` (validate) → `now-sdk install` (deploy to dev/test only; use
  standard promotion for production).
