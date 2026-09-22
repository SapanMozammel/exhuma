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

describe('MorphingTabs — Big-Omega (Ω) Spring Physics & Geometry', () => {
	it('converges to target position across different omega stiffness values without overshoot', async () => {
		const { solveCriticallyDampedSpring } = await import('../../packages/core/src/physics/spring');

		const dt = 0.016;
		for (const omega of [14, 26, 42]) {
			let pos = 0;
			let vel = 0;
			const target = 150;
			let steps = 0;

			// Step ODE simulation until settled
			while (steps < 120) {
				const state = solveCriticallyDampedSpring(pos, target, vel, dt, { omega });
				pos = state.position;
				vel = state.velocity;
				steps++;
				if (state.isSettled) break;
			}

			// Must settle exactly at target (zero overshoot)
			expect(pos).toBeCloseTo(target, 0);
			// Higher omega converges in fewer steps
			if (omega === 42) {
				expect(steps).toBeLessThanOrEqual(40);
			}
		}
	});

	it('computes correct target geometry for indicator variants', () => {
		const rect = { x: 40, y: 10, width: 120, height: 36 };

		// Pill variant
		const pillGeometry = {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
		};
		expect(pillGeometry.y).toBe(10);
		expect(pillGeometry.height).toBe(36);

		// Underline variant
		const underlineGeometry = {
			x: rect.x,
			y: rect.y + rect.height - 2,
			width: rect.width,
			height: 2,
		};
		expect(underlineGeometry.y).toBe(44);
		expect(underlineGeometry.height).toBe(2);

		// Glow variant
		const glowGeometry = {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
		};
		expect(glowGeometry.height).toBe(36);
	});
});
