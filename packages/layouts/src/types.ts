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
