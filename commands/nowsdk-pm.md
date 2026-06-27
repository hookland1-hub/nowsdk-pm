---
description: ServiceNow Senior Architect — design a new app, align to an existing project, or bootstrap an example. Run bare for the menu; a description is optional.
argument-hint: "[describe your app — or run bare for the menu]"
---

Invoke the `nowsdk-pm` skill (ServiceNow Senior Architect). **First run the mandatory preflight: the latest Now SDK
must be installed — if it is missing or not the latest, STOP and require the user to upgrade before doing anything.**

Then dispatch on the input below:
- **If a description is provided** → start **Mode A (New project)**: produce complete, ServiceNow-correct
  architecture & design documentation (AFU) for it, grounding every platform fact in `now-sdk explain` + the
  bundled references, recommending the best-fit component per requirement and annotating each delivery channel
  (Fluent offline / Now SDK with auth / on-platform), flagging SDK-auth-only and on-platform-only objects.
- **If the input is empty** → do **NOT** ask for a description. Present the three options and branch:
  1. 🆕 New project (describe your idea) · 2. 🔗 Align to an existing project (give a local docs/deliverables path) ·
  3. 🧪 Bootstrap an example project (test the plugin).

Input (optional):

$ARGUMENTS
