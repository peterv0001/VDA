---
name: Iframe reader keyboard navigation
description: Reliable keyboard shortcuts for same-origin long-form readers embedded in an iframe.
---

For keyboard chapter navigation inside an embedded document, make the reading surface focusable and let the iframe emit a narrowly scoped `postMessage` that the parent reader shell handles.

**Why:** Parent-level key listeners do not receive keystrokes while focus is inside an iframe. Browser-reserved combinations such as Alt+Arrow may be consumed as history navigation before either document sees them. A non-focusable iframe body also makes automated and assistive keyboard behavior unreliable.

**How to apply:** Use a non-reserved shortcut such as Shift+Arrow, call `preventDefault` inside the embedded document, validate the message source/type in the parent, and test the shortcut with focus inside the iframe.