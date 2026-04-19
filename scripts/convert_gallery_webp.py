from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_TARGETS = [
    (ROOT / "imgGallery", ROOT / "imgGallery" / "web" / "home", 1600, 82),
    (ROOT / "imgGallery" / "lothal-starliner-i", ROOT / "imgGallery" / "web" / "lothal-starliner-i", 1600, 82),
    (ROOT / "imgGallery" / "inaka-weinfest-i", ROOT / "imgGallery" / "web" / "inaka-weinfest-i", 1600, 82),
]


def convert_folder(source_dir: Path, target_dir: Path, max_width: int, quality: int) -> None:
    target_dir.mkdir(parents=True, exist_ok=True)
    for src in sorted(source_dir.iterdir()):
        if not src.is_file():
            continue
        try:
            with Image.open(src) as image:
                image = ImageOps.exif_transpose(image)
                image = image.convert("RGB")
                if image.width > max_width:
                    new_height = round(image.height * (max_width / image.width))
                    image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
                dst = target_dir / (src.stem + ".webp")
                image.save(dst, format="WEBP", quality=quality, method=6)
                print(f"{src.relative_to(ROOT)} -> {dst.relative_to(ROOT)}")
        except Exception as exc:
            print(f"SKIP {src.relative_to(ROOT)}: {exc}")


def main() -> None:
    for source_dir, target_dir, max_width, quality in SOURCE_TARGETS:
        convert_folder(source_dir, target_dir, max_width, quality)


if __name__ == "__main__":
    main()
