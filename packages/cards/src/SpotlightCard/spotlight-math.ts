/**
 * Exhuma Kinetic Methodology (EKM) — Spotlight Card Mathematics
 * O(1) coordinate normalization and radial illumination computation.
 */

export interface SpotlightCoordinates {
	x: number;
	y: number;
	normalizedX: number;
	normalizedY: number;
	isInside: boolean;
}

/**
 * Computes exact normalized coordinates relative to element bounding rect.
 */
export function calculateSpotlightCoordinates(clientX: number, clientY: number, rect: DOMRect | { left: number; top: number; width: number; height: number }): SpotlightCoordinates {
	const x = clientX - rect.left;
	const y = clientY - rect.top;

	const normalizedX = rect.width > 0 ? x / rect.width : 0;
	const normalizedY = rect.height > 0 ? y / rect.height : 0;

	const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

	return {
		x,
		y,
		normalizedX,
		normalizedY,
		isInside,
	};
}

/**
 * Constructs the radial illumination gradient string.
 */
export function generateSpotlightStyle(x: number, y: number, radius: number, color: string, opacity: number): string {
	return `radial-gradient(${radius}px circle at ${x}px ${y}px, ${color} 0%, transparent 100%)`;
}
