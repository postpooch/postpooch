import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import path from "node:path";

import { createCanvas, registerFont } from "canvas";

const fontRoot = path.join(process.cwd(), "public", "fonts");
const families = {
  bebasneue: ["Bebas Neue", "BebasNeue", 1],
  cormorantgaramond: ["Cormorant Garamond", "CormorantGaramond", 10],
  dmsans: ["DM Sans", "DMSans", 6],
  inter: ["Inter", "Inter", 18],
  lato: ["Lato", "Lato", 18],
  leaguespartan: ["League Spartan", "LeagueSpartan", 9],
  merriweather: ["Merriweather", "Merriweather", 8],
  montserrat: ["Montserrat", "Montserrat", 18],
  opensans: ["Open Sans", "OpenSans", 12],
  oswald: ["Oswald", "Oswald", 6],
  playfairdisplay: ["Playfair Display", "PlayfairDisplay", 6],
  poppins: ["Poppins", "Poppins", 18],
  raleway: ["Raleway", "Raleway", 18],
  roboto: ["Roboto", "Roboto", 18],
};
const weightByName = {
  Thin: "100",
  ExtraLight: "200",
  Light: "300",
  Regular: "400",
  Medium: "500",
  SemiBold: "600",
  Bold: "700",
  ExtraBold: "800",
  Black: "900",
};

function fontFaceFromFile(file, family, stem) {
  let faceName = path.basename(file, ".ttf").slice(`${stem}-`.length);
  const italic = faceName.endsWith("Italic");
  if (italic) {
    faceName = faceName.slice(0, -"Italic".length) || "Regular";
  }
  const weight = weightByName[faceName];
  if (!weight) {
    throw new Error(`Cannot infer font weight from ${file}`);
  }
  return { family, weight, style: italic ? "italic" : "normal" };
}

function renderedHash(font) {
  const canvas = createCanvas(420, 90);
  const context = canvas.getContext("2d");
  context.fillStyle = "#111827";
  context.font =
    `${font.style} ${font.weight} 46px "${font.family}", sans-serif`;
  context.fillText("PostPooch 123", 4, 62);
  return createHash("sha256").update(canvas.toBuffer("raw")).digest("hex");
}

const registeredFaces = [];
for (const [folder, [family, stem, expectedCount]] of Object.entries(
  families,
)) {
  const directory = path.join(fontRoot, folder);
  const files = readdirSync(directory)
    .filter((file) => file.endsWith(".ttf") && !file.includes("-Variable"))
    .sort();
  if (files.length !== expectedCount) {
    throw new Error(
      `${family} has ${files.length} static font files; expected ${expectedCount}`,
    );
  }
  for (const file of files) {
    const face = fontFaceFromFile(file, family, stem);
    registerFont(path.join(directory, file), face);
    registeredFaces.push(face);
  }
}

for (const face of registeredFaces) {
  const actual = renderedHash(face);
  const fallback = renderedHash({ ...face, family: "sans-serif" });
  if (actual === fallback) {
    throw new Error(
      `${face.family} ${face.weight} ${face.style} rendered as sans-serif`,
    );
  }
}

for (const family of ["Noto Sans", "Noto Sans CJK JP", "Noto Color Emoji"]) {
  const match = execFileSync(
    "fc-match",
    ["-f", "%{family}", family],
    { encoding: "utf8" },
  );
  if (!match.toLowerCase().includes("noto")) {
    throw new Error(`${family} is not available through Fontconfig`);
  }
}

console.log(
  `Verified ${registeredFaces.length} PostPooch font faces and Noto fallbacks`,
);
