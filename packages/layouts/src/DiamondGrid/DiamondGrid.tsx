'use client';

import React, { Children, useMemo, type ReactNode } from 'react';
import type { DiamondGridProps } from '../types';
import { getDiamondLayoutConfig, partitionDiamondItems } from './diamond-layout';

/**
 * DiamondGrid — Exhuma Kinetic Methodology (EKM)
 * Elevated from sapan.dev
 *
 * Symmetrical rhombic column layout [1, 2, 3, 4, 3, 2, 1] with responsive
 * mobile collapse.
 */
export const DiamondGrid: React.FC<DiamondGridProps> & {
	Grid: typeof DiamondGridRoot;
	Column: typeof DiamondColumn;
	Item: typeof DiamondItem;
} = ({
	children,
	gap = '0.75vw',
	className = '',
	style,
}) => {
	const childrenArray = useMemo(() => Children.toArray(children), [children]);
	const totalItems = childrenArray.length;

	const config = useMemo(() => getDiamondLayoutConfig(totalItems), [totalItems]);
	const columnGroups = useMemo(
		() => partitionDiamondItems(childrenArray, config),
		[childrenArray, config]
	);

	const gridTemplateColumns = useMemo(
		() => `repeat(${config.columns}, minmax(0, 1fr))`,
		[config.columns]
	);

	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;

	return (
		<div className={`exhuma-diamond-grid flex w-full flex-col gap-4 ${className}`} style={style}>
			{/* Mobile layout: standard 4-column compact grid (< md) */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:hidden">
				{childrenArray.map((item, index) => (
					<div key={`diamond-mobile-${index}`} className="flex justify-center items-center">
						{item}
					</div>
				))}
			</div>

			{/* Large screens: Rhombic Diamond pattern (>= md) */}
			<div
				className="hidden w-full md:grid items-center justify-center"
				style={{
					gridTemplateColumns,
					gap: gapVal,
				}}
			>
				{columnGroups.map((columnItems, columnIndex) => (
					<DiamondColumn
						key={`diamond-col-${columnIndex}`}
						columnIndex={columnIndex}
						gap={gapVal}
					>
						{columnItems.map((group) => (
							<DiamondItem key={`item-${group.index}`}>
								{group.item}
							</DiamondItem>
						))}
					</DiamondColumn>
				))}
			</div>
		</div>
	);
};

export const DiamondColumn: React.FC<{
	children: ReactNode;
	columnIndex: number;
	gap?: string;
	className?: string;
}> = ({ children, columnIndex, gap = '0.75vw', className = '' }) => (
	<div
		className={`exhuma-diamond-column flex flex-col items-center justify-center ${className}`}
		style={{
			gridColumn: columnIndex + 1,
			gap,
		}}
	>
		{children}
	</div>
);

export const DiamondItem: React.FC<{
	children: ReactNode;
	className?: string;
}> = ({ children, className = '' }) => (
	<div className={`exhuma-diamond-item ${className}`}>
		{children}
	</div>
);

const DiamondGridRoot = DiamondGrid;

DiamondGrid.Grid = DiamondGridRoot;
DiamondGrid.Column = DiamondColumn;
DiamondGrid.Item = DiamondItem;
