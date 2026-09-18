import type { CSSProperties, ReactNode } from 'react';

export interface HorizontalScrollerProps {
	children: ReactNode;
	/**
	 * Speed factor for scroll translation.
	 * Default: 0.85
	 */
	speed?: number;
	/**
	 * Optional scroll container reference (if inside an overflow scroll element rather than window).
	 */
	scrollContainerRef?: React.RefObject<HTMLElement | null>;
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
	 * Default: 90
	 */
	topStart?: number;
	/**
	 * Additional top increment for each subsequent card in px.
	 * Default: 24
	 */
	topIncrement?: number;
	/**
	 * Minimum scale for auto-generated values (e.g. 0.94 = 94% size).
	 * Default: 0.94
	 */
	minScale?: number;
	/**
	 * Threshold in px from top to trigger progressive scaling.
	 * Default: 120
	 */
	scaleThreshold?: number;
	/**
	 * Optional scroll container reference (if inside an overflow scroll element rather than window).
	 */
	scrollContainerRef?: React.RefObject<HTMLElement | null>;
	/**
	 * Whether the dynamic stacking calculations are enabled.
	 * Default: true
	 */
	enabled?: boolean;
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

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/**
	 * Maximum tilt angle in degrees.
	 * Default: 15
	 */
	maxTilt?: number;
	/**
	 * 3D perspective depth in pixels.
	 * Default: 1000
	 */
	perspective?: number;
	/**
	 * Enable dynamic specular glare reflection.
	 * Default: true
	 */
	glare?: boolean;
	/**
	 * Additional CSS class for card container
	 */
	className?: string;
	/**
	 * Inline styling overrides
	 */
	style?: CSSProperties;
}

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/**
	 * Radius of the spotlight in pixels.
	 * Default: 350
	 */
	radius?: number;
	/**
	 * Color of the spotlight glow (hex, rgb, or rgba).
	 * Default: 'rgba(99, 102, 241, 0.25)'
	 */
	color?: string;
	/**
	 * Spotlight opacity when active.
	 * Default: 0.8
	 */
	opacity?: number;
	/**
	 * Sub-pixel border glow color.
	 * Default: 'rgba(99, 102, 241, 0.5)'
	 */
	borderColor?: string;
	/**
	 * Additional CSS class for card container
	 */
	className?: string;
	/**
	 * Inline styling overrides
	 */
	style?: CSSProperties;
}

export interface BorderBeamProps {
	/**
	 * Size/length of the beam in pixels.
	 * Default: 250
	 */
	size?: number;
	/**
	 * Duration of one full loop in seconds.
	 * Default: 12
	 */
	duration?: number;
	/**
	 * Width of the perimeter border beam in pixels.
	 * Default: 1.5
	 */
	borderWidth?: number;
	/**
	 * Point on the beam that rides the border path, as a percentage of the beam's length (0–100).
	 * Default: 90
	 */
	anchor?: number;
	/**
	 * Start gradient color.
	 * Default: '#ffaa40'
	 */
	colorFrom?: string;
	/**
	 * End gradient color.
	 * Default: '#9c40ff'
	 */
	colorTo?: string;
	/**
	 * Animation delay in seconds.
	 * Default: 0
	 */
	delay?: number;
	className?: string;
	style?: CSSProperties;
}

export type { CardSwipeStackProps } from './CardSwipeStack/CardSwipeStack';
export type { ComparisonSliderProps } from './ComparisonSlider/ComparisonSlider';
export type { ExpandableCardProps } from './ExpandableCard/ExpandableCard';
