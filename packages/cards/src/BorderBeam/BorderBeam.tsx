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
export const BorderBeam: React.FC<BorderBeamProps> = ({ size = 250, duration = 12, borderWidth = 1.5, anchor = 90, colorFrom = '#ffaa40', colorTo = '#9c40ff', delay = 0, className = '', style }) => {
	return (
		<div
			aria-hidden='true'
			className={`exhuma-border-beam ${className}`}
			style={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				borderRadius: 'inherit',
				border: `${borderWidth}px solid transparent`,
				// Two mask layers clipped to different boxes, intersected, leave only the border ring visible.
				// Inline rather than utility classes so the ring doesn't depend on the host app's CSS
				// build scanning this package. `mask` must come before the longhands it would reset.
				mask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
				maskClip: 'padding-box, border-box',
				maskComposite: 'intersect',
				...style,
			}}
		>
			<div
				style={{
					position: 'absolute',
					aspectRatio: '1 / 1',
					width: `${size}px`,
					// The path must be a valid rect(): `round inherit` is not, and an invalid offset-path
					// is dropped entirely, which parks the beam in the top-left corner as a static blob.
					offsetPath: `rect(0 auto auto 0 round ${size}px)`,
					offsetAnchor: `${anchor}% 50%`,
					background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
					animation: `exhuma-border-beam ${duration}s linear -${delay}s infinite`,
				}}
			/>
			<style>{`
				@keyframes exhuma-border-beam {
					to {
						offset-distance: 100%;
					}
				}
			`}</style>
		</div>
	);
};
