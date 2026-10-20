"use client";

import { useState } from "react";

import {
  blogPostExcerpt,
  blogPostTitle,
  formatBlogPostDate,
  isPublishedBlogPost,
  type WebsiteBlogPost,
} from "@/lib/websites/blog-post";

type BlogInspectorProps = {
  enabled: boolean;
  posts: WebsiteBlogPost[];
  onEnabledChange: (enabled: boolean) => void;
  onChange: (id: string, post: WebsiteBlogPost) => void;
  onAdd: () => string;
  onDelete: (id: string) => void;
};

function Toggle({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-pp-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[11px] leading-4 text-pp-stone">{description}</span>
        ) : null}
      </span>
      <span className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition ${checked ? "bg-pp-teal" : "bg-[#d8d5d0]"}`}>
        <input
          className="sr-only"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={`absolute top-[3px] size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[21px]" : "translate-x-[3px]"}`}
        />
      </span>
    </label>
  );
}

export function BlogInspector({
  enabled,
  posts,
  onEnabledChange,
  onChange,
  onAdd,
  onDelete,
}: BlogInspectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = posts.find((post) => post.id === selectedId) ?? null;

  function update(patch: Partial<WebsiteBlogPost>) {
    if (!selected) return;
    onChange(selected.id, { ...selected, ...patch });
  }

  if (selected) {
    const published = isPublishedBlogPost(selected);
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-pp-sand/70 px-4 py-3">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-pp-teal transition hover:bg-pp-mist"
          >
            ← All posts
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete ${blogPostTitle(selected)}? This is applied when you publish.`)) {
                onDelete(selected.id);
                setSelectedId(null);
              }
            }}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-pp-coral transition hover:bg-pp-coral/5"
          >
            Delete
          </button>
        </div>

        <div className="flex-1 px-5 pb-8 pt-6">
          <p className="mb-4 text-[11px] font-medium text-pp-stone">
            {published ? formatBlogPostDate(selected) : "Draft"} · Visible once it has a title and you publish
          </p>
          <label className="block">
            <span className="sr-only">Title</span>
            <textarea
              value={selected.title}
              placeholder="Title"
              rows={1}
              onChange={(event) => {
                event.currentTarget.style.height = "auto";
                event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                update({ title: event.target.value });
              }}
              className="w-full resize-none border-0 bg-transparent p-0 font-serif text-[28px] leading-[1.15] tracking-[-.035em] text-pp-ink outline-none placeholder:text-[#c4bfb6]"
            />
          </label>
          <label className="mt-3 block">
            <span className="sr-only">Subtitle</span>
            <textarea
              value={selected.subtitle}
              placeholder="Add a subtitle…"
              rows={2}
              onChange={(event) => update({ subtitle: event.target.value })}
              className="w-full resize-none border-0 bg-transparent p-0 text-[16px] leading-6 text-pp-stone outline-none placeholder:text-[#c4bfb6]"
            />
          </label>
          <div className="my-5 h-px bg-pp-sand/80" />
          <label className="block">
            <span className="sr-only">Body</span>
            <textarea
              value={selected.text}
              placeholder="Tell the story…"
              onChange={(event) => update({ text: event.target.value })}
              className="min-h-[280px] w-full resize-y border-0 bg-transparent p-0 text-[15px] leading-7 text-pp-ink outline-none placeholder:text-[#c4bfb6]"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-pp-mist/65 p-4 ring-1 ring-pp-sand/80">
        <Toggle
          checked={enabled}
          label="Show posts"
          description="Controls the journal, blog, and insights pages on your website."
          onChange={onEnabledChange}
        />
      </div>

      <button
        type="button"
        onClick={() => setSelectedId(onAdd())}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-[11px] bg-pp-ink text-[13px] font-semibold text-white shadow-sm transition hover:bg-black"
      >
        <span className="text-base font-normal leading-none">＋</span> New post
      </button>

      {posts.length ? (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-pp-sand/90">
          {posts.map((post) => {
            const published = isPublishedBlogPost(post);
            return (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedId(post.id)}
                className="flex w-full items-start gap-4 border-b border-pp-sand/70 px-4 py-3.5 text-left last:border-0 transition hover:bg-pp-mist/50"
              >
                <span className="w-[4.5rem] shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-[.08em] text-pp-stone">
                  {published ? formatBlogPostDate(post).replace(/,.*/, "") : "Draft"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-[17px] leading-6 tracking-[-.02em] text-pp-ink">
                    {blogPostTitle(post)}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-[12px] leading-5 text-pp-stone">
                    {blogPostExcerpt(post, 120) || "No story yet."}
                  </span>
                  {!published ? (
                    <span className="mt-2 inline-block rounded bg-pp-mist px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-pp-stone">
                      Hidden until titled
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-10 text-center">
          <div className="mx-auto grid size-10 place-items-center rounded-full bg-pp-mist text-lg">✎</div>
          <h2 className="mt-3 font-serif text-[18px] font-normal tracking-[-.02em] text-pp-ink">
            Write your first post
          </h2>
          <p className="mx-auto mt-1 max-w-[220px] text-xs leading-5 text-pp-stone">
            Market notes, neighborhood guides, and closing stories — in your voice, on every template.
          </p>
        </div>
      )}
    </div>
  );
}
