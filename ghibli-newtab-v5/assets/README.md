# assets/ — Your local images

Drop your images into this folder, then match the filenames in `newtab.js`.

## Default expected filenames

| Scene            | Background              | Thumbnail               |
|------------------|-------------------------|-------------------------|
| Totoro's Forest  | `totoro-bg.jpg`         | `totoro-thumb.jpg`      |
| Spirited Away    | `spirited-bg.jpg`       | `spirited-thumb.jpg`    |
| Howl's Castle    | `howl-bg.jpg`           | `howl-thumb.jpg`        |
| Nausicaä Valley  | `nausicaa-bg.jpg`       | `nausicaa-thumb.jpg`    |
| Kiki's Town      | `kiki-bg.jpg`           | `kiki-thumb.jpg`        |
| Princess Mononoke| `mononoke-bg.jpg`       | `mononoke-thumb.jpg`    |

## Image tips

- **Background** (`*-bg`): aim for 1920×1080 or larger, landscape.
- **Thumbnail** (`*-thumb`): 400×250 px is plenty; smaller = faster picker.
- Accepted formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- If a local file is missing, the extension automatically falls back to
  the matching remote Unsplash URL — so nothing breaks.

## Using a different filename

Just change the `bg` / `thumb` values in the `SCENES` array at the top of
`newtab.js`:

```js
{
  name:  "My custom scene",
  bg:    "assets/my-wallpaper.jpg",   // ← your filename here
  thumb: "assets/my-wallpaper-sm.jpg",
  ...
}
```

The picker shows a **green "local"** badge when it finds your file,
or an **orange "remote"** badge when it's falling back to the internet.

## Adding a brand new scene

1. Add your images to `assets/`.
2. Copy one of the existing scene objects in `SCENES` (in `newtab.js`).
3. Update `name`, `bg`, `thumb`, `music`, `trackName`.
4. Add a matching entry to `FALLBACK_URLS` (can be the same remote URL or `''`).
