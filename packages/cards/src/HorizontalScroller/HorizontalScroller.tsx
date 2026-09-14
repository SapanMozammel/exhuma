import React, { useEffect, useRef, useState } from 'react';
import type { HorizontalScrollerProps } from '../types';

export const calculateHorizontalDistance = (
	trackWidth: number,
	containerWidth: number,
	extraPadding = 60
): number => {
	return Math.max(0, trackWidth - containerWidth + extraPadding);
};

export const calculateSectionHeight = (
	viewportHeight: number,
	horizontalDistance: number,
	speed = 0.85
): number => {
	const safeSpeed = Math.max(0.1, speed);
	return Math.round(viewportHeight + horizontalDistance / safeSpeed);
};

export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
	children,
	speed = 0.85,
	scrollContainerRef,
	className = '',
	trackClassName = '',
	style,
}) => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const stickyWrapRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [sectionHeight, setSectionHeight] = useState<number | undefined>(undefined);
	const [isReducedMotion, setIsReducedMotion] = useState(false);

	useEffect(() => {
		const section = sectionRef.current;
		const stickyWrap = stickyWrapRef.current;
		const track = trackRef.current;
		if (!section || !stickyWrap || !track || typeof window === 'undefined') return;

		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		setIsReducedMotion(prefersReducedMotion);

		if (prefersReducedMotion) {
			track.style.removeProperty('--scroll-offset-x');
			return;
		}

		let cachedHorizontalDistance = 0;
		let isIntersecting = false;
		let isTicking = false;

		const scrollTarget: HTMLElement | Window =
			scrollContainerRef?.current ?? window;

		const recalculateDimensions = () => {
			const viewportHeight = scrollContainerRef?.current
				? scrollContainerRef.current.clientHeight
				: window.innerHeight;
			const trackWidth = track.scrollWidth;
			const containerWidth = stickyWrap.clientWidth;

			const horizontalDistance = calculateHorizontalDistance(
				trackWidth,
				containerWidth
			);
			cachedHorizontalDistance = horizontalDistance;

			const computedSectionHeight = calculateSectionHeight(
				viewportHeight,
				horizontalDistance,
				speed
			);
			setSectionHeight(computedSectionHeight);
		};

		recalculateDimensions();

		const resizeObserver = new ResizeObserver(() => {
			recalculateDimensions();
			handleScroll();
		});

		resizeObserver.observe(stickyWrap);
		resizeObserver.observe(track);

		const handleScroll = () => {
			if (!isIntersecting && !scrollContainerRef?.current) return;

			const sectionRect = section.getBoundingClientRect();
			let containerTop = 0;
			let viewportHeight = window.innerHeight;

			if (scrollContainerRef?.current) {
				const cRect = scrollContainerRef.current.getBoundingClientRect();
				containerTop = cRect.top;
				viewportHeight = scrollContainerRef.current.clientHeight;
			}

			const relativeTop = sectionRect.top - containerTop;
			const totalScrollable = section.offsetHeight - viewportHeight;

			if (totalScrollable <= 0) {
				track.style.setProperty('--scroll-offset-x', '0px');
				return;
			}

			const scrolledInto = -relativeTop;
			const progress = Math.min(Math.max(scrolledInto / totalScrollable, 0), 1);
			const currentTranslate = -(progress * cachedHorizontalDistance);

			track.style.setProperty(
				'--scroll-offset-x',
				`${Number(currentTranslate.toFixed(2))}px`
			);
		};

		const onScroll = () => {
			if (!isTicking) {
				window.requestAnimationFrame(() => {
					handleScroll();
					isTicking = false;
				});
				isTicking = true;
			}
		};

		let observer: IntersectionObserver | null = null;
		if (!scrollContainerRef?.current) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						isIntersecting = entry.isIntersecting;
						if (isIntersecting) {
							handleScroll();
						}
					});
				},
				{ rootMargin: '100px 0px 100px 0px', threshold: 0 }
			);
			observer.observe(section);
		} else {
			isIntersecting = true;
		}

		scrollTarget.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', recalculateDimensions);

		// Initial frame
		handleScroll();

		return () => {
			scrollTarget.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', recalculateDimensions);
			resizeObserver.disconnect();
			if (observer) observer.disconnect();
		};
	}, [speed, scrollContainerRef]);

	if (isReducedMotion) {
		return (
			<div
				className={`exhuma-horizontal-scroller-fallback w-full overflow-x-auto py-8 ${className}`}
				style={style}
			>
				<div className={`flex gap-6 px-6 ${trackClassName}`}>{children}</div>
			</div>
		);
	}

	return (
		<div
			ref={sectionRef}
			className={`exhuma-horizontal-scroller-section relative w-full ${className}`}
			style={{
				height: sectionHeight ? `${sectionHeight}px` : '180vh',
				...style,
			}}
		>
			<div
				ref={stickyWrapRef}
				className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
			>
				<div
					ref={trackRef}
					className={`flex gap-6 will-change-transform select-none ${trackClassName}`}
					style={{
						transform: 'translate3d(var(--scroll-offset-x, 0px), 0px, 0px)',
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
