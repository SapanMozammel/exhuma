import React, { Children, useId } from 'react';
import type { CssMasonryProps } from '../types';

export const CssMasonry: React.FC<CssMasonryProps> = ({
	children,
	columns = 3,
	gap = '1.5rem',
	className = '',
	style,
}) => {
	const uniqueId = useId().replace(/:/g, '');
	const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

	const numCols = typeof columns === 'number' ? columns : 3;
	const responsiveCols = typeof columns === 'object' ? columns : {};

	return (
		<>
			<style>{`
				.exhuma-masonry-${uniqueId} {
					column-count: ${responsiveCols.sm || Math.min(numCols, 1)};
					column-gap: ${gapValue};
				}
				@media (min-width: 640px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${responsiveCols.sm || Math.min(numCols, 2)};
					}
				}
				@media (min-width: 768px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${responsiveCols.md || Math.min(numCols, 2)};
					}
				}
				@media (min-width: 1024px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${responsiveCols.lg || numCols};
					}
				}
				@media (min-width: 1280px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${responsiveCols.xl || numCols};
					}
				}
				.exhuma-masonry-${uniqueId} > * {
					break-inside: avoid;
					margin-bottom: ${gapValue};
					display: block;
				}
			`}</style>
			<div
				className={`exhuma-css-masonry exhuma-masonry-${uniqueId} w-full ${className}`}
				style={style}
			>
				{Children.map(children, (child, idx) => (
					<div key={idx} className="exhuma-masonry-item">
						{child}
					</div>
				))}
			</div>
		</>
	);
};
