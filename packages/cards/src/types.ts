import type { CSSProperties, ReactNode } from 'react';

export interface HorizontalScrollerProps {
	children: ReactNode;
	/**
	 * Speed factor for scroll translation.
	 * Default: 0.8
	 */
	speed?: number;
	/**
	 * Additional CSS class for outer container
	 */
	className?: string;
	/**
	 * Additional CSS class for the track/canvas
	 */
	trackClassName?: string;
	/**
	 * Inline styling overrides
	 */
	style?: CSSProperties;
}

export interface StackingCardsProps {
	children: ReactNode;
	/**
	 * Sticky start offset from top of viewport in px.
	 * Default: 80
	 */
	topStart?: number;
	/**
	 * Additional top increment for each subsequent card in px.
	 * Default: 16
	 */
	topIncrement?: number;
	/**
	 * Maximum scale reduction for stacked cards underneath (e.g. 0.9 = 90% size).
	 * Default: 0.92
	 */
	minScale?: number;
	/**
	 * Threshold in px over which scaling is calculated.
	 * Default: 400
	 */
	scaleThreshold?: number;
	/**
	 * Additional CSS class for wrapper container
	 */
	className?: string;
	/**
	 * Inline styles for the wrapper
	 */
	style?: CSSProperties;
}

export interface StackingCardItemProps {
	children: ReactNode;
	index: number;
	className?: string;
	style?: CSSProperties;
}
