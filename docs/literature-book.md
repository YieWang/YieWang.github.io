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

The preview iframe loads only while Literature is visible. Unloading calls
`destroy()` and releases the document, timers and GPU context.
Reduced-motion users see an open, static spread without automatic turns.

The front cover (`public/images/literature/book/0.webp`) is the Chinese illustrated
edition translated by Fan Ye, supplied by New Classics. Source JPEG: 1050 × 1500 pixels;
encoded as WebP at its original resolution, without upscaling. The page renderer
preserves this downloaded cover when regenerating the interior artwork.
Publisher: https://www.readinglife.com/books.html?langType=zh
Original source: https://www.readinglife.com/product_image/upload/imageRealUrl/cover/2023-05-05/1000107490.jpg

The initial pause is 700 ms, each turn takes 1100 ms, and the pause between
the cover opening and the next turn is 1300 ms.
