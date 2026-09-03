---
name: Pinned pnpm versions on Replit
description: Why this workspace should use Replit's Nix-provided pnpm instead of pinning a newer packageManager version.
---

Do not add a root `packageManager` pin for a pnpm version newer than the one supplied by this Replit environment.

**Why:** In this workspace, that mismatch made every pnpm invocation repeatedly try to install the pinned pnpm version until the process aborted. Removing the pin restored normal package commands without changing dependency resolution.

**How to apply:** Keep dependency versions in `package.json` and `pnpm-lock.yaml`, but let the Replit runtime provide pnpm unless the runtime is intentionally upgraded through the supported package-management flow.