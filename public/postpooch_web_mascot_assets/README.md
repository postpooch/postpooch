# Postpooch exact mascot web asset kit

This package is derived directly from the supplied 1254 × 1254 PNG. The dog was
not redrawn, restyled, regenerated, or approximated.

## Exactness and extraction

- Opaque interior mascot pixels are copied from the original.
- The supplied silhouette, color, shading, texture, and facial details remain intact.
- The white matte was mathematically removed from antialiased edge pixels.
- Edge colors were recovered to prevent a white fringe on dark or saturated backgrounds.
- The original oval shadow was converted into true transparent shadow alpha.
- Responsive and icon files are high-quality downscales of the extracted master.

A traced SVG is intentionally not included. Vector tracing would alter the textured
artwork and would therefore be less exact. A raster embedded inside an SVG adds no
visual quality or practical benefit.

## Recommended masters

- `master/postpooch-mascot-transparent.png`
  - Transparent, tightly cropped, no shadow
  - 790 × 806
  - Best for product UI, onboarding, cards, and layout components

- `master/postpooch-mascot-with-shadow.png`
  - Transparent, tightly cropped, with true translucent shadow
  - 790 × 835
  - Best for landing pages, campaigns, and free-standing use

- `*-safe` masters add transparent padding for animation or transformed layouts.

- `full-canvas` masters preserve the original 1254 × 1254 coordinate system.

## Web delivery

Use lossless WebP first and PNG as the transparent fallback. The responsive folder
contains 64, 128, 256, 512, and natural-source-width files. Nothing is upscaled.

See `web/example.html` and `web/postpooch-mascot.css`.

## Icons

- `avatar/postpooch-avatar-cream-512.png`: preferred social avatar
- `avatar/postpooch-avatar-transparent-512.png`: transparent avatar
- `avatar/apple-touch-icon.png`: iOS
- `avatar/favicon.ico`: browser favicon
- `avatar/postpooch-pwa-192.png` and `postpooch-pwa-512.png`: PWA icons

## Accessibility

Use `alt="Postpooch dog mascot"` when the image conveys brand identity. Use
`alt="" aria-hidden="true"` when it is decorative.

## Protection rules

- Do not recolor with CSS filters.
- Do not stretch, squash, mirror, or rotate the mascot.
- Do not place it directly over busy listing photography without a clean panel.
- Prefer the shadowless file inside product UI.
- Prefer the true-shadow file for free-standing marketing layouts.
- Keep the unmodified source file in `source/` as the archival reference.

## Icon treatment colors

- Cream: `#FFF7EF`
- Teal: `#256F68`
- Ink: `#241914`

`asset-manifest.json` contains dimensions, file sizes, and SHA-256 checksums.
