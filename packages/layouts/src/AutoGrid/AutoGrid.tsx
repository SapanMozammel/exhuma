import React from 'react';
import type { AutoGridProps } from '../types';

export const AutoGrid: React.FC<AutoGridProps> = ({
	children,
	minItemWidth = 280,
	gap = '1.5rem',
	className = '',
	style,
}) => {
	const minWidthVal =
		typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth;
	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;

	return (
		<div
			className={`exhuma-auto-grid grid w-full ${className}`}
			style={{
				gridTemplateColumns: `repeat(auto-fit, minmax(${minWidthVal}, 1fr))`,
				gap: gapVal,
				...style,
			}}
		>
			{children}
		</div>
	);
};
