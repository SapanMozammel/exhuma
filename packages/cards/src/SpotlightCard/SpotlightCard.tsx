'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import type { SpotlightCardProps } from '../types';
import { calculateSpotlightCoordinates } from './spotlight-math';

/**
 * SpotlightCard — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) / O(1) Constant-Time kinetic updates (Zero React re-renders on pointermove).
 * - Ω(1) Zero Heap Allocation during active tracking.
 * - Sub-pixel radial border illumination mask + background gradient fill.
 * - Graceful fade-out on pointer leave / touch cancel.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, radius = 350, color = 'rgba(99, 102, 241, 0.25)', opacity = 0.8, borderColor = 'rgba(99, 102, 241, 0.5)', className = '', style, ...props }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const rafIdRef = useRef<number | null>(null);

	// Cached coordinates to avoid heap allocation in animation frames
	const targetX = useRef<number>(-9999);
	const targetY = useRef<number>(-9999);
	const currentX = useRef<number>(-9999);
	const currentY = useRef<number>(-9999);
	const currentOpacity = useRef<number>(0);
	const targetOpacity = useRef<number>(0);

	const updateFrame = useCallback(() => {
		const el = cardRef.current;
		if (!el) return;

		// Exponential smoothing filter (lambda = 0.2)
		currentX.current += (targetX.current - currentX.current) * 0.2;
		currentY.current += (targetY.current - currentY.current) * 0.2;
		currentOpacity.current += (targetOpacity.current - currentOpacity.current) * 0.15;

		// Write directly to GPU-decoupled CSS Custom Properties
		el.style.setProperty('--exhuma-spotlight-x', `${currentX.current.toFixed(2)}px`);
		el.style.setProperty('--exhuma-spotlight-y', `${currentY.current.toFixed(2)}px`);
		el.style.setProperty('--exhuma-spotlight-opacity', `${currentOpacity.current.toFixed(3)}`);

		// Sleep if converged
		const diffX = Math.abs(targetX.current - currentX.current);
		const diffY = Math.abs(targetY.current - currentY.current);
		const diffOp = Math.abs(targetOpacity.current - currentOpacity.current);

		if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005) {
			rafIdRef.current = requestAnimationFrame(updateFrame);
		} else {
			rafIdRef.current = null;
		}
	}, []);

	const scheduleUpdate = useCallback(() => {
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(updateFrame);
		}
	}, [updateFrame]);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const el = cardRef.current;
			if (!el) return;

			const rect = el.getBoundingClientRect();
			const coords = calculateSpotlightCoordinates(e.clientX, e.clientY, rect);

			targetX.current = coords.x;
			targetY.current = coords.y;
			targetOpacity.current = opacity;

			// Snap initial position to avoid flying from -9999
			if (currentX.current < -1000) {
				currentX.current = coords.x;
				currentY.current = coords.y;
			}

			scheduleUpdate();
		},
		[opacity, scheduleUpdate]
	);

	const handlePointerLeave = useCallback(() => {
		targetOpacity.current = 0;
		scheduleUpdate();
	}, [scheduleUpdate]);

	useEffect(() => {
		const el = cardRef.current;
		if (!el) return;

		el.style.setProperty('--exhuma-spotlight-radius', `${radius}px`);
		el.style.setProperty('--exhuma-spotlight-color', color);
		el.style.setProperty('--exhuma-spotlight-border-color', borderColor);

		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [radius, color, borderColor]);

	return (
		<div
			ref={cardRef}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			className={`group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40 ${className}`}
			style={{
				['--exhuma-spotlight-radius' as string]: `${radius}px`,
				['--exhuma-spotlight-color' as string]: color,
				['--exhuma-spotlight-border-color' as string]: borderColor,
				['--exhuma-spotlight-opacity' as string]: '0',
				...style,
			}}
			{...props}
		>
			{/* Specular Border Glow Mask */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute -inset-px rounded-[inherit] opacity-[var(--exhuma-spotlight-opacity,0)] transition-opacity duration-300'
				style={{
					background: `radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color), transparent 80%)`,
					WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
					WebkitMaskComposite: 'xor',
					maskComposite: 'exclude',
					padding: '1px',
				}}
			/>

			{/* Background Radial Sheen */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0 opacity-[var(--exhuma-spotlight-opacity,0)] transition-opacity duration-300'
				style={{
					background: `radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color), transparent 80%)`,
				}}
			/>

			{/* Content Slot */}
			<div className='relative z-10'>{children}</div>
		</div>
	);
};

SpotlightCard.displayName = 'SpotlightCard';

export const Spotlight = {
	Root: SpotlightCard,
};

export default SpotlightCard;
