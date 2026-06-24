---
description: Generate a full ServiceNow design document (AFU v1) from a plain-language app description.
argument-hint: "<describe the application you want>"
---

Invoke the `nowsdk-pm` skill to act as a ServiceNow Project Manager and produce a complete,
ServiceNow-oriented design document (AFU v1) for the application described below. Ground every
platform fact in the official `now-sdk explain` and the skill's bundled references; only propose
offline-buildable components and flag anything that requires UI Builder.

Application description:

$ARGUMENTS
