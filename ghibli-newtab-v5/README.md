# Ghibli New Tab — v5 (local assets)

A Studio Ghibli-inspired Chrome new tab with clock, search, shortcuts, ambient music, and beautiful scene backgrounds.



## Quick start

1. Load the extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked → select this folder).
2. Drop your images into `assets/` — see `assets/README.md` for the exact filenames expected.
3. Reload the extension. The picker will show green badges for any scenes that found their local file.

## 

## Customising scenes

Open `newtab.js` and edit the `SCENES` array at the top.
Each scene has:

* `name` — display name
* `bg` — path to the full-screen background (relative like `assets/my.jpg` or an `https://` URL)
* `thumb` — path to the picker thumbnail
* `music` — URL to an MP3
* `trackName` — label shown in the bottom bar

The `FALLBACK\\\_URLS` array below `SCENES` provides remote backups for each scene in the same order.

