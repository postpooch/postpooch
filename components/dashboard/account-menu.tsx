"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ChevronUpIcon,
  HelpIcon,
  LogOutIcon,
} from "./icons";

type AccountMenuProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  userEmail?: string | null;
};

type MenuItem =
  | {
      type: "link";
      id: string;
      label: string;
      href: string;
      icon: ReactNode;
    }
  | {
      type: "action";
      id: string;
      label: string;
      icon: ReactNode;
      onSelect: () => void;
    }
  | { type: "separator"; id: string };

const MENU_ITEMS: MenuItem[] = [
  {
    type: "link",
    id: "help",
    label: "Help",
    href: "/dashboard/overview",
    icon: <HelpIcon className="size-4" />,
  },
  { type: "separator", id: "sep" },
  {
    type: "action",
    id: "sign-out",
    label: "Sign out",
    icon: <LogOutIcon className="size-4" />,
    onSelect: () => {
      // Auth wiring comes later.
    },
  },
];

const MENU_WIDTH_COLLAPSED = 220;

function accountLabelFromEmail(email: string | null | undefined) {
  const trimmed = email?.trim() ?? "";
  if (!trimmed) {
    return {
      displayName: "Account",
      email: "",
      initial: "A",
    };
  }

  const atIndex = trimmed.indexOf("@");
  const localPart = atIndex > 0 ? trimmed.slice(0, atIndex) : trimmed;
  const displayName = localPart || trimmed;
  const initial = displayName.charAt(0).toUpperCase() || "A";

  return {
    displayName,
    email: trimmed,
    initial,
  };
}

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

export function AccountMenu({
  collapsed,
  onNavigate,
  userEmail = null,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const account = accountLabelFromEmail(userEmail);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const width = collapsed
        ? MENU_WIDTH_COLLAPSED
        : Math.max(rect.width, 200);
      const gap = 8;
      const menuHeight = menuRef.current?.offsetHeight ?? 180;
      const top = Math.max(gap, rect.top - menuHeight - gap);
      const left = collapsed
        ? Math.min(rect.left, window.innerWidth - width - gap)
        : rect.left;

      setPosition((prev) => {
        if (
          prev &&
          prev.top === top &&
          prev.left === left &&
          prev.width === width
        ) {
          return prev;
        }
        return { top, left, width };
      });
    };

    updatePosition();
    const raf = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, collapsed]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const menu =
    open && mounted ? (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label="Account"
        style={{
          position: "fixed",
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          width: position?.width ?? (collapsed ? MENU_WIDTH_COLLAPSED : 200),
          visibility: position ? "visible" : "hidden",
        }}
        className={[
          "z-[100] overflow-hidden rounded-card border border-pp-sand bg-pp-white py-1.5 shadow-card",
          position ? "motion-safe:animate-pp-menu-in" : "",
        ].join(" ")}
      >
        <div className="border-b border-pp-sand px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-pp-ink">
            {account.displayName}
          </p>
          {account.email ? (
            <p className="truncate text-xs leading-5 text-pp-stone">
              {account.email}
            </p>
          ) : null}
        </div>

        <div className="py-1">
          {MENU_ITEMS.map((item) => {
            if (item.type === "separator") {
              return (
                <div
                  key={item.id}
                  role="separator"
                  className="my-1 border-t border-pp-sand"
                />
              );
            }

            const className = [
              "flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors duration-150 ease-out",
              "focus-visible:bg-pp-mist focus-visible:outline-none",
              item.type === "action"
                ? "text-pp-ink hover:bg-pp-mist"
                : "text-pp-ink hover:bg-pp-mist",
            ].join(" ");

            if (item.type === "link") {
              return (
                <Link
                  key={item.id}
                  role="menuitem"
                  href={item.href}
                  className={className}
                  onClick={() => {
                    close();
                    onNavigate?.();
                  }}
                >
                  <span className="text-pp-stone">{item.icon}</span>
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={className}
                onClick={() => {
                  item.onSelect();
                  close();
                  onNavigate?.();
                }}
              >
                <span className="text-pp-stone">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    ) : null;

  return (
    <div ref={rootRef} className="relative min-w-0 w-full">
      {menu && createPortal(menu, document.body)}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={[
          "flex w-full items-center rounded-card border border-pp-sand bg-pp-white text-left transition-colors duration-200 ease-out",
          "hover:border-pp-caramel/60 hover:bg-pp-cream",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
          open ? "border-pp-caramel/60 bg-pp-cream" : "",
          collapsed
            ? "min-w-0 flex-col justify-center gap-1 overflow-hidden border-0 bg-transparent p-1 py-1.5 hover:border-transparent hover:bg-pp-white/80"
            : "gap-3 px-3 py-2.5",
        ].join(" ")}
      >
        <span
          className={[
            "flex shrink-0 items-center justify-center rounded-full bg-pp-peach/55 text-sm font-semibold text-pp-ink",
            collapsed ? "size-9" : "size-9",
          ].join(" ")}
          aria-hidden
        >
          {account.initial}
        </span>

        {collapsed ? (
          <span className="block w-full min-w-0 truncate px-0.5 text-center text-[10px] leading-tight font-medium text-pp-ink">
            {account.displayName}
          </span>
        ) : (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-pp-ink">
                {account.displayName}
              </span>
              <span className="block truncate text-xs leading-5 text-pp-stone">
                {account.email || "Signed in"}
              </span>
            </span>
            <ChevronUpIcon
              className={[
                "size-4 shrink-0 text-pp-stone transition-transform duration-200 ease-out",
                open ? "rotate-0" : "rotate-180",
              ].join(" ")}
            />
          </>
        )}
      </button>
    </div>
  );
}
