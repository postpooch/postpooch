import type { SnapPoint } from "@/editor/timeline/snapping";
import type { MediaTime } from "@/editor/wasm";

export function getPlayheadSnapPoints({
	playheadTime,
}: {
	playheadTime: MediaTime;
}): SnapPoint[] {
	return [{ time: playheadTime, type: "playhead" }];
}
