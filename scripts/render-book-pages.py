"""Render static page artwork for ZineJS; no animation is generated here.
Run with Python + Pillow on macOS (or supply --font for another serif typeface).
"""
import argparse
import ast
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

default_font = '/System/Library/Fonts/Supplemental/Georgia.ttf'
if not Path(default_font).exists():
    default_font = '/System/Library/Fonts/Supplemental/Times New Roman.ttf'

parser = argparse.ArgumentParser()
parser.add_argument('--font', default=default_font)
parser.add_argument('--font-index', type=int, default=0, help='Font index in the collection')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
source = (root / 'src/pages/previews/literature.astro').read_text()
pages = ast.literal_eval(re.search(r'const pages = (\[[\s\S]*?\]);', source)[1])
assert len(''.join(pages)) == 2844
output = root / 'Homepage-Assets/upload/images/literature/book'
output.mkdir(parents=True, exist_ok=True)
scale = 3
font = lambda size: ImageFont.truetype(args.font, round(size * scale), index=args.font_index)

for index in range(len(pages) + 2):
    if index == 0:
        assert (output / '0.webp').is_file(), 'The publisher cover must be downloaded before rendering pages'
        continue
    cover = index in (0, len(pages) + 1)
    image = Image.new('RGB', (156 * scale, 224 * scale), '#39302b' if cover else '#ffffff')
    draw = ImageDraw.Draw(image)
    def text(value, x, y, size, color, anchor='lt'):
        draw.text((x * scale, y * scale), value, font=font(size), fill=color, anchor=anchor)
    if cover:
        draw.rectangle((0, 0, 3 * scale, 224 * scale), fill='#2f2824')
        text('GABRIEL GARCÍA MÁRQUEZ', 78, 106, 6, '#d5c4a2', 'mt')
    else:
        draw.rectangle((0, 0, image.width - 1, image.height - 1), outline='#d7d3cd', width=2)
        words = pages[index - 1].split(' ')
        lines = []
        cur = []
        indent_pt = 0 if index == 1 else 9
        max_w = 122 * scale
        for w in words:
            line_indent = (indent_pt * scale) if len(lines) == 0 else 0
            test_line = (' '.join(cur + [w])) if cur else w
            if line_indent + draw.textlength(test_line, font=font(7.0)) <= max_w:
                cur.append(w)
            else:
                if cur:
                    lines.append(' '.join(cur))
                    cur = [w]
                else:
                    lines.append(w)
                    cur = []
        if cur:
            lines.append(' '.join(cur))
        line_height = 11.4
        assert 19 + (len(lines) - 1) * line_height + 7.0 < 203, f'Page {index} overflows'
        for row, line in enumerate(lines):
            x = 17 + (indent_pt if row == 0 else 0)
            y = 19 + row * line_height
            text(line, x, y, 7.0, '#49453f')
        text(str(index), 78, 207, 7, '#a6a098', 'mt')
    image.save(output / f'{index}.webp', quality=90, method=6)
print(f'Rendered {len(pages) + 2} pages, {sum(p.stat().st_size for p in output.glob("*.webp")):,} bytes')
