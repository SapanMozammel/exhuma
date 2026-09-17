import type { CSSProperties, ReactNode } from 'react';

export interface CssMasonryProps {
	children: ReactNode;
	/**
	 * Number of columns or responsive column map.
	 * Default: 3
	 */
	columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
	/**
	 * Spacing between columns and items in px or rem.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface AutoGridProps {
	children: ReactNode;
	/**
	 * Minimum column width before wrapping.
	 * Default: 280
	 */
	minItemWidth?: number | string;
	/**
	 * CSS gap between items in px or rem.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface MacyMasonryProps {
	children: ReactNode;
	/**
	 * Number of columns for Macy height balancing.
	 * Default: 3
	 */
	columns?: number;
	/**
	 * Margin between items in px.
	 * Default: 20
	 */
	margin?: number;
	/**
	 * Breakpoints object for responsive column overrides.
	 * Example: { 1024: 3, 768: 2, 480: 1 }
	 */
	breakAt?: Record<number, number>;
	className?: string;
	style?: CSSProperties;
}

export interface InfiniteMarqueeProps {
	children: ReactNode;
	/**
	 * Scroll speed in pixels per second.
	 * Default: 40
	 */
	speed?: number;
	/**
	 * Direction of marquee translation.
	 * Default: 'left'
	 */
	direction?: 'left' | 'right';
	/**
	 * Smoothly decelerate to zero when hovered.
	 * Default: true
	 */
	pauseOnHover?: boolean;
	/**
	 * Spacing between items and repeated blocks.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface BentoGridProps {
	children: ReactNode;
	/**
	 * Maximum column count for large screens.
	 * Default: 3
	 */
	cols?: number | { sm?: number; md?: number; lg?: number };
	/**
	 * Spacing between bento tiles.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface BentoCardProps {
	children: ReactNode;
	/**
	 * Column span on desktop screens (1-4).
	 * Default: 1
	 */
	colSpan?: number;
	/**
	 * Row span on desktop screens (1-3).
	 * Default: 1
	 */
	rowSpan?: number;
	className?: string;
	style?: CSSProperties;
}

export interface DiamondGridProps {
	children: ReactNode;
	/**
	 * Spacing between diamond columns and elements.
	 * Default: '0.75vw'
	 */
	gap?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface ScrollTimelineItemData {
	id?: string | number;
	title: ReactNode;
	subtitle?: ReactNode;
	date?: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
}

export interface ScrollTimelineProps {
	children?: ReactNode;
	/**
	 * Structured items array or children compound nodes.
	 */
	items?: ScrollTimelineItemData[];
	/**
	 * Horizontal bezier amplitude for desktop serpentine curves.
	 * Default: 20
	 */
	curveWidth?: number;
	/**
	 * Vertical bezier transition height.
	 * Default: 40
	 */
	curveHeight?: number;
	/**
	 * Accent color for the active progress line.
	 * Default: 'currentColor'
	 */
	accentColor?: string;
	className?: string;
	style?: CSSProperties;
}

export interface StickyParallaxProps {
	children: ReactNode;
	/**
	 * Total scroll track height.
	 * Default: '250vh'
	 */
	trackHeight?: string;
	className?: string;
	style?: CSSProperties;
}

export interface StickyParallaxLayerProps {
	children: ReactNode;
	/**
	 * Multiplier for vertical parallax movement (-2.0 to 2.0).
	 * Default: 0.5
	 */
	speed?: number;
	className?: string;
	style?: CSSProperties;
}

export interface InteractiveGridPatternProps extends React.SVGAttributes<SVGSVGElement> {
	width?: number;
	height?: number;
	squares?: [number, number];
	className?: string;
}
