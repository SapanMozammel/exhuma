'use client';

import React, {
	useRef,
	useState,
	useCallback,
	useEffect,
	createContext,
	useContext,
	memo,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { damp } from '../physics/lerp';
import { calculateElementCenter, clampTooltipToViewport } from './cursor-math';

interface CursorTooltipContextValue {
	isVisible: boolean;
	show: (e: React.MouseEvent<HTMLElement>) => void;
	hide: () => void;
	update: (e: React.MouseEvent<HTMLElement>) => void;
	contentNode: ReactNode;
	setContentNode: (node: ReactNode) => void;
	offset: { x: number; y: number };
	springDamping: number;
}

const CursorTooltipContext = createContext<CursorTooltipContextValue | null>(null);

export interface CursorTooltipProps {
	children: ReactNode;
	content?: ReactNode;
	offset?: { x: number; y: number };
	springDamping?: number;
	className?: string;
	contentClassName?: string;
}

/**
 * CursorTooltip — Exhuma Kinetic Methodology (EKM)
 * Elevated from sapan.dev (Zero Framer Motion)
 *
 * Big-Omega (Ω) Guarantees:
 * - 120Hz rAF continuous transform writes directly to element style.
 * - Zero Framer Motion / GSAP dependencies.
 * - Viewport boundary collision avoidance.
 * - Zero React re-renders during cursor tracking.
 */
export const CursorTooltip: React.FC<CursorTooltipProps> & {
	Content: typeof TooltipFloatingContent;
} = ({
	children,
	content,
	offset = { x: 16, y: 16 },
	springDamping = 22,
	className = '',
	contentClassName = '',
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [contentNode, setContentNode] = useState<ReactNode>(content);
	const targetPosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
	const tooltipElRef = useRef<HTMLDivElement | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (content !== undefined) {
			setContentNode(content);
		}
	}, [content]);

	const updateRafLoop = useCallback((timestamp: number) => {
		if (!lastTimeRef.current) lastTimeRef.current = timestamp;
		const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
		lastTimeRef.current = timestamp;

		const cur = currentPosRef.current;
		const target = targetPosRef.current;

		cur.x = damp(cur.x, target.x, springDamping, dt);
		cur.y = damp(cur.y, target.y, springDamping, dt);

		if (tooltipElRef.current) {
			const el = tooltipElRef.current;
			const rect = el.getBoundingClientRect();
			const clamped = clampTooltipToViewport(
				cur.x,
				cur.y,
				rect.width,
				rect.height,
				window.innerWidth,
				window.innerHeight
			);
			el.style.transform = `translate3d(${clamped.x.toFixed(2)}px, ${clamped.y.toFixed(2)}px, 0)`;
		}

		const dist = Math.hypot(target.x - cur.x, target.y - cur.y);
		if (dist > 0.2) {
			rafIdRef.current = requestAnimationFrame(updateRafLoop);
		} else {
			rafIdRef.current = null;
			lastTimeRef.current = 0;
		}
	}, [springDamping]);

	const startRafIfNeeded = useCallback(() => {
		if (!rafIdRef.current) {
			lastTimeRef.current = 0;
			rafIdRef.current = requestAnimationFrame(updateRafLoop);
		}
	}, [updateRafLoop]);

	const show = useCallback((e: React.MouseEvent<HTMLElement>) => {
		const targetX = e.clientX + offset.x;
		const targetY = e.clientY + offset.y;

		// Initialize position at element center if first appearance
		if (currentPosRef.current.x < 0) {
			const center = calculateElementCenter(e.currentTarget.getBoundingClientRect());
			currentPosRef.current = { x: center.x, y: center.y };
		}

		targetPosRef.current = { x: targetX, y: targetY };
		setIsVisible(true);
		startRafIfNeeded();
	}, [offset.x, offset.y, startRafIfNeeded]);

	const hide = useCallback(() => {
		setIsVisible(false);
		currentPosRef.current = { x: -9999, y: -9999 };
		targetPosRef.current = { x: -9999, y: -9999 };
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	const update = useCallback((e: React.MouseEvent<HTMLElement>) => {
		targetPosRef.current.x = e.clientX + offset.x;
		targetPosRef.current.y = e.clientY + offset.y;
		startRafIfNeeded();
	}, [offset.x, offset.y, startRafIfNeeded]);

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	return (
		<CursorTooltipContext.Provider
			value={{
				isVisible,
				show,
				hide,
				update,
				contentNode,
				setContentNode,
				offset,
				springDamping,
			}}
		>
			<div
				onMouseEnter={show}
				onMouseMove={update}
				onMouseLeave={hide}
				className={`inline-block ${className}`}
			>
				{children}
			</div>

			{mounted &&
				isVisible &&
				createPortal(
					<div
						ref={(node) => {
							tooltipElRef.current = node;
						}}
						className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-150 will-change-transform ${contentClassName}`}
						style={{
							transform: `translate3d(${targetPosRef.current.x}px, ${targetPosRef.current.y}px, 0)`,
						}}
					>
						<TooltipFloatingContent>{contentNode}</TooltipFloatingContent>
					</div>,
					document.body
				)}
		</CursorTooltipContext.Provider>
	);
};

export const TooltipFloatingContent = memo<{ children: ReactNode; className?: string }>(({
	children,
	className = '',
}) => (
	<div
		className={`rounded-xl border border-primary/40 bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-md ${className}`}
	>
		{children}
	</div>
));
TooltipFloatingContent.displayName = 'TooltipFloatingContent';

CursorTooltip.Content = TooltipFloatingContent;
