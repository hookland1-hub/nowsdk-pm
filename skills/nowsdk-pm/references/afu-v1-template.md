# AFU v1 — section skeleton the generated document MUST follow

The `nowsdk-pm` skill produces a Markdown "Analisi Funzionale / Design Specification (v1)"
following this exact skeleton. Every section must be present; if information is missing, state the
assumption explicitly and add an entry to §17 (Open points) — never invent platform behavior.

Use ServiceNow-correct terminology and only propose components from
`fluent-capability-matrix.md` (flag anything UI-Builder-only as out of the offline path).

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
### 12.1 Consultation surface (Workspace lists and/or Service Portal console)
### 12.2 Management surface (Workspace CRUD and/or Service Portal management; UI actions)
### 12.3 Portal objects (if Service Portal: `sp_portal`/`sp_page`/`sp_widget`, views, filters, export)
## 13. Integrations
### 13.1 Integration component (Script Include API — read-only, single access point, accessibleFrom)
### 13.2 Consumer logic (how other processes/scopes consume it)
### 13.3 Implementation considerations
## 14. Data strategy & import (seed/reference data; import sets; non-personal demo data)
## 15. Test (ATF) — regression of ACLs, functional Script Include, relationship integrity
## 16. Release & offline packaging
(build → offline converter → single `sys_remote_update_set` XML → Retrieved Update Sets →
Preview → Commit; optional separate seed XML; delta packaging for already-deployed apps)
## 17. Assumptions & open points
## 18. Delivery roadmap — Step 0 → Delivery
(numbered milestones; see component-checklist.md for the A→Z component list)

---

### Appendix A — Component checklist (A→Z)
Embed the checklist from `component-checklist.md`, ticking what the app needs.

### Appendix B — Offline no-auth packaging path
Reference `offline-update-set-workflow.md` for the end-to-end build/package/import sequence.
