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
 * - Zero layout thrashing: All cards are absolute-positioned in a stable container; no relative/absolute
 *   switching on card advance. Direct GPU transform writes (translate3d, rotate) scheduled via rAF.
 * - Hermite smoothstep (3t^2 - 2t^3) layer elevation without CSS transition fighting.
 * - Last card elastic rubber-band resistance via logarithmic power damping.
 * - Zero external animation libraries (Framer Motion, GSAP, etc.).
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

	// Stable container ref — absolute layout, never triggers relayout on card advance
	const containerRef = useRef<HTMLDivElement>(null);
	// Card layer refs keyed by visual stack slot (0 = top, 1 = next, 2 = third)
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const isDraggingRef = useRef<boolean>(false);
	const isAnimatingRef = useRef<boolean>(false);
	const isLastCardRef = useRef<boolean>(false);
	const ringBufferRef = useRef<SwipeVelocityRingBuffer>(new SwipeVelocityRingBuffer());
	const rafIdRef = useRef<number | null>(null);

	const visibleItems = items.slice(currentIndex, currentIndex + maxVisible);

	// Cancel any running rAF
	const cancelRaf = useCallback(() => {
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	// Apply resting transforms to all background card layers
	const applyRestingTransforms = useCallback(() => {
		visibleItems.slice(1).forEach((_item, idx) => {
			const el = cardRefs.current[idx + 1];
			if (!el) return;
			const t = calculateStackedCardTransform(idx + 1, 0, scaleStep, offsetStep);
			el.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
			el.style.opacity = `${t.opacity.toFixed(2)}`;
		});
	}, [visibleItems, scaleStep, offsetStep]);

	// Elevation sweep: update all background layers to stack progress p ∈ [0, 1]
	const applyBackgroundElevation = useCallback(
		(p: number) => {
			visibleItems.slice(1).forEach((_item, idx) => {
				const el = cardRefs.current[idx + 1];
				if (!el) return;
				const t = calculateStackedCardTransform(idx + 1, p, scaleStep, offsetStep);
				el.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
				el.style.opacity = `${t.opacity.toFixed(2)}`;
			});
		},
		[visibleItems, scaleStep, offsetStep]
	);

	// DOM update: called inside rAF during drag
	const updateDOM = useCallback(() => {
		const el = cardRefs.current[0];
		if (!el) return;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		const dy = currentPosRef.current.y - startPosRef.current.y;

		let dx: number;
		let rot: number;

		if (isLastCardRef.current) {
			// Elastic rubber-band damping — resist drag, never reaches threshold
			dx = calculateElasticDamping(rawDx, 80);
			// Reduce rotation for last card — lighter tactile feedback
			rot = calculateCardRotation(dx, maxRotation * 0.4, thresholdDistance * 1.5);
		} else {
			dx = rawDx;
			rot = calculateCardRotation(dx, maxRotation, thresholdDistance * 1.5);
		}

		el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

		// Background card elevation based on raw progress (0→1)
		const progress = isLastCardRef.current ? 0 : Math.min(1, Math.abs(rawDx) / thresholdDistance);
		applyBackgroundElevation(progress);
	}, [maxRotation, thresholdDistance, applyBackgroundElevation]);

	// Spring return animation — card settles back to center
	const animateReturn = useCallback(() => {
		const el = cardRefs.current[0];
		if (!el) return;

		cancelRaf();
		isAnimatingRef.current = true;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		const rawDy = currentPosRef.current.y - startPosRef.current.y;
		const startX = isLastCardRef.current ? calculateElasticDamping(rawDx, 80) : rawDx;
		const startY = rawDy;
		const duration = 280;
		let start: number | null = null;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const elapsed = timestamp - start;
			const p = Math.min(1, elapsed / duration);
			// Cubic ease-out: fluid spring settle
			const ease = 1 - Math.pow(1 - p, 3);

			const curX = startX * (1 - ease);
			const curY = startY * (1 - ease);
			const rot = isLastCardRef.current
				? calculateCardRotation(curX, maxRotation * 0.4, thresholdDistance * 1.5)
				: calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);

			el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

			const progress = isLastCardRef.current ? 0 : Math.min(1, Math.abs(curX) / thresholdDistance);
			applyBackgroundElevation(progress);

			if (p < 1) {
				rafIdRef.current = requestAnimationFrame(step);
			} else {
				el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
				applyRestingTransforms();
				rafIdRef.current = null;
				isAnimatingRef.current = false;
			}
		};

		rafIdRef.current = requestAnimationFrame(step);
	}, [maxRotation, thresholdDistance, applyBackgroundElevation, applyRestingTransforms, cancelRaf]);

	// Dismiss animation — card flings to exit and next card promotes to top
	const animateDismiss = useCallback(
		(direction: 'left' | 'right', initialVelocityX: number = 0) => {
			const el = cardRefs.current[0];
			if (!el) return;

			cancelRaf();
			isAnimatingRef.current = true;

			const exitDistance = Math.min(540, Math.max(420, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 460));
			const targetX = direction === 'right' ? exitDistance : -exitDistance;
			const startX = currentPosRef.current.x - startPosRef.current.x;
			const startY = currentPosRef.current.y - startPosRef.current.y;
			const distRemaining = Math.abs(targetX - startX);
			const duration = calculateFlingDuration(distRemaining, initialVelocityX, 240, 340);
			let start: number | null = null;

			const step = (timestamp: number) => {
				if (!start) start = timestamp;
				const elapsed = timestamp - start;
				const p = Math.min(1, elapsed / duration);
				// Hermite smooth acceleration: p^2(3 - 2p)
				const ease = p * p * (3 - 2 * p);

				const curX = startX + (targetX - startX) * ease;
				const curRot = calculateCardRotation(curX, maxRotation * 1.2, thresholdDistance * 1.5);

				el.style.transform = `translate3d(${curX.toFixed(2)}px, ${startY.toFixed(2)}px, 0) rotate(${curRot.toFixed(2)}deg)`;
				// Fade out the exiting card: fully transparent at p = 1
				el.style.opacity = `${Math.max(0, 1 - p * 1.2).toFixed(2)}`;

				// Background cards elevate synchronously with the fling
				applyBackgroundElevation(p);

				if (p < 1) {
					rafIdRef.current = requestAnimationFrame(step);
				} else {
					// Hide immediately to prevent any 1-frame flash before React reconciles
					el.style.opacity = '0';
					el.style.pointerEvents = 'none';

					const dismissedItem = items[currentIndexRef.current];
					if (onSwipe && dismissedItem) {
						onSwipe(dismissedItem, direction);
					}
					setCurrentIndex((prev) => prev + 1);
				}
			};

			rafIdRef.current = requestAnimationFrame(step);
		},
		[items, maxRotation, onSwipe, thresholdDistance, applyBackgroundElevation, cancelRaf]
	);

	// Seamless handover: synchronize DOM when currentIndex advances
	// This runs after React has reconciled the new visibleItems array
	useEffect(() => {
		const topEl = cardRefs.current[0];
		if (topEl) {
			topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
			topEl.style.opacity = '1';
			topEl.style.pointerEvents = 'auto';
		}
		applyRestingTransforms();
		isAnimatingRef.current = false;
		rafIdRef.current = null;
	}, [currentIndex, applyRestingTransforms]);

	// Cleanup rAF on unmount
	useEffect(() => {
		return cancelRaf;
	}, [cancelRaf]);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (isAnimatingRef.current) return;
		isDraggingRef.current = true;
		isLastCardRef.current = preventLastCardDismiss && currentIndexRef.current >= items.length - 1;
		startPosRef.current = { x: e.clientX, y: e.clientY };
		currentPosRef.current = { x: e.clientX, y: e.clientY };
		ringBufferRef.current.clear();
		ringBufferRef.current.push(e.clientX, e.clientY, performance.now());
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;
		currentPosRef.current = { x: e.clientX, y: e.clientY };
		ringBufferRef.current.push(e.clientX, e.clientY, performance.now());
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(() => {
				updateDOM();
				rafIdRef.current = null;
			});
		}
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		try {
			(e.target as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Ignore if pointer capture was already released
		}

		// If on last card and preventLastCardDismiss is on — always spring back
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
	};

	const handlePointerCancel = () => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		animateReturn();
	};

	// Stable container: fixed intrinsic height, all cards are absolute inside
	// This eliminates the relative↔absolute layout switch that caused render hitches
	return (
		<div
			ref={containerRef}
			className={`relative select-none ${className}`}
			style={{ minHeight: '26.25rem' }} // 420px stable height floor
		>
			{/* Background cards — rendered back to front (highest index = furthest back) */}
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
							transform: `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`,
							opacity: t.opacity.toFixed(2),
							zIndex: 10 - stackIdx,
						}}
					>
						{renderCard(item, currentIndex + stackIdx)}
					</div>
				);
			})}

			{/* Empty state — when all cards are dismissed */}
			{visibleItems.length === 0 &&
				(emptyState || (
					<div className='border-border bg-card text-muted-foreground absolute inset-0 flex items-center justify-center rounded-2xl border p-8 text-center text-sm'>
						No more cards in stack.
					</div>
				))}

			{/* Top (active) card — always absolute, always slot 0 */}
			{visibleItems[0] && (
				<div
					key='slot-0'
					ref={(node) => {
						cardRefs.current[0] = node;
					}}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerCancel}
					className='absolute inset-0 flex cursor-grab items-center justify-center touch-none will-change-transform active:cursor-grabbing'
					style={{ zIndex: 20 }}
				>
					{renderCard(visibleItems[0], currentIndex)}
				</div>
			)}
		</div>
	);
}
