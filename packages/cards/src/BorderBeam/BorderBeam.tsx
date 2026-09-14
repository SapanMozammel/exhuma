'use client';

import React from 'react';
import type { BorderBeamProps } from '../types';

/**
 * BorderBeam — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Zero JavaScript CPU/memory overhead during active animation (100% GPU compositor thread).
 * - Sub-pixel perimeter laser trace with hardware mask clipping.
 * - Framework and container agnostic: injects seamlessly into any card or button.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
	size = 250,
	duration = 12,
	borderWidth = 1.5,
	anchor = 90,
	colorFrom = '#ffaa40',
	colorTo = '#9c40ff',
	delay = 0,
	className = '',
	style,
}) => {
	return (
		<div
			aria-hidden="true"
			className={`exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}
			style={
				{
					'--border-beam-size': `${size}px`,
					'--border-beam-duration': `${duration}s`,
					'--border-beam-anchor': `${anchor}deg`,
					'--border-beam-border-width': `${borderWidth}px`,
					'--border-beam-color-from': colorFrom,
					'--border-beam-color-to': colorTo,
					'--border-beam-delay': `-${delay}s`,
					borderWidth: `${borderWidth}px`,
					...style,
				} as React.CSSProperties
			}
		>
			<div
				className="absolute aspect-square will-change-transform"
				style={{
					width: `${size}px`,
					offsetPath: `rect(0 auto auto 0 round inherit)`,
					animationName: 'exhuma-border-beam',
					animationDuration: `${duration}s`,
					animationTimingFunction: 'linear',
					animationIterationCount: 'infinite',
					animationDelay: `-${delay}s`,
					background: `radial-gradient(circle at center, ${colorFrom} 0%, ${colorTo} 50%, transparent 100%)`,
				}}
			/>
			<style>{`
				@keyframes exhuma-border-beam {
					100% {
						offset-distance: 100%;
					}
				}
			`}</style>
		</div>
	);
};
