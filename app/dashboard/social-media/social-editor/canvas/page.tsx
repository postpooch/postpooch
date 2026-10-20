import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FORMAT_LABELS,
  getSocialTemplate,
  PILLAR_LABELS,
} from "@/components/dashboard/social-media/templates";

type CanvasPageProps = {
  searchParams: Promise<{ template?: string; blank?: string }>;
};

export async function generateMetadata({
  searchParams,
}: CanvasPageProps): Promise<Metadata> {
  const params = await searchParams;
  if (params.blank === "1") {
    return { title: "Blank canvas" };
  }
  const template = params.template
    ? getSocialTemplate(params.template)
    : undefined;
  return { title: template?.name ?? "Editor canvas" };
}

/**
 * Stub for the forthcoming fabric.js canvas editor.
 * Linked from the templates gallery; not a full editor yet.
 */
export default async function SocialEditorCanvasPage({
  searchParams,
}: CanvasPageProps) {
  const params = await searchParams;
  const isBlank = params.blank === "1";
  const template = !isBlank && params.template
    ? getSocialTemplate(params.template)
    : undefined;

  const title = isBlank
    ? "Blank canvas"
    : (template?.name ?? "Template");
  const detail = isBlank
    ? "A clean square starting point."
    : template
      ? `${PILLAR_LABELS[template.pillar]} · ${FORMAT_LABELS[template.format]}`
      : "Template not found";

  return (
    <div className="flex min-h-[calc(100dvh-3.75rem)] flex-col bg-white text-pp-ink lg:min-h-dvh">
      <header className="flex min-h-16 flex-wrap items-center gap-3 border-b border-pp-sand/80 bg-white px-4 py-2.5 sm:px-5">
        <div className="mr-auto flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/social-media/social-editor"
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink"
          >
            Templates
          </Link>
          <span className="h-5 w-px bg-pp-sand" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-.01em]">{title}</p>
            <p className="truncate text-[11px] text-pp-stone">{detail}</p>
          </div>
        </div>
      </header>

      <main className="relative min-h-[560px] min-w-0 flex-1 bg-[#e9e7e4] p-6">
        <div className="mx-auto flex h-full min-h-[480px] max-w-3xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-[18px] bg-white shadow-[0_18px_55px_rgba(36,25,20,.18)] ring-1 ring-pp-sand/70">
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-5 px-6">
              <Image
                src="/postpooch_web_mascot_assets/responsive/with-shadow/webp/postpooch-mascot-with-shadow-128w.webp"
                alt=""
                width={72}
                height={72}
                className="h-16 w-auto"
              />
              <div className="max-w-sm text-center">
                <p className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                  Canvas editor coming next
                </p>
                <p className="mt-2 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  This is where you’ll arrange photos, type, and brand details on a
                  fabric.js canvas. Your template selection is ready when that
                  lands.
                </p>
              </div>
            </div>
            {template ? (
              <div className="border-t border-pp-sand/70 px-5 py-4 sm:px-6">
                <p className="text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  {template.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
