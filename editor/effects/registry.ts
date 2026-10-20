import { DefinitionRegistry } from "@/editor/params/registry";
import type { EffectDefinition } from "@/editor/effects/types";

export class EffectsRegistry extends DefinitionRegistry<string, EffectDefinition> {
	constructor() {
		super("effect");
	}
}

export const effectsRegistry = new EffectsRegistry();
