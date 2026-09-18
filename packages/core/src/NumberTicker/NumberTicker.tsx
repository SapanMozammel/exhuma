'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';
import { calculateTickerValue } from './ticker-math';

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
	value: number;
	initialValue?: number;
	duration?: number;
	decimalPlaces?: number;
	prefix?: string;
	suffix?: string;
	triggerOnScroll?: boolean;
}

/**
 * NumberTicker — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Direct DOM textContent manipulation via rAF (ZERO React VDOM re-renders during counting).
 * - Closed-form analytical easeOutExpo function (ZERO Framer Motion).
 * - Battery-friendly IntersectionObserver trigger.
 */
export const NumberTicker = memo<NumberTickerProps>(({ value, initialValue = 0, duration = 1.5, decimalPlaces = 0, prefix = '', suffix = '', triggerOnScroll = true, className = '', style, ...props }) => {
	const spanRef = useRef<HTMLSpanElement>(null);
	const rafIdRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const hasStartedRef = useRef<boolean>(false);

	const formatNumber = useCallback(
		(val: number): string => {
			const formatted = val.toLocaleString(undefined, {
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			});
			return `${prefix}${formatted}${suffix}`;
		},
		[decimalPlaces, prefix, suffix]
	);

	const startTicker = useCallback(() => {
		if (hasStartedRef.current) return;
		hasStartedRef.current = true;
		startTimeRef.current = null;

		const tick = (now: number) => {
			if (startTimeRef.current === null) {
				startTimeRef.current = now;
			}

			const elapsed = (now - startTimeRef.current) / 1000;
			const { value: currentVal, isComplete } = calculateTickerValue(initialValue, value, elapsed, duration);

			if (spanRef.current) {
				spanRef.current.textContent = formatNumber(currentVal);
			}

			if (!isComplete) {
				rafIdRef.current = requestAnimationFrame(tick);
			} else {
				rafIdRef.current = null;
			}
		};

		rafIdRef.current = requestAnimationFrame(tick);
	}, [initialValue, value, duration, formatNumber]);

	useEffect(() => {
		const el = spanRef.current;
		if (!el) return;

		// Reset so a new animation can start for this value
		hasStartedRef.current = false;
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}

		// Initial display
		el.textContent = formatNumber(initialValue);

		if (!triggerOnScroll) {
			startTicker();
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					startTicker();
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [triggerOnScroll, startTicker, formatNumber, initialValue, value]);

	return (
		<span ref={spanRef} className={`exhuma-number-ticker font-mono tracking-tight tabular-nums ${className}`} style={style} {...props}>
			{formatNumber(initialValue)}
		</span>
	);
});

NumberTicker.displayName = 'NumberTicker';
