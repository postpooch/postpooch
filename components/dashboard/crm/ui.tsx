"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function glyph(props: IconProps) {
  return {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

function HomeGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M2.5 7.2 8 2.5l5.5 4.7V13a.8.8 0 0 1-.8.8H3.3A.8.8 0 0 1 2.5 13V7.2Z" />
      <path d="M6.2 13.8V9.2h3.6v4.6" />
    </svg>
  );
}
function PeopleGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <circle cx="6" cy="5.2" r="2.1" />
      <path d="M2.4 13.2c.3-2.2 1.8-3.4 3.6-3.4s3.3 1.2 3.6 3.4" />
      <circle cx="11.2" cy="6" r="1.7" />
      <path d="M10.4 9.9c1.5.1 2.8 1 3.2 2.7" />
    </svg>
  );
}
function BuildingGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M3 13.5V4.2L8 2.2l5 2V13.5" />
      <path d="M2.2 13.5h11.6" />
      <path d="M6.2 6.2h.1M9.8 6.2h.1M6.2 8.8h.1M9.8 8.8h.1M6.2 11.4h.1M9.8 11.4h.1" />
    </svg>
  );
}
function TargetGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2.6" />
      <path d="M8 2.5V1M8 15v-1.5M13.5 8H15M1 8h1.5" />
    </svg>
  );
}
function CheckGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="2.2" />
      <path d="m5 8.2 2.1 2.1 4-4.4" />
    </svg>
  );
}
function BriefcaseGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <rect x="2" y="5.2" width="12" height="8.4" rx="1.4" />
      <path d="M6 5.2V3.8A1.3 1.3 0 0 1 7.3 2.5h1.4A1.3 1.3 0 0 1 10 3.8v1.4M2 8.8h12" />
    </svg>
  );
}
function GearGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <circle cx="8" cy="8" r="2.1" />
      <path d="M8 2.4v1.4M8 12.2v1.4M13.6 8h-1.4M3.8 8H2.4M12 4l-1 1M5 11l-1 1M12 12l-1-1M5 5 4 4" />
    </svg>
  );
}
function MailGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.2" />
      <path d="m2.6 4.6 5.4 4.2 5.4-4.2" />
    </svg>
  );
}
function PhoneGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M3.4 6.6c2.4 4 5.9 6.3 6.9 6.1l1.3-1.3a.9.9 0 0 1 .9-.2l2.1.7a.9.9 0 0 1 .6 1l-.6 2a1.2 1.2 0 0 1-1.2.9C8.2 15.4 1.4 8.4 1.8 3.2A1.2 1.2 0 0 1 2.7 2l2-.6a.9.9 0 0 1 1 .6l.7 2.1a.9.9 0 0 1-.2.9L3.9 6.3" />
    </svg>
  );
}
function TagGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M8.6 2.5H3.2v5.4l6.2 6.2 5.4-5.4L8.6 2.5Z" />
      <circle cx="5.6" cy="5.1" r=".8" />
    </svg>
  );
}
function CalendarGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <rect x="2.2" y="3.4" width="11.6" height="10.4" rx="1.2" />
      <path d="M2.2 6.6h11.6M5.2 2.5v2.2M10.8 2.5v2.2" />
    </svg>
  );
}
function DollarGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M8 2.2v11.6M10.7 5.2C10.4 4 9.4 3.4 8 3.4 6.2 3.4 5.2 4.4 5.2 5.6c0 3.4 5.6 1.4 5.6 4.8 0 1.3-1.1 2.2-2.8 2.2-1.5 0-2.6-.7-2.9-2" />
    </svg>
  );
}
function PinGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M8 14.2s4.8-4.2 4.8-7.4A4.8 4.8 0 0 0 8 2 4.8 4.8 0 0 0 3.2 6.8C3.2 10 8 14.2 8 14.2Z" />
      <circle cx="8" cy="6.8" r="1.5" />
    </svg>
  );
}
function LinkGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M7 9.4a3 3 0 0 0 4.4.3l1.7-1.7a3 3 0 0 0-4.3-4.3L7.8 4.7" />
      <path d="M9 6.6a3 3 0 0 0-4.4-.3L2.9 8a3 3 0 0 0 4.3 4.3l1-1" />
    </svg>
  );
}
function ClockGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <circle cx="8" cy="8" r="5.6" />
      <path d="M8 5v3.2l2.2 1.4" />
    </svg>
  );
}
function UserGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <circle cx="8" cy="5.4" r="2.3" />
      <path d="M3.2 13.4c.4-2.6 2.2-3.9 4.8-3.9s4.4 1.3 4.8 3.9" />
    </svg>
  );
}
function PanelCollapseGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="1.6" />
      <path d="M6.2 2.2v11.6M9.4 6.2 7.6 8l1.8 1.8" />
    </svg>
  );
}
function PanelExpandGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="1.6" />
      <path d="M6.2 2.2v11.6M7.4 6.2 9.2 8l-1.8 1.8" />
    </svg>
  );
}

