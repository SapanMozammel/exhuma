import { describe, it, expect } from 'vitest';
import { VelocityRingBuffer, checkGestureSlop } from '../../packages/core/src/gestures/fsm';

describe('Exhuma Kinetic Methodology — Gesture FSM & Velocity Ring Buffer (Big-Omega)', () => {
	it('calculates velocity accurately using fixed 5-slot ring buffer', () => {
		const ring = new VelocityRingBuffer();

		// Simulate touch drag from x=0 to x=100 over 100ms
		ring.push(0, 0, 0);
		ring.push(25, 0, 25);
		ring.push(50, 0, 50);
		ring.push(75, 0, 75);
		ring.push(100, 0, 100);

		const vel = ring.computeVelocity();
		// 100px / 0.1s = 1000 px/s
		expect(vel.vx).toBeCloseTo(1000, 0);
		expect(vel.vy).toBe(0);
		expect(vel.speed).toBeCloseTo(1000, 0);
	});

	it('detects primary-axis horizontal slop and rejects vertical page scroll', () => {
		// Drag mainly horizontal: dx=20, dy=5 => angle = atan2(5, 20) = ~14 deg (< 30 deg)
		const horizontal = checkGestureSlop(20, 5, 'x');
		expect(horizontal.isClaimed).toBe(true);
		expect(horizontal.isRejected).toBe(false);

		// Drag mainly vertical: dx=5, dy=30 => angle = atan2(30, 5) = ~80 deg (> 30 deg)
		const vertical = checkGestureSlop(5, 30, 'x');
		expect(vertical.isClaimed).toBe(false);
		expect(vertical.isRejected).toBe(true);
	});

	it('ignores micro-movements within slop threshold (< 8px)', () => {
		const micro = checkGestureSlop(3, 4, 'x');
		expect(micro.isClaimed).toBe(false);
		expect(micro.isRejected).toBe(false);
	});
});

describe('Exhuma Kinetic Methodology — Circular Modulo Roving Index DSA', () => {
	it('wraps forward and backward navigation seamlessly', () => {
		const length = 4;
		const nextForward = (current: number) => (current + 1) % length;
		const nextBackward = (current: number) => (current - 1 + length) % length;

		expect(nextForward(0)).toBe(1);
		expect(nextForward(3)).toBe(0); // wrap to first

		expect(nextBackward(0)).toBe(3); // wrap to last
		expect(nextBackward(2)).toBe(1);
	});
});
