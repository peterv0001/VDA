---
name: Basic auth challenges in browser fetches
description: Why explicit invalid Basic credentials should not receive another WWW-Authenticate challenge
---

When a browser fetch already sends an explicit Basic `Authorization` header and the credentials are invalid, return a plain 401 without `WWW-Authenticate`. Keep the challenge header for requests that send no credentials.

**Why:** Re-challenging an invalid programmatic credential can leave the browser fetch pending behind native authentication handling, so the React client stays in a loading state instead of receiving the 401 and showing its error.

**How to apply:** For browser-driven Basic auth endpoints, send `WWW-Authenticate` only on the missing-header branch. The invalid-credential branch should return a normal JSON 401 response.
