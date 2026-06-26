---
description: Scaffold a Now SDK workspace for a scoped app — deliverable live (with auth) or fully offline as a no-auth Update Set XML.
argument-hint: "[target folder]"
---

Invoke the `nowsdk-bootstrap` skill to scaffold a Now SDK workspace (Fluent scaffold, converter,
validators, package scripts, now.config, workflow reference) — ready to deliver either live via the
standard Now SDK (`now-sdk install`/`deploy`, with auth) or fully offline as a no-auth Update Set XML.
The skill creates files only and never authenticates. Ask me for the scope and app name if not provided.

Target folder (optional):

$ARGUMENTS
