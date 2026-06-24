# nowsdk-pm

**A ServiceNow Project Manager in your Claude Code.** Describe the application you want in plain
language, and `nowsdk-pm` produces a complete, ServiceNow-correct **design document (AFU v1)** —
covering every component from **step 0 to delivery** — grounded in the official Now SDK so a
non-expert agent doesn't hallucinate platform behavior. It can also **bootstrap** a proven
**offline, no-auth** Now SDK workspace that builds a scoped app into an importable **Update Set XML**.

> You get a strong, platform-oriented starting point. What happens next — build it with the Now SDK,
> or hand it to a sys admin for a manual build — is your choice. The document is a starting point for
> a design review, not a substitute for one.

## Why

When an AI that isn't deeply trained on ServiceNow tries to operate on the platform, it hallucinates:
wrong APIs, non-existent metadata, impossible UI. `nowsdk-pm` flips the order — it first writes a
**ServiceNow-oriented design** grounded in the official `now-sdk explain` documentation and a curated
set of hard-won references, so every later step starts from solid ground.

## What it produces

A single Markdown file following a full AFU skeleton: purpose, scope, design principles, operating
model, functional & non-functional requirements, solution design (architecture, naming/scope, scope
protection), **data model** (tables/columns/choices/indexes/relationships), **security** (roles + ACL
matrix), **UI** (Workspace / Service Portal / forms), **integrations** (Script Include API), data &
seed strategy, **ATF tests**, **release & offline packaging**, governance (retention/GDPR/logical
delete/auto-number where relevant), assumptions & open points, a **Step 0 → Delivery roadmap**, and an
**A→Z component checklist**. Only offline-buildable components are proposed; anything requiring UI
Builder is flagged.

## Prerequisites

- **Node.js** (LTS or newer) and the **Now SDK** (`@servicenow/sdk`, used as a project dependency).
- The official **ServiceNow SDK** Claude plugin (provides the `now-sdk explain` skill) — strongly
  recommended for grounding. Install from the official marketplace:
  - `/plugin marketplace add anthropics/claude-plugins` *(or your configured official marketplace)*
  - `/plugin install servicenow-sdk`
- **superpowers** (brainstorming / planning discipline) — recommended:
  - `/plugin marketplace add obra/superpowers`
  - `/plugin install superpowers`

`nowsdk-pm` still works from its bundled references if a companion plugin is missing — it will tell
you what's available and what to install.

## Install

```text
/plugin marketplace add hookland1-hub/nowsdk-pm
/plugin install nowsdk-pm@nowsdk-pm
```

## Use

Generate a design document:

```text
/nowsdk-pm  an app to manage IT assets with an approval workflow and a console for operators
```

…or just describe your app in chat — the `nowsdk-pm` skill triggers on design/scoping requests.

Scaffold an offline Now SDK workspace:

```text
/nowsdk-bootstrap
```

## What's inside

- `skills/nowsdk-pm/` — the PM skill + `references/` (AFU template, Fluent capability matrix, Service
  Portal gotchas, A→Z component checklist, the offline no-auth update-set workflow) + `templates/`
  (converter, seed generator, validators, `now.config.json`, `package.json`).
- `skills/nowsdk-bootstrap/` — scaffolds the offline workspace.
- `commands/` — `/nowsdk-pm` and `/nowsdk-bootstrap` slash commands.

## The offline, no-auth philosophy

```text
Fluent (*.now.ts) ──now-sdk build──▶ dist/app/*.xml ──converter──▶ sys_remote_update_set.xml
                                                                       │
                                              Retrieved Update Sets ◀──┘  (Preview → Commit)
```

Build locally, wrap the generated records into a single self-contained Update Set XML (it includes
the `sys_app` record, so a clean instance gets the app created on commit), and import it from
**Retrieved Update Sets**. No `now-sdk auth/install/deploy`, no customer credentials.

## Author

**Fabio Ciro De Biase** — [LinkedIn](https://www.linkedin.com/in/fabiodebiase-it/)

## License

MIT © Fabio Ciro De Biase
