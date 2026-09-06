"""Render static page artwork for ZineJS; no animation is generated here.
Run with Python + Pillow on macOS (or supply --font for another Song typeface).
"""
import argparse
import ast
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--font', default='/System/Library/Fonts/Supplemental/Songti.ttc')
parser.add_argument('--font-index', type=int, default=6, help='Songti SC Regular in the macOS collection')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
source = (root / 'src/pages/previews/literature.astro').read_text()
pages = ast.literal_eval(re.search(r'const pages = (\[[\s\S]*?\]);', source)[1])
assert len(''.join(pages)) == 796
output = root / 'public/images/literature/book'
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
        remaining = ('\u3000\u3000' if index == 1 else '') + pages[index - 1]
        line, lines = '', []
        for char in remaining:
            if draw.textlength(line + char, font=font(8.5)) > 122 * scale and char not in '，。：“”！？、；':
                lines.append(line)
                line = ''
            line += char
        lines.append(line)
        assert 19 + len(lines) * 15.7 < 203, f'Page {index} overflows'
        for row, line in enumerate(lines):
            text(line, 17, 19 + row * 15.7, 8.5, '#49453f')
        text(str(index), 78, 207, 7, '#a6a098', 'mt')
    image.save(output / f'{index}.webp', quality=90, method=6)
print(f'Rendered {len(pages) + 2} pages, {sum(p.stat().st_size for p in output.glob("*.webp")):,} bytes')
