# nowsdk-pm

**A ServiceNow Senior Architect in your Claude Code.** Describe the application you want in plain
language and `nowsdk-pm` takes you **from architecture & design through development and delivery**:
it first produces complete, ServiceNow-correct **architecture & design documentation** (whole-platform —
data, security, UI, integration, governance, delivery roadmap), then **scaffolds a ready-to-build Now SDK
project** you can ship **either** via the **standard Now SDK** (with instance auth: `now-sdk install`/
`deploy`) **or** fully **offline** as a no-auth **Update Set XML**. Every platform fact is grounded in the
official Now SDK (`now-sdk explain`) plus a curated, **source-validated** set of references — so a
non-expert agent doesn't hallucinate platform behavior.

> A senior-architect head start for the whole journey — **design → build → deliver**. What you ship and
> how (live via the Now SDK, offline as an Update Set, or on-platform) stays your choice; the
> documentation and the scaffold are a strong, validated starting point, not a substitute for your own
> design review.

## Why

When an AI that isn't deeply trained on ServiceNow operates on the platform, it hallucinates: wrong APIs,
non-existent metadata, impossible UI. `nowsdk-pm` flips the order — it first establishes a
**ServiceNow-correct architecture** grounded in the official `now-sdk explain` docs and hard-won,
source-validated references, then carries that grounding into the build and delivery steps so every stage
starts from solid ground.

## From design to delivery

1. **Architect** — turn a plain-language description into a whole-platform **design specification (AFU)**:
   recommends the best-fit component for each requirement and **annotates each with its delivery channel**
   (*Fluent SDK offline* / *Now SDK with auth* / *on-platform*), flagging the gaps a delivery team fills —
   never excluding a valid component.
2. **Bootstrap** — scaffold a real **Now SDK project** (Fluent source, scripts, validators, offline
   converter) ready to build.
3. **Deliver — your channel**: push live with the **standard Now SDK** (with auth), package **offline**
   into a self-contained **Update Set XML** (no credentials), or hand off the on-platform items
   (UI Builder / Flow Designer / App Engine Studio) the design called out.

## What it produces

1. **Architecture & design documentation** — a full specification (AFU) covering the whole platform:
   purpose/scope, design principles, operating model, functional & non-functional requirements,
   **data architecture** (tables/columns/choices/indexes/relationships), **security architecture**
   (roles + ACL matrix, scope protection), **UI architecture** (Workspace / UI Builder / Service Portal /
   classic), **integration architecture** (Script Include APIs, consumer scopes), governance
   (retention/GDPR/logical-delete/auto-number), data & seed strategy, an **ATF test plan**,
   **delivery & implementation channels**, a **Step 0 → Delivery roadmap**, and an A→Z component checklist.
2. **A ready-to-build Now SDK project** (via the bootstrap skill) — `now.config`, package scripts, a
   Fluent scaffold, validators and the offline converter — **deliverable both ways**: pushed live with the
   standard **Now SDK (with auth)** (`now-sdk install`/`deploy`), or packaged **offline** into a single,
   self-contained **Update Set XML** importable via *Retrieved Update Sets* (no credentials).

## SDK with `explain` skill alone vs + nowsdk-pm

**The SDK gives you the tools — `nowsdk-pm` gives you the architect.** From a plain-language idea to a
ServiceNow-correct design and a ready-to-build app, grounded in the `explain` docs you already have. It
**doesn't replace the SDK** — it requires it and builds the architect layer on top.

| Capability | Now SDK with `explain` | + nowsdk-pm |
|---|---|---|
| Platform facts | Per-topic reference you look up yourself (`explain <topic>`) | The same `explain` (required) **+ a curated, cross-cutting synthesis** (capability map, configuration & Fluent-language references, best practices) |
| Plain-language description → design | — (you architect it yourself) | A **whole-platform architecture & design document (AFU)** from a description |
| Best-fit component + delivery channel per requirement | You decide manually, topic by topic | A **component & delivery-channel matrix** (recommends + annotates Fluent-offline / SDK-auth / on-platform) |
| Best practices / anti-patterns / hard-won gotchas | Scattered across per-topic guides | **One synthesized, validated set** (security/ACLs one-per-op, `GlideRecordSecure`, Service Portal gotchas, module anti-patterns, keystore/frozen-keys) |
| Project scaffold | `now-sdk init` (standard project) | Bootstrap **+ offline no-auth Update Set packaging** (converter, validators, seed generator) that the base SDK doesn't provide |
| Delivery channels | `install`/`deploy` (auth), `pack` (source ZIP), `transform` | Both channels end-to-end, including the **offline Update Set XML** (no auth) |
| Method / discipline | A toolchain (no methodology) | A **validation discipline** (explain → official docs → community; never invent) + AFU skeleton, roadmap, A→Z checklist |
| Output | Built app artifacts | A **design-spec deliverable** + a ready-to-build project |

