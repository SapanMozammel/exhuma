'use client';

import React, { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
	SwipeVelocityRingBuffer,
	calculateCardRotation,
	evaluateSwipeDecision,
	calculateStackedCardTransform,
	calculateFlingDuration,
	calculateElasticDamping,
} from './swipe-math';

export interface CardSwipeStackProps<T> {
	items: T[];
	renderCard: (item: T, index: number) => ReactNode;
	onSwipe?: (item: T, direction: 'left' | 'right') => void;
	thresholdDistance?: number;
	thresholdVelocity?: number;
	maxRotation?: number;
	scaleStep?: number;
	offsetStep?: number;
	preventLastCardDismiss?: boolean;
	maxVisible?: number;
	className?: string;
	emptyState?: ReactNode;
}

/**
 * CardSwipeStack — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - VelocityRingBuffer pre-allocated Float64Array circular buffer for O(1) fling velocity tracking.
 * - Zero layout thrashing: All cards are absolute-positioned in a stable container. No relative/absolute
 *   switching on card advance. Direct GPU transform writes (translate3d, rotate) via rAF.
 * - Hermite smoothstep (3t²-2t³) layer elevation without CSS transition fighting.
 * - Last card elastic rubber-band resistance via power-law damping.
 * - Pointer capture on outer container div — immune to child element unmount races.
 * - Zero external animation libraries.
 */
