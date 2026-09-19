import { describe, it, expect } from 'vitest';
import {
	calculateMarqueeOffset,
	dampFactor,
} from '../../packages/layouts/src/InfiniteMarquee/marquee-math';
import {
	getDiamondLayoutConfig,
	partitionDiamondItems,
} from '../../packages/layouts/src/DiamondGrid/diamond-layout';
import {
	generateTimelinePath,
	checkTimelineDirection,
} from '../../packages/layouts/src/ScrollTimeline/timeline-path';

describe('Exhuma Kinetic Methodology — Marquee Mathematical Kernel', () => {
	it('translates leftward and wraps with modulo arithmetic when offset exceeds width', () => {
		const contentWidth = 1000;
		const speed = 100; // 100 px/sec
		const dt = 0.5; // 0.5 sec -> moves 50px

		// Initial step
		const offset1 = calculateMarqueeOffset(0, dt, speed, 'left', contentWidth);
		expect(offset1).toBe(-50);

		// Step right before boundary
		const offset2 = calculateMarqueeOffset(-980, dt, speed, 'left', contentWidth);
		// -980 - 50 = -1030 <= -1000 -> wraps to -30
		expect(offset2).toBe(-30);
	});

	it('translates rightward and wraps when offset exceeds zero', () => {
		const contentWidth = 1000;
		const speed = 100;
		const dt = 0.5;

		const offset1 = calculateMarqueeOffset(-500, dt, speed, 'right', contentWidth);
		expect(offset1).toBe(-450);

		// Wraps when reaching or crossing 0
		const offset2 = calculateMarqueeOffset(-20, dt, speed, 'right', contentWidth);
		// -20 + 50 = +30 >= 0 -> wraps to -1000 + 30 = -970
		expect(offset2).toBe(-970);
	});

	it('handles zero content width without division by zero', () => {
		const offset = calculateMarqueeOffset(0, 0.016, 50, 'left', 0);
		expect(offset).toBe(0);
	});

	it('smoothly damps velocity factor during hover deceleration and acceleration', () => {
		let factor = 1.0;
		const target = 0.0;
		const lambda = 12.0;
		const dt = 0.016;

		// Deceleration towards 0
		for (let i = 0; i < 30; i++) {
			factor = dampFactor(factor, target, lambda, dt);
		}
		expect(factor).toBeLessThan(0.01);

		// Acceleration back to 1.0
		for (let i = 0; i < 30; i++) {
			factor = dampFactor(factor, 1.0, lambda, dt);
		}
		expect(factor).toBeGreaterThan(0.99);
	});
});

describe('Exhuma Kinetic Methodology — Diamond Grid Mathematical Partitioning', () => {
	it('selects 7-column rhombic pattern [1, 2, 3, 4, 3, 2, 1] for large sets (>= 16)', () => {
		const config = getDiamondLayoutConfig(20);
		expect(config.columns).toBe(7);
		expect(config.pattern).toEqual([1, 2, 3, 4, 3, 2, 1]);
		expect(config.maxItems).toBe(16);

		const items = Array.from({ length: 20 }, (_, i) => `item-${i}`);
		const partitioned = partitionDiamondItems(items, config);

		expect(partitioned.length).toBe(7);
		expect(partitioned[0].length).toBe(1); // column 0
		expect(partitioned[1].length).toBe(2); // column 1
		expect(partitioned[2].length).toBe(3); // column 2
		expect(partitioned[3].length).toBe(4); // column 3 (apex)
		expect(partitioned[4].length).toBe(3); // column 4
		expect(partitioned[5].length).toBe(2); // column 5
		expect(partitioned[6].length).toBe(1); // column 6
	});

	it('selects 5-column rhombic pattern [1, 2, 3, 2, 1] for medium sets (9..15)', () => {
		const config = getDiamondLayoutConfig(12);
		expect(config.columns).toBe(5);
		expect(config.pattern).toEqual([1, 2, 3, 2, 1]);
		expect(config.maxItems).toBe(9);

		const items = Array.from({ length: 12 }, (_, i) => `item-${i}`);
		const partitioned = partitionDiamondItems(items, config);
		expect(partitioned.length).toBe(5);
		expect(partitioned[2].length).toBe(3); // apex
	});

	it('selects 3-column rhombic pattern [1, 2, 1] for small sets (4..8)', () => {
		const config = getDiamondLayoutConfig(6);
		expect(config.columns).toBe(3);
		expect(config.pattern).toEqual([1, 2, 1]);

		const items = Array.from({ length: 6 }, (_, i) => `item-${i}`);
		const partitioned = partitionDiamondItems(items, config);
		expect(partitioned.length).toBe(3);
		expect(partitioned[1].length).toBe(2); // apex
	});

	it('handles fallback gracefully when items < 4', () => {
		const config = getDiamondLayoutConfig(2);
		expect(config.columns).toBe(2);
		expect(config.pattern).toEqual([]);
	});
});

describe('Exhuma Kinetic Methodology — Serpentine Timeline Bezier Kernel', () => {
	it('returns empty path string when nodes are fewer than 2', () => {
		expect(generateTimelinePath([])).toBe('');
		expect(generateTimelinePath([100])).toBe('');
	});

	it('generates continuous cubic bezier SVG path connecting alternating nodes', () => {
		const heights = [50, 150, 250, 350];
		const path = generateTimelinePath(heights, 42, 20, 40);

		expect(path.startsWith('M 0,92')).toBe(true);
		expect(path).toContain('C 0,');
		expect(path).toContain('L 0,192');
		expect(path).toContain('L 0,292');
		expect(path).toContain('L 0,392');
	});

	it('alternates direction correctly for even and odd indices', () => {
		expect(checkTimelineDirection(0)).toBe(false); // right
		expect(checkTimelineDirection(1)).toBe(true);  // left
		expect(checkTimelineDirection(2)).toBe(false); // right
		expect(checkTimelineDirection(3)).toBe(true);  // left
	});
});
