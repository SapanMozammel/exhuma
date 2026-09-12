import React, {
	Children,
	isValidElement,
	useEffect,
	useRef,
} from 'react';
import type { StackingCardsProps } from '../types';

export const StackingCards: React.FC<StackingCardsProps> = ({
	children,
	topStart = 80,
	topIncrement = 20,
	minScale = 0.9,
	scaleThreshold = 400,
	className = '',
	style,
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const childArray = Children.toArray(children);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper || typeof window === 'undefined') return;

		let rafId: number;

		const updateStack = () => {
			const totalCards = cardRefs.current.length;
			if (totalCards === 0) return;

			const lastIndex = totalCards - 1;
			const lastCard = cardRefs.current[lastIndex];
			const lastCardTop = lastCard ? lastCard.getBoundingClientRect().top : 0;

			cardRefs.current.forEach((card, index) => {
				if (!card) return;

				const rect = card.getBoundingClientRect();
				const cardTop = rect.top;
				const stickyTop = topStart + index * topIncrement;

				// Scale decay calculation
				// Target scale decreases as card index is deeper in the stack
				const targetScale = 1.0 - (1.0 - minScale) * ((totalCards - 1 - index) / Math.max(1, totalCards - 1));

				const animationRange = scaleThreshold + stickyTop;
				let scaleProgress = 0;

				if (cardTop <= animationRange) {
					scaleProgress = Math.max(0, Math.min(1, (animationRange - cardTop) / scaleThreshold));
				}

				const currentScale = 1.0 + scaleProgress * (targetScale - 1.0);

				card.style.transform = `scale(${currentScale})`;
				card.style.zIndex = `${index + 1}`;
				card.style.transformOrigin = 'center top';
			});
		};

		const handleScroll = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(updateStack);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);
		updateStack();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
			cancelAnimationFrame(rafId);
		};
	}, [topStart, topIncrement, minScale, scaleThreshold, childArray.length]);

	return (
		<div
			ref={wrapperRef}
			className={`exhuma-stacking-cards-wrapper relative flex flex-col gap-6 w-full ${className}`}
			style={style}
		>
			{childArray.map((child, index) => {
				const stickyTop = topStart + index * topIncrement;
				return (
					<div
						key={index}
						ref={(el) => {
							cardRefs.current[index] = el;
						}}
						className="sticky w-full will-change-transform"
						style={{
							top: `${stickyTop}px`,
							transition: 'transform 0.1s ease-out',
						}}
					>
						{isValidElement(child) ? child : <div>{child}</div>}
					</div>
				);
			})}
		</div>
	);
};
