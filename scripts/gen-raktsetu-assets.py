#!/usr/bin/env python3
"""Generate RaktSetu brand assets: app icon + 1200x630 OG card.

Brand: privacy-first blood donor & recipient connect platform.
Colors: brand #c62828, brand-dark #8e1c1c, brand-deep #5a0f0f, brand-light #fdecea.
Motif: blood drop (teardrop) — circle top + tapered point; donor network dots.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BRAND = (198, 40, 40)        # #c62828
BRAND_DARK = (142, 28, 28)   # #8e1c1c
BRAND_DEEP = (90, 15, 15)    # #5a0f0f
BRAND_LIGHT = (253, 236, 234)  # #fdecea
WHITE = (255, 255, 255)
OFFWHITE = (255, 245, 244)
DARK = (23, 23, 23)          # #171717

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
MONTSERRAT_DIR = "/home/paperclip/.fonts"


def font(size, bold=True):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


def montserrat(size, weight="SemiBold"):
    name = f"Montserrat-{weight}.ttf"
    return ImageFont.truetype(f"{MONTSERRAT_DIR}/{name}", size)


def teardrop(draw, cx, cy, r, color, point_h=None):
    """Draw a blood-drop teardrop centered at (cx, cy) with radius r.
    point_h = extra height of the taper below the circle (default r*0.9)."""
    if point_h is None:
        point_h = int(r * 0.9)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    bottom = cy + r + point_h
    draw.polygon([
        (cx - r, cy),
        (cx + r, cy),
        (cx, bottom),
    ], fill=color)


def vertical_gradient(w, h, top, bottom):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        d.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def radial_glow(size, center, radius, color, alpha=80):
    """Return an RGBA image with a soft radial glow."""
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([center[0] - radius, center[1] - radius,
                center[0] + radius, center[1] + radius],
               fill=(*color, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(radius // 3))
    return glow


def make_icon():
    S = 512
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    # rounded-square background with subtle vertical brand gradient
    bg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bgd = ImageDraw.Draw(bg)
    for y in range(S):
        t = y / S
        r = int(BRAND[0] + (BRAND_DARK[0] - BRAND[0]) * t)
        g = int(BRAND[1] + (BRAND_DARK[1] - BRAND[1]) * t)
        b = int(BRAND[2] + (BRAND_DARK[2] - BRAND[2]) * t)
        bgd.line([(0, y), (S, y)], fill=(r, g, b, 255))
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=110, fill=255)
    img.paste(bg, (0, 0), mask)

    # white teardrop
    d = ImageDraw.Draw(img)
    cx, cy, r = S // 2, 230, 120
    teardrop(d, cx, cy, r, WHITE, point_h=95)
    # inner red drop highlight (smaller)
    teardrop(d, cx, 252, 62, BRAND, point_h=48)

    img.save("public/icon.png")
    print("icon.png saved")


def make_og():
    W, H = 1200, 630
    # Full-bleed vertical gradient: deep blood red at top -> brand red bottom.
    img = vertical_gradient(W, H, BRAND_DEEP, BRAND)
    base = img.convert("RGBA")

    # Soft radial glows for depth (right side).
    base = Image.alpha_composite(base, radial_glow((W, H), (1000, 130), 340, (255, 190, 190), 22))
    base = Image.alpha_composite(base, radial_glow((W, H), (140, 540), 300, (255, 230, 230), 18))

    # NOTE: PIL ImageDraw does NOT alpha-blend RGBA fills — it writes the raw
    # RGBA value, so a (255,255,255,26) fill becomes SOLID white on RGB output.
    # All translucent shapes must be drawn on a separate overlay layer and
    # alpha_composited onto the base. Solid shapes (logo, text) draw on base.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)

    # Donor-network motif (clear upper-right zone, y 60-370): dots + lines
    # representing donors connecting with recipients. Kept out of the chip row
    # (y ~420+) so nothing overlaps text.
    nodes = [(880, 140), (1010, 90), (1090, 210), (950, 250), (1115, 330),
             (990, 340), (845, 290), (905, 200), (1140, 160), (1050, 400)]
    connections = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 0),
                   (2, 7), (7, 8), (8, 1), (5, 7), (4, 8)]
    for a, b in connections:
        od.line([nodes[a], nodes[b]], fill=(255, 255, 255, 40), width=2)
    for i, (nx, ny) in enumerate(nodes):
        r = 6 if i % 3 else 8
        od.ellipse([nx - r, ny - r, nx + r, ny + r],
                   fill=(255, 255, 255, 150) if i % 2 else (255, 255, 255, 225))
        if i % 4 == 0:  # small drop accents on some nodes
            teardrop(od, nx, ny, 12, WHITE, point_h=9)

    # Big soft watermark drop behind the network.
    teardrop(od, 1020, 240, 260, (*WHITE, 8), point_h=180)

    # Feature chips (rounded pills, translucent white, fit within 1200 width).
    chips = ["Find blood banks", "Post verified requests", "Connect with donors"]
    y_chip = 428
    x_chip = 333
    f_chip = montserrat(19, "SemiBold")
    ch = 44
    for chip in chips:
        bbox = od.textbbox((0, 0), chip, font=f_chip)
        tw = bbox[2] - bbox[0]
        pad_x = 30  # room for mini drop icon
        cw = tw + pad_x * 2
        od.rounded_rectangle([x_chip, y_chip, x_chip + cw, y_chip + ch],
                             radius=ch // 2, fill=(255, 255, 255, 26),
                             outline=(255, 255, 255, 130), width=2)
        x_chip += cw + 12

    # Composite the translucent overlay onto the base.
    base = Image.alpha_composite(base, overlay)

    d = ImageDraw.Draw(base)

    # Left: LARGE white teardrop logo with inner red drop + subtle shadow.
    # Enlarged per maintainer review ("need to change the bigger logo image").
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    teardrop(sd, 168, 321, 112, (0, 0, 0, 90), point_h=90)
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    base = Image.alpha_composite(base, shadow)
    d = ImageDraw.Draw(base)
    teardrop(d, 170, 318, 150, WHITE, point_h=120)
    teardrop(d, 170, 340, 74, BRAND, point_h=58)

    # Wordmark (Montserrat ExtraBold, white).
    f_big = montserrat(88, "ExtraBold")
    f_mid = montserrat(32, "SemiBold")
    f_url = montserrat(24, "SemiBold")

    d.text((400, 200), "RaktSetu", font=f_big, fill=WHITE)
    d.text((403, 305), "Privacy-first blood donor & recipient", font=f_mid, fill=OFFWHITE)
    d.text((403, 345), "connect platform.", font=f_mid, fill=OFFWHITE)

    # Chip text (solid white, drawn on base AFTER overlay composite so it sits
    # on top of the translucent pills).
    x_chip = 333
    for chip in chips:
        bbox = d.textbbox((0, 0), chip, font=f_chip)
        tw = bbox[2] - bbox[0]
        pad_x = 30
        cw = tw + pad_x * 2
        # mini blood-drop icon inside pill
        teardrop(d, x_chip + 20, y_chip + ch // 2 - 1, 7, WHITE, point_h=6)
        d.text((x_chip + pad_x + 4, y_chip + (ch - 24) // 2 - 2), chip,
               font=f_chip, fill=WHITE)
        x_chip += cw + 12

    # Footer: URL pill.
    url = "raktsetu.vercel.app"
    bbox = d.textbbox((0, 0), url, font=f_url)
    tw = bbox[2] - bbox[0]
    y_foot = 548
    d.rounded_rectangle([48, y_foot, 48 + tw + 56, y_foot + 44],
                        radius=22, fill=(0, 0, 0, 90))
    d.text((76, y_foot + 7), url, font=f_url, fill=WHITE)

    img = base.convert("RGB")
    img.save("public/og-image.png")
    print("og-image.png saved")


if __name__ == "__main__":
    make_icon()
    make_og()
