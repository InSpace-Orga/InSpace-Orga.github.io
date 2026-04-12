# InSpace Orga

Website der InSpace Orga für LARP-Abenteuer in der Welt von Inaka.

## Live-Seite

Die Seite ist hier erreichbar:

https://inspace-orga.github.io/

## Inhalt

- Startseite mit Infos zur Orga
- kommende Termine
- Galerie
- Kontakt und Impressum

## Technik

Die Seite besteht aus statischem HTML, CSS und etwas JavaScript und wird über GitHub Pages veröffentlicht.

## Galerie-Bilder

- Originalbilder für die Hauptseite liegen in `imgGallery/`
- Originalbilder für `Lothal Starliner I` liegen in `imgGallery/lothal-starliner-i/`
- Die Web-Versionen für die Website werden in `imgGallery/web/home/` und `imgGallery/web/lothal-starliner-i/` erzeugt

### Bilder in WebP umwandeln

Das Skript `scripts/convert_gallery_webp.py` erzeugt aus den Originalbildern eine Web-Version mit maximal 1600 px Breite.

Ausführen:

```bash
python scripts/convert_gallery_webp.py
```

Wenn neue Galerien dazukommen, einfach:

1. Bilder in den passenden Originalordner legen
2. Das Skript erneut ausführen
3. Die Website nutzt dann die Dateien aus `imgGallery/web/...`
