'use client';

import React, { useRef, useState, useCallback, memo, type ReactNode } from 'react';
import { calculateSplitPosition, generateClipPath, stepSliderPosition } from './slider-math';

export interface ComparisonSliderProps {
	before: ReactNode;
	after: ReactNode;
	defaultPosition?: number;
	step?: number;
	className?: string;
	handleClassName?: string;
	aspectRatio?: string;
	onPositionChange?: (position: number) => void;
}

/**
 * ComparisonSlider — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Sub-pixel clip-path polygon rendering directly on the GPU compositor.
 * - Zero external animation libraries (Zero Framer Motion).
 * - Full WAI-ARIA slider accessibility contract with keyboard step navigation.
 */
export const ComparisonSlider = memo<ComparisonSliderProps>(({
	before,
	after,
	defaultPosition = 0.5,
	step = 0.05,
	className = '',
	handleClassName = '',
	aspectRatio = '16/9',
	onPositionChange,
}) => {
	const [position, setPosition] = useState<number>(defaultPosition);
	const containerRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef<boolean>(false);

	const updatePosition = useCallback((newPos: number) => {
		const clamped = Math.max(0, Math.min(1, newPos));
		setPosition(clamped);
		onPositionChange?.(clamped);
	}, [onPositionChange]);

	const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		isDraggingRef.current = true;
		const container = containerRef.current;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const newPos = calculateSplitPosition(e.clientX, rect.left, rect.width);
		updatePosition(newPos);

		try {
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		} catch {
			// Ignore if not supported
		}
	}, [updatePosition]);

	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;
		const container = containerRef.current;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const newPos = calculateSplitPosition(e.clientX, rect.left, rect.width);
		updatePosition(newPos);
	}, [updatePosition]);

	const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Ignore
		}
	}, []);

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		let delta = 0;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			delta = -step;
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			delta = step;
		} else if (e.key === 'Home') {
			updatePosition(0);
			e.preventDefault();
			return;
		} else if (e.key === 'End') {
			updatePosition(1);
			e.preventDefault();
			return;
		}

		if (delta !== 0) {
			e.preventDefault();
			updatePosition(stepSliderPosition(position, delta));
		}
	}, [position, step, updatePosition]);

	const clipPathStyle = generateClipPath(position);
	const handlePercentage = (position * 100).toFixed(2);

	return (
		<div
			ref={containerRef}
			role="slider"
			tabIndex={0}
			aria-label="Image comparison slider"
			aria-valuenow={Math.round(position * 100)}
			aria-valuemin={0}
			aria-valuemax={100}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			onKeyDown={handleKeyDown}
			className={`relative overflow-hidden select-none cursor-ew-resize rounded-2xl border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
			style={{ aspectRatio }}
		>
			{/* After Layer (Background - full width) */}
			<div className="absolute inset-0 w-full h-full pointer-events-none">
				{after}
			</div>

			{/* Before Layer (Foreground - clipped by polygon) */}
			<div
				className="absolute inset-0 w-full h-full pointer-events-none will-change-[clip-path]"
				style={{ clipPath: clipPathStyle }}
			>
				{before}
			</div>

			{/* Divider Line & Handle */}
			<div
				className="absolute top-0 bottom-0 pointer-events-none z-10 flex items-center justify-center -translate-x-1/2 will-change-[left]"
				style={{ left: `${handlePercentage}%` }}
			>
				{/* Vertical Divider Rail */}
				<div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

				{/* Center Handle Button */}
				<div
					className={`absolute flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-lg text-muted-foreground ${handleClassName}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m9 18-6-6 6-6" />
						<path d="m15 6 6 6-6 6" />
					</svg>
				</div>
			</div>
		</div>
	);
});

ComparisonSlider.displayName = 'ComparisonSlider';
