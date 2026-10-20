import type { StickerProvider } from "@/editor/stickers/types";
import { DefinitionRegistry } from "@/editor/params/registry";

export class StickersRegistry extends DefinitionRegistry<string, StickerProvider> {
	constructor() {
		super("sticker provider");
	}
}

export const stickersRegistry = new StickersRegistry();
