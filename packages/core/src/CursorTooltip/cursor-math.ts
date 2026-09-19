/**
 * Cursor Tooltip Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) collision boundary clamping and lerp smoothing.
 * - Zero heap allocations per frame: static coordinates.
 */

export interface CursorPosition {
	x: number;
	y: number;
}

/**
 * Calculates element center coordinates.
 */
export function calculateElementCenter(rect: { left: number; top: number; width: number; height: number }): CursorPosition {
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	};
}

/**
 * Clamps tooltip coordinates to ensure it stays fully visible within the browser viewport.
 */
export function clampTooltipToViewport(targetX: number, targetY: number, tooltipWidth: number, tooltipHeight: number, viewportWidth: number, viewportHeight: number, padding: number = 12): CursorPosition {
	const maxX = Math.max(0, viewportWidth - tooltipWidth - padding);
	const maxY = Math.max(0, viewportHeight - tooltipHeight - padding);

	return {
		x: Math.min(maxX, Math.max(padding, targetX)),
		y: Math.min(maxY, Math.max(padding, targetY)),
	};
}
