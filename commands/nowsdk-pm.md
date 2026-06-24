---
description: Generate a full ServiceNow design document (AFU v1) from a plain-language app description.
argument-hint: "<describe the application you want>"
---

Invoke the `nowsdk-pm` skill to act as a ServiceNow Project Manager and produce a complete,
ServiceNow-oriented design document (AFU v1) for the application described below. Ground every
platform fact in the official `now-sdk explain` and the skill's bundled references. Recommend the
best-fit component for each requirement across the whole platform, and annotate the delivery channel
(Fluent SDK offline / Now SDK with auth / on-platform: App Engine Studio, UI Builder, Flow Designer),
explicitly calling out SDK-auth-only and on-platform-only objects — never excluding valid ones.

Application description:

$ARGUMENTS
