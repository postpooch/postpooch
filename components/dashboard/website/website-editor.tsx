"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { PanelCollapseIcon, PanelExpandIcon } from "@/components/dashboard/icons";
import { BlogInspector } from "@/components/dashboard/website/blog-inspector";
import { LoadingIndicator } from "@/components/dashboard/website/loading-indicator";
import { PropertyInspector } from "@/components/dashboard/website/property-inspector";
import { getTemplateRouter } from "@/app/websites/[subdomain]/[[...path]]/templates/registry";
import { pathnameToPathSegments } from "@/app/websites/[subdomain]/[[...path]]/templates/preview-route";
import {
  newWebsiteBlogPost,
  type WebsiteBlogPost,
} from "@/lib/websites/blog-post";
import {
  newWebsiteProperty,
  type WebsiteProperty,
} from "@/lib/websites/property";
import type { WebsiteEditorDocument } from "@/lib/websites/editor";

const EDITOR_SIDEBAR_STORAGE_KEY = "pp-website-editor-sidebar-collapsed";

type JsonObject = Record<string, unknown>;
type ValuePath = Array<string | number>;
type Device = "desktop" | "tablet" | "mobile";

const DEVICES: Record<Device, { label: string; width: number }> = {
  desktop: { label: "Desktop", width: 1440 },
  tablet: { label: "Tablet", width: 834 },
  mobile: { label: "Mobile", width: 390 },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function replaceAtPath(root: unknown, path: ValuePath, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...tail] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[Number(head)] = replaceAtPath(copy[Number(head)], tail, value);
    return copy;
  }
  const copy: JsonObject = { ...((root as JsonObject | null) ?? {}) };
  copy[String(head)] = replaceAtPath(copy[String(head)], tail, value);
  return copy;
}

