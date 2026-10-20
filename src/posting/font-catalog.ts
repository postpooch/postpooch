/**
 * Fonts offered by the PostPooch editor. Every family in this list is
 * self-hosted for the browser and bundled into the Trigger.dev renderer.
 */
export const POSTPOOCH_FONT_FAMILIES = [
  "Bebas Neue",
  "Cormorant Garamond",
  "DM Sans",
  "Inter",
  "Lato",
  "League Spartan",
  "Merriweather",
  "Montserrat",
  "Open Sans",
  "Oswald",
  "Playfair Display",
  "Poppins",
  "Raleway",
  "Roboto",
] as const;

export type PostPoochFontFamily = typeof POSTPOOCH_FONT_FAMILIES[number];

type FontSpec = {
  folder: string;
  fileStem: string;
  weights: readonly number[];
  italic: boolean;
};

export const POSTPOOCH_FONT_SPECS: Record<
  PostPoochFontFamily,
  FontSpec
> = {
  "Bebas Neue": {
    folder: "bebasneue",
    fileStem: "BebasNeue",
    weights: [400],
    italic: false,
  },
  "Cormorant Garamond": {
    folder: "cormorantgaramond",
    fileStem: "CormorantGaramond",
    weights: [300, 400, 500, 600, 700],
    italic: true,
  },
  "DM Sans": {
    folder: "dmsans",
    fileStem: "DMSans",
    weights: [400, 500, 700],
    italic: true,
  },
  Inter: {
    folder: "inter",
    fileStem: "Inter",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: true,
  },
  Lato: {
    folder: "lato",
    fileStem: "Lato",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: true,
  },
  "League Spartan": {
    folder: "leaguespartan",
    fileStem: "LeagueSpartan",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: false,
  },
  Merriweather: {
    folder: "merriweather",
    fileStem: "Merriweather",
    weights: [300, 400, 700, 900],
    italic: true,
  },
  Montserrat: {
    folder: "montserrat",
    fileStem: "Montserrat",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: true,
  },
  "Open Sans": {
    folder: "opensans",
    fileStem: "OpenSans",
    weights: [300, 400, 500, 600, 700, 800],
    italic: true,
  },
  Oswald: {
    folder: "oswald",
    fileStem: "Oswald",
    weights: [200, 300, 400, 500, 600, 700],
    italic: false,
  },
  "Playfair Display": {
    folder: "playfairdisplay",
    fileStem: "PlayfairDisplay",
    weights: [400, 700, 900],
    italic: true,
  },
  Poppins: {
    folder: "poppins",
    fileStem: "Poppins",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: true,
  },
  Raleway: {
    folder: "raleway",
    fileStem: "Raleway",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: true,
  },
  Roboto: {
    folder: "roboto",
    fileStem: "Roboto",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    italic: true,
  },
};

export type PostPoochFontSource = {
  path: string;
  weight: number;
  style: "normal" | "italic";
  cacheKey: string;
};

const staticWeightNames = new Map([
  [100, "Thin"],
  [200, "ExtraLight"],
  [300, "Light"],
  [400, "Regular"],
  [500, "Medium"],
  [600, "SemiBold"],
  [700, "Bold"],
  [800, "ExtraBold"],
  [900, "Black"],
]);

const browserFontLoads = new Map<string, Promise<void>>();

function numericWeight(weight: number | string): number {
  const parsed = typeof weight === "number"
    ? weight
    : weight === "normal"
    ? 400
    : weight === "bold"
    ? 700
    : Number(weight);

  if (!Number.isFinite(parsed)) {
    return 400;
  }

  return Math.min(900, Math.max(100, Math.round(parsed / 100) * 100));
}

function nearestWeight(requested: number, available: readonly number[]): number {
  return available.reduce((best, candidate) =>
    Math.abs(candidate - requested) < Math.abs(best - requested)
      ? candidate
      : best
  );
}

export function postPoochFontSource(
  family: PostPoochFontFamily,
  weight: number,
  style: "normal" | "italic",
): PostPoochFontSource {
  const spec = POSTPOOCH_FONT_SPECS[family];
  const actualWeight = nearestWeight(weight, spec.weights);
  const actualStyle = style === "italic" && spec.italic ? "italic" : "normal";
  const weightName = staticWeightNames.get(actualWeight) ?? "Regular";
  const fileStyle = actualStyle === "italic"
    ? weightName === "Regular"
      ? "Italic"
      : `${weightName}Italic`
    : weightName;
  return {
    path: `${spec.folder}/${spec.fileStem}-${fileStyle}.ttf`,
    weight: actualWeight,
    style: actualStyle,
    cacheKey: `${family}:${actualWeight}:${actualStyle}`,
  };
}

export async function loadPostPoochFont(
  family: PostPoochFontFamily,
  weight: number | string = 400,
  style: "normal" | "italic" = "normal",
): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }

  const normalizedWeight = numericWeight(weight);
  const source = postPoochFontSource(family, normalizedWeight, style);
  const existingLoad = browserFontLoads.get(source.cacheKey);
  if (existingLoad) {
    await existingLoad;
    return;
  }

  const load = (async () => {
    const face = new FontFace(
      family,
      `url("/fonts/${source.path}")`,
      {
        display: "swap",
        style: source.style,
        weight: String(source.weight),
      },
    );
    await face.load();
    document.fonts.add(face);

    const loaded = await document.fonts.load(
      `${style} ${normalizedWeight} 16px "${family}"`,
    );
    if (loaded.length === 0) {
      throw new Error(`PostPooch font "${family}" could not be loaded`);
    }
  })();

  browserFontLoads.set(source.cacheKey, load);
  try {
    await load;
  } catch (error) {
    browserFontLoads.delete(source.cacheKey);
    throw error;
  }
}