const CRM_SIDEBAR_STORAGE_KEY = "pp-crm-sidebar-collapsed";

function subscribeCrmSidebarCollapsed(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("pp-crm-sidebar-collapsed", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("pp-crm-sidebar-collapsed", onStoreChange);
  };
}

function getCrmSidebarCollapsedSnapshot() {
  try {
    return window.localStorage.getItem(CRM_SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setCrmSidebarCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(CRM_SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // Ignore storage access errors.
  }
  window.dispatchEvent(new Event("pp-crm-sidebar-collapsed"));
}

const NAV_ICONS = {
  home: HomeGlyph,
  contacts: PeopleGlyph,
  properties: BuildingGlyph,
  pipeline: TargetGlyph,
  tasks: CheckGlyph,
  partners: BriefcaseGlyph,
  settings: GearGlyph,
} as const;

const HEADER_ICONS = {
  mail: MailGlyph,
  phone: PhoneGlyph,
  tag: TagGlyph,
  calendar: CalendarGlyph,
  dollar: DollarGlyph,
  pin: PinGlyph,
  link: LinkGlyph,
  clock: ClockGlyph,
  user: UserGlyph,
  building: BuildingGlyph,
  people: PeopleGlyph,
  check: CheckGlyph,
} as const;

export function ColIcon({ name }: { name: keyof typeof HEADER_ICONS }) {
  const Icon = HEADER_ICONS[name];
  return <Icon className="size-3.5 text-[var(--crm-muted)]" />;
}

export const CRM_NAV = [
  { href: "/dashboard/crm", label: "Home", icon: "home", color: "#4c6ef5" },
  { href: "/dashboard/crm/contacts", label: "Contacts", icon: "contacts", color: "#be4bdb" },
  { href: "/dashboard/crm/properties", label: "Properties", icon: "properties", color: "#1976d2" },
  { href: "/dashboard/crm/deals", label: "Deals", icon: "pipeline", color: "#fab005" },
  { href: "/dashboard/crm/tasks", label: "Tasks", icon: "tasks", color: "#12b886" },
  { href: "/dashboard/crm/partners", label: "Partners", icon: "partners", color: "#fd7e14" },
  { href: "/dashboard/crm/settings", label: "Settings", icon: "settings", color: "#868e96" },
] as const;

function navActive(pathname: string, href: string) {
  return href === "/dashboard/crm" ? pathname === href : pathname.startsWith(href);
}

function NavItem({
  href,
  label,
  icon,
  color,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: keyof typeof NAV_ICONS;
  color: string;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = NAV_ICONS[icon];
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`flex items-center rounded-md text-[13px] transition ${
        collapsed ? "justify-center px-1.5 py-1.5" : "gap-2 px-2 py-1.5"
      } ${
        active
          ? "bg-[var(--crm-active)] font-medium text-[var(--crm-text)]"
          : "font-normal text-[var(--crm-secondary)] hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]"
      }`}
    >
      <Icon className="size-4 shrink-0" style={{ color }} />
      {collapsed ? null : <span className="truncate">{label}</span>}
    </Link>
  );
}

export function CrmNav() {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(
    subscribeCrmSidebarCollapsed,
    getCrmSidebarCollapsedSnapshot,
    () => false,
  );
  const toggleLabel = collapsed ? "Expand CRM sidebar" : "Collapse CRM sidebar";
  return (
    <>
      <aside
        id="crm-sidebar"
        className={`hidden shrink-0 flex-col border-r border-[var(--crm-border)] bg-[var(--crm-sidebar)] transition-[width] duration-200 ease-out lg:flex ${
          collapsed ? "w-14" : "w-[220px]"
        }`}
      >
        <div className={`flex h-12 items-center border-b border-[var(--crm-border)] ${collapsed ? "justify-center px-1" : "gap-2 px-3"}`}>
          {collapsed ? null : (
            <>
              <span className="grid size-5 place-items-center rounded-[5px] bg-[var(--crm-accent)] text-[10px] font-bold text-white">C</span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">CRM</span>
            </>
          )}
          <button
            type="button"
            onClick={() => setCrmSidebarCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-controls="crm-sidebar"
            title={toggleLabel}
            className="grid size-7 shrink-0 place-items-center rounded-md text-[var(--crm-muted)] transition hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]"
          >
            {collapsed ? <PanelExpandGlyph className="size-4" /> : <PanelCollapseGlyph className="size-4" />}
            <span className="sr-only">{toggleLabel}</span>
          </button>
        </div>
        <nav aria-label="CRM" className={`flex flex-1 flex-col gap-0.5 p-2 ${collapsed ? "items-stretch" : ""}`}>
          {collapsed ? null : <p className="px-2 pb-1 pt-1 text-[11px] font-medium text-[var(--crm-muted)]">Workspace</p>}
          {CRM_NAV.map((item) => (
            <NavItem key={item.href} {...item} collapsed={collapsed} active={navActive(pathname, item.href)} />
          ))}
        </nav>
      </aside>
      <nav aria-label="CRM" className="flex gap-1 overflow-x-auto border-b border-[var(--crm-border)] bg-[var(--crm-sidebar)] px-2 py-1.5 lg:hidden">
        {CRM_NAV.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = navActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] ${
                active ? "bg-[var(--crm-active)] font-medium text-[var(--crm-text)]" : "text-[var(--crm-secondary)]"
              }`}
            >
              <Icon className="size-3.5" style={{ color: item.color }} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function CrmPage({ children, contain }: { children: ReactNode; contain?: boolean }) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col ${contain ? "overflow-hidden" : "overflow-y-auto"}`}>
      {children}
    </div>
  );
}

function TitleIcon() {
  const pathname = usePathname();
  const item = [...CRM_NAV].reverse().find((entry) => navActive(pathname, entry.href)) ?? CRM_NAV[0];
  const Icon = NAV_ICONS[item.icon];
  return <Icon className="size-4 shrink-0" style={{ color: item.color }} />;
}

export function PageHeader({
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex min-h-12 shrink-0 items-center justify-between gap-4 border-b border-[var(--crm-border)] bg-white px-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <TitleIcon />
          <h1 className="truncate text-[15px] font-medium tracking-tight text-[var(--crm-text)]">{title}</h1>
        </div>
        {description ? <p className="mt-0.5 truncate pl-6 text-[12px] text-[var(--crm-muted)]">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-1.5">{action}</div> : null}
    </header>
  );
}

function BackGlyph(props: IconProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M10.2 3.2 5.4 8l4.8 4.8" />
      <path d="M5.6 8h7" />
    </svg>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-[var(--crm-secondary)] transition hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]"
    >
      <BackGlyph className="size-3.5 shrink-0" />
      {children}
    </Link>
  );
}

