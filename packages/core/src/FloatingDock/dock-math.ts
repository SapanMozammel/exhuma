/**
 * Gaussian Proximity Distribution Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time O(1) analytical calculation
 * - Zero dynamic object allocation during rAF execution
 * - Smooth asymptotic decay to baseline scale
 */

/**
 * Calculates continuous Gaussian magnification multiplier based on distance.
 *
 * @param distance Absolute distance in pixels between pointer and item center |x - x0|
 * @param influenceRadius Standard deviation sigma (spread of the Gaussian bell)
 * @param maxMagnification Maximum scale increase factor A (e.g. 0.6 for 1.6x max scale)
 */
export function calculateGaussianScale(
	distance: number,
	influenceRadius: number = 70,
	maxMagnification: number = 0.6
): number {
	if (influenceRadius <= 0) return 1.0;
	const exponent = -(distance * distance) / (2 * influenceRadius * influenceRadius);
	return 1.0 + maxMagnification * Math.exp(exponent);
}

/**
 * Computes exact item width/height in pixels.
 */
export function calculateDockItemSize(
	distance: number,
	baseSize: number = 44,
	influenceRadius: number = 70,
	maxMagnification: number = 0.6
): number {
	return baseSize * calculateGaussianScale(distance, influenceRadius, maxMagnification);
}
