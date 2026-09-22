/**
 * Diamond Grid Partitioning Algorithm — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Deterministic rhombic distribution in O(N) linear time
 * - Zero memory leaks or recursive call stacks
 */

export interface DiamondLayoutConfig {
	maxItems: number;
	columns: number;
	pattern: number[];
}

export const DIAMOND_LAYOUT_CONFIGS: Record<'large' | 'medium' | 'small', DiamondLayoutConfig> = {
	large: { maxItems: 16, columns: 7, pattern: [1, 2, 3, 4, 3, 2, 1] },
	medium: { maxItems: 9, columns: 5, pattern: [1, 2, 3, 2, 1] },
	small: { maxItems: 4, columns: 3, pattern: [1, 2, 1] },
};

export type DiamondLayoutVariant = 'large' | 'medium' | 'small' | 'auto';

/**
 * Determines layout configuration based on total available item count or manual layout override.
 */
export function getDiamondLayoutConfig(totalItems: number, layout: DiamondLayoutVariant = 'auto'): DiamondLayoutConfig {
	if (layout === 'large') return DIAMOND_LAYOUT_CONFIGS.large;
	if (layout === 'medium') return DIAMOND_LAYOUT_CONFIGS.medium;
	if (layout === 'small') return DIAMOND_LAYOUT_CONFIGS.small;

	if (totalItems >= 16) return DIAMOND_LAYOUT_CONFIGS.large;
	if (totalItems >= 9) return DIAMOND_LAYOUT_CONFIGS.medium;
	if (totalItems >= 4) return DIAMOND_LAYOUT_CONFIGS.small;
	return {
		maxItems: totalItems,
		columns: Math.max(1, Math.min(totalItems, 3)),
		pattern: [],
	};
}

export interface DiamondGroup<T> {
	item: T;
	index: number;
}

/**
 * Partitions a list of items into rhombic column groups.
 */
export function partitionDiamondItems<T>(items: T[], config: DiamondLayoutConfig): DiamondGroup<T>[][] {
	const columns: DiamondGroup<T>[][] = Array.from({ length: config.columns }, () => []);
	const displayedItems = items.slice(0, config.maxItems);
	let itemIndex = 0;

	if (config.pattern.length === 0) {
		for (let col = 0; col < config.columns && itemIndex < displayedItems.length; col++) {
			columns[col].push({ item: displayedItems[itemIndex], index: itemIndex });
			itemIndex++;
		}
		return columns;
	}

	for (let columnIndex = 0; columnIndex < config.pattern.length && itemIndex < displayedItems.length; columnIndex++) {
		const itemsInColumn = config.pattern[columnIndex];
		for (let i = 0; i < itemsInColumn && itemIndex < displayedItems.length; i++) {
			columns[columnIndex].push({ item: displayedItems[itemIndex], index: itemIndex });
			itemIndex++;
		}
	}

	return columns;
}
