'use client';

import React, { createContext, useContext, useState, useCallback, useId, useRef, type ReactNode, type HTMLAttributes, type ButtonHTMLAttributes } from 'react';

/**
 * Exhuma Kinetic Methodology (EKM) — Accordion
 * Ported and elevated from sapan.dev with full WAI-ARIA compliance & Big-Omega guarantees.
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) / O(1) Instant, zero-layout-thrashing expansion via modern CSS Grid (0fr ➔ 1fr).
 * - Morphing CSS pseudo-element icon (zero icon dependency overhead).
 * - Animated gradient specular border shift on active state.
 * - Circular keyboard navigation (ArrowDown / ArrowUp / Home / End).
 * - Modes: "single" (auto-collapse others) or "multiple" (independent toggles).
 */

interface AccordionContextValue {
	expandedValues: Set<string>;
	toggleItem: (value: string) => void;
	registerItem: (value: string, el: HTMLElement | null) => void;
	items: string[];
	mode: 'single' | 'multiple';
	baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
	const ctx = useContext(AccordionContext);
	if (!ctx) {
		throw new Error('Exhuma Accordion compound components must be rendered inside <Accordion.Root>');
	}
	return ctx;
}

interface AccordionItemContextValue {
	value: string;
	isOpen: boolean;
	triggerId: string;
	panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
	const ctx = useContext(AccordionItemContext);
	if (!ctx) {
		throw new Error('Accordion.Trigger and Accordion.Content must be rendered inside <Accordion.Item>');
	}
	return ctx;
}

export interface AccordionRootProps {
	children: ReactNode;
	mode?: 'single' | 'multiple';
	defaultValue?: string | string[];
	value?: string | string[];
	onValueChange?: (val: string | string[]) => void;
	className?: string;
}

export const AccordionRoot: React.FC<AccordionRootProps> = ({ children, mode = 'single', defaultValue, value: controlledValue, onValueChange, className = '' }) => {
	const baseId = useId();
	const isControlled = controlledValue !== undefined;

	const [uncontrolledValues, setUncontrolledValues] = useState<Set<string>>(() => {
		if (!defaultValue) return new Set();
		if (Array.isArray(defaultValue)) return new Set(defaultValue);
		return new Set([defaultValue]);
	});

	const expandedValues: Set<string> = React.useMemo(() => {
		if (isControlled) {
			if (!controlledValue) return new Set();
			if (Array.isArray(controlledValue)) return new Set(controlledValue);
			return new Set([controlledValue]);
		}
		return uncontrolledValues;
	}, [isControlled, controlledValue, uncontrolledValues]);

	const itemElements = useRef<Map<string, HTMLElement>>(new Map());
	const [itemsList, setItemsList] = useState<string[]>([]);

	const registerItem = useCallback((val: string, el: HTMLElement | null) => {
		if (el) {
			itemElements.current.set(val, el);
		} else {
			itemElements.current.delete(val);
		}
		setItemsList(Array.from(itemElements.current.keys()));
	}, []);

	const toggleItem = useCallback(
		(val: string) => {
			let next: Set<string>;
			if (mode === 'single') {
				next = expandedValues.has(val) ? new Set() : new Set([val]);
			} else {
				next = new Set(expandedValues);
				if (next.has(val)) {
					next.delete(val);
				} else {
					next.add(val);
				}
			}

			if (!isControlled) {
				setUncontrolledValues(next);
			}

			const emitted = mode === 'single' ? Array.from(next)[0] || '' : Array.from(next);
			onValueChange?.(emitted);
		},
		[mode, expandedValues, isControlled, onValueChange]
	);

	return (
		<AccordionContext.Provider
			value={{
				expandedValues,
				toggleItem,
				registerItem,
				items: itemsList,
				mode,
				baseId,
			}}
		>
			<div className={`exhuma-accordion-root flex w-full flex-col gap-3 ${className}`}>{children}</div>
		</AccordionContext.Provider>
	);
};

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
	children: ReactNode;
	className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, className = '', ...props }) => {
	const { expandedValues, registerItem, baseId } = useAccordionContext();
	const isOpen = expandedValues.has(value);
	const itemRef = useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		registerItem(value, itemRef.current);
		return () => registerItem(value, null);
	}, [value, registerItem]);

	const triggerId = `${baseId}-trigger-${value}`;
	const panelId = `${baseId}-panel-${value}`;

	return (
		<AccordionItemContext.Provider value={{ value, isOpen, triggerId, panelId }}>
			<div
				ref={itemRef}
				className={`exhuma-accordion-item relative rounded-2xl shadow-lg shadow-black/5 transition-shadow duration-500 dark:shadow-white/5 ${
					isOpen ? 'ring-1 ring-transparent' : 'ring-1 ring-neutral-200/80 dark:ring-neutral-800'
				} ${className}`}
				{...props}
			>
				{/* Specular animated gradient border glow from sapan.dev */}
				<div
					aria-hidden='true'
					className={`pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(135deg,rgba(99,102,241,0.6)_0%,rgba(168,85,247,0.6)_35%,rgba(99,102,241,0.6)_65%,rgba(168,85,247,0.6)_100%)] opacity-0 transition-opacity duration-500 ${
						isOpen ? 'opacity-100' : ''
					}`}
				/>

				<div
					className={`relative z-10 overflow-hidden rounded-2xl bg-white transition-shadow duration-500 dark:bg-neutral-900 ${
						isOpen ? 'shadow-[0_8px_32px_rgba(99,102,241,0.12),0_2px_8px_rgba(168,85,247,0.08)]' : ''
					}`}
				>
					{children}
				</div>
			</div>
		</AccordionItemContext.Provider>
	);
};

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	className?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className = '', ...props }) => {
	const { value, isOpen, triggerId, panelId } = useAccordionItemContext();
	const { toggleItem, items } = useAccordionContext();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (items.length === 0) return;
		const currentIndex = items.indexOf(value);

		let nextIndex = currentIndex;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			nextIndex = (currentIndex + 1) % items.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			nextIndex = (currentIndex - 1 + items.length) % items.length;
		} else if (e.key === 'Home') {
			e.preventDefault();
			nextIndex = 0;
		} else if (e.key === 'End') {
			e.preventDefault();
			nextIndex = items.length - 1;
		}

		if (nextIndex !== currentIndex && items[nextIndex]) {
			const targetTrigger = document.getElementById(`${triggerId.split('-trigger-')[0]}-trigger-${items[nextIndex]}`);
			targetTrigger?.focus();
		}
	};

	return (
		<button
			type='button'
			id={triggerId}
			aria-expanded={isOpen}
			aria-controls={panelId}
			onClick={() => toggleItem(value)}
			onKeyDown={handleKeyDown}
			className={`exhuma-accordion-trigger flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none lg:px-7 lg:py-5 ${className}`}
			{...props}
		>
			<span className='flex-1 text-base text-neutral-900 dark:text-neutral-100'>{children}</span>
		</button>
	);
};

