---
name: Animated overlay focus
description: Accessibility timing rules for focus management in animated VDACQ overlays.
---

When an animated overlay opens, make `visibility: visible` take effect immediately and delay its first programmatic focus until the trigger's native click behavior has finished. Delay `visibility: hidden` only for the closing fade.

**Why:** A visibility transition kept the mobile menu's links technically hidden during the opening fade, so `focus()` silently failed. Earlier focus timing could also be overwritten by the hamburger button's native click behavior.

**How to apply:** For menus or dialogs that animate opacity, use immediate visibility on the open state, delayed visibility on close, and transfer focus in a zero-delay task after opening. Verify the active element in a real browser.