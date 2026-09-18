'use client';

import React, { useRef, useState, useCallback, useEffect, useLayoutEffect, createContext, useContext, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { calculateFLIPDelta, generateInvertTransform, type DOMRectSnapshot } from './flip-math';

interface ExpandableContextValue {
	isExpanded: boolean;
	open: () => void;
	close: () => void;
	triggerRef: React.RefObject<HTMLDivElement | null>;
	firstRectRef: React.MutableRefObject<DOMRectSnapshot | null>;
}

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

export interface ExpandableCardProps {
	children?: ReactNode;
	cardContent?: ReactNode;
	expandedContent?: ReactNode;
	className?: string;
	expandedClassName?: string;
	onOpenChange?: (open: boolean) => void;
}

/**
 * ExpandableCard — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Mathematical FLIP morphing algorithm (ZERO Framer Motion).
 * - Single layout snapshot: zero layout thrashing during transition.
 * - Hardware-accelerated GPU translate3d and scale morphing.
 * - Accessible modal dialog with Escape dismissal and aria attributes.
 */
export const ExpandableCard: React.FC<ExpandableCardProps> & {
	Root: typeof ExpandableRoot;
	Trigger: typeof ExpandableTrigger;
	Content: typeof ExpandableContent;
	Close: typeof ExpandableClose;
} = ({ children, cardContent, expandedContent, className = '', expandedClassName = '', onOpenChange }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const triggerRef = useRef<HTMLDivElement | null>(null);
	const firstRectRef = useRef<DOMRectSnapshot | null>(null);

	const open = useCallback(() => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			firstRectRef.current = {
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height,
			};
		}
		setIsExpanded(true);
		onOpenChange?.(true);
	}, [onOpenChange]);

	const close = useCallback(() => {
		setIsExpanded(false);
		onOpenChange?.(false);
	}, [onOpenChange]);

	// If using shorthand props
	if (cardContent && expandedContent) {
		return (
			<ExpandableRoot isExpanded={isExpanded} open={open} close={close} triggerRef={triggerRef} firstRectRef={firstRectRef}>
				<ExpandableTrigger className={className}>{cardContent}</ExpandableTrigger>
				<ExpandableContent className={expandedClassName}>
					<div className='relative'>
						<ExpandableClose className='absolute top-4 right-4 z-10' />
						{expandedContent}
					</div>
				</ExpandableContent>
			</ExpandableRoot>
		);
	}

	return (
		<ExpandableRoot isExpanded={isExpanded} open={open} close={close} triggerRef={triggerRef} firstRectRef={firstRectRef}>
			{children}
		</ExpandableRoot>
	);
};

export function ExpandableRoot({
	children,
	isExpanded,
	open,
	close,
	triggerRef,
	firstRectRef,
}: {
	children: ReactNode;
	isExpanded: boolean;
	open: () => void;
	close: () => void;
	triggerRef: React.RefObject<HTMLDivElement | null>;
	firstRectRef: React.MutableRefObject<DOMRectSnapshot | null>;
}) {
	return <ExpandableContext.Provider value={{ isExpanded, open, close, triggerRef, firstRectRef }}>{children}</ExpandableContext.Provider>;
}

export const ExpandableTrigger = memo<React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', onClick, ...props }) => {
	const ctx = useContext(ExpandableContext);
	if (!ctx) throw new Error('ExpandableTrigger must be used within ExpandableCard');

	return (
		<div
			ref={ctx.triggerRef}
			role='button'
			tabIndex={0}
			aria-haspopup='dialog'
			aria-expanded={ctx.isExpanded}
			onClick={(e) => {
				ctx.open();
				onClick?.(e);
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					ctx.open();
				}
			}}
			className={`focus-visible:ring-primary cursor-pointer select-none focus:outline-none focus-visible:ring-2 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
});
ExpandableTrigger.displayName = 'ExpandableTrigger';

export const ExpandableContent = memo<React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }) => {
	const ctx = useContext(ExpandableContext);
	if (!ctx) throw new Error('ExpandableContent must be used within ExpandableCard');

	const modalRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Keyboard Escape handler
	const { isExpanded, close } = ctx;
	useEffect(() => {
		if (!isExpanded) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isExpanded, close]);

	// FLIP animation execution
	useLayoutEffect(() => {
		if (!ctx.isExpanded || !modalRef.current || !ctx.firstRectRef.current) return;

		const modal = modalRef.current;
		const lastRect = modal.getBoundingClientRect();
		const firstRect = ctx.firstRectRef.current;

		const delta = calculateFLIPDelta(firstRect, lastRect);
		const invertTransform = generateInvertTransform(delta);

		// INVERT: apply instantaneous transform before paint
		modal.style.transformOrigin = 'top left';
		modal.style.transform = invertTransform;
		modal.style.transition = 'none';

		// PLAY: force reflow then animate to target
		requestAnimationFrame(() => {
			modal.style.transition = 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms ease';
			modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
		});
	}, [ctx.isExpanded, ctx.firstRectRef]);

	if (!mounted || !ctx.isExpanded) return null;

	return createPortal(
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6' role='dialog' aria-modal='true'>
			{/* Backdrop */}
			<div className='animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300' onClick={ctx.close} />

			{/* Modal Container */}
			<div ref={modalRef} className={`border-border bg-card relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border p-6 shadow-2xl ${className}`} {...props}>
				{children}
			</div>
		</div>,
		document.body
	);
});
ExpandableContent.displayName = 'ExpandableContent';

export const ExpandableClose = memo<React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = '', onClick, children, ...props }) => {
	const ctx = useContext(ExpandableContext);
	if (!ctx) throw new Error('ExpandableClose must be used within ExpandableCard');

	return (
		<button
			type='button'
			aria-label='Close dialog'
			onClick={(e) => {
				ctx.close();
				onClick?.(e);
			}}
			className={`border-border bg-card/80 text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${className}`}
			{...props}
		>
			{children || (
				<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
					<path d='M18 6 6 18' />
					<path d='m6 6 12 12' />
				</svg>
			)}
		</button>
	);
});
ExpandableClose.displayName = 'ExpandableClose';

ExpandableCard.Root = ExpandableRoot;
ExpandableCard.Trigger = ExpandableTrigger;
ExpandableCard.Content = ExpandableContent;
ExpandableCard.Close = ExpandableClose;
