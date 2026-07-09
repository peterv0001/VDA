---
name: TS project references need explicit lib rebuild
description: Typecheck failures for @workspace/* imports are often stale dist declarations, not missing exports
---

The rule: when `pnpm --filter <artifact> run typecheck` reports "no exported member" for a `@workspace/*` package whose source clearly exports it, rebuild the referenced lib first: `pnpm exec tsc -b lib/<package>`.

**Why:** Artifact tsconfigs use TypeScript project references pointing at `lib/*` packages that emit declarations to `dist/`. Vite resolves the lib from `src/` (package exports point at `./src/index.ts`), so the app runs fine, but `tsc -p` consumes the stale `dist/*.d.ts`. After codegen or lib source changes, dist declarations lag behind.

**How to apply:** Before debugging exports/imports, run `pnpm exec tsc -b lib/<package>` and re-run the artifact typecheck.
