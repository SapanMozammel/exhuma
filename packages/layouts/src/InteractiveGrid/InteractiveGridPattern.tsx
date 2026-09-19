'use client';

import React, { useRef, useState, useCallback, useId } from 'react';

export interface InteractiveGridPatternProps extends React.SVGAttributes<SVGSVGElement> {
	width?: number;
	height?: number;
	squares?: [number, number];
	className?: string;
}

/**
 * InteractiveGridPattern — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Sub-pixel SVG grid pattern with interactive square activation.
 * - Hardware-accelerated transitions via CSS.
 * - Zero external animation libraries.
 */
export const InteractiveGridPattern: React.FC<InteractiveGridPatternProps> = ({ width = 40, height = 40, squares = [24, 24], className = '', ...props }) => {
	const patternId = useId();
	const [hoveredSquare, setHoveredSquare] = useState<[number, number] | null>(null);

	const [horizontal, vertical] = squares;

	const handleMouseEnter = useCallback((x: number, y: number) => {
		setHoveredSquare([x, y]);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setHoveredSquare(null);
	}, []);

	return (
		<svg aria-hidden='true' className={`exhuma-interactive-grid pointer-events-auto size-full stroke-neutral-400/30 dark:stroke-neutral-700/30 ${className}`} {...props}>
			<defs>
				<pattern id={patternId} width={width} height={height} patternUnits='userSpaceOnUse' x={-1} y={-1}>
					<path d={`M.5 ${height}V.5H${width}`} fill='none' strokeDasharray='0' />
				</pattern>
			</defs>
			<rect width='100%' height='100%' strokeWidth='0' fill={`url(#${patternId})`} />
			<svg x={-1} y={-1} className='overflow-visible'>
				{Array.from({ length: horizontal }).map((_, x) =>
					Array.from({ length: vertical }).map((_, y) => {
						const isHovered = hoveredSquare && hoveredSquare[0] === x && hoveredSquare[1] === y;
						return (
							<rect
								key={`${x}-${y}`}
								strokeWidth='0'
								width={width - 1}
								height={height - 1}
								x={x * width + 1}
								y={y * height + 1}
								onMouseEnter={() => handleMouseEnter(x, y)}
								onMouseLeave={handleMouseLeave}
								className={`cursor-pointer transition-colors duration-500 ${isHovered ? 'fill-primary/25 stroke-primary/50 duration-75' : 'hover:fill-primary/15 fill-transparent'}`}
							/>
						);
					})
				)}
			</svg>
		</svg>
	);
};
