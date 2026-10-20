import type { FabricObject } from "fabric";

export type ToolId =
  | "design"
  | "uploads"
  | "text"
  | "elements"
  | "brand"
  | "layers";

export type CanvasSize = {
  width: number;
  height: number;
  label: string;
};

export type EditorObject = FabricObject & {
  fill?: unknown;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  opacity?: number;
  text?: string;
  textAlign?: string;
};

export type SelectionState = {
  fill: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  kind: string;
  opacity: number;
  textAlign: string;
};

export type QueueItem = {
  id: string;
  name: string;
  platforms: string[];
  scheduledAt: string;
  status: "next" | "queued" | "scheduled";
};

export const BRAND_COLORS = [
  "#241914",
  "#256F68",
  "#356F8F",
  "#F6B177",
  "#C9824F",
  "#FFF7EF",
  "#FFFFFF",
];

export const CANVAS_PRESETS: CanvasSize[] = [
  { width: 1080, height: 1080, label: "Instagram square" },
  { width: 1080, height: 1350, label: "Instagram portrait" },
  { width: 1080, height: 1920, label: "Story & Reel" },
  { width: 1200, height: 630, label: "Facebook landscape" },
];

export const DEFAULT_SELECTION: SelectionState = {
  fill: "#241914",
  fontFamily: "Inter",
  fontSize: 32,
  fontWeight: "400",
  kind: "",
  opacity: 1,
  textAlign: "left",
};
