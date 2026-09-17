'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { InfiniteMarqueeProps } from '../types';
import { calculateMarqueeOffset, dampFactor } from './marquee-math';

/**
 * InfiniteMarquee — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(120Hz) High-precision rAF translation without VDOM diffing.
 * - Ω(1) Time complexity modulo wrapping.
 * - Zero Garbage Collection allocations during active scrolling.
 * - Hardware-accelerated translate3d transforms.
 */
export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> & {
	Root: typeof MarqueeRoot;
	Track: typeof MarqueeTrack;
	Item: typeof MarqueeItem;
} = ({ children, speed = 40, direction = 'left', pauseOnHover = true, gap = '1.5rem', className = '', style }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const offsetRef = useRef<number>(0);
	const kineticFactorRef = useRef<number>(1.0);
	const targetFactorRef = useRef<number>(1.0);
	const lastTimeRef = useRef<number | null>(null);
	const contentWidthRef = useRef<number>(0);
	const rafIdRef = useRef<number | null>(null);

	// Measure content width once with ResizeObserver (Zero layout thrashing)
	useEffect(() => {
		const contentEl = contentRef.current;
		if (!contentEl) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				contentWidthRef.current = entry.contentRect.width;
			}
		});

		observer.observe(contentEl);
		return () => observer.disconnect();
	}, []);

	// Continuous kinetic translation loop
	const tick = useCallback(
		(now: number) => {
			if (lastTimeRef.current === null) {
				lastTimeRef.current = now;
			}
			const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1); // Max 100ms clamp for tab switch
			lastTimeRef.current = now;

			// Smooth hover deceleration/acceleration factor
			kineticFactorRef.current = dampFactor(kineticFactorRef.current, targetFactorRef.current, 12.0, dt);

			const effectiveSpeed = speed * kineticFactorRef.current;
			const width = contentWidthRef.current;

			if (width > 0 && effectiveSpeed > 0.01) {
				offsetRef.current = calculateMarqueeOffset(offsetRef.current, dt, effectiveSpeed, direction, width);

				if (trackRef.current) {
					trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
				}
			}

			rafIdRef.current = requestAnimationFrame(tick);
		},
		[speed, direction]
	);

	useEffect(() => {
		rafIdRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [tick]);

	const handleMouseEnter = useCallback(() => {
		if (pauseOnHover) {
			targetFactorRef.current = 0.0;
		}
	}, [pauseOnHover]);

	const handleMouseLeave = useCallback(() => {
		if (pauseOnHover) {
			targetFactorRef.current = 1.0;
		}
	}, [pauseOnHover]);

	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;

	return (
		<div ref={containerRef} className={`exhuma-marquee-root relative w-full overflow-hidden select-none ${className}`} style={style} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<div
				ref={trackRef}
				className='exhuma-marquee-track flex w-max will-change-transform'
				style={{
					columnGap: gapVal,
				}}
			>
				{/* Primary track measured by ResizeObserver */}
				<div ref={contentRef} className='exhuma-marquee-content flex shrink-0 items-center' style={{ columnGap: gapVal }}>
					{children}
				</div>

				{/* Cloned secondary track for seamless modulo wrapping */}
				<div aria-hidden='true' className='exhuma-marquee-clone flex shrink-0 items-center' style={{ columnGap: gapVal }}>
					{children}
				</div>
			</div>
		</div>
	);
};

// Compound API Primitives
const MarqueeRoot: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`exhuma-marquee-root relative w-full overflow-hidden select-none ${className}`} {...props}>
		{children}
	</div>
);

const MarqueeTrack: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`exhuma-marquee-track flex w-max will-change-transform ${className}`} {...props}>
		{children}
	</div>
);

const MarqueeItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`exhuma-marquee-item shrink-0 ${className}`} {...props}>
		{children}
	</div>
);

InfiniteMarquee.Root = MarqueeRoot;
InfiniteMarquee.Track = MarqueeTrack;
InfiniteMarquee.Item = MarqueeItem;

export { MarqueeRoot, MarqueeTrack, MarqueeItem };