export interface AccordionIconProps extends HTMLAttributes<HTMLSpanElement> {
	className?: string;
}

/**
 * Signature Morphing Plus/Minus icon from sapan.dev.
 * Constructed purely with CSS pseudo-elements (Zero SVG/icon dependencies).
 */
export const AccordionIcon: React.FC<AccordionIconProps> = ({ className = '', ...props }) => {
	const { isOpen } = useAccordionItemContext();

	return (
		<span
			aria-hidden='true'
			className={`before:bg-primary after:bg-primary relative inline-flex aspect-square h-6 shrink-0 items-center justify-center before:absolute before:top-1/2 before:left-1/2 before:inline-flex before:h-0.5 before:w-3.5 before:origin-center before:-translate-1/2 before:rounded-full before:transition-transform before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:inline-flex after:h-0.5 after:w-3.5 after:origin-center after:-translate-1/2 after:rounded-full after:transition-transform after:duration-300 ${
				isOpen ? 'before:rotate-0 after:rotate-0' : 'before:rotate-0 after:-rotate-90'
			} ${className}`}
			{...props}
		/>
	);
};

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className = '', ...props }) => {
	const { isOpen, triggerId, panelId } = useAccordionItemContext();

	return (
		<div
			id={panelId}
			role='region'
			aria-labelledby={triggerId}
			className={`grid px-5 transition-all duration-300 ease-in-out lg:px-7 ${isOpen ? 'grid-rows-[1fr] pb-4 opacity-100 lg:pb-5' : 'grid-rows-[0fr] pb-0 opacity-0'} ${className}`}
			{...props}
		>
			<div className='overflow-hidden'>
				<div className='border-t border-neutral-100 pt-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400'>{children}</div>
			</div>
		</div>
	);
};

export const Accordion = {
	Root: AccordionRoot,
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Icon: AccordionIcon,
	Content: AccordionContent,
};

export default Accordion;
