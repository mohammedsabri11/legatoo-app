# DIN Font Files

This directory is for DIN font files. To use custom DIN font files:

1. Place your DIN font files (`.woff2`, `.woff`, `.ttf`, or `.otf`) in this directory.

2. Recommended font files:
   - `DIN-Regular.woff2` / `DIN-Regular.woff` (weight: 400)
   - `DIN-Medium.woff2` / `DIN-Medium.woff` (weight: 500)
   - `DIN-Bold.woff2` / `DIN-Bold.woff` (weight: 700)

3. Uncomment the `@font-face` declarations in `app/globals.css` and adjust the file paths if your font files have different names.

4. The app is already configured to use "DIN, sans-serif" as the default font family throughout. If DIN font files are not provided, the browser will use the system's default sans-serif font if DIN is installed on the system, or fall back to the browser's default sans-serif font.

