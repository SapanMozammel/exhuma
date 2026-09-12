import React, { useEffect, useRef, useState } from 'react';
import type { HorizontalScrollerProps } from '../types';

export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
	children,
	speed = 0.8,
	className = '',
	trackClassName = '',
	style,
}) => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [sectionHeight, setSectionHeight] = useState<number | undefined>(undefined);

	useEffect(() => {
		const section = sectionRef.current;
		const container = containerRef.current;
		const track = trackRef.current;
		if (!section || !container || !track || typeof window === 'undefined') return;

		const updateDimensions = () => {
			const containerWidth = container.offsetWidth;
			const trackWidth = track.scrollWidth;
			const scrollDistance = Math.max(0, trackWidth - containerWidth);
			const calculatedHeight = window.innerHeight + scrollDistance / Math.max(0.1, speed);
			setSectionHeight(calculatedHeight);
		};

		updateDimensions();

		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
		});

		resizeObserver.observe(container);
		resizeObserver.observe(track);
		window.addEventListener('resize', updateDimensions);

		let animationFrameId: number | undefined;

		const handleScroll = () => {
			if (!section || !container || !track) return;
			const sectionRect = section.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// If section is not visible, skip
			if (sectionRect.bottom < 0 || sectionRect.top > windowHeight) {
				return;
			}

			const totalDistance = section.offsetHeight - windowHeight;
			if (totalDistance <= 0) {
				track.style.transform = 'translate3d(0px, 0, 0)';
				return;
			}

			// Calculate progress from 0 to 1
			const scrollProgress = Math.max(0, Math.min(1, -sectionRect.top / totalDistance));
			const maxTranslateX = track.scrollWidth - container.offsetWidth;
			const translateX = -scrollProgress * Math.max(0, maxTranslateX);

			track.style.transform = `translate3d(${translateX}px, 0, 0)`;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateDimensions);
			resizeObserver.disconnect();
			if (animationFrameId !== undefined) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [speed]);

	return (
		<div
			ref={sectionRef}
			className={`exhuma-horizontal-scroller-section relative w-full ${className}`}
			style={{
				height: sectionHeight ? `${sectionHeight}px` : '200vh',
				...style,
			}}
		>
			<div
				ref={containerRef}
				className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
			>
				<div
					ref={trackRef}
					className={`flex gap-6 will-change-transform select-none ${trackClassName}`}
					style={{
						transition: 'transform 0.05s linear',
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