export function CardSwipeStack<T>({
	items,
	renderCard,
	onSwipe,
	thresholdDistance = 120,
	thresholdVelocity = 550,
	maxRotation = 20,
	scaleStep = 0.05,
	offsetStep = 14,
	preventLastCardDismiss = true,
	maxVisible = 3,
	className = '',
	emptyState = null,
}: CardSwipeStackProps<T>) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentIndexRef = useRef(currentIndex);
	currentIndexRef.current = currentIndex;

	// The outer wrapper captures all pointer events — immune to child remount races
	const outerRef = useRef<HTMLDivElement>(null);
	// Card slot refs: 0 = top card, 1 = next, 2 = third
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const isDraggingRef = useRef<boolean>(false);
	const isAnimatingRef = useRef<boolean>(false);
	const isLastCardRef = useRef<boolean>(false);
	const activePointerIdRef = useRef<number | null>(null);
	const ringBufferRef = useRef<SwipeVelocityRingBuffer>(new SwipeVelocityRingBuffer());
	const rafIdRef = useRef<number | null>(null);

	const visibleItems = items.slice(currentIndex, currentIndex + maxVisible);

	// ─── Ω(1) rAF helpers ───────────────────────────────────────────────────
	const cancelRaf = useCallback(() => {
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	// Apply resting stack transforms to all background layers
	const applyRestingTransforms = useCallback(
		(count: number) => {
			for (let idx = 1; idx <= count; idx++) {
				const el = cardRefs.current[idx];
				if (!el) continue;
				const t = calculateStackedCardTransform(idx, 0, scaleStep, offsetStep);
				el.style.transform = `translate3d(0,${t.translateY.toFixed(2)}px,0) scale(${t.scale.toFixed(3)})`;
				el.style.opacity = `${t.opacity.toFixed(2)}`;
			}
		},
		[scaleStep, offsetStep]
	);

	// Elevation sweep for all background layers at dismiss/drag progress p∈[0,1]
	const applyBackgroundElevation = useCallback(
		(p: number, count: number) => {
			for (let idx = 1; idx <= count; idx++) {
				const el = cardRefs.current[idx];
				if (!el) continue;
				const t = calculateStackedCardTransform(idx, p, scaleStep, offsetStep);
				el.style.transform = `translate3d(0,${t.translateY.toFixed(2)}px,0) scale(${t.scale.toFixed(3)})`;
				el.style.opacity = `${t.opacity.toFixed(2)}`;
			}
		},
		[scaleStep, offsetStep]
	);

	// ─── Drag DOM update (called inside rAF) ────────────────────────────────
	const updateDOM = useCallback(() => {
		const el = cardRefs.current[0];
		if (!el) return;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		const dy = currentPosRef.current.y - startPosRef.current.y;
		const bgCount = Math.min(maxVisible - 1, visibleItems.length - 1);

		let dx: number;
		let rot: number;

		if (isLastCardRef.current) {
			dx = calculateElasticDamping(rawDx, 80);
			rot = calculateCardRotation(dx, maxRotation * 0.4, thresholdDistance * 1.5);
		} else {
			dx = rawDx;
			rot = calculateCardRotation(dx, maxRotation, thresholdDistance * 1.5);
		}

		el.style.transform = `translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg)`;

		const progress = isLastCardRef.current ? 0 : Math.min(1, Math.abs(rawDx) / thresholdDistance);
		applyBackgroundElevation(progress, bgCount);
	}, [maxRotation, thresholdDistance, maxVisible, visibleItems.length, applyBackgroundElevation]);

	// ─── Spring return: quintic ease-out for snappy settle ──────────────────
	const animateReturn = useCallback(() => {
		const el = cardRefs.current[0];
		if (!el) return;

		cancelRaf();
		isAnimatingRef.current = true;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		const rawDy = currentPosRef.current.y - startPosRef.current.y;
		const startX = isLastCardRef.current ? calculateElasticDamping(rawDx, 80) : rawDx;
		const startY = rawDy;
		const bgCount = Math.min(maxVisible - 1, visibleItems.length - 1);
		// Duration scales with how far away the card is — snappier for short drags
		const dist = Math.sqrt(startX * startX + startY * startY);
		const duration = Math.max(160, Math.min(260, dist * 0.9));
		let start: number | null = null;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const p = Math.min(1, (timestamp - start) / duration);
			// Quintic ease-out: fast snap, smooth decel
			const ease = 1 - Math.pow(1 - p, 5);

			const curX = startX * (1 - ease);
			const curY = startY * (1 - ease);
			const rot = isLastCardRef.current
				? calculateCardRotation(curX, maxRotation * 0.4, thresholdDistance * 1.5)
				: calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);

			el.style.transform = `translate3d(${curX.toFixed(2)}px,${curY.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg)`;

			const progress = isLastCardRef.current ? 0 : Math.min(1, Math.abs(curX) / thresholdDistance);
			applyBackgroundElevation(progress, bgCount);

			if (p < 1) {
				rafIdRef.current = requestAnimationFrame(step);
			} else {
				el.style.transform = 'translate3d(0,0,0) rotate(0deg)';
				applyRestingTransforms(bgCount);
				rafIdRef.current = null;
				isAnimatingRef.current = false;
			}
		};

		rafIdRef.current = requestAnimationFrame(step);
	}, [maxRotation, thresholdDistance, maxVisible, visibleItems.length, applyBackgroundElevation, applyRestingTransforms, cancelRaf]);

	// ─── Dismiss fling: quintic ease-out from current position ──────────────
	const animateDismiss = useCallback(
		(direction: 'left' | 'right', initialVelocityX: number = 0) => {
			const el = cardRefs.current[0];
			if (!el) return;

			cancelRaf();
			isAnimatingRef.current = true;

			const exitDistance = Math.min(500, Math.max(360, typeof window !== 'undefined' ? window.innerWidth * 0.38 : 420));
			const targetX = direction === 'right' ? exitDistance : -exitDistance;
			const startX = currentPosRef.current.x - startPosRef.current.x;
			const startY = currentPosRef.current.y - startPosRef.current.y;
			const distRemaining = Math.abs(targetX - startX);
			const bgCount = Math.min(maxVisible - 1, visibleItems.length - 1);
			// Faster fling for higher velocity; floor of 180ms for natural feel
			const duration = calculateFlingDuration(distRemaining, initialVelocityX, 180, 300);
			let start: number | null = null;

			const step = (timestamp: number) => {
				if (!start) start = timestamp;
				const p = Math.min(1, (timestamp - start) / duration);
				// Quintic ease-out: immediate momentum from release point, smooth exit arc
				const ease = 1 - Math.pow(1 - p, 5);

				const curX = startX + (targetX - startX) * ease;
				const curRot = calculateCardRotation(curX, maxRotation * 1.15, thresholdDistance * 1.5);

				el.style.transform = `translate3d(${curX.toFixed(2)}px,${startY.toFixed(2)}px,0) rotate(${curRot.toFixed(2)}deg)`;
				// Fade starts at 60% travel, reaches 0 at exit
				el.style.opacity = `${Math.max(0, 1 - Math.max(0, p - 0.4) * (1 / 0.6)).toFixed(2)}`;

				applyBackgroundElevation(p, bgCount);

				if (p < 1) {
					rafIdRef.current = requestAnimationFrame(step);
				} else {
					el.style.opacity = '0';
					el.style.pointerEvents = 'none';
					const dismissedItem = items[currentIndexRef.current];
					if (onSwipe && dismissedItem) onSwipe(dismissedItem, direction);
					setCurrentIndex((prev) => prev + 1);
				}
			};

			rafIdRef.current = requestAnimationFrame(step);
		},
		[items, maxRotation, onSwipe, thresholdDistance, maxVisible, visibleItems.length, applyBackgroundElevation, cancelRaf]
	);

	// ─── DOM handover after React reconciles new visibleItems ───────────────
	useEffect(() => {
		const topEl = cardRefs.current[0];
		if (topEl) {
			topEl.style.transform = 'translate3d(0,0,0) rotate(0deg)';
			topEl.style.opacity = '1';
			topEl.style.pointerEvents = 'auto';
		}
		applyRestingTransforms(Math.min(maxVisible - 1, items.length - currentIndex - 1));
		isAnimatingRef.current = false;
		rafIdRef.current = null;
	}, [currentIndex, maxVisible, items.length, applyRestingTransforms]);

	// ─── Cleanup on unmount ──────────────────────────────────────────────────
	useEffect(() => {
		return cancelRaf;
	}, [cancelRaf]);

	// ─── Pointer event handlers ──────────────────────────────────────────────
	// Capture is set on the outer div element — NOT on e.target (child).
	// This means even if renderCard's internal nodes are remounted/unmounted,
	// we never lose the pointer capture and cards never "stick" to the cursor.

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (isAnimatingRef.current || visibleItems.length === 0) return;
			// Only accept primary pointer (left mouse / first touch)
			if (e.button !== 0 && e.pointerType === 'mouse') return;

			isDraggingRef.current = true;
			isLastCardRef.current = preventLastCardDismiss && currentIndexRef.current >= items.length - 1;
			activePointerIdRef.current = e.pointerId;
			startPosRef.current = { x: e.clientX, y: e.clientY };
			currentPosRef.current = { x: e.clientX, y: e.clientY };
			ringBufferRef.current.clear();
			ringBufferRef.current.push(e.clientX, e.clientY, performance.now());

			// Capture on the outer div — survives child DOM mutations
			outerRef.current?.setPointerCapture(e.pointerId);
		},
		[items.length, preventLastCardDismiss, visibleItems.length]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (!isDraggingRef.current || e.pointerId !== activePointerIdRef.current) return;
			currentPosRef.current = { x: e.clientX, y: e.clientY };
			ringBufferRef.current.push(e.clientX, e.clientY, performance.now());
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(() => {
					updateDOM();
					rafIdRef.current = null;
				});
			}
		},
		[updateDOM]
	);

	const finishDrag = useCallback(() => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		activePointerIdRef.current = null;

		if (isLastCardRef.current) {
			animateReturn();
			return;
		}

		const dx = currentPosRef.current.x - startPosRef.current.x;
		const velocityX = ringBufferRef.current.computeVelocityX();
		const decision = evaluateSwipeDecision(dx, velocityX, thresholdDistance, thresholdVelocity);

		if (decision.isDismissed && decision.direction) {
			animateDismiss(decision.direction, velocityX);
		} else {
			animateReturn();
		}
	}, [animateReturn, animateDismiss, thresholdDistance, thresholdVelocity]);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (e.pointerId !== activePointerIdRef.current) return;
			try {
				outerRef.current?.releasePointerCapture(e.pointerId);
			} catch {
				// Already released
			}
			finishDrag();
		},
		[finishDrag]
	);

	const handlePointerCancel = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (e.pointerId !== activePointerIdRef.current) return;
			isDraggingRef.current = false;
			activePointerIdRef.current = null;
			animateReturn();
		},
		[animateReturn]
	);

	// ─── Render ──────────────────────────────────────────────────────────────
	return (
		<div
			ref={outerRef}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			className={`relative overflow-hidden select-none ${className}`}
			style={{ minHeight: '22rem' }} // 352px — clips translated cards, prevents horizontal scrollbar
		>
			{/* Background cards — furthest back rendered first */}
			{visibleItems.slice(1).map((item, idx) => {
				const stackIdx = idx + 1;
				const t = calculateStackedCardTransform(stackIdx, 0, scaleStep, offsetStep);
				return (
					<div
						key={`slot-${stackIdx}`}
						ref={(node) => {
							cardRefs.current[stackIdx] = node;
						}}
						className='pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform'
						style={{
							transform: `translate3d(0,${t.translateY.toFixed(2)}px,0) scale(${t.scale.toFixed(3)})`,
							opacity: t.opacity.toFixed(2),
							zIndex: 10 - stackIdx,
						}}
					>
						{renderCard(item, currentIndex + stackIdx)}
					</div>
				);
			})}

			{/* Empty state */}
			{visibleItems.length === 0 &&
				(emptyState || (
					<div className='border-border bg-card text-muted-foreground absolute inset-0 flex items-center justify-center rounded-2xl border p-8 text-center text-sm'>
						No more cards in stack.
					</div>
				))}

			{/* Top (active) card — slot 0, always absolute */}
			{visibleItems[0] && (
				<div
					key='slot-0'
					ref={(node) => {
						cardRefs.current[0] = node;
					}}
					className='absolute inset-0 flex cursor-grab items-center justify-center touch-none will-change-transform active:cursor-grabbing'
					style={{ zIndex: 20 }}
				>
					{renderCard(visibleItems[0], currentIndex)}
				</div>
			)}
		</div>
	);
}
