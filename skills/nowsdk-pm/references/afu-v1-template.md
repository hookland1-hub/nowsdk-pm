# AFU v1 — section skeleton the generated document MUST follow

The `nowsdk-pm` skill produces a Markdown "Analisi Funzionale / Design Specification (v1)"
following this exact skeleton. Every section must be present; if information is missing, state the
assumption explicitly and add an entry to §17 (Open points) — never invent platform behavior.

Use ServiceNow-correct terminology. Recommend the **best-fit** component for each requirement across
the whole platform (see `component-delivery-matrix.md`), and for every component **annotate its
delivery channel**: *Fluent SDK (offline)* / *Now SDK (with auth)* / *on-platform* (App Engine Studio,
UI Builder, Flow Designer…). Never exclude a valid component because of a packaging constraint;
explicitly call out objects that need SDK auth or on-platform authoring (the gaps a delivery team fills).

---

# <App Name> — Design Specification & Functional Analysis (v1)

**Document metadata table**: Document, Application, Platform (ServiceNow scoped app), Technical
scope `x_<vendor>_<app>`, Project, Version 0.1, Status "Draft for Validation", Author, Date.

## 1. Purpose of the document
## 2. Context & objectives
## 3. Scope of the solution
### 3.1 In scope
### 3.2 Out of scope
## 4. Reference sources / inputs
## 5. Design principles
(centralization, configurability, separation of concerns, reuse of platform data,
security by design, logical deletion, simplicity)
## 6. Operating model
(domains/ambits, severity/levels, lifecycle if relevant)
## 7. Functional requirements
(one subsection per functional area; include consultation vs management surfaces)
## 8. Non-functional requirements
(security, usability, availability, maintainability, traceability/audit, performance,
privacy/GDPR & retention if personal data is involved)
## 9. Solution design
### 9.1 Architecture (scoped app: data model + security + UI surface(s) + integration component)
### 9.2 Naming & scope conventions (`x_<vendor>_<app>`, tables `x_<vendor>_<app>_<entity>`,
roles `x_<vendor>_<app>.<role>`)
### 9.3 Scope protection (runtime access restricted; cross-scope access only to authorized scopes)
## 10. Data design
(one subsection per table: fields with ServiceNow type, mandatory, notes; indexes; relationships;
choice lists with value→label; auto-number and retention/date fields where applicable)
## 11. Security & access
(application roles and inheritance; record ACL matrix per table per operation; `ux_route` ACL for
workspace; no exposure of other processes' data)
## 12. User interface
(choose the best UI for the need — Configurable Workspace / UI Builder experience, Service Portal,
classic forms/lists — and annotate the delivery channel of each)
### 12.1 Consultation surface (Workspace/UX experience and/or Service Portal console)
### 12.2 Management surface (Workspace CRUD / UI Builder, and/or Service Portal; UI actions)
### 12.3 UI objects & delivery channel (Fluent-authorable: `sp_*`, classic forms/lists, UiPage;
on-platform: UI Builder UX pages/components/macroponents `sys_ux_*`)
## 13. Integrations
### 13.1 Integration component (Script Include API — read-only, single access point, accessibleFrom)
### 13.2 Consumer logic (how other processes/scopes consume it)
### 13.3 Implementation considerations
## 14. Data strategy & import (seed/reference data; import sets; non-personal demo data)
## 15. Test (ATF) — regression of ACLs, functional Script Include, relationship integrity
## 16. Delivery & implementation channels
Recommend the delivery approach(es) per context, and list which components go through each:
- **Fluent SDK (offline)** → `now-sdk build` → single self-contained `sys_remote_update_set` XML →
  *Retrieved Update Sets → Preview → Commit* (no instance auth); optional seed XML; delta packaging.
- **Now SDK (with instance auth)** → `now-sdk install`/`deploy` to a connected instance.
- **On-platform** → App Engine Studio / UI Builder / Flow Designer / Catalog Builder for objects that
  are best (or only) authored on the platform.
Explicitly list the **SDK-auth-only** and **on-platform-only** components (the gaps a delivery team
fills) so the roadmap accounts for them.
## 17. Assumptions & open points
## 18. Delivery roadmap — Step 0 → Delivery
(numbered milestones; see component-checklist.md for the A→Z component list)

---

### Appendix A — Component checklist (A→Z)
Embed the checklist from `component-checklist.md`, ticking what the app needs and noting each item's
delivery channel.

### Appendix B — Delivery options (incl. offline no-auth packaging path)
For the offline no-auth path, reference `offline-update-set-workflow.md` for the end-to-end
build/package/import sequence. Also state when a Now SDK build with auth, or on-platform authoring, is
the better fit.
