# OpenCut Classic (integrated)

This folder contains the [OpenCut Classic](https://github.com/OpenCut-app/opencut-classic) editor source, ported into postpooch.

- Project library: `/dashboard/video_center`
- Editor (inside dashboard shell): `/dashboard/video_center/[project_id]`
- Package: `opencut-wasm` (published WASM compositor)

Projects and media stay in browser storage (IndexedDB / OPFS), matching Classic behavior.
