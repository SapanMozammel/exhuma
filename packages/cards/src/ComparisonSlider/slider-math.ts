/**
 * Comparison Slider Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) split-ratio clamping and polygon clipping math.
 * - Zero allocations in active tracking loop.
 */

/**
 * Calculates normalized split ratio p in [0, 1] from pointer coordinate.
 */
export function calculateSplitPosition(
	clientX: number,
	containerLeft: number,
	containerWidth: number
): number {
	if (containerWidth <= 0) return 0.5;
	const raw = (clientX - containerLeft) / containerWidth;
	return Math.max(0, Math.min(1, raw));
}

/**
 * Generates CSS clip-path polygon for the overlaid 'before' layer.
 */
export function generateClipPath(position: number): string {
	const pct = (position * 100).toFixed(3);
	return `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
}

/**
 * Steps position forward or backward by a delta step.
 */
export function stepSliderPosition(current: number, delta: number): number {
	return Math.max(0, Math.min(1, current + delta));
}
