/**
 * Marquee Mathematical Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) / O(1) Constant-time modulo translation
 * - Zero dynamic object allocation during rAF execution
 * - Frame-rate independent exponential velocity damping
 */

/**
 * Calculates continuous wrapped translation offset.
 *
 * @param currentOffset Current translation in pixels (typically negative for 'left')
 * @param deltaSeconds Time elapsed since last frame in seconds
 * @param speed Speed in pixels per second
 * @param direction 'left' translates towards negative x, 'right' towards positive x
 * @param contentWidth Total width of a single un-duplicated track
 */
export function calculateMarqueeOffset(
	currentOffset: number,
	deltaSeconds: number,
	speed: number,
	direction: 'left' | 'right',
	contentWidth: number
): number {
	if (contentWidth <= 0) return 0;

	const deltaMove = speed * deltaSeconds;
	let newOffset = currentOffset;

	if (direction === 'left') {
		newOffset -= deltaMove;
		// Modulo wrap when track has completely scrolled past
		if (newOffset <= -contentWidth) {
			newOffset = newOffset % contentWidth;
		}
	} else {
		newOffset += deltaMove;
		if (newOffset >= 0) {
			newOffset = -contentWidth + (newOffset % contentWidth);
		}
	}

	return newOffset;
}

/**
 * Frame-rate independent exponential velocity smoother.
 *
 * @param current Current kinetic factor [0..1]
 * @param target Target factor (0 when hovering, 1 when running)
 * @param lambda Smoothing factor (e.g. 10.0 for snappy deceleration)
 * @param dt Delta time in seconds
 */
export function dampFactor(
	current: number,
	target: number,
	lambda: number,
	dt: number
): number {
	return target + (current - target) * Math.exp(-lambda * dt);
}
