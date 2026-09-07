# Literature preview

Uses the unmodified `@zinejs/core` 0.9.0 package by Awecode.
Source and demo: https://github.com/awecode/zinejs
License: PolyForm Noncommercial 1.0.0, appropriate for this personal website.
Public license notice: `/licenses/zinejs.txt`.

The integration supplies static WebP pages and two timed calls to `flipNext`.
ZineJS uses its standard cone curl and WebGL2 lighting, with its native CSS
fallback on unsupported devices. No custom page geometry or animation.
Controls, hints, zoom, loading UI and deep links are disabled.

The novel passage was supplied by the site owner; page breaks preserve its text.
`scripts/render-book-pages.py` generates the 3x artwork using Pillow and macOS
Songti SC Regular. Regenerate with `python scripts/render-book-pages.py`; another
Song font may be supplied with `--font` and `--font-index`.

The preview iframe warms on entry to Marginalia and stays loaded when switching
interests. Playback pauses when inactive; page unload calls `destroy()`.
Startup waits for the cover and first spread, with later pages prefetched by ZineJS.
Reduced-motion users see an open, static spread without automatic turns.

The front cover (`public/images/literature/cover.webp`) contains only the title
百年孤独 on a plain warm paper background. Both the poster and the engine use
this small same-origin asset; the old publisher cover is no longer requested.
The adjacent `cover.svg` is its editable source, rasterized at 468 × 672 pixels
with Sharp WebP quality 90 for compatibility with the engine's bitmap decoder.

The initial pause is 150 ms, each turn takes 1100 ms, and the pause between
the cover opening and the next turn is 1300 ms.
