/**
 * Card Swipe Stack Mathematical Kernel & Gesture Ring Buffer
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) transform and swipe decision math.
 * - Zero heap allocations: Float64Array circular ring buffer for velocity tracking.
 */

export interface SwipeDecision {
	isDismissed: boolean;
	direction: 'left' | 'right' | null;
}

/**
 * Pre-allocated 5-sample circular ring buffer for O(1) velocity estimation.
 * Format: [x0, y0, t0, x1, y1, t1, x2, y2, t2, x3, y3, t3, x4, y4, t4]
 */
export class SwipeVelocityRingBuffer {
	private readonly data = new Float64Array(15);
	private count = 0;
	private head = 0;

	public clear(): void {
		this.count = 0;
		this.head = 0;
		this.data.fill(0);
	}

	public push(x: number, y: number, time: number): void {
		const offset = this.head * 3;
		this.data[offset] = x;
		this.data[offset + 1] = y;
		this.data[offset + 2] = time;

		this.head = (this.head + 1) % 5;
		if (this.count < 5) {
			this.count++;
		}
	}

	public computeVelocityX(): number {
		if (this.count < 2) return 0;
		const newestIdx = (this.head - 1 + 5) % 5;
		const oldestIdx = (this.head - this.count + 5) % 5;

		const dx = this.data[newestIdx * 3] - this.data[oldestIdx * 3];
		const dt = (this.data[newestIdx * 3 + 2] - this.data[oldestIdx * 3 + 2]) / 1000;

		if (dt <= 0.0001) return 0;
		return dx / dt;
	}
}

/**
 * Calculates card rotation angle in degrees coupled to horizontal displacement.
 */
export function calculateCardRotation(
	dx: number,
	maxRotation: number = 22,
	threshold: number = 180
): number {
	const ratio = Math.max(-1, Math.min(1, dx / threshold));
	return ratio * maxRotation;
}

/**
 * Evaluates whether a gesture qualifies as a dismiss swipe based on distance or velocity.
 */
export function evaluateSwipeDecision(
	dx: number,
	velocity: number,
	thresholdDistance: number = 120,
	thresholdVelocity: number = 550
): SwipeDecision {
	if (dx > thresholdDistance || velocity > thresholdVelocity) {
		return { isDismissed: true, direction: 'right' };
	}
	if (dx < -thresholdDistance || velocity < -thresholdVelocity) {
		return { isDismissed: true, direction: 'left' };
	}
	return { isDismissed: false, direction: null };
}

/**
 * Calculates scale and translation for background cards in stack during drag progress.
 */
export function calculateStackedCardTransform(
	index: number,
	progress: number,
	scaleStep: number = 0.05,
	offsetStep: number = 12
): { scale: number; translateY: number; opacity: number } {
	// Base values at rest
	const baseScale = Math.max(0.7, 1 - index * scaleStep);
	const baseOffset = index * offsetStep;
	const baseOpacity = Math.max(0.4, 1 - index * 0.15);

	// Interpolate towards the position of card (index - 1) as top card is swiped away
	const targetScale = Math.max(0.7, 1 - (index - 1) * scaleStep);
	const targetOffset = Math.max(0, (index - 1) * offsetStep);
	const targetOpacity = Math.max(0.4, 1 - (index - 1) * 0.15);

	const clampedProgress = Math.min(1, Math.max(0, progress));

	return {
		scale: baseScale + (targetScale - baseScale) * clampedProgress,
		translateY: baseOffset + (targetOffset - baseOffset) * clampedProgress,
		opacity: baseOpacity + (targetOpacity - baseOpacity) * clampedProgress,
	};
}
