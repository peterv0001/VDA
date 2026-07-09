---
name: Playwright e2e on NixOS
description: How the e2e suite runs in this Replit workspace (Nix chromium, proxy base URL, validation step)
---

Playwright's downloaded browsers don't run on NixOS (dynamic linking). Use the Nix `chromium` system package and point `launchOptions.executablePath` at `which chromium` (see `playwright.config.ts`).

**Why:** `playwright install chromium` binaries fail to link against Nix store libs; the system chromium works fine with `@playwright/test`.

**How to apply:** Run the suite with `pnpm test:e2e` (root script). Tests target `http://localhost:80` — the artifact proxy — so the vdacq web workflow AND the api-server workflow must both be running first. A validation step named `e2e` is registered with the same command. Tests submit real rows into the dev DB (contact inquiries / access requests) with unique `e2e-*@example.com` emails.
