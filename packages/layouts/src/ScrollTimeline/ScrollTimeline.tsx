'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { ScrollTimelineProps, ScrollTimelineItemData } from '../types';
import { generateTimelinePath, checkTimelineDirection } from './timeline-path';

/**
 * ScrollTimeline — Exhuma Kinetic Methodology (EKM)
 * Elevated from sapan.dev
 *
 * Big-Omega (Ω) Guarantees:
 * - 100% Native SVG & passive rAF scroll tracking (ZERO Framer Motion).
 * - Closed-form cubic bezier curve path generator.
 * - Zero layout thrashing: node heights cached via ResizeObserver.
 * - Sub-pixel stroke-dashoffset interpolation.
 */
export const ScrollTimeline: React.FC<ScrollTimelineProps> & {
	Root: typeof TimelineRoot;
	Track: typeof TimelineTrack;
	Item: typeof TimelineItem;
	Point: typeof TimelinePoint;
	Content: typeof TimelineContent;
} = ({
	items = [],
	children,
	curveWidth = 24,
	curveHeight = 40,
	accentColor = 'var(--primary, #6366f1)',
	className = '',
	style,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const itemsContainerRef = useRef<HTMLDivElement>(null);
	const activePathRef = useRef<SVGPathElement>(null);
	const mobileActiveLineRef = useRef<HTMLDivElement>(null);

	const [nodeHeights, setNodeHeights] = useState<number[]>([]);
	const [totalHeight, setTotalHeight] = useState<number>(0);
	const pathLengthRef = useRef<number>(0);
	const rafIdRef = useRef<number | null>(null);

	// Measure node heights once using ResizeObserver (Zero layout thrashing)
	const measureNodes = useCallback(() => {
		const container = itemsContainerRef.current;
		if (!container) return;

		const itemEls = Array.from(container.querySelectorAll('.exhuma-timeline-item-anchor'));
		if (itemEls.length === 0) return;

		const containerRect = container.getBoundingClientRect();
		const heights = itemEls.map((el) => {
			const rect = el.getBoundingClientRect();
			return rect.top - containerRect.top;
		});

		setNodeHeights(heights);
		setTotalHeight(container.offsetHeight);
	}, []);

	useEffect(() => {
		measureNodes();
		const observer = new ResizeObserver(() => {
			measureNodes();
		});
		if (itemsContainerRef.current) {
			observer.observe(itemsContainerRef.current);
		}
		window.addEventListener('resize', measureNodes, { passive: true });
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', measureNodes);
		};
	}, [measureNodes, items]);

	// Pre-calculate SVG path
	const pathD = useMemo(
		() => generateTimelinePath(nodeHeights, 42, curveWidth, curveHeight),
		[nodeHeights, curveWidth, curveHeight]
	);

	// Measure SVG path length
	useEffect(() => {
		if (activePathRef.current) {
			try {
				const len = activePathRef.current.getTotalLength();
				pathLengthRef.current = len;
				activePathRef.current.style.strokeDasharray = `${len}`;
				activePathRef.current.style.strokeDashoffset = `${len}`;
			} catch {
				// Fallback for SSR/mock
			}
		}
	}, [pathD]);

	// Kinetic 120Hz scroll tracking without VDOM re-rendering
	const updateScrollProgress = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const startOffset = viewportHeight * 0.5;

		// Calculate normalized progress [0..1]
		const currentProgress = Math.max(
			0,
			Math.min(1, (startOffset - rect.top) / (rect.height || 1))
		);

		// Drive SVG path dashoffset directly (Zero VDOM updates)
		if (activePathRef.current && pathLengthRef.current > 0) {
			const offset = pathLengthRef.current * (1 - currentProgress);
			activePathRef.current.style.strokeDashoffset = `${offset.toFixed(2)}`;
		}

		// Drive mobile vertical line scale
		if (mobileActiveLineRef.current) {
			mobileActiveLineRef.current.style.transform = `scaleY(${currentProgress})`;
		}

		rafIdRef.current = null;
	}, []);

	const handleScroll = useCallback(() => {
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(updateScrollProgress);
		}
	}, [updateScrollProgress]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [handleScroll]);

	return (
		<div
			ref={containerRef}
			className={`exhuma-timeline-root relative w-full ${className}`}
			style={style}
		>
			{/* Mobile Rail (< md): straight vertical guide on left */}
			<div className="pointer-events-none absolute top-0 bottom-0 left-4 z-0 w-0.5 md:hidden">
				<div className="h-full w-full bg-border" />
				<div
					ref={mobileActiveLineRef}
					className="absolute top-0 left-0 w-full origin-top bg-primary"
					style={{
						height: '100%',
						backgroundColor: accentColor,
						transform: 'scaleY(0)',
						transition: 'transform 0.05s linear',
					}}
				/>
			</div>

			{/* Desktop S-Curve SVG Rail (>= md): centered serpentine line */}
			<div
				className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-0 hidden -translate-x-1/2 overflow-visible md:block"
				style={{ width: 400 }}
			>
				{nodeHeights.length > 0 && totalHeight > 0 && (
					<svg
						viewBox={`-200 0 400 ${totalHeight}`}
						width="400"
						height={totalHeight}
						className="absolute top-0 left-0 w-full"
						fill="none"
						preserveAspectRatio="none"
					>
						{/* Inactive background track */}
						<path
							d={pathD}
							stroke="currentColor"
							className="text-border"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						{/* Kinetic active progress beam */}
						<path
							ref={activePathRef}
							d={pathD}
							stroke={accentColor}
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
					</svg>
				)}
			</div>

			{/* Timeline items container */}
			<div ref={itemsContainerRef} className="relative z-10 flex flex-col space-y-12">
				{items.length > 0
					? items.map((item, idx) => {
							const isLeft = checkTimelineDirection(idx);
							return (
								<div
									key={item.id ?? idx}
									className={`exhuma-timeline-item-anchor relative flex w-full items-center ${
										isLeft
											? 'md:flex-row-reverse md:text-right'
											: 'md:flex-row md:text-left'
									} pl-10 md:pl-0`}
								>
									{/* Content card */}
									<div className="w-full md:w-[44%] rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md shadow-xs">
										{item.date && (
											<span className="text-xs font-mono font-bold text-primary">
												{item.date}
											</span>
										)}
										<h4 className="text-base font-bold text-foreground mt-1">
											{item.title}
										</h4>
										{item.subtitle && (
											<p className="text-xs font-medium text-muted-foreground mt-0.5">
												{item.subtitle}
											</p>
										)}
										{item.description && (
											<p className="text-xs text-muted-foreground leading-relaxed mt-2">
												{item.description}
											</p>
										)}
									</div>

									{/* Node beacon point */}
									<div className="absolute left-[-16px] md:left-1/2 md:-translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md">
										<div className="h-2.5 w-2.5 rounded-full bg-primary" />
									</div>
								</div>
							);
					  })
					: children}
			</div>
		</div>
	);
};

