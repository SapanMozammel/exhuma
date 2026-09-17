import React, { Children, isValidElement, useEffect, useRef } from 'react';
import type { StackingCardsProps } from '../types';

/**
 * Calculates progressive target scale values across stack layers.
 * The top cards scale down gracefully towards minScale as deeper cards scroll into view.
 */
export const calculateScaleValue = (index: number, totalScalingSections: number, minScale: number, targetScale = 1.0): number => {
	if (totalScalingSections <= 1) return targetScale;
	const progress = index / (totalScalingSections - 1);
	const scale = minScale + progress * (targetScale - minScale);
	return Number(scale.toPrecision(6));
};

export const generateDefaultScaleValues = (count: number, minScale = 0.94): number[] => {
	if (count <= 0) return [];
	if (count <= 2) {
		return Array(count).fill(1.0);
	}

	const scalingSectionCount = count - 1;
	const values: number[] = [];

	for (let i = 0; i < scalingSectionCount; i++) {
		const scale = calculateScaleValue(i, scalingSectionCount, minScale, 1.0);
		values.push(scale);
	}

	// Last section retains 1.0 scale as it crowns the stack
	values.push(1.0);
	return values;
};

export const StackingCards: React.FC<StackingCardsProps> = ({ children, topStart = 90, topIncrement = 24, minScale = 0.94, scaleThreshold = 120, scrollContainerRef, enabled = true, className = '', style }) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const childArray = Children.toArray(children);
	const scaleValues = generateDefaultScaleValues(childArray.length, minScale);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper || typeof window === 'undefined' || !enabled) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			cardRefs.current.forEach((card, index) => {
				if (!card) return;
				card.style.transform = 'scale(1)';
				card.style.zIndex = `${index + 1}`;
				card.style.top = `${topStart + index * topIncrement}px`;
			});
			return;
		}

		let rafId: number | undefined;

		const scrollTarget: HTMLElement | Window = scrollContainerRef?.current ?? window;

		const updateStackEffect = () => {
			const totalCards = cardRefs.current.length;
			if (totalCards === 0) return;

			const lastIndex = totalCards - 1;
			const lastCard = cardRefs.current[lastIndex];
			if (!lastCard) return;

			const containerRect = scrollContainerRef?.current?.getBoundingClientRect() ?? null;
			const containerTop = containerRect ? containerRect.top : 0;

			const lastRect = lastCard.getBoundingClientRect();
			const lastSectionTop = lastRect.top - containerTop;

			cardRefs.current.forEach((card, index) => {
				if (!card) return;

				const rect = card.getBoundingClientRect();
				const sectionTop = rect.top - containerTop;

				const sectionStickyTop = topStart + index * topIncrement;
				const animationRange = scaleThreshold + sectionStickyTop;

				let scaleProgress = 0;
				if (sectionTop <= animationRange) {
					scaleProgress = Math.max(0, Math.min(1, (animationRange - sectionTop) / scaleThreshold));
				}

				const startScale = 1.0;
				const targetScale = scaleValues[index] ?? 1.0;
				let currentScale = startScale + scaleProgress * (targetScale - startScale);

				// Reverse scale calculation when the stack reaches terminal scroll
				const reverseAnimationRange = index === lastIndex ? sectionStickyTop - topStart : sectionStickyTop;

				const denominator = reverseAnimationRange - topStart;
				if (denominator > 0 && lastSectionTop < reverseAnimationRange) {
					const reverseScaleProgress = Math.max(0, Math.min(1, (reverseAnimationRange - lastSectionTop) / denominator));
					currentScale = targetScale + reverseScaleProgress * (minScale - targetScale);
				}

				card.style.transform = `scale(${Number(currentScale.toFixed(5))})`;
				card.style.opacity = '1';
				card.style.zIndex = `${index + 1}`;
				card.style.transformOrigin = 'center top';
				card.style.willChange = 'transform';
			});
		};

		const handleScroll = () => {
			if (rafId !== undefined) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(updateStackEffect);
		};

		scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);

		// Initial calculation
		updateStackEffect();

		return () => {
			scrollTarget.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
			if (rafId !== undefined) cancelAnimationFrame(rafId);
		};
	}, [topStart, topIncrement, minScale, scaleThreshold, scrollContainerRef, enabled, childArray.length]);

	return (
		<div ref={wrapperRef} className={`exhuma-stacking-cards-wrapper relative flex w-full flex-col gap-6 ${className}`} style={style}>
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
