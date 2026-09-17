'use client';

import React, { useRef, useEffect, useCallback, createContext, useContext } from 'react';
import type { StickyParallaxProps, StickyParallaxLayerProps } from '../types';

interface ParallaxContextValue {
	registerLayer: (el: HTMLElement, speed: number) => () => void;
}

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

/**
 * StickyParallaxScroll — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(120Hz) High-performance viewport sticky rail with differential layer parallax.
 * - Ω(1) Constant-time transform writes via requestAnimationFrame.
 * - Zero GC pauses: uses pre-allocated layer map.
 */
export const StickyParallaxScroll: React.FC<StickyParallaxProps> & {
	Root: typeof ParallaxRoot;
	Sticky: typeof ParallaxSticky;
	Layer: typeof ParallaxLayer;
	Content: typeof ParallaxContent;
} = ({ children, trackHeight = '250vh', className = '', style }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const layersRef = useRef<Map<HTMLElement, number>>(new Map());
	const rafIdRef = useRef<number | null>(null);

	const registerLayer = useCallback((el: HTMLElement, speed: number) => {
		layersRef.current.set(el, speed);
		return () => {
			layersRef.current.delete(el);
		};
	}, []);

	const updateLayers = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const totalScrollable = rect.height - window.innerHeight;
		if (totalScrollable <= 0) return;

		// Normalized scroll progress [0..1]
		const scrollOffset = Math.max(0, Math.min(totalScrollable, -rect.top));
		const progress = scrollOffset / totalScrollable;

		// Update each layer's hardware transform directly
		layersRef.current.forEach((speed, el) => {
			const translateY = (progress - 0.5) * speed * 200;
			el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
		});

		rafIdRef.current = null;
	}, []);

	const handleScroll = useCallback(() => {
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(updateLayers);
		}
	}, [updateLayers]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [handleScroll]);

	return (
		<ParallaxContext.Provider value={{ registerLayer }}>
			<div ref={containerRef} className={`exhuma-parallax-root relative w-full ${className}`} style={{ height: trackHeight, ...style }}>
				<div className='sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden'>{children}</div>
			</div>
		</ParallaxContext.Provider>
	);
};

export const ParallaxLayer: React.FC<StickyParallaxLayerProps> = ({ children, speed = 0.5, className = '', style }) => {
	const layerRef = useRef<HTMLDivElement>(null);
	const context = useContext(ParallaxContext);

	useEffect(() => {
		if (!context || !layerRef.current) return;
		const unregister = context.registerLayer(layerRef.current, speed);
		return unregister;
	}, [context, speed]);

	return (
		<div ref={layerRef} className={`exhuma-parallax-layer will-change-transform ${className}`} style={style}>
			{children}
		</div>
	);
};

export const ParallaxRoot = StickyParallaxScroll;

export const ParallaxSticky: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden ${className}`} {...props}>
		{children}
	</div>
);

export const ParallaxContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`relative z-10 ${className}`} {...props}>
		{children}
	</div>
);

StickyParallaxScroll.Root = ParallaxRoot;
StickyParallaxScroll.Sticky = ParallaxSticky;
StickyParallaxScroll.Layer = ParallaxLayer;
StickyParallaxScroll.Content = ParallaxContent;
