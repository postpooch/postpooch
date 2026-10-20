import { useEffect, useState } from "react";
import { useCommittedRef } from "@/editor/hooks/use-committed-ref";
import { useSelectionContext } from "@/editor/selection/context";
import { activateScope, type ScopeEntry } from "@/editor/selection/scope";

export function useSelectionScope() {
	const { selectedIds, clearSelection } = useSelectionContext();
	const hasSelection = selectedIds.length > 0;
	const hasSelectionRef = useCommittedRef(hasSelection);
	const clearSelectionRef = useCommittedRef(clearSelection);
	const [entry] = useState<ScopeEntry>(() => ({
		hasSelection: () => hasSelectionRef.current,
		clear: () => {
			clearSelectionRef.current();
		},
	}));

	useEffect(() => {
		if (!hasSelection) {
			return;
		}

		return activateScope({ entry });
	}, [entry, hasSelection]);
}
