import type { RetimeConfig } from "@/editor/timeline";
import { clampRetimeRate } from "@/editor/retime/rate";

export function buildConstantRetime({
	rate,
	maintainPitch = false,
}: {
	rate: number;
	maintainPitch?: boolean;
}): RetimeConfig {
	return { rate: clampRetimeRate({ rate }), maintainPitch };
}
