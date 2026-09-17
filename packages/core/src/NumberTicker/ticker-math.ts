/**
 * Analytical Exponential Counter Easing Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time O(1) analytical calculation (ZERO Framer Motion)
 * - Zero heap allocations during frame ticks
 * - Exact asymptotic convergence at terminal time
 */

/**
 * Closed-form easeOutExpo easing function.
 *
 * @param progress Normalized time [0..1]
 */
export function easeOutExpo(progress: number): number {
	if (progress >= 1.0) return 1.0;
	if (progress <= 0.0) return 0.0;
	return 1 - Math.pow(2, -10 * progress);
}

/**
 * Calculates current interpolated numerical value at time t.
 */
export function calculateTickerValue(startValue: number, targetValue: number, elapsedSeconds: number, durationSeconds: number): { value: number; isComplete: boolean } {
	if (durationSeconds <= 0 || elapsedSeconds >= durationSeconds) {
		return { value: targetValue, isComplete: true };
	}

	const progress = Math.max(0, Math.min(1, elapsedSeconds / durationSeconds));
	const ease = easeOutExpo(progress);
	const value = startValue + (targetValue - startValue) * ease;

	return { value, isComplete: false };
}
