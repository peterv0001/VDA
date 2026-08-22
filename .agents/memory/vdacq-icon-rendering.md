---
name: Libre Baskerville icon rendering
description: How to reliably select Libre Baskerville Bold when regenerating the VD monogram PNG assets.
---

Google Fonts supplies Libre Baskerville as a variable TTF. Expose that file through a temporary Fontconfig directory and render with ImageMagick's `Libre-Baskerville-Bold` named font record rather than passing the TTF path directly.

**Why:** Passing the variable TTF path directly renders its default Regular face; ImageMagick's weight and variation flags do not select the named Bold instance in this environment. Fontconfig identifies the Bold instance correctly and reproduces the established monogram.

**How to apply:** Use this route whenever regenerating the site's VD favicon, touch icon, or web app manifest PNGs from the Libre Baskerville source.