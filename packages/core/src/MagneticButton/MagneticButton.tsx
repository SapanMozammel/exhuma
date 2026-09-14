'use client';

import React, { useRef, useEffect, useCallback, memo, type ButtonHTMLAttributes } from 'react';
import { calculateMagneticPull } from './magnetic-math';
import { damp } from '../physics/lerp';

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	strength?: number;
	radius?: number;
	springDamping?: number;
	asChild?: boolean;
}

/**
 * MagneticButton — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Handcrafted inverted spring pull field (ZERO Framer Motion).
 * - 120Hz rAF continuous transform writes directly to element style.
 * - Zero React state updates / zero VDOM re-renders during cursor tracking.
 * - Critically damped spring return on pointer leave.
 */
export const MagneticButton = memo<MagneticButtonProps>(({
	children,
	strength = 0.35,
	radius = 120,
	springDamping = 18,
	className = '',
	style,
	...props
}) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const isHoveredRef = useRef<boolean>(false);
	const rafIdRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);

	const updateLoop = useCallback((timestamp: number) => {
		if (!lastTimeRef.current) lastTimeRef.current = timestamp;
		const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
		lastTimeRef.current = timestamp;

		const current = currentRef.current;
		const target = targetRef.current;

		// Damp current coordinates toward target
		current.x = damp(current.x, target.x, springDamping, dt);
		current.y = damp(current.y, target.y, springDamping, dt);

		if (buttonRef.current) {
			buttonRef.current.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
		}

		// Keep running if moving or hovered
		const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
		if (isHoveredRef.current || distToTarget > 0.1) {
			rafIdRef.current = requestAnimationFrame(updateLoop);
		} else {
			current.x = 0;
			current.y = 0;
			if (buttonRef.current) {
				buttonRef.current.style.transform = 'translate3d(0, 0, 0)';
			}
			rafIdRef.current = null;
			lastTimeRef.current = 0;
		}
	}, [springDamping]);

	const startRafIfNeeded = useCallback(() => {
		if (!rafIdRef.current) {
			lastTimeRef.current = 0;
			rafIdRef.current = requestAnimationFrame(updateLoop);
		}
	}, [updateLoop]);

	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
		const el = buttonRef.current;
		if (!el) return;

		const rect = el.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const result = calculateMagneticPull(
			e.clientX,
			e.clientY,
			centerX,
			centerY,
			radius,
			strength
		);

		targetRef.current.x = result.x;
		targetRef.current.y = result.y;
		isHoveredRef.current = true;
		startRafIfNeeded();
	}, [radius, strength, startRafIfNeeded]);

	const handlePointerLeave = useCallback(() => {
		isHoveredRef.current = false;
		targetRef.current.x = 0;
		targetRef.current.y = 0;
		startRafIfNeeded();
	}, [startRafIfNeeded]);

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	return (
		<button
			ref={buttonRef}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			className={className}
			style={{
				willChange: 'transform',
				...style,
			}}
			{...props}
		>
			{children}
		</button>
	);
});

MagneticButton.displayName = 'MagneticButton';
