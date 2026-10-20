"use client";

import type { CSSProperties, ChangeEvent } from "react";
import { useMemo, useState } from "react";

type BrandStudioProps = {
  initialName: string;
  initialTitle: string;
  initialMarket: string;
  initialInk: string;
  initialPaper: string;
  initialAccent: string;
  initialDisplay: string;
  heroImage: string;
};

export function BrandStudio({
  initialName,
  initialTitle,
  initialMarket,
  initialInk,
  initialPaper,
  initialAccent,
  initialDisplay,
  heroImage,
}: BrandStudioProps) {
  const [form, setForm] = useState({
    name: initialName,
    title: initialTitle,
    market: initialMarket,
    primary: initialInk,
    background: initialPaper,
    accent: initialAccent,
    display: initialDisplay,
  });

  const style = useMemo(
    () =>
      ({
        "--studio-ink": form.primary,
        "--studio-paper": form.background,
        "--studio-accent": form.accent,
        "--studio-display": form.display,
      }) as CSSProperties,
    [form],
  );

  const set =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((old) => ({ ...old, [key]: e.target.value }));

  const download = () => {
    const payload = {
      realtor: { name: form.name, title: form.title, market: form.market },
      brand: {
        colors: { ink: form.primary, paper: form.background, accent: form.accent },
        typography: { display: form.display },
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="studio-shell" style={style}>
      <aside className="studio-panel">
        <p className="eyebrow">TEMPLATE CONTROLS</p>
        <h1>Brand Studio</h1>
        <p>
          Use this working preview to choose a direction, then copy the exported
          values into website settings or save the same shape in your database.
        </p>
        <label>
          Realtor or Team Name
          <input value={form.name} onChange={set("name")} />
        </label>
        <label>
          Professional Title
          <input value={form.title} onChange={set("title")} />
        </label>
        <label>
          Primary Market
          <input value={form.market} onChange={set("market")} />
        </label>
        <div className="color-grid">
          <label>
            Ink
            <input type="color" value={form.primary} onChange={set("primary")} />
          </label>
          <label>
            Background
            <input
              type="color"
              value={form.background}
              onChange={set("background")}
            />
          </label>
          <label>
            Accent
            <input type="color" value={form.accent} onChange={set("accent")} />
          </label>
        </div>
        <label>
          Display Typeface
          <select value={form.display} onChange={set("display")}>
            <option value="Georgia, 'Times New Roman', serif">Classic Serif</option>
            <option value="'Times New Roman', Times, serif">Editorial Serif</option>
            <option value="Arial, Helvetica, sans-serif">Modern Sans</option>
          </select>
        </label>
        <button className="button" type="button" onClick={download}>
          Export JSON
        </button>
      </aside>
      <main className="studio-preview">
        <div className="studio-nav">
          <strong>{form.name}</strong>
          <span>ABOUT &nbsp; PROPERTIES &nbsp; COMMUNITIES</span>
          <button type="button">LET&apos;S CONNECT</button>
        </div>
        <div className="studio-hero">
          <img src={heroImage} alt="Luxury home" />
          <div>
            <small>{form.market.toUpperCase()} REAL ESTATE</small>
            <h2>
              Extraordinary homes.
              <br />
              Thoughtfully represented.
            </h2>
            <p>
              {form.name} · {form.title}
            </p>
            <button type="button">EXPLORE PROPERTIES</button>
          </div>
        </div>
        <div className="studio-copy">
          <small>PERSONAL REPRESENTATION</small>
          <h2>
            A refined point of view,
            <br />
            made entirely your own.
          </h2>
          <p>
            This preview demonstrates how one configuration object can control
            the visual identity across every page type.
          </p>
        </div>
      </main>
    </div>
  );
}