// Compound API Primitives
const TimelineRoot = ScrollTimeline;

const TimelineTrack: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = '',
	...props
}) => (
	<div className={`exhuma-timeline-track relative ${className}`} {...props}>
		{children}
	</div>
);

const TimelineItem: React.FC<
	React.HTMLAttributes<HTMLDivElement> & { align?: 'left' | 'right' }
> = ({ children, align = 'left', className = '', ...props }) => (
	<div
		className={`exhuma-timeline-item-anchor relative flex w-full items-center ${
			align === 'left'
				? 'md:flex-row-reverse md:text-right'
				: 'md:flex-row md:text-left'
		} pl-10 md:pl-0 ${className}`}
		{...props}
	>
		{children}
	</div>
);

const TimelinePoint: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = '',
	...props
}) => (
	<div
		className={`exhuma-timeline-point absolute left-[-16px] md:left-1/2 md:-translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md ${className}`}
		{...props}
	>
		{children || <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
	</div>
);

const TimelineContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = '',
	...props
}) => (
	<div
		className={`exhuma-timeline-content w-full md:w-[44%] rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md shadow-xs ${className}`}
		{...props}
	>
		{children}
	</div>
);

ScrollTimeline.Root = TimelineRoot;
ScrollTimeline.Track = TimelineTrack;
ScrollTimeline.Item = TimelineItem;
ScrollTimeline.Point = TimelinePoint;
ScrollTimeline.Content = TimelineContent;

export { TimelineRoot, TimelineTrack, TimelineItem, TimelinePoint, TimelineContent };
