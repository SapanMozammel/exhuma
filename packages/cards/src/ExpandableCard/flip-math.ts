/**
 * FLIP (First, Last, Invert, Play) Mathematical Geometry Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) FLIP delta computation.
 * - Zero layout thrashing: geometry captured once at discrete state transition.
 */

export interface DOMRectSnapshot {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface FLIPDelta {
	dx: number;
	dy: number;
	scaleX: number;
	scaleY: number;
}

/**
 * Computes FLIP inverse delta transformation between First and Last rectangles.
 */
export function calculateFLIPDelta(first: DOMRectSnapshot, last: DOMRectSnapshot): FLIPDelta {
	const dx = first.left - last.left;
	const dy = first.top - last.top;
	const scaleX = last.width > 0 ? first.width / last.width : 1;
	const scaleY = last.height > 0 ? first.height / last.height : 1;

	return { dx, dy, scaleX, scaleY };
}

/**
 * Generates the inverted CSS transform string for instantaneous repositioning.
 */
export function generateInvertTransform(delta: FLIPDelta): string {
	return `translate3d(${delta.dx.toFixed(2)}px, ${delta.dy.toFixed(2)}px, 0) scale(${delta.scaleX.toFixed(4)}, ${delta.scaleY.toFixed(4)})`;
}
