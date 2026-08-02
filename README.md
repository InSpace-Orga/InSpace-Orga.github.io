# InSpace Orga

Website der InSpace Orga fuer LARP-Abenteuer in der Welt von Inaka.

## Live-Seite

Die Seite ist hier erreichbar:

https://inspace-orga.github.io/

## Inhalt

- Startseite mit Infos zur Orga
- kommende Termine
- Galerie
- Kontakt und Impressum

## Technik

Die Seite besteht aus statischem HTML, CSS und etwas JavaScript und wird ueber GitHub Pages veroeffentlicht.

## Galerie-Bilder

- Originalbilder fuer die Hauptseite liegen in `imgGallery/`
- Originalbilder fuer `Lothal Starliner I` liegen in `imgGallery/lothal-starliner-i/`
- Originalbilder fuer `Inaka Weinfest I` liegen in `imgGallery/inaka-weinfest-i/`
- Die Web-Versionen fuer die Website werden in `imgGallery/web/home/`, `imgGallery/web/lothal-starliner-i/` und `imgGallery/web/inaka-weinfest-i/` erzeugt

### Bilder in WebP umwandeln

Das Skript `scripts/convert_gallery_webp.py` erzeugt aus den Originalbildern eine Web-Version mit maximal 1600 px Breite.

Ausfuehren:

```bash
python scripts/convert_gallery_webp.py
```

Wenn neue Galerien dazukommen, einfach:

1. Bilder in den passenden Originalordner legen
2. Das Skript erneut ausfuehren
3. Die Website nutzt dann die Dateien aus `imgGallery/web/...`

## Themes

- Die Website kennt zwei Varianten: `fantasy` und `scifi`
- Der Default pro Seite steht im `<html>`-Tag als `data-default-theme`
- `index.html`, `fest-der-winde.html`, `datenschutz.html` und `galerien/inaka-weinfest-i.html` nutzen standardmaessig `fantasy`
- `galerien/lothal-starliner-i.html` nutzt standardmaessig `scifi`
- Der Button in der Navigation schaltet das Theme manuell um
- Die manuelle Auswahl wird im Browser gespeichert
