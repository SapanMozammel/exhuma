'use client';

import * as React from 'react';
import {
	IconAdjustments as Sliders,
	IconTerminal2 as Terminal,
	IconCheck as Check,
	IconCopy as Copy,
	IconCpu as Cpu,
	IconSparkles as Sparkles,
	IconShieldCheck as ShieldCheck,
	IconAccessible as Accessibility,
	IconDeviceTablet as Tablet,
	IconDeviceMobile as Smartphone,
	IconDeviceDesktop as Monitor,
	IconZoomIn as ZoomIn,
	IconZoomOut as ZoomOut,
	IconDownload as Download,
	IconRefresh as RefreshCw,
	IconArrowsMaximize as Maximize,
	IconArrowsMinimize as Minimize,
} from '@tabler/icons-react';
import { COMPONENT_REGISTRY, ALL_COMPONENTS, EcosystemFlavor, ECOSYSTEM_LABELS, generateComponentUsage } from '@/registry';
import { CodeBlock } from './CodeBlock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { DocsTable, docsTableHeadClass } from '@/components/docs/DocsTable';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';
import { cn } from '@/lib/utils';
import { StackingCards, HorizontalScroller, TiltCard, SpotlightCard, BorderBeam, CardSwipeStack, ComparisonSlider, ExpandableCard } from '@exhuma/cards';
import { CssMasonry, AutoGrid, InfiniteMarquee, BentoGrid, BentoCard, BentoHeader, BentoContent, DiamondGrid, ScrollTimeline, StickyParallaxScroll, ParallaxLayer, InteractiveGridPattern } from '@exhuma/layouts';
import { MorphingTabs, Accordion, AnimatedSphere, FloatingDock, NumberTicker, MagneticButton, CursorTooltip } from '@exhuma/core';

const COLOR_PRESETS = [
	{ label: 'Indigo', value: '#6366f1' },
	{ label: 'Violet', value: '#8b5cf6' },
	{ label: 'Cyan', value: '#06b6d4' },
	{ label: 'Emerald', value: '#10b981' },
	{ label: 'Rose', value: '#f43f5e' },
	{ label: 'Amber', value: '#f59e0b' },
	{ label: 'White', value: '#ffffff' },
];

