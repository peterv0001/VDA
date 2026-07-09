---
name: SPA prerendering for static-serve artifacts
description: How build-time prerendering works for the vdacq SPA and the pitfalls (vite preview fallback, production rewrites, shared page meta)
---

The vdacq site prerenders all routes to static HTML at build time (client build → SSR build of an entry-server → node prerender script writing `dist/public/<route>/index.html` with per-page title/meta injected, hydrated via `hydrateRoot` when `#root` has children).

**Why:** Crawlers that don't execute JS must see real page content and per-page meta in the raw HTML.

**How to apply / pitfalls:**
- Per-route titles/descriptions live in one shared module consumed by both the runtime meta hook and the prerender script — never re-add literal strings to page components or they drift out of the prerendered HTML.
- `vite preview` SPA fallback serves the root `index.html` for extensionless paths and ignores `dist/public/<route>/index.html`; that is NOT how production behaves. Production static serving uses artifact `services.production.rewrites` (evaluated in order, specific routes before the `/*` catch-all) to map each route to its prerendered file.
- Adding a new route requires updating the shared meta record AND the production rewrites (via the artifact TOML replace flow, not direct edits).
- Everything browser-only must stay inside effects; components were already SSR-safe.
