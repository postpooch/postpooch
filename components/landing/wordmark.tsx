import Image from "next/image";
import Link from "next/link";

const AVATAR_SRC =
  "/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp";

type WordmarkProps = {
  theme?: "ink" | "white";
  size?: "md" | "lg";
  href?: string | null;
};

export function Wordmark({
  theme = "ink",
  size = "md",
  href = "/",
}: WordmarkProps) {
  const badge = size === "lg" ? "size-11" : "size-9";
  const text =
    size === "lg"
      ? "text-[28px] leading-none"
      : "text-[22px] leading-none";
  const color = theme === "white" ? "text-pp-white" : "text-pp-ink";

  const lockup = (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src={AVATAR_SRC}
        alt=""
        width={size === "lg" ? 44 : 36}
        height={size === "lg" ? 44 : 36}
        className={`${badge} rounded-full`}
        priority
      />
      <span
        className={`font-display font-bold lowercase tracking-tight ${text} ${color}`}
      >
        postpooch
      </span>
    </span>
  );

  if (!href) return lockup;

  return (
    <Link
      href={href}
      aria-label="postpooch home"
      className="inline-flex rounded-control outline-offset-4 focus-visible:outline-2 focus-visible:outline-pp-teal"
    >
      {lockup}
    </Link>
  );
}
