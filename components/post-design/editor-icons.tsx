import type { SVGProps } from "react";

export type EditorIconName =
  | "arrow-left"
  | "brand"
  | "calendar"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "circle"
  | "close"
  | "design"
  | "download"
  | "duplicate"
  | "elements"
  | "eye"
  | "file"
  | "image"
  | "layers"
  | "line"
  | "minus"
  | "more"
  | "plus"
  | "publish"
  | "redo"
  | "search"
  | "square"
  | "text"
  | "trash"
  | "triangle"
  | "undo"
  | "upload";

type EditorIconProps = SVGProps<SVGSVGElement> & {
  name: EditorIconName;
};

export function EditorIcon({ name, className, ...props }: EditorIconProps) {
  const paths: Record<EditorIconName, React.ReactNode> = {
    "arrow-left": <path d="m14.5 5-7 7 7 7M8 12h11" />,
    brand: (
      <>
        <path d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z" />
        <path d="M8.5 9.5h7M8.5 13h7M8.5 16.5h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M8 3v4M16 3v4M3.5 9.5h17" />
      </>
    ),
    check: <path d="m5 12.5 4.25 4.25L19 7" />,
    "chevron-down": <path d="m7 10 5 5 5-5" />,
    "chevron-left": <path d="m14.5 6-6 6 6 6" />,
    "chevron-right": <path d="m9.5 6 6 6-6 6" />,
    circle: <circle cx="12" cy="12" r="7.5" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    design: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M4 10h16M10 10v10" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v11M8 10l4 4 4-4" />
        <path d="M5 17v3h14v-3" />
      </>
    ),
    duplicate: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    elements: (
      <>
        <circle cx="8" cy="8" r="3.5" />
        <rect x="12" y="12" width="8" height="8" rx="1.5" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.25-6 9.5-6 9.5 6 9.5 6-3.25 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    file: (
      <>
        <path d="M6 3.5h8l4 4V20H6V3.5Z" />
        <path d="M14 3.5v4h4M9 12h6M9 16h4" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m5 18 5-5 3 3 2-2 4 4" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m4 12 8 4.5 8-4.5M4 16l8 4.5 8-4.5" />
      </>
    ),
    line: <path d="M5 19 19 5" />,
    minus: <path d="M5 12h14" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    publish: (
      <>
        <path d="M12 16V4M8 8l4-4 4 4" />
        <path d="M5 13v7h14v-7" />
      </>
    ),
    redo: <path d="M19 8v5h-5M5 17a8 8 0 0 1 13.5-5.5L19 13" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15 15 4.5 4.5" />
      </>
    ),
    square: <rect x="5" y="5" width="14" height="14" rx="2" />,
    text: (
      <>
        <path d="M5 6V4h14v2M12 4v16M8 20h8" />
      </>
    ),
    trash: (
      <>
        <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    triangle: <path d="m12 4 8 16H4L12 4Z" />,
    undo: <path d="M5 8v5h5M19 17A8 8 0 0 0 5.5 11.5L5 13" />,
    upload: (
      <>
        <path d="M12 16V5M8 9l4-4 4 4" />
        <path d="M5 16v4h14v-4" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "size-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
