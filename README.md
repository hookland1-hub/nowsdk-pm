# nowsdk-pm

**A ServiceNow Senior Architect in your Claude Code.** Describe the application you want in plain
language and `nowsdk-pm` takes you **from architecture & design through development and delivery**:
it first produces complete, ServiceNow-correct **architecture & design documentation** (whole-platform —
data, security, UI, integration, governance, delivery roadmap), then **scaffolds a ready-to-build Now SDK
workspace** you can ship **either** via the **standard Now SDK** (with instance auth: `now-sdk install`/
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
2. **Bootstrap** — scaffold a real **Now SDK workspace** (Fluent project, scripts, validators, offline
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
2. **A ready-to-build Now SDK workspace** (via the bootstrap skill) — `now.config`, package scripts, a
   Fluent scaffold, validators and the offline converter — **deliverable both ways**: pushed live with the
   standard **Now SDK (with auth)** (`now-sdk install`/`deploy`), or packaged **offline** into a single,
   self-contained **Update Set XML** importable via *Retrieved Update Sets* (no credentials).

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

Generate the architecture & design documentation:

```text
/nowsdk-pm  an app to manage IT assets with an approval workflow and a console for operators
```

…or just describe your app in chat — the `nowsdk-pm` skill triggers on design/architecture requests.

Scaffold a Now SDK workspace (ready for either delivery channel):

```text
/nowsdk-bootstrap
```

## What's inside

- `skills/nowsdk-pm/` — the architect skill + `references/` (AFU template, **component & delivery-channel
  matrix**, **SDK Fluent capabilities** (4.8), **configuration reference**, **Fluent-language reference**,
  **best practices**, Service Portal gotchas, A→Z component checklist, the end-to-end update-set workflow) +
  `templates/` (converter, seed generator, validators, `now.config.json`, `package.json`).
- `skills/nowsdk-bootstrap/` — scaffolds a Now SDK workspace deliverable live (with auth) or offline (no-auth).
- `commands/` — `/nowsdk-pm` and `/nowsdk-bootstrap` slash commands.

## Delivery channels

The design recommends the best component per requirement and tags each with a channel; the scaffolded
workspace can be delivered through whichever fits:

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
