import React, { useRef, useState } from 'react';
import type { TiltCardProps } from '../types';

export const TiltCard: React.FC<TiltCardProps> = ({ children, maxTilt = 15, perspective = 1000, glare = true, className = '', style, ...props }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [transform, setTransform] = useState('');
	const [glareOpacity, setGlareOpacity] = useState(0);
	const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const rotX = (y / rect.height - 0.5) * -maxTilt;
		const rotY = (x / rect.width - 0.5) * maxTilt;

		setTransform(`perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
		setGlareOpacity(0.3);
		setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
	};

	const handleMouseLeave = () => {
		setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
		setGlareOpacity(0);
	};

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={`exhuma-tilt-card relative overflow-hidden rounded-2xl transition-transform duration-200 ease-out will-change-transform ${className}`}
			style={{ transform, ...style }}
			{...props}
		>
			{children}
			{glare && (
				<div
					className='pointer-events-none absolute inset-0 transition-opacity duration-300'
					style={{
						opacity: glareOpacity,
						background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.8), transparent 60%)`,
					}}
				/>
			)}
		</div>
	);
};
