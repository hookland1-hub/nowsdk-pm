# Project gotcha ledger

Local, project-specific hard-won fixes. **The plugin always reads this file when working on the project**
(alongside its bundled `service-portal-gotchas.md`), and **appends a new entry whenever it resolves a new
problem — especially a fix applied after a deploy.** Keep entries short and factual.

Format per entry: **symptom → root cause → fix** (dated; note if it was a post-deploy fix). Most recent first.

<!--
Template — copy for each new gotcha:

## <YYYY-MM-DD> — <one-line title>  [post-deploy?]
- **Symptom:** what was observed (exact error text if any, and where — build / Preview / commit / runtime).
- **Root cause:** the real reason (grounded, not guessed).
- **Fix:** the change that resolved it (file / API / setting), and how it was verified.
- **Scope:** which tables/components/surfaces it affects; promote to the shared plugin references? (yes/no)
-->

<!-- No entries yet. The plugin will add the first one when it resolves something worth recording. -->
