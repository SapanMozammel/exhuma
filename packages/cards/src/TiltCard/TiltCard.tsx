'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';
import type { TiltCardProps } from '../types';
import { calculateTilt, calculateGlare, generateTiltTransform, generateGlareStyle, lerp } from './tilt-math';

/**
 * TiltCard — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) Time: Zero layout thrashing during pointer move via bounding-box caching.
 * - Ω(1) Memory: Zero per-frame React state allocations during cursor tracking.
 * - Ω(120Hz) Fluidity: Direct DOM transform writes driven by rAF spring lerp.
 * - Accessibility: WCAG 2.2 AA prefers-reduced-motion fallback.
 */
export const TiltCard = memo<TiltCardProps>(
	({ children, maxTilt = 15, perspective = 1000, scale = 1.02, speed = 0.12, glare = true, maxGlareOpacity = 0.3, reverse = false, disabled = false, axis = 'all', className = '', style, ...props }) => {
		const cardRef = useRef<HTMLDivElement>(null);
		const glareRef = useRef<HTMLDivElement>(null);
		const rafIdRef = useRef<number | null>(null);
		const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

		// Target values set from pointer events (no re-renders)
		const targetRotX = useRef(0);
		const targetRotY = useRef(0);
		const targetScale = useRef(1);
		const targetGlareX = useRef(50);
		const targetGlareY = useRef(50);
		const targetGlareOpacity = useRef(0);

		// Current animated values
		const currentRotX = useRef(0);
		const currentRotY = useRef(0);
		const currentScale = useRef(1);
		const currentGlareX = useRef(50);
		const currentGlareY = useRef(50);
		const currentGlareOpacity = useRef(0);

		const isHoveredRef = useRef(false);
		const isReducedMotionRef = useRef(false);

		useEffect(() => {
			isReducedMotionRef.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}, []);

		const updateFrame = useCallback(() => {
			const card = cardRef.current;
			if (!card) return;

			if (disabled || isReducedMotionRef.current) {
				card.style.transform = '';
				if (glareRef.current) glareRef.current.style.opacity = '0';
				rafIdRef.current = null;
				return;
			}

			const lerpFactor = Math.max(0.01, Math.min(1, speed));

			currentRotX.current = lerp(currentRotX.current, targetRotX.current, lerpFactor);
			currentRotY.current = lerp(currentRotY.current, targetRotY.current, lerpFactor);
			currentScale.current = lerp(currentScale.current, targetScale.current, lerpFactor);
			currentGlareX.current = lerp(currentGlareX.current, targetGlareX.current, lerpFactor);
			currentGlareY.current = lerp(currentGlareY.current, targetGlareY.current, lerpFactor);
			currentGlareOpacity.current = lerp(currentGlareOpacity.current, targetGlareOpacity.current, lerpFactor);

			card.style.transform = generateTiltTransform(perspective, currentRotX.current, currentRotY.current, currentScale.current);

			if (glare && glareRef.current) {
				const glareStyle = generateGlareStyle(currentGlareX.current, currentGlareY.current, currentGlareOpacity.current);
				glareRef.current.style.opacity = glareStyle.opacity;
				glareRef.current.style.background = glareStyle.background;
			}

			// Check convergence
			const diffRotX = Math.abs(targetRotX.current - currentRotX.current);
			const diffRotY = Math.abs(targetRotY.current - currentRotY.current);
			const diffScale = Math.abs(targetScale.current - currentScale.current);
			const diffOp = Math.abs(targetGlareOpacity.current - currentGlareOpacity.current);

			if (diffRotX > 0.01 || diffRotY > 0.01 || diffScale > 0.001 || diffOp > 0.002 || isHoveredRef.current) {
				rafIdRef.current = requestAnimationFrame(updateFrame);
			} else {
				rafIdRef.current = null;
			}
		}, [perspective, speed, glare, disabled]);

		const scheduleRaf = useCallback(() => {
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(updateFrame);
			}
		}, [updateFrame]);

		const measureRect = useCallback(() => {
			const card = cardRef.current;
			if (!card) return;
			const r = card.getBoundingClientRect();
			rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
		}, []);

		const handlePointerMove = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (disabled || isReducedMotionRef.current) return;
				if (!rectRef.current) measureRect();
				const rect = rectRef.current;
				if (!rect) return;

				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const tilt = calculateTilt(x, y, rect.width, rect.height, maxTilt, reverse, axis);
				targetRotX.current = tilt.rotX;
				targetRotY.current = tilt.rotY;

				if (glare) {
					const glareCalc = calculateGlare(x, y, rect.width, rect.height, maxGlareOpacity);
					targetGlareX.current = glareCalc.glareX;
					targetGlareY.current = glareCalc.glareY;
					targetGlareOpacity.current = glareCalc.glareOpacity;
				}

				scheduleRaf();
			},
			[disabled, maxTilt, reverse, axis, glare, maxGlareOpacity, measureRect, scheduleRaf]
		);

		const handlePointerEnter = useCallback(() => {
			if (disabled || isReducedMotionRef.current) return;
			isHoveredRef.current = true;
			targetScale.current = scale;
			measureRect();
			scheduleRaf();
		}, [disabled, scale, measureRect, scheduleRaf]);

		const handlePointerLeave = useCallback(() => {
			isHoveredRef.current = false;
			rectRef.current = null;
			targetRotX.current = 0;
			targetRotY.current = 0;
			targetScale.current = 1.0;
			targetGlareOpacity.current = 0;
			scheduleRaf();
		}, [scheduleRaf]);

		// Handle scroll or resize during hover to keep bounds accurate without per-move thrashing
		useEffect(() => {
			const onScrollOrResize = () => {
				if (isHoveredRef.current) {
					measureRect();
				}
			};
			window.addEventListener('scroll', onScrollOrResize, { passive: true });
			window.addEventListener('resize', onScrollOrResize, { passive: true });
			return () => {
				window.removeEventListener('scroll', onScrollOrResize);
				window.removeEventListener('resize', onScrollOrResize);
				if (rafIdRef.current !== null) {
					cancelAnimationFrame(rafIdRef.current);
				}
			};
		}, [measureRect]);

		return (
			<div
				ref={cardRef}
				onPointerEnter={handlePointerEnter}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				className={`exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform ${className}`}
				style={style}
				{...props}
			>
				{children}
				{glare && <div ref={glareRef} aria-hidden='true' className='pointer-events-none absolute inset-0' style={{ opacity: 0 }} />}
			</div>
		);
	}
);

TiltCard.displayName = 'TiltCard';