function toHexColor(color: unknown, fallback = '#6366f1'): string {
	if (typeof color !== 'string') return fallback;
	const str = color.trim().toLowerCase();
	if (/^#[0-9a-f]{6}$/.test(str)) return str;
	if (/^#[0-9a-f]{8}$/.test(str)) return str.slice(0, 7);
	if (/^#[0-9a-f]{3}$/.test(str)) {
		return `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`;
	}
	const rgbMatch = str.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
	if (rgbMatch) {
		const r = Math.min(255, parseInt(rgbMatch[1], 10)).toString(16).padStart(2, '0');
		const g = Math.min(255, parseInt(rgbMatch[2], 10)).toString(16).padStart(2, '0');
		const b = Math.min(255, parseInt(rgbMatch[3], 10)).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}
	return fallback;
}

// Architectural grayscale presets per component
const COMPONENT_PRESETS: Record<string, Record<string, Record<string, unknown>>> = {
	'stacking-cards': {
		Default: { topStart: 20, topIncrement: 28, cardGap: 20, scaleThreshold: 150, minScale: 0.9, reverseScale: true },
		'Subtle Elegance': { topStart: 20, topIncrement: 16, cardGap: 24, scaleThreshold: 180, minScale: 0.94, reverseScale: true },
		'Cinematic 3D': { topStart: 24, topIncrement: 36, cardGap: 28, scaleThreshold: 120, minScale: 0.85, reverseScale: true },
		'Compact Deck': { topStart: 16, topIncrement: 14, cardGap: 12, scaleThreshold: 100, minScale: 0.92, reverseScale: false },
	},
	'horizontal-scroller': {
		Default: { itemGap: 28, speed: 1.0, cardWidth: 320, showProgress: true, showFadeEdges: true, fadeWidth: 48, mobileMode: 'scroll' },
		'Compact Gap': { itemGap: 16, speed: 1.0, cardWidth: 320, showProgress: true, showFadeEdges: true, fadeWidth: 48, mobileMode: 'scroll' },
		'Spacious Gap': { itemGap: 44, speed: 1.0, cardWidth: 340, showProgress: true, showFadeEdges: true, fadeWidth: 64, mobileMode: 'scroll' },
		'High Velocity': { itemGap: 32, speed: 1.8, cardWidth: 320, showProgress: true, showFadeEdges: true, fadeWidth: 64, mobileMode: 'scroll' },
	},
	'tilt-card': {
		Default: { maxTilt: 15, perspective: 1000, scale: 1.02, speed: 0.12, reverse: false, disabled: false, axis: 'all' },
		'Subtle Float': { maxTilt: 8, perspective: 1200, scale: 1.01, speed: 0.08, reverse: false, disabled: false, axis: 'all' },
		'Aggressive 3D': { maxTilt: 30, perspective: 800, scale: 1.06, speed: 0.18, reverse: false, disabled: false, axis: 'all' },
		'Magnetic Lift (Reverse)': { maxTilt: 20, perspective: 900, scale: 1.04, speed: 0.15, reverse: true, disabled: false, axis: 'all' },
		'Pitch Only (X-Axis)': { maxTilt: 20, perspective: 1000, scale: 1.02, speed: 0.12, reverse: false, disabled: false, axis: 'x' },
		'Yaw Only (Y-Axis)': { maxTilt: 20, perspective: 1000, scale: 1.02, speed: 0.12, reverse: false, disabled: false, axis: 'y' },
	},
	'css-masonry': {
		Default: { columns: 3, gap: 16 },
		Dense: { columns: 4, gap: 12 },
		Spacious: { columns: 2, gap: 24 },
	},
	'auto-grid': {
		Default: { minItemWidth: 280, gap: 24 },
		Compact: { minItemWidth: 200, gap: 16 },
		Cards: { minItemWidth: 320, gap: 28 },
	},
	'spotlight-card': {
		Default: { radius: 350, opacity: 0.8, color: '#6366f1', borderColor: '#818cf8', spread: 80, mode: 'both', smoothing: 0.2, disabled: false },
		Subtle: { radius: 250, opacity: 0.4, color: '#94a3b8', borderColor: '#cbd5e1', spread: 70, mode: 'both', smoothing: 0.15, disabled: false },
		Broad: { radius: 500, opacity: 0.95, color: '#10b981', borderColor: '#34d399', spread: 90, mode: 'both', smoothing: 0.25, disabled: false },
		BorderOnly: { radius: 300, opacity: 0.85, color: '#6366f1', borderColor: '#a855f7', spread: 80, mode: 'border', smoothing: 0.2, disabled: false },
	},
	'morphing-tabs': {
		Default: { springStiffness: 26 },
		Snappy: { springStiffness: 40 },
		Gentle: { springStiffness: 16 },
	},
	accordion: {
		Default: { mode: 'single', duration: 300 },
		Multiple: { mode: 'multiple', duration: 300 },
		Fast: { mode: 'single', duration: 200 },
	},
	'infinite-marquee': {
		Default: { speed: 40, pauseOnHover: true },
		Fast: { speed: 80, pauseOnHover: true },
		Gentle: { speed: 20, pauseOnHover: false },
	},
	'bento-grid': {
		Default: { cols: 3, gap: '1.5rem' },
		Dense: { cols: 4, gap: '1rem' },
		Spacious: { cols: 2, gap: '2rem' },
	},
	'diamond-grid': {
		Default: { gap: '0.75vw' },
		Tight: { gap: '0.5vw' },
		Spacious: { gap: '1.2vw' },
	},
	'scroll-timeline': {
		Default: { curveWidth: 24, curveHeight: 40, accentColor: '#6366f1' },
		Wider: { curveWidth: 36, curveHeight: 50, accentColor: '#8b5cf6' },
		Subtle: { curveWidth: 16, curveHeight: 30, accentColor: '#06b6d4' },
	},
	'sticky-parallax': {
		Default: { trackHeight: '250vh' },
		Short: { trackHeight: '180vh' },
		Deep: { trackHeight: '350vh' },
	},
	'border-beam': {
		Default: { size: 200, duration: 8, borderWidth: 2, colorFrom: '#ffaa40', colorTo: '#9c40ff', doubleBeam: false, endOpacity: 0, opacity: 1, blur: 0, borderRadius: 16 },
		'Dual Orbital': { size: 200, duration: 8, borderWidth: 2, colorFrom: '#06b6d4', colorTo: '#3b82f6', doubleBeam: true, endOpacity: 0, opacity: 1, blur: 0, borderRadius: 16 },
		Hyperdrive: { size: 180, duration: 4, borderWidth: 2.5, colorFrom: '#ec4899', colorTo: '#8b5cf6', doubleBeam: true, endOpacity: 0.05, opacity: 1, blur: 1, borderRadius: 16 },
		'Subtle Glow': { size: 180, duration: 12, borderWidth: 1.5, colorFrom: '#6366f1', colorTo: '#a855f7', doubleBeam: false, endOpacity: 0, opacity: 0.85, blur: 0, borderRadius: 16 },
		'Neon Emerald': { size: 200, duration: 6, borderWidth: 2, colorFrom: '#10b981', colorTo: '#06b6d4', doubleBeam: false, endOpacity: 0, opacity: 1, blur: 0, borderRadius: 16 },
	},
	'animated-sphere': {
		Default: { color: '#6366f1', speed: 1.0, radiusScale: 0.475 },
		Rapid: { color: '#8b5cf6', speed: 2.0, radiusScale: 0.475 },
		Subtle: { color: '#06b6d4', speed: 0.5, radiusScale: 0.4 },
	},
	'floating-dock': {
		Default: { baseSize: 44, maxMagnification: 0.6, influenceRadius: 70 },
		Compact: { baseSize: 36, maxMagnification: 0.5, influenceRadius: 55 },
		Dramatic: { baseSize: 44, maxMagnification: 0.9, influenceRadius: 90 },
	},
	'interactive-grid': {
		Default: { width: 32, height: 32 },
		Dense: { width: 20, height: 20 },
		Spacious: { width: 48, height: 48 },
	},
	'number-ticker': {
		Default: { value: 1000, decimalPlaces: 0 },
		Precision: { value: 98.65, decimalPlaces: 2 },
		Large: { value: 1000000, decimalPlaces: 0 },
	},
	'magnetic-button': {
		Default: { strength: 0.35, radius: 120, springDamping: 18 },
		Strong: { strength: 0.6, radius: 160, springDamping: 22 },
		Subtle: { strength: 0.2, radius: 80, springDamping: 14 },
	},
	'card-swipe-stack': {
		Default: { thresholdDistance: 120, maxRotation: 20, scaleStep: 0.05, offsetStep: 14, preventLastCardDismiss: true },
		Snappy: { thresholdDistance: 80, maxRotation: 28, scaleStep: 0.06, offsetStep: 16, preventLastCardDismiss: true },
		'Fluid Spring': { thresholdDistance: 150, maxRotation: 24, scaleStep: 0.04, offsetStep: 12, preventLastCardDismiss: true },
		Minimalist: { thresholdDistance: 100, maxRotation: 12, scaleStep: 0.03, offsetStep: 8, preventLastCardDismiss: true },
		'Free Swipe': { thresholdDistance: 120, maxRotation: 20, scaleStep: 0.05, offsetStep: 14, preventLastCardDismiss: false },
	},
	'comparison-slider': {
		Default: { defaultPosition: 0.5, step: 0.05 },
		SplitQuarter: { defaultPosition: 0.25, step: 0.05 },
		SplitThreeQuarters: { defaultPosition: 0.75, step: 0.05 },
	},
	'expandable-card': {
		Default: { duration: 360 },
		Fast: { duration: 240 },
		Cinematic: { duration: 480 },
	},
	'cursor-tooltip': {
		Default: { springDamping: 22 },
		Elastic: { springDamping: 14 },
		Instant: { springDamping: 35 },
	},
};

const FLAVORS = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

const ECOSYSTEM_SHORT_NAMES: Record<EcosystemFlavor, string> = {
	react: 'React',
	nextjs: 'Next.js 15',
	vue: 'Vue 3',
	svelte: 'Svelte 5',
	angular: 'Angular 18+',
	solid: 'SolidJS',
	astro: 'Astro',
	blade: 'Laravel Blade',
	vanilla: 'Vanilla JS',
	wordpress: 'WordPress',
	webcomponent: 'Web Components',
	'react-native': 'React Native',
	flutter: 'Flutter',
};

const ECOSYSTEM_EXTENSIONS: Record<EcosystemFlavor, string> = {
	react: '.tsx',
	nextjs: 'App Router',
	vue: '.vue',
	svelte: '.svelte',
	angular: 'Standalone',
	solid: '.tsx',
	astro: '.astro',
	blade: '.blade.php',
	vanilla: 'ESM / CSS',
	wordpress: 'Gutenberg',
	webcomponent: 'Custom Element',
	'react-native': 'Expo / TSX',
	flutter: 'Dart',
};

const ECOSYSTEM_GROUPS: { label: string; flavors: EcosystemFlavor[] }[] = [
	{
		label: 'Web & Full-Stack',
		flavors: ['nextjs', 'react', 'vue', 'svelte', 'angular', 'solid', 'astro'],
	},
	{
		label: 'Backend & CMS',
		flavors: ['blade', 'wordpress'],
	},
	{
		label: 'Universal Standards',
		flavors: ['webcomponent', 'vanilla'],
	},
	{
		label: 'Mobile & Native',
		flavors: ['react-native', 'flutter'],
	},
];

type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn';

const PKG_MANAGERS: { id: PackageManager; label: string; prefix: string }[] = [
	{ id: 'pnpm', label: 'pnpm', prefix: 'pnpm dlx' },
	{ id: 'npm', label: 'npm', prefix: 'npx' },
	{ id: 'bun', label: 'bun', prefix: 'bunx --bun' },
	{ id: 'yarn', label: 'yarn', prefix: 'yarn dlx' },
];

interface ComponentDocViewProps {
	slug: string;
}

export function ComponentDocView({ slug }: ComponentDocViewProps) {
	const component = COMPONENT_REGISTRY[slug] || ALL_COMPONENTS[0];

	const [selectedFlavor, setSelectedFlavor] = React.useState<EcosystemFlavor>('react');
	const [selectedFileIdx, setSelectedFileIdx] = React.useState(0);
	const [codeMode, setCodeMode] = React.useState<'clean' | 'ejected'>('clean');
	const [copiedCli, setCopiedCli] = React.useState(false);
	const [copiedUsage, setCopiedUsage] = React.useState(false);
	const [copiedSource, setCopiedSource] = React.useState(false);
	const [pkgManager, setPkgManager] = React.useState<PackageManager>('pnpm');

	// Studio Viewport & Canvas Controls
	const [viewportMode, setViewportMode] = React.useState<'fluid' | 'tablet' | 'mobile'>('fluid');
	const [zoomScale, setZoomScale] = React.useState<number>(100);
	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
	const [cardSwipeResetKey, setCardSwipeResetKey] = React.useState<number>(0);

	// Presets
	const presets = COMPONENT_PRESETS[component.slug] || {};
	const [activePreset, setActivePreset] = React.useState<string>('Default');

	// Dynamic prop values state, initialized with component.defaultProps
	const [propValues, setPropValues] = React.useState<Record<string, unknown>>({
		...component.defaultProps,
	});

	// Synchronize propValues when component changes
	React.useEffect(() => {
		setPropValues({ ...component.defaultProps });
		setActivePreset('Default');
	}, [component]);

	// Sticky dock elevation observer with exact header clearance offset (Big-Ω rAF batching)
	const stickyDockRef = React.useRef<HTMLDivElement>(null);
	const [isDockSticky, setIsDockSticky] = React.useState(false);

	React.useEffect(() => {
		const dock = stickyDockRef.current;
		if (!dock) return;

		let rafId: number | null = null;

		// Calculate sticky position dynamically based on current header offset with zero layout thrashing
		const checkSticky = () => {
			if (rafId !== null) return;
			rafId = requestAnimationFrame(() => {
				rafId = null;
				if (!dock) return;
				const dockTop = dock.getBoundingClientRect().top;
				const root = document.documentElement;
				const rootFontSize = parseFloat(getComputedStyle(root).fontSize) || 16;
				const rawHeaderHeight = getComputedStyle(root).getPropertyValue('--header-height').trim();
				const headerRem = parseFloat(rawHeaderHeight) || 5.4375;
				const isMobile = window.innerWidth < 1024;
				// Match CSS top offsets: top-header-mobile-gap (header + 3.75rem) vs lg:top-header-gap (header + 0.75rem)
				const gapRem = isMobile ? 3.75 : 0.75;
				const targetTopPx = (headerRem + gapRem) * rootFontSize;

				// If dock has reached or stuck at its target top position (within 1.5px tolerance)
				const isStuck = dockTop <= targetTopPx + 1.5;
				setIsDockSticky((prev) => (prev !== isStuck ? isStuck : prev));
			});
		};

		checkSticky();
		window.addEventListener('scroll', checkSticky, { passive: true });
		window.addEventListener('resize', checkSticky, { passive: true });

		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', checkSticky);
			window.removeEventListener('resize', checkSticky);
		};
	}, []);

	// Scroll refs for container-based kinetic components
	const stackingScrollRef = React.useRef<HTMLDivElement>(null);
	const horizontalScrollRef = React.useRef<HTMLDivElement>(null);

	const applyPreset = (presetName: string) => {
		setActivePreset(presetName);
		const presetValues = presets[presetName];
		if (presetValues) {
			setPropValues({ ...component.defaultProps, ...presetValues });
		}
	};

	const handlePropChange = (propName: string, value: unknown) => {
		setPropValues((prev) => ({
			...prev,
			[propName]: value,
		}));
		setActivePreset('Custom');
	};

	const resetProps = () => {
		setPropValues({ ...component.defaultProps });
		setActivePreset('Default');
	};

	// 1. Synthesize Usage Example snippet for consumer application
	const usageFile = React.useMemo(() => {
		return generateComponentUsage(component, selectedFlavor, propValues);
	}, [component, selectedFlavor, propValues]);

	// 2. Synthesize internal Component Source files (Clean vs Ejected Engine)
	const cleanFiles = React.useMemo(() => {
		return component.generateCode(selectedFlavor, propValues, { eject: false });
	}, [component, selectedFlavor, propValues]);

	const ejectedFiles = React.useMemo(() => {
		return component.generateCode(selectedFlavor, propValues, { eject: true });
	}, [component, selectedFlavor, propValues]);

	const hasEjectedDifference = React.useMemo(() => {
		if (cleanFiles.length !== ejectedFiles.length) return true;
		return cleanFiles.some((cf, i) => {
			const ef = ejectedFiles[i];
			return !ef || cf.code !== ef.code || cf.filename !== ef.filename;
		});
	}, [cleanFiles, ejectedFiles]);

	const generatedFiles = hasEjectedDifference && codeMode === 'ejected' ? ejectedFiles : cleanFiles;

	const activeSourceFile = generatedFiles[selectedFileIdx] || generatedFiles[0] || { filename: 'component.tsx', code: '' };

	const activePkg = React.useMemo(() => PKG_MANAGERS.find((p) => p.id === pkgManager) || PKG_MANAGERS[0], [pkgManager]);

	const cliCommand = `${activePkg.prefix} exhuma add ${component.slug} --flavor=${selectedFlavor}`;

	const copyCli = async () => {
		try {
			await navigator.clipboard.writeText(cliCommand);
			setCopiedCli(true);
			setTimeout(() => setCopiedCli(false), 2000);
		} catch {
			setCopiedCli(false);
		}
	};

	const copyUsageCode = async () => {
		try {
			await navigator.clipboard.writeText(usageFile.code);
			setCopiedUsage(true);
			setTimeout(() => setCopiedUsage(false), 2000);
		} catch {
			setCopiedUsage(false);
		}
	};

	const downloadUsageFile = () => {
		const blob = new Blob([usageFile.code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = usageFile.filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const copySourceCode = async () => {
		try {
			await navigator.clipboard.writeText(activeSourceFile.code);
			setCopiedSource(true);
			setTimeout(() => setCopiedSource(false), 2000);
		} catch {
			setCopiedSource(false);
		}
	};

	const downloadSourceFile = () => {
		const blob = new Blob([activeSourceFile.code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = activeSourceFile.filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const getCodeLanguage = (filename: string) => {
		if (filename.endsWith('.dart')) return 'dart';
		if (filename.endsWith('.php')) return 'php';
		if (filename.endsWith('.vue')) return 'vue';
		if (filename.endsWith('.svelte')) return 'svelte';
		if (filename.endsWith('.astro')) return 'astro';
		if (filename.endsWith('.json')) return 'json';
		if (filename.endsWith('.css')) return 'css';
		if (filename.endsWith('.html')) return 'html';
		if (filename.endsWith('.js')) return 'js';
		if (filename.endsWith('.ts')) return 'typescript';
		return 'tsx';
	};

	// Render interactive canvas preview with real-time prop tweaking across all 23 components
	const renderCanvasPreview = () => {
		// 1. Stacking Cards
		if (component.slug === 'stacking-cards') {
			const topStart = Number(propValues.topStart ?? 20);
			const topIncrement = Number(propValues.topIncrement ?? propValues.stackOffset ?? 28);
			const cardGap = Number(propValues.cardGap ?? propValues.gap ?? 20);
			const scaleThreshold = Number(propValues.scaleThreshold ?? 150);
			const minScale = Number(propValues.minScale ?? 0.9);
			const reverseScale = propValues.reverseScale !== undefined ? Boolean(propValues.reverseScale) : true;

			return (
				<div
					ref={stackingScrollRef}
					tabIndex={0}
					role='region'
					aria-label={`${component.name} scroll demo`}
					className='border-border/80 bg-background/50 no-scrollbar focus-visible:ring-foreground/50 relative mx-auto h-[31.25rem] w-full max-w-xl overflow-y-auto rounded-2xl border p-3 shadow-inner outline-none focus-visible:ring-1 sm:p-6'
				>
					<div className='text-muted-foreground text-2xs mb-6 flex items-center justify-center gap-2 text-center font-mono'>
						<span className='kbd border-border bg-card/80 text-foreground text-3xs font-mono font-bold uppercase'>SCROLL DOWN TO ENGAGE MOMENTUM</span>
						<span>↓</span>
					</div>
					<StackingCards topStart={topStart} topIncrement={topIncrement} cardGap={cardGap} minScale={minScale} scaleThreshold={scaleThreshold} reverseScale={reverseScale} scrollContainerRef={stackingScrollRef}>
						{Array.from({ length: 4 }).map((_, idx) => (
							<div key={idx} className='border-border/80 bg-card/95 relative rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-colors sm:p-6'>
								<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
								<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

								<div className='text-muted-foreground mb-3 flex items-center justify-between font-mono text-xs'>
									<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>LAYER // 0{idx + 1}</span>
									<span className='text-muted-foreground text-2xs font-mono'>120 FPS rAF</span>
								</div>
								<h4 className='text-foreground text-lg font-bold tracking-tight sm:text-xl'>Autonomous Stacking Card</h4>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Card stacks with dynamic mathematical scale decay. Zero layout thrashing or parent scroll locking.</p>
								<div className='border-border/60 text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 font-mono text-xs sm:mt-6 sm:pt-4'>
									<span>topStart: {topStart}px</span>
									<span>topIncrement: {topIncrement}px</span>
									<span>cardGap: {cardGap}px</span>
									<span>minScale: {minScale}</span>
									<span>reverseScale: {reverseScale ? 'true' : 'false'}</span>
								</div>
							</div>
						))}
					</StackingCards>
					<div className='text-muted-foreground flex h-[17.5rem] items-center justify-center font-mono text-xs'>Terminal scroll reached — reverse scaling applied</div>
				</div>
			);
		}

		// 2. Horizontal Scroller
		if (component.slug === 'horizontal-scroller') {
			const speed = Number(propValues.speed ?? propValues.scrollSpeed ?? 1.0);
			const itemGap = Number(propValues.itemGap ?? propValues.gap ?? 28);
			const cardWidth = propValues.cardWidth !== undefined ? Number(propValues.cardWidth) : 320;
			const showProgress = propValues.showProgress !== false;
			const showFadeEdges = propValues.showFadeEdges !== false;
			const fadeWidth = Number(propValues.fadeWidth ?? 48);
			const mobileMode = (propValues.mobileMode as 'scroll' | 'stack' | 'pinned') ?? 'scroll';

			const SERVICES = [
				{ num: '01', category: 'DESIGN', title: 'Web Design & UI', desc: 'High-conversion visual interfaces engineered to command attention.', cta: 'Explore', tag: 'STAGE // 01' },
				{ num: '02', category: 'DEV', title: 'Kinetic Engineering', desc: '120 FPS transitions, zero layout thrashing, and sub-pixel compositing.', cta: 'Explore', tag: 'STAGE // 02' },
				{ num: '03', category: 'BRAND', title: 'Brand Strategy', desc: 'Distinct typography and positioning frameworks that scale.', cta: 'Explore', tag: 'STAGE // 03' },
				{ num: '04', category: 'SCALE', title: 'Conversion Scale', desc: 'Data-driven landing pages and behavioral experimentation.', cta: 'Explore', tag: 'STAGE // 04' },
				{ num: '05', category: 'AI', title: 'AI Workflows', desc: 'Intelligent automation pipelines built for high leverage.', cta: 'Explore', tag: 'STAGE // 05' },
			];

			return (
				<div
					ref={horizontalScrollRef}
					tabIndex={0}
					role='region'
					aria-label={`${component.name} scroll demo`}
					className='border-border/80 bg-background/50 no-scrollbar focus-visible:ring-foreground/50 relative h-[36rem] w-full overflow-y-auto rounded-2xl border shadow-inner outline-none focus-visible:ring-1'
				>
					<div className='text-muted-foreground text-2xs pointer-events-none absolute top-3 right-4 z-30 flex items-center gap-2 font-mono'>
						<span className='kbd border-border/80 bg-card/90 text-foreground text-3xs font-mono font-bold shadow-xs'>VERTICAL SCROLL → HORIZONTAL RAIL</span>
						<span>↓</span>
					</div>
					<HorizontalScroller
						speed={speed}
						itemGap={itemGap}
						cardWidth={cardWidth}
						showProgress={showProgress}
						showFadeEdges={showFadeEdges}
						fadeWidth={fadeWidth}
						mobileMode={mobileMode}
						scrollContainerRef={horizontalScrollRef}
						header={
							<div className='border-border/40 mb-4 flex items-center justify-between border-b pb-3'>
								<div>
									<span className='text-3xs font-mono font-bold tracking-widest text-emerald-500 uppercase'>Brix-Engineered Rail</span>
									<h3 className='text-foreground text-lg font-bold tracking-tight sm:text-xl'>Digital Solutions Suite</h3>
								</div>
								<span className='text-muted-foreground hidden font-mono text-xs sm:inline'>120 FPS Pinned Camera</span>
							</div>
						}
					>
						{SERVICES.map((s, idx) => (
							<div
								key={idx}
								className='group border-border/80 bg-card/95 hover:border-foreground/40 flex h-[210px] flex-col justify-between overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300'
							>
								<div>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<span className='font-mono text-xs font-bold text-emerald-500'>{s.num}</span>
											<span className='text-3xs text-muted-foreground font-mono tracking-wider uppercase'>{s.category}</span>
										</div>
										<span className='text-3xs border-border bg-background/60 text-muted-foreground rounded-full border px-2 py-0.5 font-mono'>{s.tag}</span>
									</div>
									<h4 className='text-foreground mt-3 text-base font-bold tracking-tight'>{s.title}</h4>
									<p className='text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed'>{s.desc}</p>
								</div>
								<div className='border-border/40 flex items-center justify-between border-t pt-3'>
									<span className='text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors group-hover:text-emerald-400'>
										{s.cta}
										<span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
									</span>
									<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
								</div>
							</div>
						))}
					</HorizontalScroller>

					{/* Subsequent Section (Unpinned Normal Flow) */}
					<div className='border-border/60 bg-muted/20 border-t px-6 py-12 sm:px-10'>
						<div className='max-w-xl'>
							<div className='flex items-center gap-2'>
								<span className='size-2 rounded-full bg-emerald-500' />
								<span className='text-3xs font-mono font-bold tracking-widest text-emerald-500 uppercase'>Traversal Complete &bull; Normal Scroll Resumed</span>
							</div>
							<h4 className='text-foreground mt-2 text-xl font-bold tracking-tight sm:text-2xl'>Next Milestone: Product Delivery &amp; Scale</h4>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm'>
								Once horizontal card translation reaches 100%, the pinned camera seamlessly releases and natural vertical scrolling resumes.
							</p>
						</div>

						<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
							<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Performance</span>
								<div className='text-foreground mt-1 font-mono text-lg font-bold'>120 FPS</div>
								<p className='text-muted-foreground text-2xs mt-0.5'>Zero layout thrashing</p>
							</div>
							<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Compositor</span>
								<div className='text-foreground mt-1 font-mono text-lg font-bold'>GPU Rail</div>
								<p className='text-muted-foreground text-2xs mt-0.5'>Hardware acceleration</p>
							</div>
							<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Exit Behavior</span>
								<div className='text-foreground mt-1 font-mono text-lg font-bold'>Seamless</div>
								<p className='text-muted-foreground text-2xs mt-0.5'>Natural scroll unpin</p>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// 3. Tilt Card
		if (component.slug === 'tilt-card') {
			const maxTilt = Number(propValues.maxTilt ?? 15);
			const perspective = Number(propValues.perspective ?? 1000);
			const scale = Number(propValues.scale ?? 1.02);
			const speed = Number(propValues.speed ?? 0.12);
			const reverse = Boolean(propValues.reverse ?? false);
			const disabled = Boolean(propValues.disabled ?? false);
			const axis = (propValues.axis as 'all' | 'x' | 'y') ?? 'all';

			return (
				<div className='flex items-center justify-center p-2 sm:p-6'>
					<TiltCard
						maxTilt={maxTilt}
						perspective={perspective}
						scale={scale}
						speed={speed}
						reverse={reverse}
						disabled={disabled}
						axis={axis}
						className='bg-card/95 border-border/80 hover:border-foreground/40 w-full max-w-md cursor-pointer border p-5 shadow-2xl transition-colors sm:p-8'
					>
						<div className='mb-4 flex items-center justify-between'>
							<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>3D GYROSCOPE</span>
							<span className='text-muted-foreground font-mono text-xs'>Max: {maxTilt}°</span>
						</div>
						<h4 className='text-foreground text-xl font-black tracking-tight sm:text-2xl'>Tactile 3D Tilt Card</h4>
						<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Move pointer across surface. Calculated with 120 FPS spring lerp and zero layout thrashing.</p>
						<div className='border-border/70 text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
							<span>Perspective: {perspective}px</span>
							<span className='text-foreground/80 font-mono'>Scale: {scale}x</span>
						</div>
					</TiltCard>
				</div>
			);
		}

		// 4. CSS Masonry
		if (component.slug === 'css-masonry') {
			const columns = Number(propValues.columns ?? 3);
			const gap = Number(propValues.gap ?? 16);

			return (
				<CssMasonry columns={columns} gap={gap} className='w-full p-4'>
					{[130, 190, 150, 220, 170, 240].map((h, idx) => (
						<div key={idx} className='border-border/80 bg-card hover:border-foreground/40 mb-4 break-inside-avoid rounded-2xl border p-5 shadow-sm transition-all' style={{ height: `${h}px` }}>
							<div className='text-muted-foreground mb-1 flex items-center justify-between font-mono text-xs'>
								<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold'>TILE // 0{idx + 1}</span>
								<span className='font-mono'>{h}px</span>
							</div>
							<div className='text-foreground mt-2 text-sm font-bold'>Dynamic Masonry</div>
							<div className='text-muted-foreground mt-1 text-xs'>Zero Reflow Layout</div>
						</div>
					))}
				</CssMasonry>
			);
		}

		// 5. Auto Grid
		if (component.slug === 'auto-grid') {
			const minItemWidth = Number(propValues.minItemWidth ?? 280);
			const gap = Number(propValues.gap ?? 24);

			return (
				<AutoGrid minItemWidth={minItemWidth} gap={gap} className='w-full p-4'>
					{Array.from({ length: 6 }).map((_, idx) => (
						<div key={idx} className='border-border/80 bg-card hover:border-foreground/40 rounded-2xl border p-5 shadow-sm transition-all'>
							<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold'>GRID #{idx + 1}</span>
							<div className='text-foreground mt-2 text-sm font-bold'>Auto-Fit Grid</div>
							<div className='text-muted-foreground mt-1 font-mono text-xs'>Min: {minItemWidth}px</div>
						</div>
					))}
				</AutoGrid>
			);
		}

		// 6. Spotlight Card
		if (component.slug === 'spotlight-card') {
			const radius = Number(propValues.radius ?? 350);
			const opacity = Number(propValues.opacity ?? 0.8);
			const color = String(propValues.color ?? '#6366f1');
			const borderColor = String(propValues.borderColor ?? '#818cf8');
			const spread = Number(propValues.spread ?? 80);
			const mode = (propValues.mode as 'both' | 'border' | 'background') ?? 'both';
			const smoothing = Number(propValues.smoothing ?? 0.2);
			const disabled = Boolean(propValues.disabled ?? false);

			return (
				<div className='flex items-center justify-center p-2 sm:p-6'>
					<SpotlightCard
						radius={radius}
						color={color}
						borderColor={borderColor}
						opacity={opacity}
						spread={spread}
						mode={mode}
						smoothing={smoothing}
						disabled={disabled}
						className='border-border/80 bg-card/95 w-full max-w-lg cursor-pointer p-6 shadow-2xl transition-colors sm:p-8'
					>
						<div className='flex flex-col gap-6'>
							{/* Top Header */}
							<div className='flex items-center justify-between'>
								<div className='border-primary/20 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs'>
									<Sparkles className='size-5' />
								</div>
								<span className='kbd border-border/80 bg-muted/40 text-muted-foreground text-3xs px-2.5 py-1 font-mono font-semibold tracking-wider uppercase'>Interactive Spotlight</span>
							</div>

							{/* Title & Description */}
							<div className='space-y-2'>
								<h4 className='text-foreground text-xl font-bold tracking-tight sm:text-2xl'>Radial Illumination</h4>
								<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Dynamic 2D coordinate tracking with specular border illumination and fluid inertial falloff.</p>
							</div>

							{/* Clean Bottom Meta */}
							<div className='border-border/60 text-muted-foreground mt-2 flex items-center justify-between border-t pt-4 font-mono text-xs'>
								<div className='flex items-center gap-2'>
									<span className='size-2 rounded-full bg-emerald-500' />
									<span className='text-3xs tracking-wide uppercase'>120 FPS Coalesced</span>
								</div>
								<span className='text-3xs text-foreground/80 font-semibold tracking-wide uppercase'>Mode: {mode}</span>
							</div>
						</div>
					</SpotlightCard>
				</div>
			);
		}

		// 7. Morphing Tabs
		if (component.slug === 'morphing-tabs') {
			return (
				<div className='mx-auto w-full max-w-md p-4'>
					<MorphingTabs.Root defaultValue='dashboard'>
						<MorphingTabs.List className='border-border/80 bg-muted/30 w-full justify-between rounded-xl border p-1'>
							<MorphingTabs.Indicator className='bg-foreground text-background shadow-xs' />
							<MorphingTabs.Trigger value='dashboard' className='flex-1 font-mono text-xs'>
								Dashboard
							</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value='analytics' className='flex-1 font-mono text-xs'>
								Analytics
							</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value='settings' className='flex-1 font-mono text-xs'>
								Settings
							</MorphingTabs.Trigger>
						</MorphingTabs.List>
						<MorphingTabs.Content value='dashboard' className='border-border/80 bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Dashboard Metric Stream</div>
							<div className='text-muted-foreground text-xs'>Real-time system state with zero-jank floating indicator.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value='analytics' className='border-border/80 bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Kinetic Analytics Engine</div>
							<div className='text-muted-foreground text-xs'>Analytical spring differential equations driving indicator geometry.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value='settings' className='border-border/80 bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Global Configuration</div>
							<div className='text-muted-foreground text-xs'>WAI-ARIA roving keyboard navigation enabled.</div>
						</MorphingTabs.Content>
					</MorphingTabs.Root>
				</div>
			);
		}

		// 8. Accordion
		if (component.slug === 'accordion') {
			const mode = (propValues.mode === 'multiple' ? 'multiple' : 'single') as 'single' | 'multiple';

			return (
				<div className='mx-auto w-full max-w-lg p-4'>
					<Accordion.Root mode={mode} defaultValue='faq-1'>
						<Accordion.Item value='faq-1'>
							<Accordion.Trigger>
								<span className='font-medium'>How does Exhuma eliminate animation jank?</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>Exhuma uses modern CSS Grid 0fr to 1fr interpolation with exact analytical spring differential equations, eliminating layout reflows.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value='faq-2'>
							<Accordion.Trigger>
								<span className='font-medium'>Does this require Framer Motion or GSAP?</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>Zero external dependencies. Every component is 100% handcrafted with pure mathematics and native browser APIs.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value='faq-3'>
							<Accordion.Trigger>
								<span className='font-medium'>Which platforms are supported?</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>
								All 13 major ecosystems including React, Next.js, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			);
		}

		// 9. Infinite Marquee
		if (component.slug === 'infinite-marquee') {
			const speed = Number(propValues.speed ?? 40);
			const pauseOnHover = Boolean(propValues.pauseOnHover ?? true);

			return (
				<div className='mx-auto w-full max-w-2xl py-6'>
					<InfiniteMarquee speed={speed} pauseOnHover={pauseOnHover} gap='1.5rem'>
						{['120Hz ProMotion Ready', 'Zero Runtime Deps', 'Modulo Wrap Arithmetic', `${ECOSYSTEM_COUNT} Targets`, 'Exhuma Kinetic Engine'].map((item, idx) => (
							<div
								key={idx}
								className='border-border/80 bg-card/90 hover:border-foreground/40 flex items-center gap-2 rounded-2xl border px-5 py-3 text-xs font-semibold shadow-xs backdrop-blur-md transition-colors'
							>
								<span className='bg-foreground/60 h-1.5 w-1.5 rounded-full' />
								<span className='text-foreground font-mono'>{item}</span>
							</div>
						))}
					</InfiniteMarquee>
				</div>
			);
		}

		// 10. Bento Grid
		if (component.slug === 'bento-grid') {
			const cols = Number(propValues.cols ?? 3);

			return (
				<div className='mx-auto w-full max-w-2xl p-4'>
					<BentoGrid cols={cols} gap='1rem'>
						<BentoCard colSpan={2}>
							<BentoHeader>
								<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>ANALYTICAL KINETICS</span>
								<h4 className='text-foreground text-base font-bold'>Continuous Math Engine</h4>
							</BentoHeader>
							<BentoContent>Hardware-accelerated CSS custom properties driven directly by rAF loops.</BentoContent>
						</BentoCard>
						<BentoCard colSpan={1}>
							<BentoHeader>
								<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>BIG-OMEGA</span>
								<h4 className='text-foreground text-base font-bold'>Ω(120Hz)</h4>
							</BentoHeader>
							<BentoContent>Guaranteed lower-bound execution.</BentoContent>
						</BentoCard>
					</BentoGrid>
				</div>
			);
		}

		// 11. Diamond Grid
		if (component.slug === 'diamond-grid') {
			const gap = String(propValues.gap ?? '0.75vw');

			return (
				<div className='mx-auto w-full max-w-xl p-4'>
					<DiamondGrid gap={gap}>
						{Array.from({ length: 16 }).map((_, idx) => (
							<div
								key={idx}
								className='border-border/80 bg-card/80 hover:border-foreground/50 flex aspect-square w-12 flex-col items-center justify-center rounded-2xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 sm:w-16'
							>
								<span className='text-foreground text-3xs font-mono font-bold'>#{idx + 1}</span>
							</div>
						))}
					</DiamondGrid>
				</div>
			);
		}

		// 12. Scroll Timeline
		if (component.slug === 'scroll-timeline') {
			return (
				<div
					tabIndex={0}
					role='region'
					aria-label={`${component.name} scroll demo`}
					className='border-border/80 bg-background/50 no-scrollbar focus-visible:ring-foreground/50 relative mx-auto h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border p-6 shadow-inner outline-none focus-visible:ring-1'
				>
					<ScrollTimeline
						items={[
							{
								date: 'Phase 01',
								title: 'Mathematical Invariants',
								subtitle: 'Big-Omega Foundation',
								description: 'Codified analytical spring ODEs and zero-allocation ring buffers.',
							},
							{
								date: 'Phase 02',
								title: `${ECOSYSTEM_COUNT}-Ecosystem Compilers`,
								subtitle: 'Universal Code Generation',
								description: 'Deterministic AST compilation to React, Vue, Svelte, Angular, and more.',
							},
							{
								date: 'Phase 03',
								title: 'Kinetic Layout Engines',
								subtitle: 'Responsive Matrix',
								description: 'Pure native SVG serpentine curves and continuous momentum translations.',
							},
						]}
					/>
				</div>
			);
		}

		// 13. Sticky Parallax Scroll
		if (component.slug === 'sticky-parallax') {
			return (
				<div
					tabIndex={0}
					role='region'
					aria-label={`${component.name} scroll demo`}
					className='border-border/80 bg-background/50 no-scrollbar focus-visible:ring-foreground/50 relative mx-auto h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border shadow-inner outline-none focus-visible:ring-1'
				>
					<StickyParallaxScroll trackHeight='800px'>
						<div className='relative flex size-full items-center justify-center'>
							<ParallaxLayer speed={-0.4}>
								<div className='text-foreground/15 text-4xl font-black select-none'>BACKGROUND</div>
							</ParallaxLayer>
							<ParallaxLayer speed={0.8}>
								<div className='border-border/80 bg-card/90 rounded-2xl border p-6 text-center shadow-2xl backdrop-blur-md'>
									<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>DIFFERENTIAL MOMENTUM</span>
									<h4 className='text-foreground mt-1 text-lg font-bold'>Multi-Speed Layers</h4>
									<p className='text-muted-foreground mt-1 text-xs'>Scroll inside stage to observe parallax</p>
								</div>
							</ParallaxLayer>
						</div>
					</StickyParallaxScroll>
				</div>
			);
		}

		// 14. Border Beam
		if (component.slug === 'border-beam') {
			const size = Number(propValues.size ?? 200);
			const duration = Number(propValues.duration ?? 8);
			const borderWidth = Number(propValues.borderWidth ?? 2);
			const colorFrom = String(propValues.colorFrom ?? '#ffaa40');
			const colorTo = String(propValues.colorTo ?? '#9c40ff');
			const doubleBeam = Boolean(propValues.doubleBeam ?? false);
			const endOpacity = Number(propValues.endOpacity ?? 0);
			const opacity = Number(propValues.opacity ?? 1);
			const blur = Number(propValues.blur ?? 0);
			const borderRadius = Number(propValues.borderRadius ?? 16);

			return (
				<div
					className='border-border/80 bg-card/95 relative mx-auto flex min-h-[220px] w-full max-w-md flex-col justify-between overflow-hidden border p-5 shadow-2xl backdrop-blur-xl sm:min-h-[240px] sm:p-6'
					style={{ borderRadius: `${borderRadius}px` }}
				>
					<div className='flex items-center justify-between gap-3'>
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 text-amber-500 shadow-sm'>
								<Sparkles className='size-4' />
							</div>
							<div>
								<h4 className='text-foreground text-sm font-semibold tracking-tight'>Quantum Laser Perimeter</h4>
								<p className='text-muted-foreground text-xs'>Sub-pixel hardware composite</p>
							</div>
						</div>
						<span className='border-border/80 bg-muted/40 text-muted-foreground text-3xs inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono font-medium'>
							<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
							{doubleBeam ? 'DUAL BEAM // 120 FPS' : '120 FPS'}
						</span>
					</div>

					<div className='my-auto py-3'>
						<div className='text-muted-foreground text-3xs font-mono tracking-wider uppercase'>Kinetic Orbital Vector</div>
						<div className='text-foreground mt-1 flex items-baseline gap-2 text-xl font-semibold tracking-tight sm:text-2xl'>
							<span>
								{duration > 0 ? (360 / duration).toFixed(0) : '0'} <span className='text-muted-foreground font-mono text-xs font-normal'>deg/s</span>
							</span>
							<span className='font-mono text-xs font-medium text-emerald-500'>• {doubleBeam ? 'Dual Phase (180°)' : 'Single Phase'}</span>
						</div>
					</div>

					<div className='border-border/40 text-3xs text-muted-foreground flex items-center justify-between border-t pt-3 font-mono'>
						<div className='flex items-center gap-2'>
							<span>{borderWidth}px stroke</span>
							<span>•</span>
							<span>{duration}s cycle</span>
							<span>•</span>
							<span>{size}px arc</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<span className='border-border/60 size-2.5 rounded-full border' style={{ backgroundColor: colorFrom }} title={`From: ${colorFrom}`} />
							<span className='border-border/60 size-2.5 rounded-full border' style={{ backgroundColor: colorTo }} title={`To: ${colorTo}`} />
						</div>
					</div>

					<BorderBeam
						size={size}
						duration={duration}
						borderWidth={borderWidth}
						colorFrom={colorFrom}
						colorTo={colorTo}
						doubleBeam={doubleBeam}
						endOpacity={endOpacity}
						opacity={opacity}
						blur={blur}
						borderRadius={Number(propValues.borderRadius ?? 16)}
					/>
				</div>
			);
		}

		// 15. Animated Sphere
		if (component.slug === 'animated-sphere') {
			const color = String(propValues.color ?? '#6366f1');
			const speed = Number(propValues.speed ?? 1.0);
			const radiusScale = Number(propValues.radiusScale ?? 0.475);

			return (
				<div className='flex flex-col items-center justify-center p-4'>
					<AnimatedSphere color={color} speed={speed} radiusScale={radiusScale} className='border-border/80 h-64 w-64 rounded-2xl border bg-black/60 shadow-2xl backdrop-blur-md' />
				</div>
			);
		}

		// 16. Floating Dock
		if (component.slug === 'floating-dock') {
			const baseSize = Number(propValues.baseSize ?? 44);
			const maxMagnification = Number(propValues.maxMagnification ?? 0.6);
			const influenceRadius = Number(propValues.influenceRadius ?? 70);

			return (
				<div className='mx-auto flex w-full max-w-md flex-col items-center justify-center py-12'>
					<p className='text-muted-foreground mb-6 font-mono text-xs'>Hover over icons to experience Gaussian scale distribution</p>
					<FloatingDock
						baseSize={baseSize}
						maxMagnification={maxMagnification}
						influenceRadius={influenceRadius}
						items={[
							{ title: 'Terminal', icon: <Terminal className='h-5 w-5' /> },
							{ title: 'Kinetics', icon: <Sliders className='h-5 w-5' /> },
							{ title: 'Hardware', icon: <Cpu className='h-5 w-5' /> },
							{ title: 'Shaders', icon: <Sparkles className='h-5 w-5' /> },
							{ title: 'Security', icon: <ShieldCheck className='h-5 w-5' /> },
						]}
					/>
				</div>
			);
		}

		// 17. Interactive Grid Pattern
		if (component.slug === 'interactive-grid') {
			const width = Number(propValues.width ?? 32);
			const height = Number(propValues.height ?? 32);

			return (
				<div className='border-border/80 bg-background relative mx-auto flex h-[23.75rem] w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 shadow-inner'>
					<InteractiveGridPattern width={width} height={height} squares={[24, 16]} className='mask-[radial-gradient(400px_circle_at_center,white,transparent)] opacity-70' />
					<div className='z-10 flex flex-col items-center text-center'>
						<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>VECTOR KINETICS</span>
						<h4 className='text-foreground mt-1 text-xl font-bold'>Interactive Grid</h4>
						<p className='text-muted-foreground mt-1 max-w-xs text-xs'>Hover over grid squares to trigger hardware-accelerated kinetic active states.</p>
					</div>
				</div>
			);
		}

		// 18. Number Ticker
		if (component.slug === 'number-ticker') {
			const value = Number(propValues.value ?? 1000);
			const decimalPlaces = Number(propValues.decimalPlaces ?? 0);

			return (
				<div className='border-border/80 bg-card mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-lg'>
					<span className='kbd border-border bg-background/80 text-foreground text-3xs mb-2 font-mono font-bold uppercase'>ANALYTICAL EASING (rAF)</span>
					<div className='text-foreground font-mono text-6xl font-black tracking-tight'>
						$<NumberTicker value={value} decimalPlaces={decimalPlaces} />
					</div>
					<p className='text-muted-foreground mt-3 font-mono text-xs'>Continuous ease-out exponential ticker with zero Framer Motion dependencies.</p>
				</div>
			);
		}

		// 19. Magnetic Button
		if (component.slug === 'magnetic-button') {
			const strength = Number(propValues.strength ?? 0.35);
			const radius = Number(propValues.radius ?? 120);
			const springDamping = Number(propValues.springDamping ?? 18);

			return (
				<div className='flex flex-col items-center justify-center p-12'>
					<p className='text-muted-foreground mb-6 font-mono text-xs'>Move cursor near button to feel inverted magnetic pull field</p>
					<MagneticButton
						strength={strength}
						radius={radius}
						springDamping={springDamping}
						className='border-border/80 bg-card/90 text-foreground hover:bg-foreground hover:text-background rounded-2xl border px-8 py-4 font-bold shadow-xl backdrop-blur-md transition-colors'
					>
						<span className='flex items-center gap-2'>
							<Sparkles className='h-4 w-4 shrink-0' />
							<span>Magnetic Attraction</span>
						</span>
					</MagneticButton>
				</div>
			);
		}

		// 20. Card Swipe Stack
		if (component.slug === 'card-swipe-stack') {
			const thresholdDistance = Number(propValues.thresholdDistance ?? 120);
			const maxRotation = Number(propValues.maxRotation ?? 20);
			const scaleStep = Number(propValues.scaleStep ?? 0.05);
			const offsetStep = Number(propValues.offsetStep ?? 14);
			const preventLastCardDismiss = propValues.preventLastCardDismiss !== false;

			return (
				<div className='relative max-h-[480px] w-full overflow-x-hidden overflow-y-auto scroll-smooth px-4 py-2'>
					{/* Stage 01: Card Swipe Stack Section */}
					<div className='flex flex-col items-center justify-center py-2'>
						<div className='mb-2 text-center'>
							<span className='kbd text-primary text-3xs font-mono'>STAGE 01 // SWIPE STACK</span>
							<h3 className='text-foreground mt-0.5 text-sm font-bold'>Kinetic Card Swipe Stack</h3>
							<p className='text-muted-foreground mt-0.5 font-mono text-xs'>
								{preventLastCardDismiss ? 'Drag to swipe cards → last card anchors with elastic resistance' : 'Drag to swipe all cards → scroll moves to Stage 02'}
							</p>
						</div>

						<CardSwipeStack
							key={cardSwipeResetKey}
							thresholdDistance={thresholdDistance}
							maxRotation={maxRotation}
							scaleStep={scaleStep}
							offsetStep={offsetStep}
							preventLastCardDismiss={preventLastCardDismiss}
							className='w-full max-w-sm'
							items={[
								{ id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
								{ id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: `Pure AST universal generation targeting ${ECOSYSTEM_COUNT} ecosystems.` },
								{ id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
							]}
							renderCard={(item) => (
								<div className='border-border/80 bg-card w-full rounded-2xl border p-5 shadow-2xl backdrop-blur-md'>
									<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold'>{item.tag}</span>
									<h4 className='text-foreground mt-1 text-base font-bold'>{item.title}</h4>
									<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>{item.desc}</p>
									<div className='border-border/60 text-muted-foreground text-3xs mt-3 flex items-center justify-between border-t pt-2.5 font-mono'>
										<span>← SWIPE LEFT</span>
										<span>SWIPE RIGHT →</span>
									</div>
								</div>
							)}
							emptyState={
								<div className='border-border bg-card/80 flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-xl backdrop-blur-md'>
									<div className='bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-full'>
										<RefreshCw className='size-4' />
									</div>
									<h4 className='text-foreground text-sm font-semibold'>Stack Completed</h4>
									<p className='text-muted-foreground mt-0.5 text-xs'>All cards have been swiped away.</p>
									<button
										type='button'
										onClick={() => setCardSwipeResetKey((k) => k + 1)}
										className='bg-primary text-primary-foreground hover:bg-primary/90 mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors'
									>
										<RefreshCw className='size-3.5' /> Reset Stack
									</button>
								</div>
							}
						/>

						<div className='text-muted-foreground/60 text-3xs mt-3 flex animate-bounce items-center gap-1.5 font-mono'>
							<span>SCROLL FOR NEXT SECTION</span>
							<span>↓</span>
						</div>
					</div>

					{/* Stage 02: Next Section Below Stack */}
					<div className='border-border/80 bg-card/70 mx-auto mt-4 max-w-md rounded-2xl border p-6 shadow-xl backdrop-blur-md'>
						<div className='border-border/60 flex items-center justify-between border-b pb-3'>
							<div>
								<span className='kbd text-3xs font-mono text-emerald-400'>STAGE 02 // NEXT SECTION</span>
								<h4 className='text-foreground mt-1 text-sm font-bold'>Hardware Telemetry & Runtime Invariants</h4>
							</div>
							<span className='kbd text-3xs border-emerald-500/30 bg-emerald-500/10 font-mono text-emerald-400'>PASS-THROUGH ACTIVE</span>
						</div>
						<p className='text-muted-foreground mt-3 text-xs leading-relaxed'>You have scrolled past the card stack. Drag cards to dismiss them — scroll always moves here naturally.</p>
						<div className='mt-4 grid grid-cols-3 gap-2.5'>
							<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
								<span className='text-muted-foreground text-3xs font-mono'>FRAME FLOOR</span>
								<p className='text-foreground mt-1 text-sm font-bold'>120 FPS</p>
							</div>
							<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
								<span className='text-muted-foreground text-3xs font-mono'>GESTURE BUFFER</span>
								<p className='text-foreground mt-1 text-sm font-bold'>Float64Array</p>
							</div>
							<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
								<span className='text-muted-foreground text-3xs font-mono'>HEAP ALLOC</span>
								<p className='text-foreground mt-1 text-sm font-bold'>Ω(1) ZERO</p>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// 21. Comparison Slider
		if (component.slug === 'comparison-slider') {
			const defaultPosition = Number(propValues.defaultPosition ?? 0.5);

			return (
				<div className='mx-auto w-full max-w-md py-4'>
					<ComparisonSlider
						aspectRatio='16/10'
						defaultPosition={defaultPosition}
						before={
							<div className='flex size-full flex-col justify-between bg-linear-to-br from-zinc-950 via-zinc-900 to-black p-6 text-white'>
								<span className='kbd text-3xs self-start border-white/20 bg-white/10 font-mono text-white'>STATIC CANVAS</span>
								<div>
									<h4 className='text-xl font-bold'>Traditional View</h4>
									<p className='text-xs opacity-70'>Unaccelerated layout</p>
								</div>
							</div>
						}
						after={
							<div className='flex size-full flex-col justify-between bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-6 text-white'>
								<span className='kbd text-3xs self-start border-white/30 bg-white/20 font-mono text-white'>EXHUMA KINETIC</span>
								<div>
									<h4 className='text-xl font-bold'>120Hz ProMotion</h4>
									<p className='text-xs opacity-70'>Compositor accelerated</p>
								</div>
							</div>
						}
					/>
				</div>
			);
		}

		// 22. Expandable Card
		if (component.slug === 'expandable-card') {
			return (
				<div className='mx-auto w-full max-w-sm py-4'>
					<ExpandableCard
						cardContent={
							<div className='border-border/80 bg-card hover:border-foreground/40 rounded-2xl border p-6 shadow-lg transition-all'>
								<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>CLICK TO EXPAND</span>
								<h4 className='text-foreground mt-2 text-lg font-bold'>FLIP Morphing Architecture</h4>
								<p className='text-muted-foreground mt-1 text-xs'>Mathematical geometry snapshot with zero Framer Motion.</p>
							</div>
						}
						expandedContent={
							<div className='space-y-4'>
								<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>MODAL DIALOG (FLIP INVERTED)</span>
								<h3 className='text-foreground text-2xl font-black'>Hardware-Accelerated Dialog</h3>
								<p className='text-muted-foreground text-sm leading-relaxed'>
									The card morphs smoothly from its trigger bounding rect into a centered dialog snapshot using analytical FLIP transformation matrices.
								</p>
								<div className='border-border/60 bg-background text-muted-foreground rounded-xl border p-4 font-mono text-xs'>Press ESC or click backdrop to close</div>
							</div>
						}
					/>
				</div>
			);
		}

		// 23. Cursor Tooltip
		if (component.slug === 'cursor-tooltip') {
			const springDamping = Number(propValues.springDamping ?? 22);

			return (
				<div className='flex flex-col items-center justify-center p-12'>
					<CursorTooltip
						springDamping={springDamping}
						content='Exhuma Exponential Cursor Smoothing'
						className='border-border/80 bg-card/80 hover:border-foreground/40 cursor-pointer rounded-2xl border p-8 text-center shadow-xl transition-colors'
					>
						<span className='kbd border-border bg-background/80 text-foreground text-3xs mb-2 inline-block font-mono font-bold uppercase'>HOVER OVER CARD</span>
						<h4 className='text-foreground text-xl font-bold'>Interactive Viewport Target</h4>
						<p className='text-muted-foreground mt-1 text-xs'>Hover cursor anywhere over this card to activate the magnetic trailing tooltip.</p>
					</CursorTooltip>
				</div>
			);
		}

		return null;
	};

	return (
		<div className='space-y-12'>
			{/* Page Header */}
			<DocsPageHeader
				eyebrow={[
					{ label: 'Components', href: '/docs/components' },
					{ label: component.category.charAt(0).toUpperCase() + component.category.slice(1), href: `/docs/components#${component.category}` },
				]}
				title={component.name}
				description={component.description}
			/>

			{/* Sticky Target Environment Chooser Floating Mission Control Bar */}
			<div ref={stickyDockRef} className='top-header-mobile-gap lg:top-header-gap sticky z-30 mb-5! transition-all duration-300'>
				<div
					className={cn(
						'relative flex flex-col gap-2.5 overflow-hidden rounded-2xl transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-3',
						isDockSticky
							? 'border-primary/50 shadow-sticky-dock ring-primary/20 bg-card/95 supports-[backdrop-filter]:bg-background/90 scale-[1.01] border-2 p-2.5 shadow-2xl ring-2 backdrop-blur-2xl sm:p-3'
							: 'border-border/60 bg-muted/20 hover:border-border/80 border p-2.5 backdrop-blur-xs sm:p-3'
					)}
				>
					{/* Active laser accent beam across top edge: only appears when sticky */}
					{isDockSticky && <div className='via-primary absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-transparent to-transparent' />}

					{/* Left: Icon & Label */}
					<div className='flex min-w-0 items-center justify-between gap-2.5 sm:justify-start sm:gap-3'>
						<div className='flex min-w-0 items-center gap-2.5 sm:gap-3'>
							<div
								className={cn(
									'flex shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
									isDockSticky
										? 'border-primary/50 bg-primary text-primary-foreground h-7.5 w-7.5 shadow-sm sm:h-8 sm:w-8'
										: 'border-border/70 bg-background/60 text-muted-foreground h-7 w-7 sm:h-7.5 sm:w-7.5'
								)}
							>
								<Cpu className='h-3.5 w-3.5' />
							</div>
							<div className='flex min-w-0 flex-col gap-0.5'>
								<div className='flex items-center gap-2'>
									<span className={cn('text-xs font-semibold tracking-tight whitespace-nowrap transition-colors sm:text-sm', isDockSticky ? 'text-foreground font-bold' : 'text-foreground/90')}>
										Target Environment
									</span>
									{isDockSticky && (
										<div className='flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 shadow-xs'>
											<span className='relative flex h-1.5 w-1.5'>
												<span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75' />
												<span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500' />
											</span>
											<span className='text-3xs font-mono font-bold tracking-wide text-emerald-600 uppercase dark:text-emerald-400'>Pinned</span>
										</div>
									)}
								</div>
								{isDockSticky && <span className='text-muted-foreground text-3xs hidden font-mono md:inline-block'>Adapts interactive workbench, props contract & CLI commands below</span>}
							</div>
						</div>
					</div>

					{/* Right: Select Trigger */}
					<div className='flex w-full items-center gap-2 sm:w-auto sm:shrink-0'>
						<Select
							value={selectedFlavor}
							onValueChange={(val) => {
								setSelectedFlavor(val as EcosystemFlavor);
								setSelectedFileIdx(0);
							}}
						>
							<SelectTrigger
								className={cn(
									'h-9 w-full cursor-pointer rounded-xl px-3 font-mono text-xs transition-all sm:h-9.5 sm:w-44',
									isDockSticky
										? 'border-primary/60 bg-background/95 hover:bg-background hover:border-primary focus:ring-primary/30 shadow-md focus:ring-2'
										: 'border-border/70 bg-background/80 hover:bg-background hover:border-foreground/30 focus:ring-foreground/10 shadow-2xs focus:ring-1'
								)}
							>
								<div className='flex w-full items-center justify-between gap-2 truncate'>
									<div className='flex items-center gap-2 truncate'>
										<span className='text-foreground text-xs font-bold sm:text-sm'>{ECOSYSTEM_SHORT_NAMES[selectedFlavor]}</span>
										<span className='border-border/80 bg-muted/80 text-muted-foreground text-3xs hidden rounded-sm px-1.5 py-0.5 font-mono sm:inline'>{ECOSYSTEM_EXTENSIONS[selectedFlavor]}</span>
									</div>
									<span
										className={cn(
											'text-3xs shrink-0 rounded-sm px-1.5 py-0.5 font-mono font-bold tracking-wider uppercase sm:hidden',
											isDockSticky ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
										)}
									>
										Switch
									</span>
								</div>
							</SelectTrigger>
							<SelectContent className='max-h-96 min-w-64 sm:min-w-68'>
								{ECOSYSTEM_GROUPS.map((group, groupIdx) => (
									<React.Fragment key={group.label}>
										{groupIdx > 0 && <SelectSeparator />}
										<SelectGroup>
											<SelectLabel className='text-3xs text-muted-foreground/80 font-mono tracking-wider'>{group.label}</SelectLabel>
											{group.flavors.map((flavor) => (
												<SelectItem key={flavor} value={flavor} className='cursor-pointer py-2 font-mono text-xs'>
													<div className='flex w-full items-center justify-between gap-3'>
														<span className='font-semibold'>{ECOSYSTEM_LABELS[flavor]}</span>
														<span className='text-3xs text-muted-foreground/70 bg-muted rounded-sm px-1.5 py-0.5 font-mono'>{ECOSYSTEM_EXTENSIONS[flavor]}</span>
													</div>
												</SelectItem>
											))}
										</SelectGroup>
									</React.Fragment>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* CLI Quick Install Command Bar */}
			<div className='border-border/80 bg-card/85 relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-3.5 shadow-xs backdrop-blur-xl transition-all sm:p-4'>
				{/* Top hairline highlight & registration marks */}
				<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
				<div className='text-foreground/20 text-4xs pointer-events-none absolute top-1.5 left-2 font-mono select-none'>+</div>
				<div className='text-foreground/20 text-4xs pointer-events-none absolute top-1.5 right-2 font-mono select-none'>+</div>

				{/* Header Row: Terminal Identity & Package Manager Switcher */}
				<div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex items-center gap-2'>
						{/* macOS Terminal window dots */}
						<div className='flex items-center gap-1.5 pr-1'>
							<div className='h-2.5 w-2.5 rounded-full bg-red-500/70' />
							<div className='h-2.5 w-2.5 rounded-full bg-amber-500/70' />
							<div className='h-2.5 w-2.5 rounded-full bg-emerald-500/70' />
						</div>
						<span className='text-foreground font-mono text-xs font-bold tracking-tight'>CLI Installation</span>
						<Badge variant='outline' className='text-3xs border-emerald-500/30 bg-emerald-500/10 font-mono font-medium text-emerald-600 dark:text-emerald-400'>
							{ECOSYSTEM_SHORT_NAMES[selectedFlavor]}
						</Badge>
					</div>

					{/* Package Manager Selector: pnpm, npm, bun, yarn */}
					<div className='border-border/60 bg-muted/50 flex w-full items-center gap-1 rounded-lg border p-0.5 sm:w-auto'>
						{PKG_MANAGERS.map((pm) => {
							const isSelected = pkgManager === pm.id;
							return (
								<button
									key={pm.id}
									type='button'
									onClick={() => setPkgManager(pm.id)}
									className={cn(
										'text-2xs flex-1 cursor-pointer rounded-md px-2.5 py-1 text-center font-mono font-semibold transition-all sm:flex-none sm:px-2 sm:py-0.5',
										isSelected ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									{pm.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Terminal Viewport Row */}
				<div className='flex flex-col gap-2.5 sm:flex-row sm:items-center'>
					<div
						onClick={copyCli}
						title='Click to copy install command'
						className='group/cli border-muted-foreground/50! dark:border-border! relative flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 overflow-hidden rounded-xl border bg-zinc-950/90 px-3.5 py-2.5 shadow-inner transition-colors hover:border-zinc-600 dark:bg-black/90'
					>
						<Terminal className='h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover/cli:text-emerald-400' />
						<div className='no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto font-mono text-xs whitespace-nowrap select-all'>
							<span className='font-bold text-emerald-400 select-none'>$</span>
							<span className='font-semibold text-sky-400'>{activePkg.prefix}</span>
							<span className='font-bold text-zinc-100'>exhuma</span>
							<span className='text-zinc-400'>add</span>
							<span className='font-bold text-amber-400'>{component.slug}</span>
							<span className='text-zinc-500'>--flavor=</span>
							<span className='font-bold text-emerald-400 underline decoration-emerald-500/40 decoration-dotted'>{selectedFlavor}</span>
						</div>
					</div>

					<Button
						variant='default'
						size='sm'
						onClick={copyCli}
						className={cn(
							'h-9.5 shrink-0 cursor-pointer gap-1.5 rounded-xl px-4 font-mono text-xs font-semibold shadow-xs transition-all max-sm:w-full max-sm:justify-center',
							copiedCli ? 'bg-emerald-600 text-white hover:bg-emerald-600 dark:bg-emerald-500 dark:text-white' : 'bg-foreground text-background hover:bg-foreground/90'
						)}
					>
						{copiedCli ? (
							<>
								<Check className='h-3.5 w-3.5' />
								<span>Copied!</span>
							</>
						) : (
							<>
								<Copy className='h-3.5 w-3.5' />
								<span>Copy Command</span>
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Studio Workbench Interactive Specification Section */}
			<DocsSection id='interactive-stage' index={1} label='Workbench' title='Interactive Specification & Studio' reveal={false}>
				<div className='w-full space-y-6'>
					{/* 1. Studio Stage Header Toolbar */}
					<div className='border-border/80 bg-card/75 relative flex flex-col flex-wrap justify-between gap-3 overflow-hidden rounded-2xl border p-3.5 shadow-xs backdrop-blur-md transition-colors sm:flex-row sm:items-center'>
						<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

						{/* Left: Component Category & Presets Selector */}
						<div className='flex flex-wrap items-center gap-3 max-sm:w-full'>
							<Badge variant='outline' className='text-3xs bg-background/90 text-foreground font-mono font-bold tracking-wider uppercase'>
								{component.category}
							</Badge>

							{Object.keys(presets).length > 0 && (
								<div className='flex items-center gap-2 pl-1 max-sm:w-full'>
									<span className='text-muted-foreground text-3xs font-mono font-semibold uppercase max-sm:hidden'>Preset:</span>
									<div className='flex max-sm:scrollbar-none max-sm:overflow-x-auto'>
										<div className='border-border/70 bg-background/80 no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border p-0.5 whitespace-nowrap'>
											{Object.keys(presets).map((pName) => (
												<button
													key={pName}
													type='button'
													onClick={() => applyPreset(pName)}
													className={cn(
														'cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-all',
														activePreset === pName ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
													)}
												>
													{pName}
												</button>
											))}
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Right: Stage Zoom & Expand/Collapse Split */}
						<div className='flex items-center gap-2 font-mono text-xs'>
							<div className='border-border/70 bg-background/80 flex items-center gap-1 rounded-lg border p-0.5'>
								<button
									type='button'
									onClick={() => setZoomScale((z) => Math.max(50, z - 25))}
									className='hover:bg-accent hover:text-foreground text-muted-foreground cursor-pointer rounded-sm p-1'
									title='Zoom Out'
								>
									<ZoomOut className='h-3.5 w-3.5' />
								</button>
								<button
									type='button'
									onClick={() => setZoomScale(100)}
									className='hover:text-foreground text-3xs text-muted-foreground w-9 cursor-pointer text-center transition-colors'
									title='Reset zoom to 100%'
								>
									{zoomScale}%
								</button>
								<button
									type='button'
									onClick={() => setZoomScale((z) => Math.min(150, z + 25))}
									className='hover:bg-accent hover:text-foreground text-muted-foreground cursor-pointer rounded-sm p-1'
									title='Zoom In'
								>
									<ZoomIn className='h-3.5 w-3.5' />
								</button>
							</div>

							<Button
								variant='outline'
								size='sm'
								onClick={() => setIsExpanded(!isExpanded)}
								className='border-border/80 hover:border-foreground/40 hidden h-7 cursor-pointer gap-1.5 font-mono text-xs xl:inline-flex'
								title={isExpanded ? 'Restore side-by-side view' : 'Expand stage to full width'}
							>
								{isExpanded ? <Minimize className='h-3.5 w-3.5' /> : <Maximize className='h-3.5 w-3.5' />}
								<span>{isExpanded ? 'Split View' : 'Full Width'}</span>
							</Button>
						</div>
					</div>

					{/* 2. Responsive Stage & Parameter Inspector Grid */}
					<div className='grid grid-cols-1 items-start gap-6 xl:grid-cols-12'>
						{/* Canvas Viewport Card */}
						<div
							className={cn(
								'border-border/80 bg-card/75 relative flex flex-col overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl transition-all duration-300',
								isExpanded ? 'xl:col-span-12' : 'xl:col-span-8'
							)}
						>
							<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

							{/* Device Switcher & Dimension Indicator Toolbar */}
							<div className='border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2 text-xs sm:px-4'>
								<div className='flex items-center gap-2'>
									<span className='text-foreground/80 text-2xs font-mono font-bold tracking-wider uppercase'>Viewport</span>
								</div>

								{/* 3 Real Responsive Device Modes */}
								<div className='border-border/70 bg-background/80 flex items-center gap-0.5 rounded-lg border p-0.5'>
									<button
										type='button'
										onClick={() => setViewportMode('fluid')}
										className={cn(
											'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:px-2.5',
											viewportMode === 'fluid' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
										)}
										title='Fluid (100% Canvas Width)'
									>
										<Monitor className='h-3.5 w-3.5' />
										<span className='hidden sm:inline'>Fluid</span>
									</button>
									<button
										type='button'
										onClick={() => setViewportMode('tablet')}
										className={cn(
											'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:px-2.5',
											viewportMode === 'tablet' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
										)}
										title='Tablet Viewport (640px)'
									>
										<Tablet className='h-3.5 w-3.5' />
										<span className='hidden sm:inline'>Tablet</span>
									</button>
									<button
										type='button'
										onClick={() => setViewportMode('mobile')}
										className={cn(
											'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:px-2.5',
											viewportMode === 'mobile' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
										)}
										title='Mobile Viewport (375px)'
									>
										<Smartphone className='h-3.5 w-3.5' />
										<span className='hidden sm:inline'>Mobile</span>
									</button>
								</div>

								{/* Dimension Tag */}
								<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold'>
									{viewportMode === 'mobile' ? '375 × 667 px' : viewportMode === 'tablet' ? '640 × 800 px' : 'Fluid 100%'}
								</span>
							</div>

							{/* Live Canvas Viewport with High-Contrast Studio Backdrop */}
							<div className='bg-dot-grid-studio relative flex min-h-[20rem] items-center justify-center overflow-x-auto p-2.5 transition-colors sm:min-h-[31.25rem] sm:p-6 lg:p-10'>
								<div
									className={cn(
										'border-border/80 bg-background/95 ring-border/50 mx-auto flex items-center justify-center border-2 shadow-2xl ring-1 transition-all duration-300',
										viewportMode === 'mobile'
											? 'w-[375px] max-w-full rounded-3xl p-3 sm:p-4'
											: viewportMode === 'tablet'
												? 'w-[640px] max-w-full rounded-2xl p-4 sm:p-6'
												: 'w-full rounded-2xl p-3 sm:p-6 lg:p-10'
									)}
									style={{
										transform: `scale(${zoomScale / 100})`,
										transformOrigin: 'top center',
									}}
								>
									{renderCanvasPreview()}
								</div>
							</div>
						</div>

						{/* 3. Parameter Inspector Card */}
						<div
							className={cn(
								'border-border/80 bg-card/75 relative space-y-4 overflow-hidden rounded-2xl border p-4 shadow-xs backdrop-blur-xl transition-all duration-300',
								isExpanded ? 'xl:col-span-12' : 'xl:col-span-4'
							)}
						>
							<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

							<div className='border-border/70 flex items-center justify-between border-b pb-3'>
								<div className='flex items-center gap-2'>
									<Sliders className='text-foreground/80 h-4 w-4 shrink-0' />
									<span className='text-foreground font-mono text-xs font-bold tracking-wider uppercase'>Parameters</span>
								</div>
								<div className='flex items-center gap-2'>
									<Badge variant='outline' className='text-4xs bg-background/80 text-foreground font-mono font-bold tracking-wider uppercase'>
										{component.props.length} Props
									</Badge>
									<Button
										variant='ghost'
										size='sm'
										onClick={resetProps}
										className='text-muted-foreground hover:text-foreground text-3xs flex h-7 cursor-pointer items-center gap-1.5 px-2 font-mono transition-colors'
										title='Reset all parameters to default'
									>
										<RefreshCw className='h-3 w-3' />
										<span>Reset</span>
									</Button>
								</div>
							</div>

							{/* Dynamic Prop Tweaks List */}
							<div className='max-h-[31.25rem] space-y-1.5 overflow-y-auto pr-1'>
								{component.props.map((propDef) => {
									const val = propValues[propDef.name] ?? propDef.defaultValue;

									return (
										<div key={propDef.name} className='border-border/70 bg-background/50 hover:border-foreground/30 rounded-lg border px-2.5 py-2.5 shadow-2xs transition-colors'>
											<div className='flex items-center justify-between text-xs'>
												<label htmlFor={`prop-${propDef.name}`} className='text-foreground text-2xs font-mono font-semibold'>
													{propDef.name}
												</label>
												{propDef.type === 'boolean' && <Switch id={`prop-${propDef.name}`} checked={Boolean(val)} onCheckedChange={(checked) => handlePropChange(propDef.name, checked)} />}
											</div>

											{/* Controls */}
											{propDef.type === 'select' && propDef.options ? (
												<div className='mt-1 w-full'>
													<Select value={String(val ?? '')} onValueChange={(newVal) => handlePropChange(propDef.name, newVal)}>
														<SelectTrigger id={`prop-${propDef.name}`} className='text-2xs h-7 w-full'>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{propDef.options.map((opt) => (
																<SelectItem key={opt.value} value={opt.value} className='text-2xs'>
																	{opt.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											) : propDef.type === 'number' ? (
												(() => {
													const parsed = typeof val === 'number' ? val : parseFloat(String(val));
													const min = propDef.min ?? 0;
													const max = propDef.max ?? 100;
													const step = propDef.step ?? 1;
													const num = Number.isFinite(parsed) ? parsed : min;
													return (
														<div className='flex items-center gap-2 pt-0.5'>
															<Slider min={min} max={max} step={step} value={[num]} onValueChange={(vals) => handlePropChange(propDef.name, vals[0])} className='flex-1' />
															<Input
																type='number'
																min={min}
																max={max}
																step={step}
																value={Number.isFinite(parsed) ? parsed : ''}
																onChange={(e) => {
																	const parsedVal = parseFloat(e.target.value);
																	handlePropChange(propDef.name, Number.isFinite(parsedVal) ? parsedVal : min);
																}}
																className='text-3xs h-6 w-14 px-1 py-0 text-right font-mono'
															/>
														</div>
													);
												})()
											) : propDef.type === 'color' ? (
												<div className='flex flex-col gap-1.5 pt-0.5'>
													<div className='flex items-center gap-1.5'>
														<input
															type='color'
															id={`prop-${propDef.name}`}
															value={toHexColor(val)}
															onChange={(e) => handlePropChange(propDef.name, e.target.value)}
															className='border-border/80 h-7 w-9 cursor-pointer rounded-md border bg-transparent p-0.5'
															title='Select color'
														/>
														<Input
															type='text'
															value={String(val ?? '')}
															onChange={(e) => handlePropChange(propDef.name, e.target.value)}
															className='text-3xs h-7 flex-1 font-mono'
															placeholder='#6366f1'
														/>
													</div>
													<div className='flex items-center gap-1 pt-0.5'>
														{COLOR_PRESETS.map((preset) => (
															<button
																key={preset.value}
																type='button'
																title={`${preset.label} (${preset.value})`}
																onClick={() => handlePropChange(propDef.name, preset.value)}
																className={`h-3.5 w-3.5 cursor-pointer rounded-full border transition-transform hover:scale-125 ${
																	toHexColor(val) === preset.value.toLowerCase() ? 'border-foreground ring-primary scale-110 ring-1' : 'border-border/80'
																}`}
																style={{ backgroundColor: preset.value }}
															/>
														))}
													</div>
												</div>
											) : propDef.type !== 'boolean' ? (
												<div className='pt-0.5'>
													<Input
														type='text'
														id={`prop-${propDef.name}`}
														value={String(val ?? '')}
														onChange={(e) => handlePropChange(propDef.name, e.target.value)}
														className='text-3xs h-6 w-full font-mono'
													/>
												</div>
											) : null}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</DocsSection>

			{/* 2. Quick Start & Usage Example Section */}
			<DocsSection
				id='usage-example'
				index={2}
				label='Usage'
				title='Quick Start & Consumer Example'
				description={`Copy-paste ready implementation for ${ECOSYSTEM_LABELS[selectedFlavor]}. Automatically updates when you modify parameters in the Workbench above.`}
			>
				<div className='border-border/80 bg-card/75 relative overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl'>
					<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
					<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
					<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

					{/* File Header Bar */}
					<div className='border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5'>
						<div className='flex items-center gap-2'>
							<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>{usageFile.filename}</span>
							<Badge variant='outline' className='text-3xs font-mono'>
								{ECOSYSTEM_LABELS[selectedFlavor]}
							</Badge>
						</div>

						<div className='flex items-center gap-1.5'>
							<TooltipProvider delayDuration={150}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={downloadUsageFile}
											className='border-border/80 hover:border-foreground/40 h-8 w-8 cursor-pointer'
											aria-label={`Download ${usageFile.filename}`}
										>
											<Download className='h-3.5 w-3.5 shrink-0' />
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>Download {usageFile.filename}</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											onClick={copyUsageCode}
											className='border-border/80 hover:border-foreground/40 h-8 cursor-pointer gap-1.5 font-mono text-xs'
											aria-label='Copy usage code'
										>
											{copiedUsage ? (
												<>
													<Check className='h-3.5 w-3.5 text-emerald-500' />
													<span className='font-semibold text-emerald-600 dark:text-emerald-400'>Copied!</span>
												</>
											) : (
												<>
													<Copy className='h-3.5 w-3.5' />
													<span>Copy Code</span>
												</>
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>{copiedUsage ? 'Copied to clipboard' : 'Copy code snippet'}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* Code Preview */}
					<div className='bg-muted/10 p-3 sm:p-4'>
						<CodeBlock code={usageFile.code} filename={usageFile.filename} language={getCodeLanguage(usageFile.filename)} showHeader={false} className='border-0 bg-transparent shadow-none' />
					</div>
				</div>
			</DocsSection>

			{/* 3. API Contract: Focused Props & Configuration Section */}
			<DocsSection
				id='props-api'
				index={3}
				label='API Contract'
				title='Props & Configuration'
				description={`Exhaustive parameter contract for ${component.name}. Validated in the live Studio workbench above and statically checked across all ${ECOSYSTEM_COUNT} ecosystem templates.`}
			>
				{/* Desktop View: Dense Data Table */}
				<div className='hidden md:block'>
					<DocsTable label={`${component.name} props`}>
						<thead className={docsTableHeadClass}>
							<tr>
								<th className='px-4 py-3 font-mono'>Prop</th>
								<th className='px-4 py-3 font-mono'>Type</th>
								<th className='px-4 py-3 font-mono'>Default</th>
								<th className='px-4 py-3 font-mono'>Description</th>
							</tr>
						</thead>
						<tbody className='divide-border divide-y'>
							{component.props.map((p) => {
								const isCustom = propValues[p.name] !== undefined && propValues[p.name] !== p.defaultValue;
								return (
									<tr key={p.name} className='hover:bg-muted/30 transition-colors'>
										<td className='text-foreground px-4 py-3 font-mono font-bold whitespace-nowrap'>
											<div className='flex items-center gap-2'>
												<span>{p.name}</span>
												{isCustom && <span className='bg-foreground/10 text-foreground text-4xs rounded-sm px-1.5 py-0.5 font-mono uppercase'>live</span>}
											</div>
										</td>
										<td className='px-4 py-3 font-mono'>
											<span
												className={cn(
													'text-3xs rounded-md border px-2 py-0.5 font-mono font-semibold',
													p.type === 'number'
														? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
														: p.type === 'boolean'
															? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
															: p.type === 'string'
																? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
																: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
												)}
											>
												{p.type}
											</span>
										</td>
										<td className='text-foreground px-4 py-3 font-mono font-semibold'>
											<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono'>
												{p.defaultValue !== undefined && p.defaultValue !== null && p.defaultValue !== '' ? String(p.defaultValue) : '—'}
											</span>
										</td>
										<td className='text-muted-foreground px-4 py-3 font-mono text-xs leading-relaxed'>{p.description || 'Configures dynamic calculation parameters.'}</td>
									</tr>
								);
							})}
						</tbody>
					</DocsTable>
				</div>

				{/* Mobile View: Dedicated Parameter Cards (Zero Horizontal Overflow) */}
				<div className='space-y-3 md:hidden'>
					{component.props.map((p) => {
						const isCustom = propValues[p.name] !== undefined && propValues[p.name] !== p.defaultValue;
						return (
							<div key={p.name} className='border-border/80 bg-card/80 space-y-2 rounded-xl border p-3.5 shadow-xs'>
								<div className='flex items-center justify-between gap-2'>
									<div className='flex items-center gap-1.5'>
										<span className='text-foreground font-mono text-xs font-bold'>{p.name}</span>
										{isCustom && <span className='bg-foreground/10 text-foreground text-4xs rounded-sm px-1.5 py-0.5 font-mono uppercase'>live</span>}
									</div>
									<span
										className={cn(
											'text-3xs rounded-md border px-2 py-0.5 font-mono font-semibold',
											p.type === 'number'
												? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
												: p.type === 'boolean'
													? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
													: p.type === 'string'
														? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
														: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
										)}
									>
										{p.type}
									</span>
								</div>
								<p className='text-muted-foreground text-2xs font-mono leading-relaxed'>{p.description || 'Configures dynamic calculation parameters.'}</p>
								<div className='border-border/60 text-muted-foreground text-2xs flex items-center justify-between border-t pt-2 font-mono'>
									<span>Default:</span>
									<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold'>
										{p.defaultValue !== undefined && p.defaultValue !== null && p.defaultValue !== '' ? String(p.defaultValue) : '—'}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</DocsSection>

			{/* 4. Component Source Code Section */}
			<DocsSection
				id='source-code'
				index={4}
				label='Source Code'
				title='Component Source'
				description={`Component source definition for ${ECOSYSTEM_LABELS[selectedFlavor]}. ${
					hasEjectedDifference ? 'Toggle between the clean wrapper and the standalone ejected engine micro-kernel.' : 'Direct drop-in implementation for your project.'
				}`}
			>
				<div className='border-border/80 bg-card/75 relative overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl'>
					<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
					<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
					<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

					{/* File Header Bar */}
					<div className='border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5'>
						<div className='flex flex-wrap items-center gap-2'>
							<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>{activeSourceFile.filename}</span>

							{/* Clean vs Ejected Mode Switcher - only rendered when there is an actual difference */}
							{hasEjectedDifference && (
								<div className='border-border/70 bg-background/80 flex items-center gap-0.5 rounded-lg border p-0.5'>
									<button
										type='button'
										onClick={() => {
											setCodeMode('clean');
											setSelectedFileIdx(0);
										}}
										className={cn(
											'text-2xs cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
											codeMode === 'clean' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
										)}
									>
										Clean
									</button>
									<button
										type='button'
										onClick={() => {
											setCodeMode('ejected');
											setSelectedFileIdx(0);
										}}
										className={cn(
											'text-2xs cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
											codeMode === 'ejected' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
										)}
										title='Standalone zero-dependency code with raw math/physics inlined'
									>
										Ejected Engine
									</button>
								</div>
							)}

							{/* Multi-file Tabs */}
							{generatedFiles.length > 1 && (
								<div className='no-scrollbar flex items-center gap-1 overflow-x-auto'>
									{generatedFiles.map((file, idx) => (
										<button
											key={file.filename}
											type='button'
											onClick={() => setSelectedFileIdx(idx)}
											className={cn(
												'text-2xs shrink-0 cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
												selectedFileIdx === idx ? 'bg-muted text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
											)}
										>
											{file.filename}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Action Buttons: Download & Copy */}
						<div className='flex items-center gap-1.5'>
							<TooltipProvider delayDuration={150}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={downloadSourceFile}
											className='border-border/80 hover:border-foreground/40 h-8 w-8 cursor-pointer'
											aria-label={`Download ${activeSourceFile.filename}`}
										>
											<Download className='h-3.5 w-3.5 shrink-0' />
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>Download {activeSourceFile.filename}</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											onClick={copySourceCode}
											className='border-border/80 hover:border-foreground/40 h-8 cursor-pointer gap-1.5 font-mono text-xs'
											aria-label='Copy source code'
										>
											{copiedSource ? (
												<>
													<Check className='h-3.5 w-3.5 text-emerald-500' />
													<span className='font-semibold text-emerald-600 dark:text-emerald-400'>Copied!</span>
												</>
											) : (
												<>
													<Copy className='h-3.5 w-3.5' />
													<span>Copy Code</span>
												</>
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>{copiedSource ? 'Copied to clipboard' : 'Copy source code'}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* Source CodeBlock Display */}
					<div className='bg-muted/10 p-3 sm:p-4'>
						<CodeBlock
							code={activeSourceFile.code}
							filename={activeSourceFile.filename}
							language={getCodeLanguage(activeSourceFile.filename)}
							showHeader={false}
							className='border-0 bg-transparent shadow-none'
						/>
					</div>
				</div>
			</DocsSection>

			{/* 5. Lifecycle & Performance Guarantees */}
			<DocsSection id='lifecycle-safety' index={5} label='Architecture' title='Lifecycle Safety & Performance' description='Engineered for high-frequency user interactions with zero memory leaks.'>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					<DocsSpecCard icon={ShieldCheck} tag='Teardown' title='Deterministic Cleanup'>
						All pointer event listeners, scroll handlers, and resize observers are cleanly destroyed on component unmount, preventing lingering background processes.
					</DocsSpecCard>
					<DocsSpecCard icon={Sparkles} tag='Compositor' title='GPU Compositor Acceleration'>
						Transform and opacity modifications run directly on the GPU compositor thread using <code className='text-foreground font-mono'>will-change: transform</code> without triggering browser layout
						recalculations.
					</DocsSpecCard>
				</div>
			</DocsSection>

			{/* 6. Accessibility Considerations */}
			<DocsSection id='accessibility' index={6} label='a11y' title='Accessibility Considerations' description='Fully compliant with WCAG guidelines and respects user motion preferences.'>
				<DocsSpecCard icon={Accessibility} tag='Motion' title='prefers-reduced-motion Support'>
					When a user has <code className='text-foreground font-mono'>prefers-reduced-motion: reduce</code> enabled in their operating system, Exhuma components automatically disable 3D gyroscope tilt and
					spring animations, rendering static accessible content.
				</DocsSpecCard>
			</DocsSection>
		</div>
	);
}

export default ComponentDocView;