It never writes the app for you or replaces `explain` — it grounds every fact in `explain`/official docs,
curates it, and builds an architect's workflow on top.

## Prerequisites

- **Node.js** (LTS or newer).
- **Required — the latest Now SDK.** `nowsdk-pm` is grounded in the live, current `now-sdk explain`, so it
  **requires** the latest **`@servicenow/sdk`** plus the official **ServiceNow SDK** Claude plugin. If the SDK is
  missing or not the latest, the skill **stops** and asks you to install/upgrade first (the bundled `references/`
  are a curated map + best practices, **not** a substitute for the live `explain`). Install:
  - `/plugin marketplace add anthropics/claude-plugins` *(or your configured official marketplace)*
  - `/plugin install servicenow-sdk`
  - project dependency, latest: `npm install @servicenow/sdk@latest`
- **superpowers** (brainstorming / planning discipline) — **optional** (recommended); the only companion the
  plugin runs without:
  - `/plugin marketplace add obra/superpowers`
  - `/plugin install superpowers`

## Install

```text
/plugin marketplace add hookland1-hub/nowsdk-pm
/plugin install nowsdk-pm@nowsdk-pm
```

## Use

Run it **bare** to get the menu — a description is optional:

```text
/nowsdk-pm
```

You'll be offered three modes:
- 🆕 **New project** — describe your idea → a whole-platform architecture & design document (AFU).
- 🔗 **Align to an existing project** — give a local path to your project's docs/deliverables; it ingests them,
  aligns to the project's current state, and then supports every next request on that project.
- 🧪 **Bootstrap an example** — scaffold a small sample app to test the plugin.

Or jump straight to a new design by passing the idea:

```text
/nowsdk-pm  an app to manage IT assets with an approval workflow and a console for operators
```

> **Requires the latest Now SDK.** If yours is outdated (e.g. an older 4.7.x), the skill stops and asks you to
> upgrade first (`npm install @servicenow/sdk@latest`) — it won't run on a stale SDK.

Scaffold a Now SDK project directly (either delivery channel):

```text
/nowsdk-bootstrap
```

## What's inside

- `skills/nowsdk-pm/` — the architect skill + `references/` (AFU template, **component & delivery-channel
  matrix**, **SDK Fluent capabilities** (4.8), **configuration reference**, **Fluent-language reference**,
  **best practices**, Service Portal gotchas, A→Z component checklist, the end-to-end update-set workflow) +
  `templates/` (converter, seed generator, validators, `now.config.json`, `package.json`).
- `skills/nowsdk-bootstrap/` — scaffolds a Now SDK project deliverable live (with auth) or offline (no-auth).
- `commands/` — `/nowsdk-pm` and `/nowsdk-bootstrap` slash commands.

## Delivery channels

The design recommends the best component per requirement and tags each with a channel; the scaffolded
project can be delivered through whichever fits:

- **Now SDK (with auth)** — push the same Fluent app live to a connected instance (`now-sdk install` /
  `now-sdk deploy`).
- **Offline (no-auth)** — build locally and wrap the generated records into a single self-contained
  **Update Set XML** (it includes the `sys_app` record, so a clean instance gets the app on commit); import
  it from **Retrieved Update Sets → Import from XML → Preview → Commit** — no credentials.

```text
Fluent (*.now.ts) ──now-sdk build──▶ dist/app/*.xml ──┬─▶ now-sdk install/deploy   (with auth)
                                                      └─▶ converter ▶ Update Set XML ▶ Retrieved Update Sets (no auth)
```

- **On-platform** — the design flags objects best (or only) authored in UI Builder / Flow Designer /
  Catalog Builder / App Engine Studio, with the work they need.

## Changelog

