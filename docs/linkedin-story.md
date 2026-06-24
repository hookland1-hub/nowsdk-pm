# LinkedIn post — nowsdk-pm

> Draft copy for a LinkedIn post. Tone: practical, no hype. No client names.

---

**I turned a working ServiceNow delivery practice into a Claude plugin that writes real PM-grade design docs. Not a dystopian demo — something you can run today.**

For weeks I've been shipping real ServiceNow scoped applications a different way: build everything
locally with the **Now SDK + Fluent**, package the generated records into a single **Update Set XML**,
and import it from *Retrieved Update Sets*. No instance auth, no credentials, no `deploy` — just a
self-contained artifact a platform admin can preview and commit. Full apps: data model, ACLs,
Workspace, Service Portal, integrations — delivered as one importable file.

The unlock wasn't a bigger model. It was **grounding**: pairing the official **ServiceNow `now-sdk
explain`** documentation skill with disciplined engineering workflows, so the AI stops guessing about
the platform and starts citing it.

So I packaged that discipline into a plugin: **`nowsdk-pm`**.

You describe the application you want in plain language. `nowsdk-pm` acts as a **ServiceNow Project
Manager** and writes a complete, ServiceNow-correct **design document (an "AFU v1")** — from **step 0
to delivery**: scope, data model, security/ACLs, UI surfaces, the integration API, ATF tests, the
offline release path, governance, a delivery roadmap, and an A→Z component checklist. Crucially, it
only proposes components that are actually buildable offline, and flags the ones that aren't.

Why it matters: when an AI that isn't deeply trained on ServiceNow tries to operate on the platform,
it hallucinates APIs and metadata that don't exist. `nowsdk-pm` flips the order — it produces a solid,
platform-oriented design **first**, so every later step (Now SDK build or a manual admin build, your
call) starts from real ground instead of fiction.

It also ships a **bootstrap** that scaffolds the exact offline, no-auth workspace I use — converter,
validators, package scripts — so you can go from design to a buildable project in minutes.

**Try it (Claude Code):**
```
/plugin marketplace add hookland1-hub/nowsdk-pm
/plugin install nowsdk-pm@nowsdk-pm
/nowsdk-pm  an app to manage IT assets with an approval workflow and an operator console
```

It's open source (MIT) on my GitHub. I'd genuinely love feedback from ServiceNow architects, devs and
PMs — what would you want a tool like this to get right?

\#ServiceNow #NowSDK #Fluent #ClaudeCode #AI #LowCode #PlatformEngineering #ITSM
