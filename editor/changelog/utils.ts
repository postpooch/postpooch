export type Change = { type: string; text: string };

export type Release = {
	version: string;
	title: string;
	summary?: string;
	date?: string;
	published?: boolean;
	changes: Change[];
};

const releases: Release[] = [
	{
		version: "0.3.0",
		title: "OpenCut Classic integrated",
		summary:
			"Video editing is powered by OpenCut Classic, embedded directly in postpooch.",
		date: "2026-09-05",
		published: true,
		changes: [
			{ type: "new", text: "Timeline, preview, and export from OpenCut Classic" },
			{ type: "new", text: "Projects stored locally in your browser" },
		],
	},
];

type ChangeSectionConfig = {
	title: string;
	order: number;
	collapsible?: boolean;
};

const knownSectionConfigs: Record<string, ChangeSectionConfig> = {
	new: { title: "Features", order: 0 },
	improved: { title: "Improvements", order: 1 },
	fixed: { title: "Fixes", order: 2 },
	breaking: { title: "Breaking Changes", order: 3 },
	technical: {
		title: "Technical details",
		order: 4,
		collapsible: true,
	},
};

function getSectionConfig({ type }: { type: string }): ChangeSectionConfig {
	return (
		knownSectionConfigs[type] ?? {
			title: type.charAt(0).toUpperCase() + type.slice(1),
			order: Number.MAX_SAFE_INTEGER,
		}
	);
}

export function getSectionTitle({ type }: { type: string }): string {
	return getSectionConfig({ type }).title;
}

export function isSectionCollapsible({ type }: { type: string }): boolean {
	return getSectionConfig({ type }).collapsible ?? false;
}

export function groupAndOrderChanges({ changes }: { changes: Change[] }) {
	const typeEncounterOrder = new Map<string, number>();
	const grouped = changes.reduce<Record<string, Change[]>>((acc, change) => {
		if (!typeEncounterOrder.has(change.type)) {
			typeEncounterOrder.set(change.type, typeEncounterOrder.size);
		}
		if (!acc[change.type]) acc[change.type] = [];
		acc[change.type].push(change);
		return acc;
	}, {});

	const orderedTypes = Object.keys(grouped).sort((left, right) => {
		const orderDifference =
			getSectionConfig({ type: left }).order -
			getSectionConfig({ type: right }).order;
		if (orderDifference !== 0) {
			return orderDifference;
		}
		return (
			(typeEncounterOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
			(typeEncounterOrder.get(right) ?? Number.MAX_SAFE_INTEGER)
		);
	});

	return { grouped, orderedTypes };
}

function isPublishedRelease({ published }: Release) {
	return published !== false;
}

export function getSortedReleases() {
	return releases
		.filter(isPublishedRelease)
		.sort((a, b) =>
			b.version.localeCompare(a.version, undefined, { numeric: true }),
		);
}

export function getReleaseByVersion({ version }: { version: string }) {
	return getSortedReleases().find((release) => release.version === version);
}
