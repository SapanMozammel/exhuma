'use client';

import React, { useRef, useCallback } from 'react';
import type { BentoGridProps, BentoCardProps } from '../types';

/**
 * BentoGrid — Exhuma Kinetic Methodology (EKM)
 *
 * Modern responsive dense auto-flow grid with asymmetric spans and subtle
 * kinetic border sheen on hover. Zero layout shifts.
 */
export const BentoGrid: React.FC<BentoGridProps> & {
	Grid: typeof BentoGridRoot;
	Card: typeof BentoCard;
	Header: typeof BentoHeader;
	Content: typeof BentoContent;
	Visual: typeof BentoVisual;
} = ({
	children,
	cols = 3,
	gap = '1.5rem',
	className = '',
	style,
}) => {
	const colsVal = typeof cols === 'number' ? cols : (cols.lg ?? cols.md ?? 3);
	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;

	return (
		<div
			className={`exhuma-bento-grid grid w-full grid-flow-dense ${className}`}
			style={{
				gridTemplateColumns: `repeat(${colsVal}, minmax(0, 1fr))`,
				gap: gapVal,
				...style,
			}}
		>
			{children}
		</div>
	);
};

export const BentoCard: React.FC<BentoCardProps> = ({
	children,
	colSpan = 1,
	rowSpan = 1,
	className = '',
	style,
}) => {
	const cardRef = useRef<HTMLDivElement>(null);

	// Kinetic pointer sheen (Zero re-renders)
	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		const el = cardRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		el.style.setProperty('--bento-x', `${x.toFixed(1)}px`);
		el.style.setProperty('--bento-y', `${y.toFixed(1)}px`);
	}, []);

	return (
		<div
			ref={cardRef}
			onPointerMove={handlePointerMove}
			className={`exhuma-bento-card group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl ${className}`}
			style={{
				gridColumn: `span ${colSpan}`,
				gridRow: `span ${rowSpan}`,
				...style,
			}}
		>
			{/* Subtle kinetic radial sheen */}
			<div
				className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: `radial-gradient(400px circle at var(--bento-x, -999px) var(--bento-y, -999px), rgba(99, 102, 241, 0.08), transparent 80%)`,
				}}
			/>
			<div className="relative z-10 flex h-full flex-col justify-between">
				{children}
			</div>
		</div>
	);
};

export const BentoHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = '',
	...props
}) => (
	<div className={`exhuma-bento-header space-y-2 ${className}`} {...props}>
		{children}
	</div>
);

export const BentoContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = '',
	...props
}) => (
	<div className={`exhuma-bento-content text-sm text-muted-foreground ${className}`} {...props}>
		{children}
	</div>
);

export const BentoVisual: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className = '',
	...props
}) => (
	<div className={`exhuma-bento-visual my-auto flex items-center justify-center overflow-hidden py-4 ${className}`} {...props}>
		{children}
	</div>
);

const BentoGridRoot = BentoGrid;

BentoGrid.Grid = BentoGridRoot;
BentoGrid.Card = BentoCard;
BentoGrid.Header = BentoHeader;
BentoGrid.Content = BentoContent;
BentoGrid.Visual = BentoVisual;
