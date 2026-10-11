"""Génère les images web de la galerie à partir des originaux assets/images/gallery-N.jpg.

Pour chaque photo :
  - agrandissement ×2 (Lanczos) pour les écrans haute densité ;
  - netteté fine (unsharp mask), léger contraste local (« clarté »), contraste ×1.12 et saturation ×1.05 ;
  - export WebP en 600 / 1200 / 2048 px de large (ou la largeur max disponible) + un JPEG haute qualité de secours.

Usage : python3 scripts/build-images.py
"""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

DIR = Path(__file__).resolve().parent.parent / "assets" / "images"
WIDTHS = (600, 1200, 2048)


def enhance(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.8, percent=80, threshold=3))
    im = im.filter(ImageFilter.UnsharpMask(radius=24, percent=14, threshold=0))
    # contraste/saturation intégrés à l'image (évite un filtre CSS recalculé pendant l'animation)
    im = ImageEnhance.Contrast(im).enhance(1.12)
    im = ImageEnhance.Color(im).enhance(1.05)
    return im


def main() -> None:
    for i in range(1, 6):
        src = DIR / f"gallery-{i}.jpg"
        hd = enhance(Image.open(src))
        sizes = [w for w in WIDTHS if w < hd.width] + [min(hd.width, WIDTHS[-1])]
        for w in sizes:
            out = hd if hd.width == w else hd.resize((w, round(hd.height * w / hd.width)), Image.LANCZOS)
            out.save(DIR / f"gallery-{i}-{w}.webp", "WEBP", quality=86, method=6)
        fb = hd.resize((1200, round(hd.height * 1200 / hd.width)), Image.LANCZOS)
        fb.save(DIR / f"gallery-{i}-hd.jpg", "JPEG", quality=88, optimize=True, progressive=True)
        print(f"gallery-{i}: {hd.width}x{hd.height} -> webp {sizes}")


if __name__ == "__main__":
    main()
