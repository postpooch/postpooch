import type { ContextSnapshot, HandleMaps, ImageCandidate } from "./contracts";

export function createHandleMaps(snapshot: ContextSnapshot): HandleMaps {
  const temporaryByHandle = new Map<
    `TEMP_${number}`,
    ContextSnapshot["activeTemporaryInstructions"][number]
  >();
  const temporaryHandleById = new Map<string, `TEMP_${number}`>();
  snapshot.activeTemporaryInstructions.forEach((instruction, index) => {
    const handle = `TEMP_${index + 1}` as const;
    temporaryByHandle.set(handle, instruction);
    temporaryHandleById.set(instruction.id, handle);
  });

  const imageByHandle = new Map<`IMAGE_${number}`, ImageCandidate>();
  const imageHandleByAssetId = new Map<string, `IMAGE_${number}`>();
  return {
    temporaryByHandle,
    temporaryHandleById,
    imageByHandle,
    imageHandleByAssetId,
  };
}

export function addCandidate(
  maps: HandleMaps,
  candidate: Omit<ImageCandidate, "handle">,
): ImageCandidate {
  if (candidate.durableSource.source === "user_asset") {
    const existing = maps.imageHandleByAssetId.get(candidate.durableSource.assetId);
    if (existing) return maps.imageByHandle.get(existing)!;
  }

  const handle = `IMAGE_${maps.imageByHandle.size + 1}` as const;
  const withHandle = { ...candidate, handle } as ImageCandidate;
  maps.imageByHandle.set(handle, withHandle);
  if (candidate.durableSource.source === "user_asset") {
    maps.imageHandleByAssetId.set(candidate.durableSource.assetId, handle);
  }
  return withHandle;
}

export function resolveSuppliedHandles<T extends string>(
  values: readonly T[],
  supplied: ReadonlyMap<T, unknown>,
  label: string,
): void {
  for (const value of values) {
    if (!supplied.has(value)) throw new Error(`Unknown ${label} handle: ${value}`);
  }
}
