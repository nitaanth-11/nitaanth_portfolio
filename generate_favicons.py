import os
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen

# 1. Extract Georgia Bold glyph path for letter N
font_path = "C:/Windows/Fonts/georgiab.ttf"
font = TTFont(font_path)
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
glyph_name = cmap[ord("N")]

bounds_pen = BoundsPen(glyph_set)
glyph_set[glyph_name].draw(bounds_pen)
xmin, ymin, xmax, ymax = bounds_pen.bounds

pen = SVGPathPen(glyph_set)
glyph_set[glyph_name].draw(pen)
path_d = pen.getCommands()

# Target 128x128 viewBox
target_h = 76.0
s = target_h / (ymax - ymin)
target_w = (xmax - xmin) * s

tx = (128.0 - target_w) / 2.0 - xmin * s
ty = (128.0 - target_h) / 2.0 + ymax * s

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#081420"/>
      <stop offset="100%" stop-color="#020508"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8F7FF"/>
      <stop offset="100%" stop-color="#00D9FF"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background squircle -->
  <rect x="3" y="3" width="122" height="122" rx="28" fill="url(#bgGrad)" stroke="#00D9FF" stroke-width="2.5" stroke-opacity="0.45"/>

  <!-- Subtle radial cyan core illumination -->
  <circle cx="64" cy="64" r="38" fill="#00D9FF" fill-opacity="0.12"/>

  <!-- Crisp Vector Serif N -->
  <g transform="translate({tx:.2f}, {ty:.2f}) scale({s:.6f}, {-s:.6f})" fill="url(#cyanGrad)" filter="url(#glow)">
    <path d="{path_d}"/>
  </g>
</svg>'''

with open("favicon.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)
print("Created favicon.svg successfully!")

# 2. Render high quality PNGs using Pillow
def generate_png_icon(size):
    # Render at 4x for supersampling / ultra-crisp antialiasing
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = int(6 * scale * (size / 128.0))
    radius = int(28 * scale * (size / 128.0))
    border_w = max(1, int(2.5 * scale * (size / 128.0)))

    # Dark background #04090E
    bg_color = (4, 9, 14, 255)
    border_color = (0, 217, 255, 115) # cyan border ~45% opacity
    draw.rounded_rectangle(
        [pad, pad, canvas_size - pad, canvas_size - pad],
        radius=radius,
        fill=bg_color,
        outline=border_color,
        width=border_w
    )

    # Ambient radial cyan glow in center
    cx, cy = canvas_size // 2, canvas_size // 2
    glow_r = int(38 * scale * (size / 128.0))
    for r in range(glow_r, 0, max(1, scale)):
        alpha = int(28 * (1.0 - r / glow_r))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 217, 255, alpha))

    # Font size
    font_size = int(82 * scale * (size / 128.0))
    font_obj = ImageFont.truetype(font_path, font_size)

    # Measure exact text box
    bbox = draw.textbbox((0, 0), "N", font=font_obj)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (canvas_size - tw) // 2 - bbox[0]
    ty = (canvas_size - th) // 2 - bbox[1] - int(2 * scale * (size / 128.0))

    # Multi-layer glow behind letter
    glow_offsets = [(-1*scale, 0), (1*scale, 0), (0, -1*scale), (0, 1*scale),
                    (-1*scale, -1*scale), (1*scale, 1*scale)]
    for gx, gy in glow_offsets:
        draw.text((tx + gx, ty + gy), "N", font=font_obj, fill=(0, 217, 255, 60))

    # Foreground electric cyan letter N
    draw.text((tx, ty), "N", font=font_obj, fill=(0, 217, 255, 255))

    # High-quality downsampling with Lanczos
    resampled = img.resize((size, size), Image.Resampling.LANCZOS)
    return resampled

# Generate standard icons
icon_16 = generate_png_icon(16)
icon_16.save("favicon-16x16.png")

icon_32 = generate_png_icon(32)
icon_32.save("favicon-32x32.png")

icon_180 = generate_png_icon(180)
icon_180.save("apple-touch-icon.png")

icon_192 = generate_png_icon(192)
icon_192.save("icon-192.png")

icon_512 = generate_png_icon(512)
icon_512.save("icon-512.png")

# Generate standard multi-resolution favicon.ico containing 16x16, 32x32, 48x48
icon_48 = generate_png_icon(48)
icon_32.save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

print("Generated all favicon formats successfully (SVG, PNG, ICO, Apple Touch Icon)!")

