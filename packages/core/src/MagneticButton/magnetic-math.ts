/**
 * Magnetic Button Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) vector pull calculation.
 * - Zero heap allocations per frame: static return coordinates.
 */

export interface MagneticCoordinates {
	x: number;
	y: number;
	distance: number;
	isInside: boolean;
}

/**
 * Calculates inverted spring magnetic pull displacement.
 * When pointer is within radius R of center:
 *   displacement = (pointer - center) * strength * (1 - distance / R)
 */
export function calculateMagneticPull(pointerX: number, pointerY: number, centerX: number, centerY: number, radius: number, strength: number = 0.4): MagneticCoordinates {
	const dx = pointerX - centerX;
	const dy = pointerY - centerY;
	const distance = Math.hypot(dx, dy);

	if (distance > radius || radius <= 0) {
		return { x: 0, y: 0, distance, isInside: false };
	}

	const attenuation = 1 - distance / radius;
	const pullX = dx * strength * attenuation;
	const pullY = dy * strength * attenuation;

	return {
		x: pullX,
		y: pullY,
		distance,
		isInside: true,
	};
}
