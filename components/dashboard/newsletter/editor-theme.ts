/**
 * Moderate PostPooch tuning for Templatical (chrome CSS lives on `.pp-templatical-host`).
 * Keep hex presets in sync with `app/globals.css` brand tokens.
 */

/** Brand swatches offered in every Templatical color picker. */
export const NEWSLETTER_COLOR_PRESETS = [
  "#241914", // ink
  "#746c67", // stone
  "#256f68", // teal
  "#1e5a55", // teal-dark
  "#356f8f", // blue
  "#9b5c35", // cocoa
  "#c9824f", // caramel
  "#b9483a", // coral
  "#ead9c8", // sand
  "#fff7ef", // cream
  "#ffffff", // white
] as const;

/** Soft document defaults so new emails read as PostPooch without locking authors in. */
export const NEWSLETTER_TEMPLATE_DEFAULTS = {
  backgroundColor: "#f5f2ef", // mist — warm canvas behind the email body
  textColor: "#241914", // ink
  linkColor: "#256f68", // teal
  fontFamily: "Inter, system-ui, sans-serif",
} as const;

export const NEWSLETTER_BLOCK_DEFAULTS = {
  button: {
    backgroundColor: "#256f68",
    textColor: "#ffffff",
    borderRadius: 10,
  },
  title: {
    color: "#241914",
  },
  divider: {
    color: "#ead9c8",
  },
} as const;
