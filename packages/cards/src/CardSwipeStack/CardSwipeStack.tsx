'use client';

import React, { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { SwipeVelocityRingBuffer, calculateCardRotation, evaluateSwipeDecision, calculateStackedCardTransform, calculateFlingDuration, calculateElasticDamping } from './swipe-math';

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

function getItemKey<T>(item: T, fallbackIndex: number): string | number {
	if (item && typeof item === 'object') {
		if ('id' in item && item.id != null) return String(item.id);
		if ('key' in item && (item as Record<string, unknown>).key != null) return String((item as Record<string, unknown>).key);
	}
	return `card-${fallbackIndex}`;
}

/**
 * CardSwipeStack — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - VelocityRingBuffer pre-allocated Float64Array circular buffer for O(1) fling velocity tracking.
 * - Single unified card list with stable item-based keys: zero DOM thrashing, zero component remounting,
 *   zero 1-frame reconciliation jumps during card promotions.
 * - Smooth quartic ease-out kinematics for fluid, natural fling and spring return.
 * - Ironclad pointer lifecycle: lostpointercapture + buttons===0 validation + window listeners eliminate stickiness.
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

	// Refs to current rendered card DOM elements (index 0 = top, index 1 = next, ...)
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const isDraggingRef = useRef<boolean>(false);
	const isAnimatingRef = useRef<boolean>(false);
	const isLastCardRef = useRef<boolean>(false);
	const activePointerIdRef = useRef<number | null>(null);
	const activeTargetRef = useRef<HTMLElement | null>(null);
	const dragProgressRef = useRef<number>(0);
	const ringBufferRef = useRef<SwipeVelocityRingBuffer>(new SwipeVelocityRingBuffer());
	const rafIdRef = useRef<number | null>(null);

	const visibleItems = items.slice(currentIndex, currentIndex + maxVisible);

	const cancelRaf = useCallback(() => {
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	// Reset card refs array length on render
	cardRefs.current = cardRefs.current.slice(0, visibleItems.length);

	// Apply resting transforms to background cards
	const applyRestingTransforms = useCallback(() => {
		for (let i = 1; i < cardRefs.current.length; i++) {
			const el = cardRefs.current[i];
			if (!el) continue;
			const t = calculateStackedCardTransform(i, 0, scaleStep, offsetStep);
			el.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
			el.style.opacity = `${t.opacity.toFixed(2)}`;
		}
	}, [scaleStep, offsetStep]);

	// Update DOM during active drag
	const updateDOM = useCallback(() => {
		const topEl = cardRefs.current[0];
		if (!topEl) return;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		// Dampen vertical displacement so gestures feel stable and weighted
		const dy = (currentPosRef.current.y - startPosRef.current.y) * 0.35;

		let dx: number;
		let rot: number;

		if (isLastCardRef.current) {
			dx = calculateElasticDamping(rawDx, 80);
			rot = calculateCardRotation(dx, maxRotation * 0.35, thresholdDistance * 1.5);
		} else {
			dx = rawDx;
			rot = calculateCardRotation(dx, maxRotation, thresholdDistance * 1.5);
		}

		topEl.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

		// Background cards preview forward up to 50% during drag
		const progress = isLastCardRef.current ? 0 : Math.min(0.5, (Math.abs(rawDx) / (thresholdDistance * 2)) * 0.5);
		dragProgressRef.current = progress;

		for (let i = 1; i < cardRefs.current.length; i++) {
			const bgEl = cardRefs.current[i];
			if (!bgEl) continue;
			const t = calculateStackedCardTransform(i, progress, scaleStep, offsetStep);
			bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
			bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
		}
	}, [maxRotation, thresholdDistance, scaleStep, offsetStep]);

	// Spring return animation (release without dismiss)
	const animateReturn = useCallback(() => {
		const topEl = cardRefs.current[0];
		if (!topEl) return;

		cancelRaf();
		isAnimatingRef.current = true;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		const rawDy = (currentPosRef.current.y - startPosRef.current.y) * 0.35;
		const startX = isLastCardRef.current ? calculateElasticDamping(rawDx, 80) : rawDx;
		const startY = rawDy;
		const startProgress = dragProgressRef.current;

		const dist = Math.sqrt(startX * startX + startY * startY);
		const duration = Math.max(180, Math.min(260, dist * 0.85));
		let start: number | null = null;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const p = Math.min(1, (timestamp - start) / duration);
			// Quartic ease-out for a crisp, organic settle
			const ease = 1 - Math.pow(1 - p, 4);

			const curX = startX * (1 - ease);
			const curY = startY * (1 - ease);
			const rot = isLastCardRef.current ? calculateCardRotation(curX, maxRotation * 0.35, thresholdDistance * 1.5) : calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);

			topEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

			// Background cards ease back to resting state
			const curProgress = startProgress * (1 - ease);
			for (let i = 1; i < cardRefs.current.length; i++) {
				const bgEl = cardRefs.current[i];
				if (!bgEl) continue;
				const t = calculateStackedCardTransform(i, curProgress, scaleStep, offsetStep);
				bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
				bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
			}

			if (p < 1) {
				rafIdRef.current = requestAnimationFrame(step);
			} else {
				topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
				applyRestingTransforms();
				dragProgressRef.current = 0;
				rafIdRef.current = null;
				isAnimatingRef.current = false;
			}
		};

		rafIdRef.current = requestAnimationFrame(step);
	}, [maxRotation, thresholdDistance, scaleStep, offsetStep, applyRestingTransforms, cancelRaf]);

	// Fling dismiss animation
	const animateDismiss = useCallback(
		(direction: 'left' | 'right', initialVelocityX: number = 0) => {
			const topEl = cardRefs.current[0];
			if (!topEl) return;

			cancelRaf();
			isAnimatingRef.current = true;

			const exitDistance = Math.min(520, Math.max(380, typeof window !== 'undefined' ? window.innerWidth * 0.45 : 440));
			const targetX = direction === 'right' ? exitDistance : -exitDistance;
			const startX = currentPosRef.current.x - startPosRef.current.x;
			const startY = (currentPosRef.current.y - startPosRef.current.y) * 0.35;
			const startProgress = dragProgressRef.current;

			const distRemaining = Math.abs(targetX - startX);
			const duration = calculateFlingDuration(distRemaining, initialVelocityX, 190, 280);
			let start: number | null = null;

			const step = (timestamp: number) => {
				if (!start) start = timestamp;
				const p = Math.min(1, (timestamp - start) / duration);
				// Quartic ease-out: immediate momentum preservation and graceful exit arc
				const ease = 1 - Math.pow(1 - p, 4);

				const curX = startX + (targetX - startX) * ease;
				const curY = startY * (1 - ease); // Smoothly glides back to center on exit
				const curRot = calculateCardRotation(curX, maxRotation * 1.25, thresholdDistance * 1.5);
				// Fade out during the second half of the exit
				const fadeOut = Math.max(0, 1 - Math.max(0, p - 0.4) / 0.6);

				topEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${curRot.toFixed(2)}deg)`;
				topEl.style.opacity = `${fadeOut.toFixed(2)}`;

				// Background cards interpolate seamlessly to their next resting layer (progress -> 1.0)
				const bgProgress = startProgress + (1 - startProgress) * ease;
				for (let i = 1; i < cardRefs.current.length; i++) {
					const bgEl = cardRefs.current[i];
					if (!bgEl) continue;
					const t = calculateStackedCardTransform(i, bgProgress, scaleStep, offsetStep);
					bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
					bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
				}

				if (p < 1) {
					rafIdRef.current = requestAnimationFrame(step);
				} else {
					// Dismiss complete: background cards have reached 100% resting position for (index - 1)
					topEl.style.opacity = '0';
					dragProgressRef.current = 0;
					rafIdRef.current = null;
					isAnimatingRef.current = false;

					const dismissedItem = items[currentIndexRef.current];
					if (onSwipe && dismissedItem) {
						onSwipe(dismissedItem, direction);
					}
					// State advance: React updates. Because keys are item-based, next card was already
					// sitting at (translateY: 0, scale: 1, opacity: 1) and remains completely uninterrupted!
					setCurrentIndex((prev) => prev + 1);
				}
			};

			rafIdRef.current = requestAnimationFrame(step);
		},
		[items, maxRotation, onSwipe, thresholdDistance, scaleStep, offsetStep, cancelRaf]
	);

	// Safe completion of drag gesture
	const finishDrag = useCallback(() => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;

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

	const handleEnd = useCallback(
		(pointerId?: number) => {
			if (!isDraggingRef.current) return;
			if (pointerId !== undefined && activeTargetRef.current) {
				try {
					activeTargetRef.current.releasePointerCapture(pointerId);
				} catch {
					// Ignore if capture was already released
				}
			}
			activePointerIdRef.current = null;
			activeTargetRef.current = null;
			finishDrag();
		},
		[finishDrag]
	);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (isAnimatingRef.current || visibleItems.length === 0) return;
		if (e.pointerType === 'mouse' && e.button !== 0) return;

		isDraggingRef.current = true;
		isLastCardRef.current = preventLastCardDismiss && currentIndexRef.current >= items.length - 1;
		activePointerIdRef.current = e.pointerId;
		activeTargetRef.current = e.currentTarget;

		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {
			// Ignore if pointer capture is unavailable
		}

		startPosRef.current = { x: e.clientX, y: e.clientY };
		currentPosRef.current = { x: e.clientX, y: e.clientY };
		ringBufferRef.current.clear();
		ringBufferRef.current.push(e.clientX, e.clientY, performance.now());
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;

		// Ironclad stickiness guard: If mouse button was released outside, stop dragging immediately
		if (e.pointerType === 'mouse' && e.buttons === 0) {
			handleEnd(e.pointerId);
			return;
		}

		if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;

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
		handleEnd(e.pointerId);
	};

	const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
		handleEnd(e.pointerId);
	};

	const handleLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
		handleEnd(e.pointerId);
	};

	// Global window listener: safety net for mouse/pointer released anywhere outside the browser/iframe
	useEffect(() => {
		const onGlobalPointerUp = (e: PointerEvent) => {
			if (isDraggingRef.current) {
				handleEnd(e.pointerId);
			}
		};
		window.addEventListener('pointerup', onGlobalPointerUp);
		window.addEventListener('pointercancel', onGlobalPointerUp);
		return () => {
			window.removeEventListener('pointerup', onGlobalPointerUp);
			window.removeEventListener('pointercancel', onGlobalPointerUp);
		};
	}, [handleEnd]);

	// Cleanup rAF on unmount
	useEffect(() => {
		return cancelRaf;
	}, [cancelRaf]);

	// Ensure top card transform is clean on index change
	useEffect(() => {
		const topEl = cardRefs.current[0];
		if (topEl) {
			topEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
			topEl.style.opacity = '1';
		}
		applyRestingTransforms();
	}, [currentIndex, applyRestingTransforms]);

	return (
		<div
			className={`relative select-none ${className}`}
			style={{ minHeight: '14.5rem' }} // 232px — perfectly hugs card height + background peek
		>
			{/* Unified card stack rendering: back-to-front by visual index */}
			{visibleItems.map((item, stackIdx) => {
				const isTop = stackIdx === 0;
				const itemKey = getItemKey(item, currentIndex + stackIdx);
				const t = calculateStackedCardTransform(stackIdx, 0, scaleStep, offsetStep);

				return (
					<div
						key={itemKey}
						ref={(node) => {
							cardRefs.current[stackIdx] = node;
						}}
						onPointerDown={isTop ? handlePointerDown : undefined}
						onPointerMove={isTop ? handlePointerMove : undefined}
						onPointerUp={isTop ? handlePointerUp : undefined}
						onPointerCancel={isTop ? handlePointerCancel : undefined}
						onLostPointerCapture={isTop ? handleLostPointerCapture : undefined}
						className={`absolute inset-0 flex items-center justify-center will-change-transform ${isTop ? 'cursor-grab touch-none active:cursor-grabbing' : 'pointer-events-none'}`}
						style={{
							zIndex: 30 - stackIdx * 10,
							transform: `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`,
							opacity: t.opacity.toFixed(2),
						}}
					>
						{renderCard(item, currentIndex + stackIdx)}
					</div>
				);
			})}

			{/* Empty state when all cards are dismissed */}
			{visibleItems.length === 0 &&
				(emptyState || <div className='border-border bg-card text-muted-foreground absolute inset-0 flex items-center justify-center rounded-2xl border p-8 text-center text-sm'>No more cards in stack.</div>)}
		</div>
	);
}