function humanize(value: string): string {
  return value
    .replace(/^\[|\]$/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function resolvePreviewParams(
  template: string,
  path: string,
  settings: JsonObject,
  properties: WebsiteProperty[],
  blogPosts: WebsiteBlogPost[],
  override?: Record<string, string>,
): Record<string, string> {
  if (override) return override;
  const router = getTemplateRouter(template);
  return router?.editorPreviewMatch(path, settings, properties, blogPosts)?.params ?? {};
}

function icon(name: "pages" | "properties" | "posts" | "settings" | "desktop" | "tablet" | "mobile" | "external" | "chevron" | "upload") {
  const paths: Record<typeof name, ReactNode> = {
    pages: <><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    properties: <><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    posts: <><path d="M5 5h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M15 5v4h4M8 12h8M8 16h6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.37.35.7.6 1 .28.3.66.44 1.1.4h.09v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></>,
    desktop: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    tablet: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></>,
    mobile: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>,
    external: <><path d="M14 3h7v7M21 3l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 20h14"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[1.7]">{paths[name]}</svg>;
}

function isImageField(name: string, value: string): boolean {
  return /(image|photo|portrait|headshot|logo|gallery|thumbnail|background|collage)/i.test(name) ||
    (/^https?:\/\//.test(value) && /(images\.unsplash|\.(avif|gif|jpe?g|png|webp)(\?|$))/i.test(value));
}

function isColorField(name: string, value: string): boolean {
  return /(color|colour|ink|paper|cream|sage|rust|olive|accent|teal|coral|white|night)/i.test(name) && /^#[0-9a-f]{3,8}$/i.test(value);
}

function ImageControl({
  name,
  value,
  websiteId,
  onChange,
}: {
  name: string;
  value: string;
  websiteId: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.set("image", file);
    try {
      const response = await fetch(`/api/websites/${websiteId}/images`, { method: "POST", body: form });
      const payload = (await response.json()) as { image?: { url?: string }; error?: string };
      if (!response.ok || !payload.image?.url) throw new Error(payload.error || "Upload failed.");
      onChange(payload.image.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-[12px] font-medium text-pp-stone">{humanize(name)}</span>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-pp-mist ring-1 ring-pp-sand">
        {/* User-selected R2 assets are already immutable and should not incur optimizer copies. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-xs text-pp-stone">No image</div>}
        {uploading ? (
          <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-pp-ink shadow-card-sm ring-1 ring-pp-sand/80">
              <LoadingIndicator label="Uploading image" />
            </span>
          </div>
        ) : null}
        <label className="absolute inset-x-2 bottom-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-pp-ink shadow-card-sm backdrop-blur transition hover:bg-white">
          {uploading ? <LoadingIndicator label="Uploading…" className="gap-1.5" spinnerClassName="size-3.5" /> : <>{icon("upload")}Replace image</>}
          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" onChange={upload} disabled={uploading} className="sr-only" />
        </label>
      </div>
      {error ? <p role="alert" className="text-xs leading-5 text-pp-coral">{error}</p> : null}
    </div>
  );
}

function ValueEditor({
  name,
  value,
  path,
  websiteId,
  onChange,
  depth = 0,
}: {
  name: string;
  value: unknown;
  path: ValuePath;
  websiteId: string;
  onChange: (path: ValuePath, value: unknown) => void;
  depth?: number;
}) {
  if (typeof value === "string") {
    if (isImageField(name, value)) {
      return <ImageControl name={name} value={value} websiteId={websiteId} onChange={(next) => onChange(path, next)} />;
    }
    const multiline = value.length > 90 || /(body|copy|description|excerpt|summary|subtext|intro|note|quote|text)/i.test(name);
    return (
      <label className="block space-y-1.5">
        <span className="block text-[12px] font-medium text-pp-stone">{humanize(name)}</span>
        <div className="flex items-center gap-2">
          {isColorField(name, value) ? (
            <input aria-label={`${humanize(name)} color picker`} type="color" value={value.slice(0, 7)} onChange={(event) => onChange(path, event.target.value)} className="size-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
          ) : null}
          {multiline ? (
            <textarea value={value} rows={Math.min(6, Math.max(3, Math.ceil(value.length / 48)))} onChange={(event) => onChange(path, event.target.value)} className="min-h-20 w-full resize-y rounded-[10px] border border-pp-sand bg-white px-3 py-2.5 text-[13px] leading-5 text-pp-ink outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10" />
          ) : (
            <input value={value} onChange={(event) => onChange(path, event.target.value)} className="h-10 w-full rounded-[10px] border border-pp-sand bg-white px-3 text-[13px] text-pp-ink outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10" />
          )}
        </div>
      </label>
    );
  }

  if (typeof value === "number") {
    return <label className="block space-y-1.5"><span className="block text-[12px] font-medium text-pp-stone">{humanize(name)}</span><input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} className="h-10 w-full rounded-[10px] border border-pp-sand bg-white px-3 text-[13px] outline-none focus:border-pp-teal" /></label>;
  }

  if (typeof value === "boolean") {
    return <label className="flex items-center justify-between gap-3 text-[13px] font-medium text-pp-ink"><span>{humanize(name)}</span><input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} className="size-4 accent-pp-teal" /></label>;
  }

  if (Array.isArray(value)) {
    return (
      <details className="group rounded-xl border border-pp-sand/80 bg-pp-mist/40" open={depth === 0}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-[12px] font-semibold text-pp-ink">
          <span>{humanize(name)} <span className="font-normal text-pp-stone">({value.length})</span></span><span className="transition group-open:rotate-90">{icon("chevron")}</span>
        </summary>
        <div className="space-y-4 border-t border-pp-sand/70 px-3 py-3">
          {value.map((item, index) => (
            <div key={index} className="space-y-2 border-b border-pp-sand/60 pb-4 last:border-0 last:pb-0">
              <ValueEditor name={`${humanize(name)} ${index + 1}`} value={item} path={[...path, index]} websiteId={websiteId} onChange={onChange} depth={depth + 1} />
              {value.length > 1 ? <button type="button" onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))} className="text-[11px] font-medium text-pp-coral hover:underline">Remove item</button> : null}
            </div>
          ))}
          {value.length ? <button type="button" onClick={() => onChange(path, [...value, clone(value[value.length - 1])])} className="text-[12px] font-semibold text-pp-teal hover:text-pp-teal-dark">+ Add item</button> : null}
        </div>
      </details>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as JsonObject);
    return (
      <details className="group rounded-xl border border-pp-sand/80 bg-pp-mist/40" open={depth < 1}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-[12px] font-semibold text-pp-ink"><span>{humanize(name)}</span><span className="transition group-open:rotate-90">{icon("chevron")}</span></summary>
        <div className="space-y-4 border-t border-pp-sand/70 px-3 py-3">
          {entries.map(([key, item]) => <ValueEditor key={key} name={key} value={item} path={[...path, key]} websiteId={websiteId} onChange={onChange} depth={depth + 1} />)}
        </div>
      </details>
    );
  }

  return null;
}

function PreviewCanvas({
  iframeRef,
  device,
  onLoad,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  device: Device;
  onLoad: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const width = DEVICES[device].width;
  const height = device === "mobile" ? 844 : 900;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => setScale(Math.min(1, Math.max(0.28, (host.clientWidth - 48) / width)));
    const observer = new ResizeObserver(update);
    observer.observe(host);
    update();
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={hostRef} className="h-full min-h-[520px] overflow-auto bg-[#e9e7e4] p-6">
      <div className="mx-auto transition-[width,height] duration-300" style={{ width: width * scale, height: height * scale }}>
        <iframe
          ref={iframeRef}
          src="/website-preview"
          title={`${DEVICES[device].label} website preview`}
          onLoad={onLoad}
          className="origin-top-left border-0 bg-white shadow-[0_18px_55px_rgba(36,25,20,.18)]"
          style={{ width, height, transform: `scale(${scale})`, borderRadius: device === "mobile" ? 26 / scale : 8 / scale } as CSSProperties}
        />
      </div>
    </div>
  );
}

export function WebsiteEditor({
  initialDocument,
  templateName,
}: {
  initialDocument: WebsiteEditorDocument;
  templateName: string;
}) {
  const [settings, setSettings] = useState(() => clone(initialDocument.settings));
  const [pages, setPages] = useState(() => clone(initialDocument.pages));
  const [propertiesEnabled, setPropertiesEnabled] = useState(initialDocument.propertiesEnabled);
  const [properties, setProperties] = useState(() => clone(initialDocument.properties));
  const [blogPostsEnabled, setBlogPostsEnabled] = useState(initialDocument.blogPostsEnabled);
  const [blogPosts, setBlogPosts] = useState(() => clone(initialDocument.blogPosts));
  const [saved, setSaved] = useState(() => clone({
    settings: initialDocument.settings,
    pages: initialDocument.pages,
    propertiesEnabled: initialDocument.propertiesEnabled,
    properties: initialDocument.properties,
    blogPostsEnabled: initialDocument.blogPostsEnabled,
    blogPosts: initialDocument.blogPosts,
  }));
  const [selectedPath, setSelectedPath] = useState(initialDocument.pages[0]?.path ?? "/");
  const [previewParams, setPreviewParams] = useState<Record<string, string>>(() =>
    resolvePreviewParams(
      initialDocument.template,
      initialDocument.pages[0]?.path ?? "/",
      initialDocument.settings,
      initialDocument.properties,
      initialDocument.blogPosts,
    ),
  );
  const [panel, setPanel] = useState<"page" | "properties" | "posts" | "settings">("page");
  const [device, setDevice] = useState<Device>("desktop");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, startPublishing] = useTransition();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const page = pages.find((item) => item.path === selectedPath) ?? pages[0];
  const savedPage = saved.pages.find((item) => item.path === selectedPath) ?? saved.pages[0];
  const currentPageDirty = JSON.stringify(page?.content) !== JSON.stringify(savedPage?.content);
  const isDirty = JSON.stringify({ settings, pages, propertiesEnabled, properties, blogPostsEnabled, blogPosts }) !== JSON.stringify(saved);

  const sendPreview = useCallback(() => {
    if (!page || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: "postpooch:preview",
        payload: {
          site: {
            id: initialDocument.id,
            profileId: "",
            subdomain: initialDocument.subdomain,
            template: initialDocument.template,
            propertiesEnabled,
            blogPostsEnabled,
            settings,
          },
          path: page.path,
          content: page.content,
          params: previewParams,
          properties,
          blogPosts,
        },
      },
      window.location.origin,
    );
  }, [blogPosts, blogPostsEnabled, initialDocument.id, initialDocument.subdomain, initialDocument.template, page, previewParams, properties, propertiesEnabled, settings]);

  const choosePage = useCallback((path: string, params?: Record<string, string>) => {
    const nextParams = resolvePreviewParams(
      initialDocument.template,
      path,
      settings,
      properties,
      blogPosts,
      params,
    );

    if (path === selectedPath) {
      setPreviewParams(nextParams);
      setPanel("page");
      return;
    }

    if (currentPageDirty && !window.confirm("Discard this page's unpublished changes and open another page?")) return;
    if (currentPageDirty && savedPage) {
      setPages((current) => current.map((item) => item.path === selectedPath ? clone(savedPage) : item));
    }
    setSelectedPath(path);
    setPreviewParams(nextParams);
    setPanel("page");
    setError(null);
  }, [blogPosts, currentPageDirty, initialDocument.template, properties, savedPage, selectedPath, settings]);

  useEffect(() => sendPreview(), [sendPreview]);
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { type?: string; pathname?: string };
      if (data.type === "postpooch:preview-ready") sendPreview();
      if (data.type === "postpooch:navigate" && data.pathname) {
        const router = getTemplateRouter(initialDocument.template);
        const match = router?.match(pathnameToPathSegments(data.pathname));
        if (!match) return;
        const target = pages.find((item) => item.path === match.pattern);
        if (!target) return;
        choosePage(match.pattern, match.params);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [choosePage, initialDocument.template, pages, sendPreview]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (isDirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setSidebarCollapsed(window.localStorage.getItem(EDITOR_SIDEBAR_STORAGE_KEY) === "1");
      } catch {
        // Ignore storage access errors.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(EDITOR_SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Ignore storage access errors.
      }
      return next;
    });
  }

  function changePageValue(path: ValuePath, value: unknown) {
    setPages((current) => current.map((item) => item.path === selectedPath ? { ...item, content: replaceAtPath(item.content, path, value) as JsonObject } : item));
    setNotice(null);
  }

  function changeSetting(path: ValuePath, value: unknown) {
    setSettings((current) => replaceAtPath(current, path, value) as JsonObject);
    setNotice(null);
  }

  function addProperty(): string {
    const property = newWebsiteProperty(properties.length);
    setProperties((current) => [...current, property]);
    setPropertiesEnabled(true);
    setNotice(null);
    return property.id;
  }

  function changeProperty(id: string, property: WebsiteProperty) {
    setProperties((current) => current.map((item) => item.id === id ? property : item));
    setNotice(null);
  }

  function deleteProperty(id: string) {
    setProperties((current) => current.filter((item) => item.id !== id));
    setNotice(null);
  }

  function moveProperty(id: string, direction: -1 | 1) {
    setProperties((current) => {
      const index = current.findIndex((property) => property.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next.map((property, displayOrder) => ({ ...property, displayOrder }));
    });
    setNotice(null);
  }

  function addBlogPost(): string {
    const post = newWebsiteBlogPost();
    setBlogPosts((current) => [post, ...current]);
    setBlogPostsEnabled(true);
    setNotice(null);
    return post.id;
  }

  function changeBlogPost(id: string, post: WebsiteBlogPost) {
    setBlogPosts((current) => current.map((item) => (item.id === id ? post : item)));
    setNotice(null);
  }

  function deleteBlogPost(id: string) {
    setBlogPosts((current) => current.filter((item) => item.id !== id));
    setNotice(null);
  }

  function publish() {
    if (!page || !isDirty) return;
    setError(null);
    setNotice(null);
    startPublishing(async () => {
      try {
        const response = await fetch(`/api/websites/${initialDocument.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings,
            propertiesEnabled,
            properties,
            blogPostsEnabled,
            blogPosts,
            page: { path: page.path, content: page.content },
          }),
        });
        const payload = (await response.json()) as { error?: string; publishedAt?: string };
        if (!response.ok) throw new Error(payload.error || "Unable to publish.");
        const orderedProperties = properties.map((property, displayOrder) => ({ ...property, displayOrder }));
        setProperties(orderedProperties);
        setSaved(clone({
          settings,
          pages,
          propertiesEnabled,
          properties: orderedProperties,
          blogPostsEnabled,
          blogPosts,
        }));
        setNotice("Published");
        window.setTimeout(() => setNotice(null), 2400);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Unable to publish.");
      }
    });
  }

  const publicHref = `/websites/${encodeURIComponent(initialDocument.subdomain)}`;
  const inspectorEntries = useMemo(() => Object.entries(panel === "settings" ? settings : page?.content ?? {}), [panel, settings, page]);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-pp-ink">
      <header className="flex min-h-16 flex-wrap items-center gap-3 border-b border-pp-sand/80 bg-white px-4 py-2.5 sm:px-5">
        <div className="mr-auto flex min-w-0 items-center gap-3">
          <Link href="/dashboard/website?templates=1" onClick={(event) => { if (isDirty && !window.confirm("Leave the editor and discard unpublished changes?")) event.preventDefault(); }} className="rounded-lg px-2 py-1.5 text-sm font-medium text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink">Templates</Link>
          <span className="h-5 w-px bg-pp-sand" />
          <div className="min-w-0"><p className="truncate text-sm font-semibold tracking-[-.01em]">{templateName}</p><p className="truncate text-[11px] text-pp-stone">{initialDocument.subdomain}.postpooch.com</p></div>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-expanded={!sidebarCollapsed}
          aria-controls="website-editor-sidebar"
          title={sidebarCollapsed ? "Show editor sidebar" : "Hide editor sidebar"}
          className="grid size-9 place-items-center rounded-[10px] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink"
        >
          {sidebarCollapsed ? <PanelExpandIcon className="size-[18px]" /> : <PanelCollapseIcon className="size-[18px]" />}
          <span className="sr-only">{sidebarCollapsed ? "Show editor sidebar" : "Hide editor sidebar"}</span>
        </button>
        <div className="flex rounded-[10px] bg-pp-mist p-1" aria-label="Preview size">
          {(Object.keys(DEVICES) as Device[]).map((item) => <button key={item} type="button" title={DEVICES[item].label} aria-label={DEVICES[item].label} aria-pressed={device === item} onClick={() => setDevice(item)} className={`grid size-8 place-items-center rounded-[7px] transition ${device === item ? "bg-white text-pp-ink shadow-sm" : "text-pp-stone hover:text-pp-ink"}`}>{icon(item)}</button>)}
        </div>
        <a href={publicHref} target="_blank" rel="noreferrer" className="flex h-9 items-center gap-2 rounded-[10px] px-3 text-xs font-semibold text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink">View site {icon("external")}</a>
        <button type="button" onClick={publish} disabled={!isDirty || isPublishing} className="inline-flex h-9 items-center justify-center rounded-[10px] bg-pp-teal px-4 text-xs font-semibold text-white transition hover:bg-pp-teal-dark disabled:cursor-default disabled:opacity-45">
          {isPublishing ? <LoadingIndicator label="Publishing…" tone="dark" className="gap-1.5" spinnerClassName="size-3.5" /> : "Publish"}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div
          id="website-editor-sidebar"
          aria-hidden={sidebarCollapsed}
          inert={sidebarCollapsed}
          className={`min-h-0 overflow-hidden border-pp-sand/80 bg-white transition-[max-height,width] duration-300 ease-in-out lg:flex lg:max-h-none lg:shrink-0 ${
            sidebarCollapsed
              ? "max-h-0 border-b-0 lg:w-0 lg:border-r-0"
              : "max-h-[70dvh] border-b lg:w-[510px] lg:border-r"
          }`}
        >
          <div className="flex h-full w-full flex-col lg:w-[510px] lg:min-w-[510px] lg:flex-row">
            <nav aria-label="Website editor" className="shrink-0 border-b border-pp-sand/80 bg-[#fbfaf8] p-3 lg:w-[190px] lg:border-b-0 lg:border-r">
              <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-pp-stone">Site</p>
              <button type="button" onClick={() => setPanel("settings")} className={`flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[13px] font-medium transition ${panel === "settings" ? "bg-white text-pp-ink shadow-sm ring-1 ring-pp-sand/70" : "text-pp-stone hover:bg-white/70 hover:text-pp-ink"}`}>{icon("settings")} Theme settings</button>
              <button type="button" onClick={() => setPanel("properties")} className={`mt-0.5 flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[13px] font-medium transition ${panel === "properties" ? "bg-white text-pp-ink shadow-sm ring-1 ring-pp-sand/70" : "text-pp-stone hover:bg-white/70 hover:text-pp-ink"}`}>{icon("properties")}<span className="min-w-0 flex-1">Properties</span>{properties.length ? <span className="rounded-full bg-pp-mist px-1.5 py-0.5 text-[10px] tabular-nums text-pp-stone">{properties.length}</span> : null}</button>
              <button type="button" onClick={() => setPanel("posts")} className={`mt-0.5 flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[13px] font-medium transition ${panel === "posts" ? "bg-white text-pp-ink shadow-sm ring-1 ring-pp-sand/70" : "text-pp-stone hover:bg-white/70 hover:text-pp-ink"}`}>{icon("posts")}<span className="min-w-0 flex-1">Posts</span>{blogPosts.length ? <span className="rounded-full bg-pp-mist px-1.5 py-0.5 text-[10px] tabular-nums text-pp-stone">{blogPosts.length}</span> : null}</button>
              <p className="mt-5 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-pp-stone">Pages</p>
              <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-1">
                {pages.map((item) => <button key={item.path} type="button" onClick={() => choosePage(item.path)} className={`flex min-w-0 items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[13px] transition ${panel === "page" && page?.path === item.path ? "bg-white font-semibold text-pp-ink shadow-sm ring-1 ring-pp-sand/70" : "font-medium text-pp-stone hover:bg-white/70 hover:text-pp-ink"}`}><span className="shrink-0">{icon("pages")}</span><span className="truncate">{item.label}</span></button>)}
              </div>
            </nav>

            <aside className="min-h-0 max-h-[48dvh] flex-1 overflow-y-auto bg-white lg:max-h-[calc(100dvh-64px)] lg:w-[320px]">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-pp-sand/80 bg-white/95 px-4 py-4 backdrop-blur">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-pp-teal">{panel === "settings" ? "Across every page" : panel === "properties" ? "Your listing library" : panel === "posts" ? "Your publication" : page?.path}</p>
                  <h1 className="mt-1 text-lg font-semibold tracking-[-.025em]">{panel === "settings" ? "Theme settings" : panel === "properties" ? "Properties" : panel === "posts" ? "Posts" : page?.label}</h1>
                </div>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-expanded={!sidebarCollapsed}
                  aria-controls="website-editor-sidebar"
                  title="Hide editor sidebar"
                  className="grid size-8 shrink-0 place-items-center rounded-[8px] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink"
                >
                  <PanelCollapseIcon className="size-[18px]" />
                  <span className="sr-only">Hide editor sidebar</span>
                </button>
              </div>
              {panel === "properties" ? (
                <PropertyInspector
                  websiteId={initialDocument.id}
                  enabled={propertiesEnabled}
                  properties={properties}
                  onEnabledChange={(enabled) => { setPropertiesEnabled(enabled); setNotice(null); }}
                  onChange={changeProperty}
                  onAdd={addProperty}
                  onDelete={deleteProperty}
                  onMove={moveProperty}
                />
              ) : panel === "posts" ? (
                <BlogInspector
                  enabled={blogPostsEnabled}
                  posts={blogPosts}
                  onEnabledChange={(enabled) => { setBlogPostsEnabled(enabled); setNotice(null); }}
                  onChange={changeBlogPost}
                  onAdd={addBlogPost}
                  onDelete={deleteBlogPost}
                />
              ) : (
                <div className="space-y-4 p-4">
                  {inspectorEntries.map(([name, value]) => <ValueEditor key={name} name={name} value={value} path={[name]} websiteId={initialDocument.id} onChange={panel === "settings" ? changeSetting : changePageValue} />)}
                </div>
              )}
            </aside>
          </div>
        </div>

        <main className="relative min-h-[560px] min-w-0 flex-1">
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-expanded={false}
              aria-controls="website-editor-sidebar"
              title="Show editor sidebar"
              className="absolute top-4 left-0 z-20 flex items-center gap-1 rounded-r-xl border border-l-0 border-pp-sand/80 bg-white px-1.5 py-2.5 text-pp-stone shadow-card-sm transition hover:bg-pp-mist hover:text-pp-ink"
            >
              <PanelExpandIcon className="size-[18px]" />
              <span className="sr-only">Show editor sidebar</span>
            </button>
          ) : null}
          <PreviewCanvas iframeRef={iframeRef} device={device} onLoad={sendPreview} />
          {isPublishing ? (
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-white/35 backdrop-blur-[1px]">
              <div className="rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-pp-ink shadow-card ring-1 ring-pp-sand/80">
                <LoadingIndicator label="Publishing updates" />
              </div>
            </div>
          ) : null}
          {isDirty ? <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-pp-ink/88 px-3 py-1.5 text-[11px] font-medium text-white shadow-card backdrop-blur">Unpublished changes</div> : null}
          {notice ? <div role="status" className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-pp-teal px-4 py-2 text-xs font-semibold text-white shadow-card">{notice}</div> : null}
          {error ? <div role="alert" className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-white px-4 py-3 text-xs font-medium text-pp-coral shadow-card ring-1 ring-pp-sand"><span>{error}</span><button onClick={() => setError(null)} className="text-pp-stone">Dismiss</button></div> : null}
        </main>
      </div>
    </div>
  );
}
