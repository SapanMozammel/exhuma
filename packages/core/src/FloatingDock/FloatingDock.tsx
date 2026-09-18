'use client';

import React, { useRef, useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react';
import { calculateDockItemSize } from './dock-math';

export interface FloatingDockItemData {
	title: string;
	icon: ReactNode;
	href?: string;
	onClick?: () => void;
}

export interface FloatingDockProps {
	items?: FloatingDockItemData[];
	children?: ReactNode;
	baseSize?: number;
	maxMagnification?: number;
	influenceRadius?: number;
	className?: string;
	style?: React.CSSProperties;
}

interface DockContextValue {
	pointerX: React.MutableRefObject<number>;
	isHovered: boolean;
	influenceRadius: number;
	maxMagnification: number;
	baseSize: number;
	registerItem: (el: HTMLElement) => () => void;
}

const DockContext = createContext<DockContextValue | null>(null);

/**
 * FloatingDock — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Handcrafted Gaussian proximity magnification function (ZERO Framer Motion).
 * - 120Hz rAF continuous transform writes directly to element style properties.
 * - Zero React re-renders on mousemove.
 */
export const FloatingDock: React.FC<FloatingDockProps> & {
	Root: typeof DockRoot;
	Item: typeof DockItem;
	Icon: typeof DockIcon;
	Label: typeof DockLabel;
} = ({ items = [], children, baseSize = 44, maxMagnification = 0.6, influenceRadius = 70, className = '', style }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pointerX = useRef<number>(-9999);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const itemsRef = useRef<HTMLElement[]>([]);
	const rafIdRef = useRef<number | null>(null);

	const registerItem = useCallback((el: HTMLElement) => {
		itemsRef.current.push(el);
		return () => {
			itemsRef.current = itemsRef.current.filter((item) => item !== el);
		};
	}, []);

	const updateScales = useCallback(() => {
		const mouseX = pointerX.current;
		for (const el of itemsRef.current) {
			const rect = el.getBoundingClientRect();
			const itemCenter = rect.left + rect.width / 2;
			const size = mouseX === -9999
				? baseSize
				: calculateDockItemSize(Math.abs(mouseX - itemCenter), baseSize, influenceRadius, maxMagnification);
			el.style.width = `${size.toFixed(2)}px`;
			el.style.height = `${size.toFixed(2)}px`;
		}
		rafIdRef.current = null;
	}, [baseSize, influenceRadius, maxMagnification]);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			pointerX.current = e.clientX;
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(updateScales);
			}
		},
		[updateScales]
	);

	const handlePointerEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handlePointerLeave = useCallback(() => {
		setIsHovered(false);
		pointerX.current = -9999;
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(updateScales);
		}
	}, [updateScales]);

	return (
		<DockContext.Provider
			value={{
				pointerX,
				isHovered,
				influenceRadius,
				maxMagnification,
				baseSize,
				registerItem,
			}}
		>
			<div
				ref={containerRef}
				onPointerEnter={handlePointerEnter}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				className={`exhuma-dock-root border-border bg-card/70 inline-flex items-center gap-3 rounded-3xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${className}`}
				style={style}
			>
				{items.length > 0
					? items.map((item) => (
							<DockItem key={item.title} title={item.title} href={item.href} onClick={item.onClick}>
								<div className='flex items-center justify-center'>{item.icon}</div>
							</DockItem>
						))
					: children}
			</div>
		</DockContext.Provider>
	);
};

export const DockItem: React.FC<{
	children: ReactNode;
	title?: string;
	href?: string;
	onClick?: () => void;
	className?: string;
}> = ({ children, title, href, onClick, className = '' }) => {
	const itemRef = useRef<HTMLDivElement>(null);
	const ctx = useContext(DockContext);
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		if (!ctx || !itemRef.current) return;
		return ctx.registerItem(itemRef.current);
	}, [ctx]);

	const content = (
		<div
			ref={itemRef}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onClick={onClick}
			className={`exhuma-dock-item border-border/80 bg-background/80 relative flex items-center justify-center rounded-2xl border shadow-md transition-shadow will-change-transform hover:shadow-xl ${className}`}
			style={{
				width: `${ctx?.baseSize ?? 44}px`,
				height: `${ctx?.baseSize ?? 44}px`,
			}}
		>
			{/* Hover tooltip label */}
			{title && hovered && (
				<div className='border-border bg-card/95 text-foreground text-3xs pointer-events-none absolute -top-9 z-20 rounded-md border px-2.5 py-1 font-semibold whitespace-nowrap shadow-lg backdrop-blur-md'>
					{title}
				</div>
			)}
			<div className='relative z-10 flex items-center justify-center'>{children}</div>
		</div>
	);

	if (href) {
		return (
			<a href={href} className='focus-visible:ring-primary inline-block rounded-2xl outline-none focus-visible:ring-2'>
				{content}
			</a>
		);
	}

	return content;
};

const DockRoot = FloatingDock;
const DockIcon: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => <div className={`exhuma-dock-icon flex items-center justify-center ${className}`}>{children}</div>;
const DockLabel: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => <div className={`exhuma-dock-label text-xs font-semibold ${className}`}>{children}</div>;

FloatingDock.Root = DockRoot;
FloatingDock.Item = DockItem;
FloatingDock.Icon = DockIcon;
FloatingDock.Label = DockLabel;

export { DockRoot, DockIcon, DockLabel };
