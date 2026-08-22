---
name: Rebase test merges
description: Validation needed after automated semantic merges touch shared end-to-end tests.
---

Treat a marker-free semantic merge of shared end-to-end tests as untrusted until the test inventory and full suite both pass.

**Why:** An automated rebase once reported a clean merge while duplicating declarations, moving statements between test blocks, and dropping complete journal tests.

**How to apply:** After any task rebase that changes shared e2e files, compare the test inventory with the pre-rebase version, run the test runner's list command, and then run the complete suite.