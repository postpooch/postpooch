"use client";

type LoadingIndicatorProps = {
  label?: string;
  className?: string;
  spinnerClassName?: string;
  tone?: "light" | "dark";
};

export function LoadingIndicator({
  label,
  className = "",
  spinnerClassName = "",
  tone = "light",
}: LoadingIndicatorProps) {
  const borderTone =
    tone === "dark"
      ? "border-white/30 border-t-white"
      : "border-pp-ink/20 border-t-pp-ink/70";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span
        aria-hidden="true"
        className={`size-4 animate-spin rounded-full border-2 ${borderTone} motion-reduce:animate-none ${spinnerClassName}`.trim()}
      />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