export function PrimaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[var(--crm-accent)] px-3 text-[13px] font-medium text-white transition hover:bg-[var(--crm-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-[var(--crm-secondary)] transition hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)] disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[var(--crm-border)] bg-white ${className}`}>{children}</section>;
}

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`grid gap-1.5 text-[13px] font-medium text-[var(--crm-secondary)] ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-[var(--crm-border)] bg-white px-2.5 py-[7px] text-[13px] leading-5 text-[var(--crm-text)] outline-none transition placeholder:text-[var(--crm-muted)] focus:border-[var(--crm-accent)] focus:ring-2 focus:ring-[var(--crm-accent)]/15";

export const toolbarSelectClass =
  "h-7 max-w-[11rem] cursor-pointer rounded-md border-0 bg-transparent px-2 text-[13px] font-medium text-[var(--crm-secondary)] outline-none hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]";

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="my-8 w-full max-w-2xl rounded-xl border border-[var(--crm-border)] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-medium text-[var(--crm-text)]">{title}</h2>
            {description ? <p className="mt-1 text-[13px] text-[var(--crm-secondary)]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-md text-lg leading-none text-[var(--crm-muted)] hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormActions({
  busy,
  error,
  onCancel,
  submitLabel = "Save",
}: {
  busy: boolean;
  error: string | null;
  onCancel: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--crm-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[13px] font-medium text-[var(--crm-danger)]" role="alert">
        {error}
      </div>
      <div className="flex justify-end gap-1.5">
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <PrimaryButton disabled={busy} type="submit">
          {busy ? "Saving…" : submitLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  children,
  viewLabel,
  count,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
  viewLabel?: string;
  count?: number;
}) {
  return (
    <div className="flex min-h-10 shrink-0 flex-col gap-2 border-b border-[var(--crm-border)] bg-white px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2 text-[13px]">
        {viewLabel ? <span className="truncate font-medium text-[var(--crm-text)]">{viewLabel}</span> : null}
        {count != null ? <span className="text-[var(--crm-muted)]">· {count}</span> : null}
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        <input
          className="h-7 w-full rounded-md border border-transparent bg-transparent px-2 text-[13px] text-[var(--crm-text)] outline-none placeholder:text-[var(--crm-muted)] hover:bg-[var(--crm-hover)] focus:border-[var(--crm-border)] focus:bg-white sm:w-52"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        {children}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="grid min-h-48 flex-1 place-items-center text-[13px] text-[var(--crm-muted)]">Loading…</div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="grid min-h-48 flex-1 place-items-center px-6 text-center">
      <div>
        <p className="text-[13px] font-medium text-[var(--crm-danger)]">{message}</p>
        <SecondaryButton className="mt-3" onClick={retry}>
          Try again
        </SecondaryButton>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="grid min-h-48 flex-1 place-items-center px-6 text-center">
      <div>
        <h2 className="text-[14px] font-medium text-[var(--crm-text)]">{title}</h2>
        <p className="mx-auto mt-1 max-w-md text-[13px] leading-5 text-[var(--crm-secondary)]">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

export function Pill({ children, tone = "sand" }: { children: ReactNode; tone?: "teal" | "blue" | "coral" | "sand" }) {
  const tones = {
    teal: "bg-[#e8f5e9] text-[#1b5e20]",
    blue: "bg-[#e3f2fd] text-[#0d47a1]",
    coral: "bg-[#fdecea] text-[#b71c1c]",
    sand: "bg-[#f1f1f1] text-[var(--crm-secondary)]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Chip({ children, href, external }: { children: ReactNode; href?: string; external?: boolean }) {
  const className =
    "inline-flex max-w-full items-center truncate rounded-full border border-[var(--crm-border)] bg-[var(--crm-hover)] px-2 py-0.5 text-[12px] text-[var(--crm-text)]";
  if (href) {
    return (
      <a
        className={`${className} hover:border-[var(--crm-accent)] hover:text-[var(--crm-accent)]`}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </a>
    );
  }
  return <span className={className}>{children}</span>;
}

const AVATAR_COLORS = ["#1961ed", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#ca8a04", "#4f46e5"];

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = value.charCodeAt(index) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export function EntityAvatar({ name, size = 16 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: AVATAR_COLORS[hashString(name || "?") % AVATAR_COLORS.length],
        fontSize: Math.max(8, Math.round(size * 0.42)),
      }}
    >
      {initials || "·"}
    </span>
  );
}

export function EntityName({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <EntityAvatar name={name} size={size} />
      <span className="truncate text-[13px] font-medium text-[var(--crm-text)]">{name}</span>
    </span>
  );
}

export type CrmColumn<T> = {
  id: string;
  header: string;
  icon?: ReactNode;
  width?: number;
  interactive?: boolean;
  render: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  getHref,
  onAdd,
  addLabel = "New",
  emptyMessage,
  fill = true,
}: {
  columns: CrmColumn<T>[];
  rows: T[];
  getHref?: (row: T) => string;
  onAdd?: () => void;
  addLabel?: string;
  emptyMessage?: string;
  fill?: boolean;
}) {
  return (
    <div className={fill ? "min-h-0 flex-1 overflow-auto" : "overflow-x-auto"}>
      <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={column.width ? { minWidth: column.width, width: column.width } : { minWidth: 128 }}
                className="sticky top-0 z-[1] border-b border-r border-[var(--crm-border)] bg-white px-2 py-1.5 text-[12px] font-medium text-[var(--crm-secondary)] last:border-r-0"
              >
                <span className="inline-flex items-center gap-1.5">
                  {column.icon}
                  {column.header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row) => {
              const href = getHref?.(row);
              return (
                <tr key={row.id} className="group">
                  {columns.map((column) => {
                    const content = (
                      <div className={`flex min-h-8 items-center px-2 py-1 text-[13px] whitespace-nowrap text-[var(--crm-text)] ${column.interactive ? "relative overflow-visible" : "overflow-hidden"}`}>
                        {column.render(row)}
                      </div>
                    );
                    return (
                      <td
                        key={column.id}
                        className="border-b border-r border-[var(--crm-border)] p-0 last:border-r-0 group-hover:bg-[var(--crm-hover)]"
                      >
                        {href && !column.interactive ? (
                          <Link href={href} className="block min-w-0">
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : emptyMessage ? (
            <tr>
              <td colSpan={columns.length} className="border-b border-[var(--crm-border)] px-3 py-6 text-[13px] text-[var(--crm-muted)]">
                {emptyMessage}
              </td>
            </tr>
          ) : null}
          {onAdd ? (
            <tr>
              <td colSpan={columns.length} className="border-b border-[var(--crm-border)] p-0">
                <button
                  type="button"
                  onClick={onAdd}
                  className="flex min-h-8 w-full items-center px-3 text-[13px] text-[var(--crm-muted)] transition hover:bg-[var(--crm-hover)] hover:text-[var(--crm-text)]"
                >
                  + {addLabel}
                </button>
              </td>
            </tr>
          ) : null}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length} className="sticky bottom-0 bg-[var(--crm-sidebar)] px-3 py-1.5 text-[12px] text-[var(--crm-secondary)]">
              Count all {rows.length}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function MetaGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="flex min-h-9 items-center gap-4 border-b border-[var(--crm-border)] px-1">
          <dt className="w-32 shrink-0 text-[13px] text-[var(--crm-secondary)]">{item.label}</dt>
          <dd className="min-w-0 truncate text-[13px] text-[var(--crm-text)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function money(value: number | null | undefined) {
  return value == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function shortDate(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "No date";
}

export function relativeTime(value: string | null | undefined) {
  if (!value) return "—";
  const deltaSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const abs = Math.abs(deltaSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60) return rtf.format(Math.round(deltaSeconds), "second");
  if (abs < 3600) return rtf.format(Math.round(deltaSeconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(deltaSeconds / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(deltaSeconds / 86400), "day");
  return shortDate(value);
}

export function RelativeTime({ value }: { value: string | null | undefined }) {
  const [label, setLabel] = useState(() => (value ? shortDate(value) : "—"));
  useEffect(() => {
    setLabel(relativeTime(value));
  }, [value]);
  return <>{label}</>;
}

export function dateTimeLocalValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function isoFromLocal(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? new Date(text).toISOString() : null;
}

export function nullableText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export function nullableNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

export type SubmitEvent = FormEvent<HTMLFormElement>;
