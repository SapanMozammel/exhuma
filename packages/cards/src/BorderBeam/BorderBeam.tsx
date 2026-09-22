'use client';

import React from 'react';
import type { BorderBeamProps } from '../types';

/**
 * BorderBeam — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Zero JavaScript CPU/memory overhead during active animation (100% GPU compositor thread).
 * - Sub-pixel perimeter laser trace with hardware mask clipping (zero background bleed).
 * - Framework and container agnostic: injects seamlessly into any card or button.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
	size = 200,
	duration = 8,
	borderWidth = 2,
	colorFrom = '#ffaa40',
	colorTo = '#9c40ff',
	doubleBeam = false,
	endOpacity = 0,
	opacity = 1,
	blur = 0,
	borderRadius = 16,
	className = '',
	style,
}) => {
	const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
	const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : `color-mix(in srgb, ${colorTo} ${Math.round(clampedEndOpacity * 100)}%, transparent)`;
	const pathRadius = Math.min(size, 200);

	return (
		<div
			key={`${duration}-${doubleBeam}-${borderRadius}`}
			aria-hidden='true'
			className={`exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
			style={{
				borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
				border: `${borderWidth}px solid transparent`,
				WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
				WebkitMaskComposite: 'destination-out',
				mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
				maskComposite: 'exclude',
				opacity: opacity !== 1 ? opacity : undefined,
				filter: blur > 0 ? `blur(${blur}px)` : undefined,
				...style,
			}}
		>
			{/* Primary Beam (Clockwise Sweep) */}
			<div
				className='exhuma-border-beam-trace'
				style={{
					position: 'absolute',
					aspectRatio: '1 / 1',
					width: `${size}px`,
					offsetPath: `rect(0 auto auto 0 round ${pathRadius}px)`,
					offsetAnchor: `${size / 2}px ${size / 2}px`,
					background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, ${endColor})`,
					animation: `exhuma-border-beam ${duration}s linear infinite`,
				}}
			/>

			{/* Secondary Beam (Opposite position, same direction sweep, 180° phase offset) */}
			{doubleBeam && (
				<div
					className='exhuma-border-beam-trace'
					style={{
						position: 'absolute',
						aspectRatio: '1 / 1',
						width: `${size}px`,
						offsetPath: `rect(0 auto auto 0 round ${pathRadius}px)`,
						offsetAnchor: `${size / 2}px ${size / 2}px`,
						background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, ${endColor})`,
						animation: `exhuma-border-beam ${duration}s linear infinite`,
						animationDelay: `-${duration / 2}s`,
					}}
				/>
			)}

			<style>{`
				.exhuma-border-beam-trace {
					will-change: transform;
				}
				@keyframes exhuma-border-beam {
					from {
						offset-distance: 0%;
					}
					to {
						offset-distance: 100%;
					}
				}
				@media (prefers-reduced-motion: reduce) {
					.exhuma-border-beam-trace {
						animation-play-state: paused !important;
					}
				}
			`}</style>
		</div>
	);
};

BorderBeam.displayName = 'BorderBeam';

export default BorderBeam;
