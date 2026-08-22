---
name: Legacy SPA hash redirects
description: Routing rule for preserving retired single-page anchor URLs after sections move to dedicated pages.
---

Legacy fragment compatibility must handle both the initial page load and later `hashchange` events. When a retired fragment maps to the route already being displayed, remove it with `history.replaceState` rather than relying on the client router to navigate to the same path.

**Why:** SPA routers commonly exclude fragments from route state and suppress navigation to the current path. A mount-only redirect works for a fresh bookmark but can leave a second legacy fragment intact when the browser performs a same-document hash change.

**How to apply:** When converting anchored sections into routes, test each old fragment from a fresh load and while already on the source page. Preserve unknown fragments unless the migration explicitly retires them.