### 0.6.1
- **Two production-validated gotchas added** (hard-won on a live client deploy):
  (1) **Configurable Workspace record preview** needs a `Form()` on the **`workspace`** view per table —
  a `default_view` form covers the classic + full record form but not the preview pane (warns *"This form has
  not been configured for Workspace"*); fix offline with `Form({ view: 'workspace' })`.
  (2) **Widget server script execution order**: the script is an IIFE and `var` assignments are not hoisted, so a
  call placed before the `var` maps it uses throws *"Cannot read property … from undefined"* — put triggers after them.
- `component-checklist.md` reminds to add the `workspace`-view form when a Configurable Workspace is used.

### 0.6.0
- **`/nowsdk-pm` is now a menu** when run bare — a description is no longer required. Three modes:
  **New project** (design from an idea), **Align to an existing project** (point it at a local docs/deliverables
  path; it ingests, aligns, and supports every next request on that project), and **Bootstrap an example**.
- **The latest Now SDK is force-required**: the preflight hard-blocks and asks you to upgrade if the installed SDK
  isn't the latest (no "offline-only" fallback, no proceeding on a stale SDK).
- Install descriptions updated to reflect the modes and the SDK requirement.

### 0.5.1
- **Accuracy pass on the integrated docs knowledge** (validated against `now-sdk explain`): module-guide
  function-vs-`Now.include()` API split and ACL `decisionType`/`type`/`field` properties confirmed exact;
  corrected an overstated "two-way sync" wording (it's `transform` pull + build/deploy push, not live auto-sync);
  added a validated module anti-pattern (no global scope-prefix in modules — import from `@servicenow/glide/<scope>`).

### 0.5.0
- **Official docs knowledge extracted** (curated, cited) from `servicenow.github.io/sdk` — API Reference,
  Configuration, Fluent Language, Guides — into new references: `configuration-reference.md` (now.config.json,
  keys file, CI/frozen-keys), `fluent-language-reference.md` (DSL, `Now.*` helpers, Data Helpers, ES-modules vs
  `Now.include()`), `best-practices.md` (dev workflow, security/ACLs, identity & deploys, data/migration).
- **API catalogue completed** in the delivery matrix: `RestApi`, `Sla`, `ScriptAction`, `CrossScopePrivilege`,
  `ImportSet`, `UserPreference`, `AiAgent`/`AiAgenticWorkflow`/`NowAssistSkillConfig`, Instance Scan checks — with
  tables validated via `explain`.
- **The latest Now SDK is now REQUIRED** (blocking preflight); only `superpowers` is optional. Bundled references
  are a curated map + best practices, not a substitute for the live `explain`.

### 0.4.0
- **Aligned to Now SDK 4.8.1** (templates) and added a validated capability knowledge base
  (`references/sdk-fluent-capabilities.md`), grounded in `now-sdk explain` (4.8.1) + the official GitHub
  release notes.
- **New Fluent APIs surfaced (4.8):** `RestMessage()` (`sys_rest_message`), `Alias()`/`AliasTemplate()`,
  `RetryPolicy()`, `DataLookup()` (`dl_definition`), `PlaybookDefinition()` (`sys_pd_process_definition`),
  `UserCriteria()` — added to the delivery matrix and component checklist as Fluent-authorable.
- **Helpers documented:** `Now.del()` (mark a record for deletion on deploy), `$override` (escape hatch),
  `Table` `augments`/`createAccessControls`/`userRole`, Flow `Stages`/`TryCatch`/`DoInParallel`, ACL `field`
  typing, `ScheduledScript` `$meta` one-time; CLI `now-sdk query` (auth).

### 0.3.0
- **Accuracy audit of every platform claim** in the references, validated against `now-sdk explain`,
  official ServiceNow product documentation, and the community.
- **Correctness fix:** scoped `GlideRecord` does **not** enforce record ACLs — server-side it runs with
  system access and **bypasses** them; use **`GlideRecordSecure`** (or explicit `can*()` checks) in
  widget/server code. (Previous wording was backwards.)
- **ATF API** corrected to `Test()` (was `AtfTest()`); `sys_atf_test` unchanged.
- **Delivery matrix realigned:** Service Catalog (`CatalogItem()`/`CatalogUiPolicy()`/…), Email
  notifications (`EmailNotification()`) and Data Policy (`DataPolicy()`) are Fluent-authorable (were
  understated as on-platform).
- **Methodology hardened:** `explain` is authoritative but not exhaustive — when it is silent/ambiguous,
  escalate to official docs then community; never assert an uncitable platform behavior.

## Author

**Fabio Ciro De Biase** — [LinkedIn](https://www.linkedin.com/in/fabiodebiase-it/)

## License

MIT © Fabio Ciro De Biase
