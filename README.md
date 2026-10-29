# J R Auto Repair & Bodyshop — website

Live site: https://jr-auto-lawrence.pages.dev/ (Cloudflare Pages)
Shop: 7 Winter St, Lawrence, MA 01841 · 978-975-2700 · Mon–Sat 9 AM–5 PM, Sun closed

## Editing
`index.html` is the whole site in one file — the before/after slider photos are
embedded in it, so there are no other files to keep in sync.
Edit it right here on GitHub (pencil icon), commit, then download the new ZIP
(Code → Download ZIP) and upload it as a new deployment in Cloudflare Pages
(Workers & Pages → jr-auto-lawrence → Create deployment).

Slider fix (2026-10-27): the before/after pair is now the same car in identical
framing (dull/scuffed before, glossy after). The original pair was two unrelated
stock photos (a motorcycle and a different car at a harbor).

Paint fix (2026-10-27): the color swatches originally changed only the caption
text — no code ever recolored the car, so only blue (the photo's own color)
looked right. Each swatch now swaps the repaired-car image for a recolored
version of the same photo (paint pixels only): Radiant Red, Obsidian Gray,
Pearl White, and Deep Blue (the original). Recolors are embedded in index.html.
