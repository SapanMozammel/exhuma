'use client';

import React, { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
	SwipeVelocityRingBuffer,
	calculateCardRotation,
	evaluateSwipeDecision,
	calculateStackedCardTransform,
} from './swipe-math';

export interface CardSwipeStackProps<T> {
	items: T[];
	renderCard: (item: T, index: number) => ReactNode;
	onSwipe?: (item: T, direction: 'left' | 'right') => void;
	thresholdDistance?: number;
	thresholdVelocity?: number;
	maxRotation?: number;
	className?: string;
	emptyState?: ReactNode;
}

/**
 * CardSwipeStack — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - VelocityRingBuffer pre-allocated circular array for O(1) fling velocity tracking.
 * - Hardware-accelerated GPU transforms driven directly via rAF.
 * - Zero Framer Motion or GSAP.
 */
export function CardSwipeStack<T>({
	items,
	renderCard,
	onSwipe,
	thresholdDistance = 120,
	thresholdVelocity = 550,
	maxRotation = 20,
	className = '',
	emptyState = null,
}: CardSwipeStackProps<T>) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const topCardRef = useRef<HTMLDivElement>(null);
	const backgroundCardsRef = useRef<(HTMLDivElement | null)[]>([]);

	const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const isDraggingRef = useRef<boolean>(false);
	const ringBufferRef = useRef<SwipeVelocityRingBuffer>(new SwipeVelocityRingBuffer());
	const rafIdRef = useRef<number | null>(null);

	const visibleItems = items.slice(currentIndex, currentIndex + 3);

	const updateDOM = useCallback(() => {
		const dx = currentPosRef.current.x - startPosRef.current.x;
		const dy = currentPosRef.current.y - startPosRef.current.y;
		const rot = calculateCardRotation(dx, maxRotation, thresholdDistance * 1.5);
		const progress = Math.min(1, Math.abs(dx) / thresholdDistance);

		// Top card transform
		if (topCardRef.current) {
			topCardRef.current.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
		}

		// Background cards transforms
		backgroundCardsRef.current.forEach((el, idx) => {
			if (!el) return;
			const stackIdx = idx + 1; // 1-based index for cards behind
			const t = calculateStackedCardTransform(stackIdx, progress);
			el.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
			el.style.opacity = `${t.opacity.toFixed(2)}`;
		});
	}, [maxRotation, thresholdDistance]);

	const animateReturn = useCallback(() => {
		const el = topCardRef.current;
		if (!el) return;

		let start: number | null = null;
		const startX = currentPosRef.current.x - startPosRef.current.x;
		const startY = currentPosRef.current.y - startPosRef.current.y;
		const duration = 280;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const elapsed = timestamp - start;
			const p = Math.min(1, elapsed / duration);
			// Ease out quad
			const ease = 1 - (1 - p) * (1 - p);

			const curX = startX * (1 - ease);
			const curY = startY * (1 - ease);
			const rot = calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);

			el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

			// Background cards return
			const progress = Math.min(1, Math.abs(curX) / thresholdDistance);
			backgroundCardsRef.current.forEach((bgEl, idx) => {
				if (!bgEl) return;
				const stackIdx = idx + 1;
				const t = calculateStackedCardTransform(stackIdx, progress);
				bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
				bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
			});

			if (p < 1) {
				rafIdRef.current = requestAnimationFrame(step);
			} else {
				el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
				rafIdRef.current = null;
			}
		};

		rafIdRef.current = requestAnimationFrame(step);
	}, [maxRotation, thresholdDistance]);

	const animateDismiss = useCallback((direction: 'left' | 'right') => {
		const el = topCardRef.current;
		if (!el) return;

		const targetX = direction === 'right' ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
		const startX = currentPosRef.current.x - startPosRef.current.x;
		const startY = currentPosRef.current.y - startPosRef.current.y;
		const duration = 250;
		let start: number | null = null;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const elapsed = timestamp - start;
			const p = Math.min(1, elapsed / duration);
			const ease = p * p; // Accelerate fling

			const curX = startX + (targetX - startX) * ease;
			const rot = calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);

			el.style.transform = `translate3d(${curX.toFixed(2)}px, ${startY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
			el.style.opacity = `${(1 - p).toFixed(2)}`;

			if (p < 1) {
				rafIdRef.current = requestAnimationFrame(step);
			} else {
				// Fling complete -> advance index
				if (onSwipe && items[currentIndex]) {
					onSwipe(items[currentIndex], direction);
				}
				setCurrentIndex((prev) => prev + 1);
				if (el) {
					el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
					el.style.opacity = '1';
				}
				rafIdRef.current = null;
			}
		};

		rafIdRef.current = requestAnimationFrame(step);
	}, [currentIndex, items, maxRotation, onSwipe, thresholdDistance]);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (visibleItems.length === 0) return;
		isDraggingRef.current = true;
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
		updateDOM();
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		try {
			(e.target as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Ignore if not captured
		}

		const dx = currentPosRef.current.x - startPosRef.current.x;
		const velocityX = ringBufferRef.current.computeVelocityX();
		const decision = evaluateSwipeDecision(dx, velocityX, thresholdDistance, thresholdVelocity);

		if (decision.isDismissed && decision.direction) {
			animateDismiss(decision.direction);
		} else {
			animateReturn();
		}
	};

	const handlePointerCancel = () => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		animateReturn();
	};

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	if (currentIndex >= items.length) {
		return (
			<div className={`relative flex items-center justify-center ${className}`}>
				{emptyState || (
					<div className="text-center p-8 rounded-2xl border border-border bg-card text-muted-foreground text-sm">
						No more cards in stack.
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={`relative flex items-center justify-center select-none ${className}`}>
			{/* Stacked background cards rendered in reverse order */}
			{visibleItems
				.slice(1)
				.map((item, index) => {
					const stackIdx = index + 1;
					const t = calculateStackedCardTransform(stackIdx, 0);
					return (
						<div
							key={currentIndex + stackIdx}
							ref={(node) => {
								backgroundCardsRef.current[index] = node;
							}}
							className="absolute w-full max-w-sm pointer-events-none transition-transform will-change-transform"
							style={{
								transform: `translate3d(0, ${t.translateY}px, 0) scale(${t.scale})`,
								opacity: t.opacity,
								zIndex: 10 - stackIdx,
							}}
						>
							{renderCard(item, currentIndex + stackIdx)}
						</div>
					);
				})}

			{/* Active top card */}
			{visibleItems[0] && (
				<div
					ref={topCardRef}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerCancel}
					className="relative w-full max-w-sm cursor-grab active:cursor-grabbing touch-none will-change-transform"
					style={{ zIndex: 20 }}
				>
					{renderCard(visibleItems[0], currentIndex)}
				</div>
			)}
		</div>
	);
}
