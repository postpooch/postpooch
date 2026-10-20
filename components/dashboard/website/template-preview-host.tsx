"use client";

import { type FormEvent, type MouseEvent, useEffect, useMemo, useState } from "react";

import { getTemplateRouter } from "@/app/websites/[subdomain]/[[...path]]/templates/registry";
import type { WebsiteSite } from "@/app/websites/[subdomain]/[[...path]]/templates/types";
import { patternToPathSegments } from "@/app/websites/[subdomain]/[[...path]]/templates/preview-route";
import type { WebsiteBlogPost } from "@/lib/websites/blog-post";
import type { WebsiteProperty } from "@/lib/websites/property";

import { PreviewRenderBoundary } from "./preview-render-boundary";

type PreviewPayload = {
  site: WebsiteSite;
  path: string;
  content: Record<string, unknown>;
  params: Record<string, string>;
  properties: WebsiteProperty[];
  blogPosts: WebsiteBlogPost[];
};

function resolvePreviewMatch(
  template: string,
  draft: PreviewPayload,
) {
  const router = getTemplateRouter(template);
  if (!router) return { router: null, match: null };

  const segments = patternToPathSegments(draft.path, draft.params);
  if (segments !== null) {
    const matched = router.match(segments);
    if (matched && matched.pattern === draft.path) {
      return { router, match: matched };
    }
  }

  const fallback = router.editorPreviewMatch(
    draft.path,
    draft.site.settings,
    draft.properties,
    draft.blogPosts,
  );
  return { router, match: fallback };
}

export function TemplatePreviewHost() {
  const [draft, setDraft] = useState<PreviewPayload | null>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const message = event.data as { type?: string; payload?: PreviewPayload };
      if (message.type !== "postpooch:preview" || !message.payload) return;
      setDraft(message.payload);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "postpooch:preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  function interceptLink(event: MouseEvent<HTMLDivElement>) {
    const element = event.target as HTMLElement;
    const anchor = element.closest("a");
    if (!anchor) return;
    event.preventDefault();
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin === window.location.origin) {
        window.parent.postMessage(
          { type: "postpooch:navigate", pathname: url.pathname },
          window.location.origin,
        );
      }
    } catch {
      // A malformed template link is inert inside the editor preview.
    }
  }

  function preventSubmit(event: FormEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  const previewKey = draft ? `${draft.path}:${JSON.stringify(draft.params)}` : "empty";
  const resolved = useMemo(
    () => (draft ? resolvePreviewMatch(draft.site.template, draft) : { router: null, match: null }),
    [draft],
  );

  if (!draft) {
    return <div className="grid min-h-dvh place-items-center bg-white text-sm text-pp-stone">Preparing preview…</div>;
  }

  const { router, match } = resolved;
  if (!router || !match) {
    return (
      <div className="grid min-h-dvh place-items-center bg-white px-8 text-center text-sm leading-6 text-pp-coral">
        Preview unavailable for this page. Add a catalog item or choose another route.
      </div>
    );
  }

  try {
    router.resolveSettings(draft.site.settings);
    router.resolveContent(draft.path, draft.content);
  } catch {
    return (
      <div className="grid min-h-dvh place-items-center bg-white px-8 text-center text-sm leading-6 text-pp-coral">
        One of these values is not valid for the selected template.
      </div>
    );
  }

  const preview = router.render({
    match,
    site: { ...draft.site, settings: draft.site.settings },
    rawContent: draft.content,
    properties: draft.properties,
    blogPosts: draft.blogPosts,
  });

  return (
    <PreviewRenderBoundary resetKey={previewKey}>
      <div onClickCapture={interceptLink} onSubmitCapture={preventSubmit}>
        {preview}
      </div>
    </PreviewRenderBoundary>
  );
}
