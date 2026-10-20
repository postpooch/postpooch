import { EditorIcon } from "./editor-icons";

type MediaPagerProps = {
  index: number;
  count: number;
  disabled?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Apple Photos-style chevrons sitting on the stage, not on the canvas.
 * Positioned against the viewport so they stay put if the canvas scrolls.
 */
export function MediaPager({
  index,
  count,
  disabled = false,
  onPrev,
  onNext,
}: MediaPagerProps) {
  if (count < 2) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <PagerButton
        label="Previous slide"
        side="left"
        disabled={disabled || index <= 0}
        onClick={onPrev}
      />
      <PagerButton
        label="Next slide"
        side="right"
        disabled={disabled || index >= count - 1}
        onClick={onNext}
      />
    </div>
  );
}

function PagerButton({
  label,
  side,
  disabled,
  onClick,
}: {
  label: string;
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`pointer-events-auto absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-pp-ink shadow-[0_10px_28px_rgba(36,25,20,0.16)] ring-1 ring-black/[0.06] backdrop-blur-md transition-[transform,background-color,opacity] hover:bg-white hover:scale-[1.04] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal disabled:pointer-events-none disabled:opacity-0 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <EditorIcon
        name={side === "left" ? "chevron-left" : "chevron-right"}
        className="size-5"
      />
    </button>
  );
}
