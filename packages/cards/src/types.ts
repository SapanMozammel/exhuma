import type { CSSProperties, ReactNode, HTMLAttributes } from 'react';

export interface HorizontalScrollerProps {
	children: ReactNode;
	/**
	 * Speed factor for scroll translation distance multiplier.
	 * Default: 1.0
	 */
	speed?: number;
	/**
	 * Gap in pixels between horizontal track cards.
	 * Default: 28
	 */
	itemGap?: number;
	/**
	 * Fixed width in pixels of individual cards.
	 * Default: 320
	 */
	cardWidth?: number | string;
	/**
	 * Whether to display a kinetic bottom progress indicator track.
	 * Default: true
	 */
	showProgress?: boolean;
	/**
	 * Whether to apply gradient mask fading at horizontal boundaries.
	 * Default: true
	 */
	showFadeEdges?: boolean;
	/**
	 * Width in pixels of the left and right gradient fade masks.
	 * Default: 48
	 */
	fadeWidth?: number;
	/**
	 * Mobile fallback behavior below 768px ('scroll' = native horizontal swipe with snap, 'stack' = vertical list, 'pinned' = keep pin).
	 * Default: 'scroll'
	 */
	mobileMode?: 'scroll' | 'stack' | 'pinned';
	/**
	 * Optional pinned header content (title, eyebrow, CTA) that remains fixed while cards scroll.
	 */
	header?: ReactNode;
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

export interface StackingCardsProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/**
	 * Sticky start offset from top of viewport in px.
	 * Default: 20
	 */
	topStart?: number;
	/**
	 * Additional top increment for each subsequent card in px.
	 * Default: 28
	 */
	topIncrement?: number;
	/**
	 * Minimum scale for auto-generated values (e.g. 0.9 = 90% size).
	 * Default: 0.9
	 */
	minScale?: number;
	/**
	 * Threshold in px from top to trigger progressive scaling.
	 * Default: 150
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
	 * Vertical gap between cards before they stack over one another (in px or CSS string).
	 * Default: 20
	 */
	cardGap?: number | string;
	/**
	 * Alias for `cardGap`.
	 * Default: 20
	 */
	gap?: number | string;
	/**
	 * Whether reverse scaling exit cascade mechanics are enabled.
	 * Default: true
	 */
	reverseScale?: boolean;
	/**
	 * Alias for `reverseScale`.
	 * Default: true
	 */
	enableReverseScale?: boolean;
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
	 * Scale factor applied on card hover.
	 * Default: 1.02
	 */
	scale?: number;
	/**
	 * Spring damping response rate (0.05 - 0.30).
	 * Default: 0.12
	 */
	speed?: number;
	/**
	 * Enable dynamic specular glare reflection.
	 * Default: true
	 */
	glare?: boolean;
	/**
	 * Peak opacity of the specular glare reflection (0.0 - 1.0).
	 * Default: 0.3
	 */
	maxGlareOpacity?: number;
	/**
	 * Invert tilt direction (tilts towards cursor when true).
	 * Default: false
	 */
	reverse?: boolean;
	/**
	 * Programmatically disable tilt animations and glare.
	 * Default: false
	 */
	disabled?: boolean;
	/**
	 * Constrain tilt rotation axis ('all' = 3D, 'x' = pitch only, 'y' = yaw only).
	 * Default: 'all'
	 */
	axis?: 'all' | 'x' | 'y';
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
	 * Spotlight opacity when active (0.0 to 1.0).
	 * Default: 0.8
	 */
	opacity?: number;
	/**
	 * Sub-pixel border glow color.
	 * Default: 'rgba(99, 102, 241, 0.5)'
	 */
	borderColor?: string;
	/**
	 * Radial gradient falloff softness / spread percentage (20 to 100).
	 * Default: 80
	 */
	spread?: number;
	/**
	 * Spotlight rendering mode: 'both' | 'border' | 'background'.
	 * Default: 'both'
	 */
	mode?: 'both' | 'border' | 'background';
	/**
	 * Kinetic exponential smoothing factor (0.05 to 1.0).
	 * Default: 0.2
	 */
	smoothing?: number;
	/**
	 * Programmatically disable pointer tracking and spotlight illumination.
	 * Default: false
	 */
	disabled?: boolean;
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
