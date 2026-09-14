/**
 * Serpentine Cubic Bezier Path Generator — Exhuma Kinetic Methodology (EKM)
 * Elevated from sapan.dev
 *
 * Big-Omega (Ω) Guarantees:
 * - Deterministic O(N) path construction
 * - Zero external animation libraries (Zero Framer Motion)
 */

export const checkTimelineDirection = (index: number): boolean => index % 2 !== 0;

/**
 * Generates an alternating serpentine SVG path connecting timeline nodes.
 *
 * @param heights Array of vertical offsets (in pixels) for each timeline node
 * @param startY Initial vertical offset
 * @param curveWidth Horizontal amplitude of bezier swing (default: 20)
 * @param curveHeight Vertical transition height (default: 40)
 */
export function generateTimelinePath(
	heights: number[],
	startY: number = 42,
	curveWidth: number = 20,
	curveHeight: number = 40
): string {
	if (heights.length < 2) {
		return '';
	}

	let result = `M 0,${heights[0] + startY} `;

	for (let i = 0; i < heights.length - 1; i++) {
		const currentY = heights[i] + startY;
		const nextY = heights[i + 1] + startY;
		const isLeft = checkTimelineDirection(i);

		const side = isLeft ? -curveWidth : curveWidth;

		const startCurveY = currentY + 15;
		result += `L 0,${startCurveY} `;

		const endCurveOutY = startCurveY + curveHeight;
		result += `C 0,${startCurveY + curveHeight * 0.4} ${side},${startCurveY + curveHeight * 0.6} ${side},${endCurveOutY} `;

		const startCurveBackY = nextY - curveHeight - 15;
		if (startCurveBackY > endCurveOutY) {
			result += `L ${side},${startCurveBackY} `;
		}

		const backStartY = Math.max(endCurveOutY, startCurveBackY);
		const endCurveBackY = nextY - 15;
		result += `C ${side},${backStartY + curveHeight * 0.4} 0,${endCurveBackY - curveHeight * 0.6} 0,${endCurveBackY} `;

		result += `L 0,${nextY} `;
	}

	return result;
}
