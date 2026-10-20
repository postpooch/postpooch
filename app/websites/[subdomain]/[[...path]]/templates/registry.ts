import { ardenRouter } from "./arden/router";
import { atelierRouter } from "./atelier/router";
import { aureliaRouter } from "./aurelia/router";
import { averyRouter } from "./avery/router";
import { coastalRouter } from "./coastal/router";
import { elenaRouter } from "./elena/router";
import { harborRouter } from "./harbor/router";
import { luxuryRouter } from "./luxury/router";
import { maraRouter } from "./mara/router";
import { milaRouter } from "./mila/router";
import { nathanRouter } from "./nathan/router";
import { northpineRouter } from "./northpine/router";
import { reyRouter } from "./rey/router";
import { rowanRouter } from "./rowan/router";
import { roweRouter } from "./rowe/router";
import { sloaneRouter } from "./sloane/router";
import type { TemplateRouter } from "./types";
import { valeRouter } from "./vale/router";
import { vossRouter } from "./voss/router";

/**
 * The only executable template registry. The tenant runtime, editor preview,
 * and publishing API all use these exact router instances.
 */
export const TEMPLATE_REGISTRY: Readonly<Record<string, TemplateRouter>> = {
  arden: ardenRouter,
  atelier: atelierRouter,
  aurelia: aureliaRouter,
  avery: averyRouter,
  coastal: coastalRouter,
  elena: elenaRouter,
  harbor: harborRouter,
  luxury: luxuryRouter,
  mara: maraRouter,
  mila: milaRouter,
  nathan: nathanRouter,
  northpine: northpineRouter,
  rey: reyRouter,
  rowan: rowanRouter,
  rowe: roweRouter,
  sloane: sloaneRouter,
  vale: valeRouter,
  voss: vossRouter,
};

export function getTemplateRouter(template: string): TemplateRouter | undefined {
  return TEMPLATE_REGISTRY[template];
}
