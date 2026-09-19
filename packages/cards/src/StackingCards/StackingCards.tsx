import React, { Children, isValidElement, useEffect, useRef } from 'react';
import type { StackingCardsProps } from '../types';

/**
 * Calculates progressive target scale values across stack layers.
 * Card at index 0 = most scaled down (bottom of stack visual).
 * Card at last index = 1.0 (top of stack, full size).
 */
export const calculateScaleValue = (index: number, totalScalingSections: number, minScale: number, targetScale = 1.0): number => {
	if (totalScalingSections <= 1) return targetScale;
	const progress = index / (totalScalingSections - 1);
	const scale = minScale + progress * (targetScale - minScale);
	return Number(scale.toPrecision(6));
};

export const generateDefaultScaleValues = (count: number, minScale = 0.94): number[] => {
	if (count <= 0) return [];
	if (count <= 2) return Array(count).fill(1.0);

	const values: number[] = [];
	for (let i = 0; i < count; i++) {
		values.push(calculateScaleValue(i, count - 1, minScale, 1.0));
	}
	return values;
};

export const StackingCards: React.FC<StackingCardsProps> = ({
	children,
	topStart = 90,
	topIncrement = 24,
	minScale = 0.94,
	scaleThreshold = 120,
	scrollContainerRef,
	enabled = true,
	className = '',
	style,
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const childArray = Children.toArray(children);
	const totalCards = childArray.length;
	const scaleValues = generateDefaultScaleValues(totalCards, minScale);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper || typeof window === 'undefined' || !enabled || totalCards === 0) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			cardRefs.current.forEach((card, index) => {
				if (!card) return;
				card.style.transform = 'scale(1)';
				card.style.zIndex = `${index + 1}`;
			});
			return;
		}

		let rafId: number | undefined;
		const scrollTarget: HTMLElement | Window = scrollContainerRef?.current ?? window;

		const updateStackEffect = () => {
			// Get current scroll position relative to the container
			const scrollContainer = scrollContainerRef?.current;
			const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;

			// Get wrapper's offsetTop relative to scroll container
			const wrapperOffsetTop = scrollContainer
				? wrapper.offsetTop - scrollContainer.offsetTop
				: wrapper.getBoundingClientRect().top + scrollTop;

			cardRefs.current.forEach((card, index) => {
				if (!card) return;

				// The card's own sticky top position
				const cardStickyTop = topStart + index * topIncrement;

				// How far into the wrapper has the user scrolled past this card's section?
				// Each card "section" starts when scrollTop reaches: wrapperOffsetTop + index * card height
				// But we drive it purely from scrollTop vs the card's sticky threshold.
				//
				// Classic sapan.dev behaviour: card[i] starts shrinking when the card below it
				// (card[i+1]) is about to slide under it. That happens when scroll reaches:
				//   wrapperOffsetTop + (i+1) * sectionHeight - scaleThreshold
				//
				// We approximate sectionHeight as cardStickyTop gap to next card.

				// Position of card relative to the sticky viewport origin
				const cardTop = wrapperOffsetTop + index * scaleThreshold - scrollTop + cardStickyTop;

				// scaleProgress: 0 = full size, 1 = targetScale (shrunk)
				// Card begins shrinking as the NEXT card approaches its sticky position.
				// We measure: how far has card[index+1]'s arrival pushed card[index] away?
				const nextCardThreshold = wrapperOffsetTop + (index + 1) * scaleThreshold - scrollTop + cardStickyTop;
				const shrinkTrigger = topIncrement;

				let scaleProgress = 0;
				if (nextCardThreshold < cardStickyTop + scaleThreshold + shrinkTrigger && index < totalCards - 1) {
					const rawProgress = (cardStickyTop + scaleThreshold + shrinkTrigger - nextCardThreshold) / scaleThreshold;
					scaleProgress = Math.max(0, Math.min(1, rawProgress));
				}

				const targetScale = scaleValues[index] ?? 1.0;
				const currentScale = 1.0 + scaleProgress * (targetScale - 1.0);

				card.style.transform = `scale(${Number(currentScale.toFixed(5))})`;
				card.style.zIndex = `${index + 1}`;
				card.style.transformOrigin = 'center top';
				card.style.willChange = 'transform';

				// suppress unused variable lint for cardTop
				void cardTop;
			});
		};

		const handleScroll = () => {
			if (rafId !== undefined) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(updateStackEffect);
		};

		scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);
		updateStackEffect();

		return () => {
			scrollTarget.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
			if (rafId !== undefined) cancelAnimationFrame(rafId);
		};
	}, [topStart, topIncrement, minScale, scaleThreshold, scrollContainerRef, enabled, totalCards, scaleValues]);

	return (
		<div ref={wrapperRef} className={`exhuma-stacking-cards-wrapper relative flex w-full flex-col ${className}`} style={style}>
			{childArray.map((child, index) => {
				const stickyTop = topStart + index * topIncrement;
				return (
					<div
						key={index}
						ref={(el) => {
							cardRefs.current[index] = el;
						}}
						className='sticky w-full will-change-transform'
						style={{
							top: `${stickyTop}px`,
							zIndex: index + 1,
							transformOrigin: 'center top',
						}}
					>
						{isValidElement(child) ? child : <div>{child}</div>}
					</div>
				);
			})}
		</div>
	);
};
