'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	ALL_COMPONENTS,
	COMPONENT_REGISTRY,
	EcosystemFlavor,
	ECOSYSTEM_LABELS,
	CATEGORIES,
	UniversalComponent,
	PropDescriptor,
	ComponentFilePayload,
} from '@/registry';
import { CodeBlock } from './CodeBlock';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconAdjustments as Sliders,
  IconSparkles as Sparkles,
  IconRefresh as RefreshCw,
  IconStack2 as Layers,
  IconCopy as Copy,
  IconCheck as Check,
  IconDeviceLaptop as Laptop,
  IconDeviceTablet as Tablet,
  IconDeviceMobile as Smartphone,
  IconDeviceDesktop as Monitor,
  IconZoomIn as ZoomIn,
  IconZoomOut as ZoomOut,
  IconDownload as Download,
  IconSearch as Search,
  IconChevronRight as ChevronRight,
  IconLayoutGrid as Grid,
  IconMaximize as Maximize2,
  IconTerminal2 as Terminal,
  IconCpu as Cpu,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import {
	StackingCards,
	HorizontalScroller,
	TiltCard,
	SpotlightCard,
	BorderBeam,
	CardSwipeStack,
	ComparisonSlider,
	ExpandableCard,
} from '@exhuma/cards';
import {
	CssMasonry,
	AutoGrid,
	InfiniteMarquee,
	BentoGrid,
	BentoCard,
	BentoHeader,
	BentoContent,
	DiamondGrid,
	ScrollTimeline,
	StickyParallaxScroll,
	ParallaxLayer,
	InteractiveGridPattern,
} from '@exhuma/layouts';
import {
	MorphingTabs,
	Accordion,
	AnimatedSphere,
	FloatingDock,
	NumberTicker,
	MagneticButton,
	CursorTooltip,
} from '@exhuma/core';

// Presets per component
const COMPONENT_PRESETS: Record<string, Record<string, Record<string, unknown>>> = {
	'stacking-cards': {
		Default: { cardHeight: 320, stackOffset: 24, scaleStep: 0.04, tiltFactor: 0.15 },
		'Subtle Elegance': { cardHeight: 280, stackOffset: 16, scaleStep: 0.02, tiltFactor: 0.05 },
		'Cinematic 3D': { cardHeight: 360, stackOffset: 32, scaleStep: 0.06, tiltFactor: 0.3 },
		'Compact Deck': { cardHeight: 220, stackOffset: 12, scaleStep: 0.03, tiltFactor: 0.1 },
	},
	'horizontal-scroller': {
		Default: { gap: 16, itemWidth: 280, scrollSpeed: 1.2, snapToItem: true },
		'High Velocity': { gap: 24, itemWidth: 340, scrollSpeed: 2.0, snapToItem: false },
		'Compact Reel': { gap: 12, itemWidth: 200, scrollSpeed: 1.0, snapToItem: true },
	},
	'tilt-card': {
		Default: { maxTilt: 20, glare: true, maxGlare: 0.35, scale: 1.05, speed: 400 },
		'Subtle Glare': { maxTilt: 10, glare: true, maxGlare: 0.15, scale: 1.02, speed: 600 },
		'Aggressive 3D': { maxTilt: 35, glare: true, maxGlare: 0.5, scale: 1.1, speed: 300 },
	},
	'css-masonry': {
		Default: { columns: 3, gap: 16 },
		Dense: { columns: 4, gap: 12 },
		Spacious: { columns: 2, gap: 24 },
	},
	'auto-grid': {
		Default: { minItemWidth: 220, gap: 16 },
		Compact: { minItemWidth: 160, gap: 12 },
		Cards: { minItemWidth: 280, gap: 24 },
	},
	'spotlight-card': {
		Default: { radius: 350, opacity: 0.8 },
		Subtle: { radius: 250, opacity: 0.5 },
		Broad: { radius: 500, opacity: 0.9 },
	},
	'morphing-tabs': {
		Default: { springStiffness: 26 },
		Snappy: { springStiffness: 40 },
		Gentle: { springStiffness: 16 },
	},
	'accordion': {
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
		Spacious: { cols: 3, gap: '2rem' },
	},
	'diamond-grid': {
		Default: { gap: '0.75vw' },
		Tight: { gap: '0.5vw' },
		Spacious: { gap: '1.2vw' },
	},
	'scroll-timeline': {
		Default: { curveWidth: 24, curveHeight: 40 },
		Wider: { curveWidth: 36, curveHeight: 50 },
		Subtle: { curveWidth: 16, curveHeight: 30 },
	},
	'sticky-parallax': {
		Default: { trackHeight: '250vh' },
		Short: { trackHeight: '180vh' },
		Deep: { trackHeight: '350vh' },
	},
	'border-beam': {
		Default: { size: 200, duration: 8, borderWidth: 2 },
		Fast: { size: 200, duration: 4, borderWidth: 2 },
		Subtle: { size: 300, duration: 12, borderWidth: 1.5 },
	},
	'animated-sphere': {
		Default: { radius: 100, rotationSpeedX: 0.008, rotationSpeedY: 0.012, asciiMode: false },
		ASCII: { radius: 100, rotationSpeedX: 0.008, rotationSpeedY: 0.012, asciiMode: true },
		Rapid: { radius: 100, rotationSpeedX: 0.02, rotationSpeedY: 0.03, asciiMode: false },
	},
	'floating-dock': {
		Default: { maxDistance: 140, baseWidth: 44, magnifiedWidth: 72 },
		Compact: { maxDistance: 100, baseWidth: 36, magnifiedWidth: 56 },
		Dramatic: { maxDistance: 180, baseWidth: 44, magnifiedWidth: 88 },
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
		Default: { thresholdDistance: 120, maxRotation: 20, scaleStep: 0.05 },
		Snappy: { thresholdDistance: 90, maxRotation: 25, scaleStep: 0.06 },
		Stiff: { thresholdDistance: 160, maxRotation: 15, scaleStep: 0.04 },
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

export function StudioWorkbench({
	initialSlug = 'stacking-cards',
}: {
	initialSlug?: string;
}) {
	const searchParams = useSearchParams();
	const querySlug = searchParams.get('slug') || searchParams.get('component') || initialSlug;
	const [selectedSlug, setSelectedSlug] = useState(querySlug);
	const component = COMPONENT_REGISTRY[selectedSlug] || ALL_COMPONENTS[0];

	// Component search query in left catalog
	const [catalogSearch, setCatalogSearch] = useState('');

	// Dynamic prop state
	const [propValues, setPropValues] = useState<Record<string, unknown>>(() => ({
		...component.defaultProps,
	}));

	const [selectedFlavor, setSelectedFlavor] = useState<EcosystemFlavor>('react');
	const [selectedFileIdx, setSelectedFileIdx] = useState(0);
	const [viewportMode, setViewportMode] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
	const [zoomScale, setZoomScale] = useState<number>(100);
	const [copiedCli, setCopiedCli] = useState(false);
	const [canvasGrid, setCanvasGrid] = useState<'dots' | 'dense' | 'clean'>('dots');

	const studioStackingRef = React.useRef<HTMLDivElement>(null);
	const studioHorizontalRef = React.useRef<HTMLDivElement>(null);

	// Presets
	const presets = COMPONENT_PRESETS[selectedSlug] || {};
	const [activePreset, setActivePreset] = useState<string>('Default');

	// Synchronize with query parameter when navigating from docs / showcase
	useEffect(() => {
		if (querySlug && COMPONENT_REGISTRY[querySlug] && querySlug !== selectedSlug) {
			setSelectedSlug(querySlug);
			const newComp = COMPONENT_REGISTRY[querySlug];
			if (newComp) {
				setPropValues({ ...newComp.defaultProps });
				setActivePreset('Default');
			}
		}
	}, [querySlug, selectedSlug]);

	const handleSelectComponent = (slug: string) => {
		setSelectedSlug(slug);
		const newComp = COMPONENT_REGISTRY[slug];
		if (newComp) {
			setPropValues({ ...newComp.defaultProps });
			setActivePreset('Default');
		}
	};

	const applyPreset = (presetName: string) => {
		setActivePreset(presetName);
		const presetValues = presets[presetName];
		if (presetValues) {
			setPropValues((prev) => ({ ...prev, ...presetValues }));
		}
	};

	const handlePropChange = (name: string, value: unknown) => {
		setPropValues((prev) => ({ ...prev, [name]: value }));
	};

	const resetProps = () => {
		setPropValues({ ...component.defaultProps });
		setActivePreset('Default');
	};

	// Generate code
	const generatedFiles = useMemo(() => {
		return component.generateCode(selectedFlavor, propValues);
	}, [component, selectedFlavor, propValues]);

	const activeFile = generatedFiles[selectedFileIdx] || generatedFiles[0] || { filename: 'component.tsx', code: '' };

	const cliCommand = `npx exhuma add ${selectedSlug} --flavor=${selectedFlavor}`;

	const copyCli = () => {
		navigator.clipboard.writeText(cliCommand);
		setCopiedCli(true);
		setTimeout(() => setCopiedCli(false), 2000);
	};

	const downloadFile = () => {
		const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = activeFile.filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	// Filtered components for sidebar
	const filteredComponents = useMemo(() => {
		if (!catalogSearch.trim()) return ALL_COMPONENTS;
		return ALL_COMPONENTS.filter((c) =>
			c.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
			c.category.toLowerCase().includes(catalogSearch.toLowerCase())
		);
	}, [catalogSearch]);

	// Viewport widths
	const viewportWidth =
		viewportMode === 'mobile'
			? 'max-w-[375px]'
			: viewportMode === 'tablet'
			? 'max-w-[768px]'
			: viewportMode === 'laptop'
			? 'max-w-[1024px]'
			: 'w-full';

	// Render interactive canvas preview according to selected component
	const renderCanvasPreview = () => {
		if (selectedSlug === 'stacking-cards') {
			const topIncrement = Number(propValues.topIncrement ?? propValues.stackOffset ?? 24);
			const topStart = Number(propValues.topStart ?? 20);
			const minScale = Number(propValues.minScale ?? 0.92);
			const count = Number(propValues.cardCount ?? 4);

			return (
				<div
					ref={studioStackingRef}
					className="w-full max-w-xl mx-auto h-[500px] overflow-y-auto rounded-2xl border border-border bg-background/50 p-6 no-scrollbar relative shadow-inner"
				>
					<div className="text-[11px] font-mono text-muted-foreground text-center mb-6 flex items-center justify-center gap-2">
						<span className="kbd text-[10px]">SCROLL DOWN TO TEST DYNAMIC SCALE</span>
						<span>↓</span>
					</div>
					<StackingCards
						topStart={topStart}
						topIncrement={topIncrement}
						minScale={minScale}
						scaleThreshold={100}
						scrollContainerRef={studioStackingRef}
					>
						{Array.from({ length: count }).map((_, idx) => (
							<div
								key={idx}
								className="rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 shadow-xl"
							>
								<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
									<span className="kbd text-[10px] uppercase font-bold text-primary">
										STACK LAYER 0{idx + 1}
									</span>
									<span className="text-emerald-500 font-semibold text-[11px]">
										Dynamic Physics
									</span>
								</div>
								<h4 className="text-xl font-bold tracking-tight text-foreground">
									Autonomous Stacking Card
								</h4>
								<p className="text-xs text-muted-foreground mt-2 leading-relaxed">
									Card stacks with dynamic mathematical scale decay. Zero layout thrashing or parent scroll locking.
								</p>
								<div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
									<span>Offset: {topIncrement}px</span>
									<span>Layer: #{idx + 1}</span>
								</div>
							</div>
						))}
					</StackingCards>
					<div className="h-[280px] flex items-center justify-center text-xs font-mono text-muted-foreground">
						Terminal scroll reached — reverse scaling applied
					</div>
				</div>
			);
		}

		if (selectedSlug === 'horizontal-scroller') {
			const speed = Number(propValues.speed ?? propValues.scrollSpeed ?? 0.85);
			const gap = Number(propValues.itemGap ?? propValues.gap ?? 16);
			const itemWidth = Number(propValues.itemWidth ?? 280);

			return (
				<div
					ref={studioHorizontalRef}
					className="w-full h-[500px] overflow-y-auto rounded-2xl border border-border bg-background/50 relative no-scrollbar shadow-inner"
				>
					<div className="sticky top-4 z-20 text-[11px] font-mono text-muted-foreground text-center mb-2 flex items-center justify-center gap-2 pointer-events-none">
						<span className="kbd text-[10px] bg-card/90 shadow">VERTICAL SCROLL → HORIZONTAL RAIL</span>
						<span>↓</span>
					</div>
					<HorizontalScroller
						speed={speed}
						scrollContainerRef={studioHorizontalRef}
					>
						{Array.from({ length: 6 }).map((_, idx) => (
							<div
								key={idx}
								className="shrink-0 rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:border-primary/50"
								style={{ width: `${itemWidth}px` }}
							>
								<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
									<span className="kbd text-[10px] text-primary">RAIL ITEM #{idx + 1}</span>
									<span className="text-[10px]">Momentum Rail</span>
								</div>
								<h4 className="text-base font-bold text-foreground mt-1">
									Momentum Scroller
								</h4>
								<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
									Dynamic translation mapped to scroll progress via GPU-decoupled CSS variable.
								</p>
							</div>
						))}
					</HorizontalScroller>
				</div>
			);
		}

		if (selectedSlug === 'tilt-card') {
			return (
				<div className="flex items-center justify-center p-8">
					<TiltCard
						maxTilt={Number(propValues.maxTilt ?? 15)}
						perspective={Number(propValues.perspective ?? 1000)}
						glare={Boolean(propValues.glare ?? true)}
						className="w-full max-w-md bg-card p-8 border border-border shadow-2xl cursor-pointer"
					>
						<div className="flex items-center justify-between mb-4">
							<span className="kbd text-[10px] text-primary font-bold">3D PERSPECTIVE</span>
							<span className="text-xs font-mono text-muted-foreground">
								Max Tilt: {Number(propValues.maxTilt ?? 15)}°
							</span>
						</div>
						<h4 className="text-2xl font-black text-foreground tracking-tight">
							Tactile 3D Tilt Card
						</h4>
						<p className="text-xs text-muted-foreground mt-2 leading-relaxed">
							Perspective: {Number(propValues.perspective ?? 1000)}px | Glare: {Boolean(propValues.glare ?? true) ? 'Active' : 'Disabled'}
						</p>
						<div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
							<span>Physics: Spring Math</span>
							<span className="text-emerald-500 font-semibold">60 FPS Native</span>
						</div>
					</TiltCard>
				</div>
			);
		}

		if (selectedSlug === 'css-masonry') {
			return (
				<CssMasonry
					columns={Number(propValues.columns ?? 3)}
					gap={Number(propValues.gap ?? 16)}
					className="w-full p-6"
				>
					{[140, 200, 160, 240, 180, 260].map((h, idx) => (
						<div
							key={idx}
							className="rounded-2xl border border-border bg-card p-5 shadow-sm mb-4 break-inside-avoid transition-all hover:border-input"
							style={{ height: `${h}px` }}
						>
							<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
								<span className="kbd text-[10px] text-primary">TILE 0{idx + 1}</span>
								<span>{h}px</span>
							</div>
							<div className="text-sm font-bold text-foreground mt-2">Dynamic Masonry</div>
							<div className="text-xs text-muted-foreground mt-1">CSS-First Flow</div>
						</div>
					))}
				</CssMasonry>
			);
		}

		if (selectedSlug === 'auto-grid') {
			return (
				<AutoGrid
					minItemWidth={Number(propValues.minItemWidth ?? 200)}
					gap={Number(propValues.gap ?? 16)}
					className="w-full p-6"
				>
					{Array.from({ length: 6 }).map((_, idx) => (
						<div
							key={idx}
							className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-input"
						>
							<span className="kbd text-[10px] text-primary">GRID #{idx + 1}</span>
							<div className="text-sm font-bold text-foreground mt-2">Auto Responsive</div>
							<div className="text-xs text-muted-foreground mt-1">MinMax Width Flow</div>
						</div>
					))}
				</AutoGrid>
			);
		}

		if (selectedSlug === 'spotlight-card') {
			const radius = Number(propValues.radius ?? 350);
			const opacity = Number(propValues.opacity ?? 0.8);
			const color = String(propValues.color ?? 'rgba(99, 102, 241, 0.25)');
			const borderColor = String(propValues.borderColor ?? 'rgba(99, 102, 241, 0.5)');

			return (
				<div className="w-full max-w-md mx-auto p-4">
					<SpotlightCard
						radius={radius}
						color={color}
						opacity={opacity}
						borderColor={borderColor}
						className="p-8 shadow-2xl"
					>
						<div className="flex flex-col gap-3">
							<span className="kbd text-[10px] text-primary">STUDIO PREVIEW</span>
							<h4 className="text-xl font-bold tracking-tight text-foreground">Spotlight Card</h4>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Interactive pointer tracking with sub-pixel radial border mask. Radius: {radius}px.
							</p>
							<div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground">
								<span>Glow: {Math.round(opacity * 100)}%</span>
								<span className="text-emerald-500 font-semibold">120Hz rAF</span>
							</div>
						</div>
					</SpotlightCard>
				</div>
			);
		}

		if (selectedSlug === 'morphing-tabs') {
			return (
				<div className="w-full max-w-md mx-auto p-4">
					<MorphingTabs.Root defaultValue="dashboard">
						<MorphingTabs.List className="w-full justify-between">
							<MorphingTabs.Indicator />
							<MorphingTabs.Trigger value="dashboard" className="flex-1">Dashboard</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value="analytics" className="flex-1">Analytics</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value="settings" className="flex-1">Settings</MorphingTabs.Trigger>
						</MorphingTabs.List>
						<MorphingTabs.Content value="dashboard" className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm">
							<div className="font-bold text-foreground mb-1">Dashboard Metric Stream</div>
							<div className="text-muted-foreground text-xs">Real-time dynamic system state with zero-jank pill transitions.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value="analytics" className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm">
							<div className="font-bold text-foreground mb-1">Kinetic Analytics Engine</div>
							<div className="text-muted-foreground text-xs">Hardware accelerated measurements and analytical spring ODE.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value="settings" className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm">
							<div className="font-bold text-foreground mb-1">Global Configuration</div>
							<div className="text-muted-foreground text-xs">WAI-ARIA roving keyboard navigation enabled.</div>
						</MorphingTabs.Content>
					</MorphingTabs.Root>
				</div>
			);
		}

		if (selectedSlug === 'accordion') {
			const mode = (propValues.mode === 'multiple' ? 'multiple' : 'single') as 'single' | 'multiple';

			return (
				<div className="w-full max-w-md mx-auto p-4">
					<Accordion.Root mode={mode} defaultValue="s-1">
						<Accordion.Item value="s-1">
							<Accordion.Trigger>
								<span>Dynamic Height Interpolation</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>
								Using modern CSS Grid (0fr to 1fr) with zero layout reflows and zero-dependency morphing icon.
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="s-2">
							<Accordion.Trigger>
								<span>WAI-ARIA Accessibility Standards</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>
								Full roving arrow keys, aria-expanded, aria-controls, and single/multiple expansion mode.
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			);
		}

		if (selectedSlug === 'infinite-marquee') {
			const speed = Number(propValues.speed ?? 40);
			const pauseOnHover = Boolean(propValues.pauseOnHover ?? true);

			return (
				<div className="w-full max-w-2xl mx-auto py-8">
					<InfiniteMarquee speed={speed} pauseOnHover={pauseOnHover} gap="1.5rem">
						{[
							'120Hz ProMotion',
							'Zero External Animation Deps',
							'Pure rAF Translation',
							'Modulo Wrapping',
							'13 Ecosystems',
						].map((item, idx) => (
							<div
								key={idx}
								className="flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-6 py-4 text-xs font-semibold backdrop-blur-md shadow-xs"
							>
								<span className="h-2 w-2 rounded-full bg-primary" />
								<span className="text-foreground">{item}</span>
							</div>
						))}
					</InfiniteMarquee>
				</div>
			);
		}

		if (selectedSlug === 'bento-grid') {
			const cols = Number(propValues.cols ?? 3);
			return (
				<div className="w-full max-w-2xl mx-auto p-4">
					<BentoGrid cols={cols} gap="1rem">
						<BentoCard colSpan={2}>
							<BentoHeader>
								<span className="kbd text-[10px] text-primary">ANALYTICAL KINETICS</span>
								<h4 className="text-base font-bold text-foreground">Continuous Math Engine</h4>
							</BentoHeader>
							<BentoContent>
								Hardware-accelerated CSS custom properties driven directly by rAF loops.
							</BentoContent>
						</BentoCard>
						<BentoCard colSpan={1}>
							<BentoHeader>
								<span className="kbd text-[10px] text-emerald-500">BIG-OMEGA</span>
								<h4 className="text-base font-bold text-foreground">Ω(120Hz)</h4>
							</BentoHeader>
							<BentoContent>
								Guaranteed lower-bound execution.
							</BentoContent>
						</BentoCard>
					</BentoGrid>
				</div>
			);
		}

		if (selectedSlug === 'diamond-grid') {
			return (
				<div className="w-full max-w-xl mx-auto p-4">
					<DiamondGrid gap="0.75vw">
						{Array.from({ length: 16 }).map((_, idx) => (
							<div
								key={idx}
								className="aspect-square w-12 sm:w-16 rounded-2xl border border-border bg-card/80 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center shadow-md hover:border-primary transition-all duration-300 hover:scale-105"
							>
								<span className="text-[10px] font-mono font-bold text-primary">#{idx + 1}</span>
							</div>
						))}
					</DiamondGrid>
				</div>
			);
		}

		if (selectedSlug === 'scroll-timeline') {
			return (
				<div className="w-full max-w-md mx-auto h-[460px] overflow-y-auto rounded-2xl border border-border bg-background/50 p-6 no-scrollbar relative shadow-inner">
					<ScrollTimeline
						items={[
							{
								date: 'Phase 01',
								title: 'Mathematical Invariants',
								description: 'Analytical spring ODEs and zero-allocation ring buffers.',
							},
							{
								date: 'Phase 02',
								title: '13-Ecosystem Compilers',
								description: 'Deterministic AST compilation to React, Vue, Svelte, Angular, and more.',
							},
						]}
					/>
				</div>
			);
		}

		if (selectedSlug === 'sticky-parallax') {
			return (
				<div className="w-full max-w-md mx-auto h-[460px] overflow-y-auto rounded-2xl border border-border bg-background/50 relative no-scrollbar shadow-inner">
					<StickyParallaxScroll trackHeight="800px">
						<div className="relative w-full h-full flex items-center justify-center">
							<ParallaxLayer speed={-0.4}>
								<div className="text-4xl font-extrabold text-foreground/20 select-none">
									BACKGROUND
								</div>
							</ParallaxLayer>
							<ParallaxLayer speed={0.8}>
								<div className="rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl backdrop-blur-md text-center">
									<span className="kbd text-[10px] text-primary">PARALLAX</span>
									<h4 className="text-lg font-bold text-foreground mt-1">Differential Layers</h4>
								</div>
							</ParallaxLayer>
						</div>
					</StickyParallaxScroll>
				</div>
			);
		}

		if (selectedSlug === 'border-beam') {
			const size = Number(propValues.size ?? 200);
			const duration = Number(propValues.duration ?? 8);
			const borderWidth = Number(propValues.borderWidth ?? 2);
			return (
				<div className="relative flex h-64 w-full max-w-sm mx-auto flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl">
					<span className="kbd text-[10px] text-primary">PERIMETER TRACE</span>
					<h4 className="text-xl font-bold text-foreground mt-2">Border Beam</h4>
					<p className="text-xs text-muted-foreground text-center mt-1">
						Hardware-accelerated conic perimeter trace with zero GC pauses.
					</p>
					<BorderBeam size={size} duration={duration} borderWidth={borderWidth} />
				</div>
			);
		}

		if (selectedSlug === 'animated-sphere') {
			const color = String(propValues.color ?? '#6366f1');
			const speed = Number(propValues.speed ?? 1.0);
			const radiusScale = Number(propValues.radiusScale ?? 0.475);
			return (
				<div className="flex flex-col items-center justify-center p-4">
					<AnimatedSphere
						color={color}
						speed={speed}
						radiusScale={radiusScale}
						className="w-64 h-64 rounded-2xl border border-border bg-black/40 backdrop-blur-md shadow-2xl"
					/>
				</div>
			);
		}

		if (selectedSlug === 'floating-dock') {
			const baseSize = Number(propValues.baseSize ?? 44);
			const maxMagnification = Number(propValues.maxMagnification ?? 0.6);
			const influenceRadius = Number(propValues.influenceRadius ?? 70);
			return (
				<div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12">
					<p className="text-xs text-muted-foreground mb-6">Hover over icons to test Gaussian proximity curve</p>
					<FloatingDock
						baseSize={baseSize}
						maxMagnification={maxMagnification}
						influenceRadius={influenceRadius}
						items={[
							{ title: 'Terminal', icon: <Terminal className="h-5 w-5" /> },
							{ title: 'Kinetics', icon: <Sliders className="h-5 w-5" /> },
							{ title: 'Hardware', icon: <Cpu className="h-5 w-5" /> },
							{ title: 'Shaders', icon: <Sparkles className="h-5 w-5" /> },
							{ title: 'Security', icon: <Layers className="h-5 w-5" /> },
						]}
					/>
				</div>
			);
		}

		if (selectedSlug === 'interactive-grid') {
			const width = Number(propValues.width ?? 32);
			const height = Number(propValues.height ?? 32);
			return (
				<div className="relative flex h-[380px] w-full max-w-xl mx-auto flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-inner">
					<InteractiveGridPattern
						width={width}
						height={height}
						squares={[24, 16]}
						className="opacity-70 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
					/>
					<div className="z-10 flex flex-col items-center text-center">
						<span className="kbd text-[10px] text-primary">VECTOR KINETICS</span>
						<h4 className="text-xl font-bold text-foreground mt-1">Interactive Grid</h4>
						<p className="text-xs text-muted-foreground max-w-xs mt-1">
							Hover over grid squares to trigger hardware-accelerated kinetic active states.
						</p>
					</div>
				</div>
			);
		}

		if (selectedSlug === 'number-ticker') {
			const value = Number(propValues.value ?? 1000);
			const decimalPlaces = Number(propValues.decimalPlaces ?? 0);
			return (
				<div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card shadow-lg text-center max-w-sm mx-auto">
					<span className="kbd text-[10px] text-primary mb-2">ANALYTICAL EASING (rAF)</span>
					<div className="text-6xl font-black tracking-tight text-foreground font-mono">
						$<NumberTicker value={value} decimalPlaces={decimalPlaces} />
					</div>
					<p className="text-xs text-muted-foreground mt-3">
						Continuous ease-out exponential ticker with zero Framer Motion dependencies.
					</p>
				</div>
			);
		}

		if (selectedSlug === 'magnetic-button') {
			const strength = Number(propValues.strength ?? 0.35);
			const radius = Number(propValues.radius ?? 120);
			const springDamping = Number(propValues.springDamping ?? 18);
			return (
				<div className="flex flex-col items-center justify-center p-12">
					<p className="text-xs text-muted-foreground mb-6">Move cursor near button to feel inverted magnetic pull field</p>
					<MagneticButton
						strength={strength}
						radius={radius}
						springDamping={springDamping}
						className="rounded-2xl border border-primary/50 bg-primary/10 px-8 py-4 font-bold text-foreground backdrop-blur-md shadow-xl hover:bg-primary/20 transition-colors"
					>
						<span className="flex items-center gap-2">
							<Sparkles className="h-4 w-4 text-primary" />
							<span>Magnetic Attraction</span>
						</span>
					</MagneticButton>
				</div>
			);
		}

		if (selectedSlug === 'card-swipe-stack') {
			const thresholdDistance = Number(propValues.thresholdDistance ?? 120);
			const maxRotation = Number(propValues.maxRotation ?? 20);
			return (
				<div className="w-full max-w-sm mx-auto py-8 flex flex-col items-center">
					<p className="text-xs text-muted-foreground mb-4">Drag card left or right to dismiss with momentum fling</p>
					<CardSwipeStack
						thresholdDistance={thresholdDistance}
						maxRotation={maxRotation}
						items={[
							{ id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
							{ id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
							{ id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
						]}
						renderCard={(item) => (
							<div className="rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
								<span className="kbd text-[10px] text-primary">{item.tag}</span>
								<h4 className="text-lg font-bold text-foreground mt-2">{item.title}</h4>
								<p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
								<div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
									<span>← SWIPE LEFT</span>
									<span>SWIPE RIGHT →</span>
								</div>
							</div>
						)}
					/>
				</div>
			);
		}

		if (selectedSlug === 'comparison-slider') {
			const defaultPosition = Number(propValues.defaultPosition ?? 0.5);
			return (
				<div className="w-full max-w-md mx-auto py-4">
					<ComparisonSlider
						aspectRatio="16/10"
						defaultPosition={defaultPosition}
						before={
							<div className="w-full h-full bg-linear-to-br from-indigo-950 via-purple-950 to-slate-900 p-6 flex flex-col justify-between text-white">
								<span className="kbd text-[10px] bg-white/20 text-white self-start">ORIGINAL MOCKUP</span>
								<div>
									<h4 className="text-xl font-bold">Static Canvas</h4>
									<p className="text-xs opacity-70">Unaccelerated design view</p>
								</div>
							</div>
						}
						after={
							<div className="w-full h-full bg-linear-to-br from-emerald-950 via-teal-950 to-slate-900 p-6 flex flex-col justify-between text-white">
								<span className="kbd text-[10px] bg-emerald-500/30 text-emerald-300 self-start">EXHUMA KINETIC ENGINE</span>
								<div>
									<h4 className="text-xl font-bold">120Hz ProMotion</h4>
									<p className="text-xs opacity-70">Analytical physics active</p>
								</div>
							</div>
						}
					/>
				</div>
			);
		}

		if (selectedSlug === 'expandable-card') {
			return (
				<div className="w-full max-w-sm mx-auto py-4">
					<ExpandableCard
						cardContent={
							<div className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:border-primary/50">
								<span className="kbd text-[10px] text-primary">CLICK TO EXPAND</span>
								<h4 className="text-lg font-bold text-foreground mt-2">FLIP Morphing Architecture</h4>
								<p className="text-xs text-muted-foreground mt-1">Mathematical geometry snapshot with zero Framer Motion.</p>
							</div>
						}
						expandedContent={
							<div className="space-y-4">
								<span className="kbd text-[10px] text-primary">MODAL DIALOG (FLIP INVERTED)</span>
								<h3 className="text-2xl font-black text-foreground">Hardware-Accelerated Dialog</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									The card morphs smoothly from its trigger bounding rect into a centered dialog snapshot using analytical FLIP transformation matrices.
								</p>
								<div className="rounded-xl border border-border bg-background p-4 text-xs font-mono text-muted-foreground">
									Press ESC or click backdrop to close
								</div>
							</div>
						}
					/>
				</div>
			);
		}

		if (selectedSlug === 'cursor-tooltip') {
			const springDamping = Number(propValues.springDamping ?? 22);
			return (
				<div className="flex flex-col items-center justify-center p-12">
					<CursorTooltip
						springDamping={springDamping}
						content="Exhuma Exponential Cursor Smoothing"
						className="rounded-2xl border border-border bg-card/80 p-8 shadow-xl text-center cursor-pointer hover:border-primary transition-colors"
					>
						<span className="kbd text-[10px] text-primary mb-2 inline-block">HOVER OVER CARD</span>
						<h4 className="text-xl font-bold text-foreground">Interactive Viewport Target</h4>
						<p className="text-xs text-muted-foreground mt-1">
							Hover cursor anywhere over this card to activate the magnetic trailing tooltip.
						</p>
					</CursorTooltip>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="w-full space-y-6">
			{/* Xcode/Figma Top Toolbar */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors">
				{/* Breadcrumb & Component Info */}
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
						<Sliders className="h-4 w-4" />
					</div>
					<div>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
							<span>Studio Workbench</span>
							<ChevronRight className="h-3 w-3" />
							<span className="text-foreground font-bold">{component.name}</span>
						</div>
						<div className="flex items-center gap-2 mt-0.5">
							<Badge variant="ecosystem" className="text-[10px] uppercase font-bold text-primary">
								{component.category}
							</Badge>
							<span className="text-xs text-muted-foreground">· 13 Native Idioms</span>
						</div>
					</div>
				</div>

				{/* Presets Selector Bar */}
				{Object.keys(presets).length > 0 && (
					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground font-mono font-medium">Presets:</span>
						<div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
							{Object.keys(presets).map((pName) => (
								<button
									key={pName}
									type="button"
									onClick={() => applyPreset(pName)}
									className={cn(
										'px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer',
										activePreset === pName
											? 'bg-background text-foreground font-bold shadow-xs'
											: 'text-muted-foreground hover:text-foreground'
									)}
								>
									{pName}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Right: Quick CLI & Reset */}
				<div className="flex items-center gap-2.5">
					<div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-foreground">
						<Terminal className="h-3.5 w-3.5 text-primary shrink-0" />
						<span className="text-muted-foreground text-[11px] truncate max-w-[180px] sm:max-w-none">
							{cliCommand}
						</span>
						<button
							type="button"
							onClick={copyCli}
							className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
							title="Copy CLI command"
						>
							{copiedCli ? (
								<Check className="h-3.5 w-3.5 text-emerald-500" />
							) : (
								<Copy className="h-3.5 w-3.5" />
							)}
						</button>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={resetProps}
						className="gap-1.5 text-xs cursor-pointer"
						title="Reset all properties"
					>
						<RefreshCw className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Reset</span>
					</Button>
				</div>
			</div>

			{/* Three-Panel Xcode/Figma IDE Stage */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* 1. Left Component Tree (3 cols) */}
				<div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">
					<div className="flex items-center justify-between border-b border-border pb-3">
						<div className="flex items-center gap-2">
							<Layers className="h-4 w-4 text-primary" />
							<span className="font-bold text-xs uppercase tracking-wider text-foreground font-mono">
								Components
							</span>
						</div>
						<span className="kbd text-[9px]">{ALL_COMPONENTS.length} CANONICAL</span>
					</div>

					{/* Search input */}
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
						<input
							type="text"
							value={catalogSearch}
							onChange={(e) => setCatalogSearch(e.target.value)}
							placeholder="Filter components..."
							className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
						/>
					</div>

					{/* Component Tree Items */}
					<div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
						{filteredComponents.map((comp) => {
							const isSelected = comp.slug === selectedSlug;
							return (
								<button
									key={comp.slug}
									type="button"
									onClick={() => handleSelectComponent(comp.slug)}
									className={cn(
										'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all cursor-pointer',
										isSelected
											? 'bg-primary text-primary-foreground font-bold shadow-xs'
											: 'text-muted-foreground hover:bg-accent hover:text-foreground'
									)}
								>
									<div>
										<div className="truncate font-semibold">{comp.name}</div>
										<div
											className={cn(
												'text-[10px] capitalize font-mono',
												isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
											)}
										>
											{comp.category}
										</div>
									</div>
									<ChevronRight
										className={cn(
											'h-3.5 w-3.5 shrink-0 transition-transform',
											isSelected ? 'opacity-100 translate-x-0.5' : 'opacity-40'
										)}
									/>
								</button>
							);
						})}
					</div>
				</div>

				{/* 2. Center Stage Viewport (6 cols) */}
				<div className="lg:col-span-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
					{/* Responsive Device Toolbar */}
					<div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2 text-xs">
						{/* Device Frames */}
						<div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50">
							<button
								type="button"
								onClick={() => setViewportMode('desktop')}
								className={cn(
									'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
									viewportMode === 'desktop'
										? 'bg-background text-foreground shadow-xs font-bold'
										: 'text-muted-foreground hover:text-foreground'
								)}
								title="Desktop (100%)"
							>
								<Monitor className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Desktop</span>
							</button>
							<button
								type="button"
								onClick={() => setViewportMode('laptop')}
								className={cn(
									'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
									viewportMode === 'laptop'
										? 'bg-background text-foreground shadow-xs font-bold'
										: 'text-muted-foreground hover:text-foreground'
								)}
								title="Laptop (1024px)"
							>
								<Laptop className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Laptop</span>
							</button>
							<button
								type="button"
								onClick={() => setViewportMode('tablet')}
								className={cn(
									'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
									viewportMode === 'tablet'
										? 'bg-background text-foreground shadow-xs font-bold'
										: 'text-muted-foreground hover:text-foreground'
								)}
								title="Tablet (768px)"
							>
								<Tablet className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Tablet</span>
							</button>
							<button
								type="button"
								onClick={() => setViewportMode('mobile')}
								className={cn(
									'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer',
									viewportMode === 'mobile'
										? 'bg-background text-foreground shadow-xs font-bold'
										: 'text-muted-foreground hover:text-foreground'
								)}
								title="Mobile (375px)"
							>
								<Smartphone className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Mobile</span>
							</button>
						</div>

						{/* Zoom & Canvas Texture */}
						<div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
							<span className="kbd text-[9px]">
								{viewportMode === 'mobile'
									? '375 × 667 px'
									: viewportMode === 'tablet'
									? '768 × 1024 px'
									: viewportMode === 'laptop'
									? '1024 × 768 px'
									: 'Fluid 100%'}
							</span>

							<div className="hidden sm:flex items-center gap-1">
								<button
									type="button"
									onClick={() => setZoomScale((z) => Math.max(50, z - 25))}
									className="p-1 rounded hover:bg-accent hover:text-foreground cursor-pointer"
									title="Zoom out"
								>
									<ZoomOut className="h-3.5 w-3.5" />
								</button>
								<span className="w-8 text-center">{zoomScale}%</span>
								<button
									type="button"
									onClick={() => setZoomScale((z) => Math.min(150, z + 25))}
									className="p-1 rounded hover:bg-accent hover:text-foreground cursor-pointer"
									title="Zoom in"
								>
									<ZoomIn className="h-3.5 w-3.5" />
								</button>
							</div>
						</div>
					</div>

					{/* Dot-Grid Canvas Viewport */}
					<div
						className={cn(
							'p-6 sm:p-10 min-h-[480px] flex items-center justify-center overflow-auto transition-colors',
							canvasGrid === 'dots' ? 'bg-dot-grid' : canvasGrid === 'dense' ? 'bg-dot-grid-dense' : 'bg-background'
						)}
					>
						<div
							className={cn('w-full transition-all duration-300', viewportWidth)}
							style={{
								transform: `scale(${zoomScale / 100})`,
								transformOrigin: 'center',
							}}
						>
							{renderCanvasPreview()}
						</div>
					</div>
				</div>

				{/* 3. Right Property Inspector (3 cols) */}
				<div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">
					<div className="flex items-center justify-between border-b border-border pb-3">
						<div className="flex items-center gap-2">
							<Sliders className="h-4 w-4 text-primary" />
							<span className="font-bold text-xs uppercase tracking-wider text-foreground font-mono">
								Property Inspector
							</span>
						</div>
						<span className="kbd text-[9px]">{component.props.length} PROPS</span>
					</div>

					{/* Prop Controls List */}
					<div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
						{component.props.map((propDef) => {
							const val = propValues[propDef.name] ?? propDef.defaultValue;

							return (
								<div key={propDef.name} className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
									<div className="flex items-center justify-between text-xs">
										<label
											htmlFor={`prop-${propDef.name}`}
											className="font-mono text-foreground font-semibold text-[11px]"
										>
											{propDef.name}
										</label>
										<span className="kbd text-[10px]">
											{String(val)}
										</span>
									</div>

									{propDef.description && (
										<p className="text-[10px] text-muted-foreground leading-tight">
											{propDef.description}
										</p>
									)}

									{/* Render Control based on type */}
									{propDef.type === 'boolean' ? (
										<div className="flex items-center gap-2 pt-1">
											<input
												type="checkbox"
												id={`prop-${propDef.name}`}
												checked={Boolean(val)}
												onChange={(e) =>
													handlePropChange(propDef.name, e.target.checked)
												}
												className="rounded border-border accent-primary cursor-pointer h-4 w-4"
											/>
											<label
												htmlFor={`prop-${propDef.name}`}
												className="text-xs text-muted-foreground cursor-pointer"
											>
												{val ? 'Enabled' : 'Disabled'}
											</label>
										</div>
									) : propDef.type === 'select' && propDef.options ? (
										<select
											id={`prop-${propDef.name}`}
											value={String(val)}
											onChange={(e) =>
												handlePropChange(propDef.name, e.target.value)
											}
											className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
										>
											{propDef.options.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
									) : (
										/* Slider + Numerical Input Sync */
										<div className="flex items-center gap-2 pt-1">
											<input
												type="range"
												id={`prop-${propDef.name}`}
												min={propDef.min ?? 0}
												max={propDef.max ?? 100}
												step={propDef.step ?? 1}
												value={Number(val)}
												onChange={(e) =>
													handlePropChange(propDef.name, Number(e.target.value))
												}
												className="flex-1 accent-primary h-1.5 cursor-pointer"
											/>
											<input
												type="number"
												min={propDef.min ?? 0}
												max={propDef.max ?? 100}
												step={propDef.step ?? 1}
												value={Number(val)}
												onChange={(e) =>
													handlePropChange(propDef.name, Number(e.target.value))
												}
												className="w-14 rounded border border-input bg-background px-1.5 py-0.5 font-mono text-[11px] text-foreground text-right"
											/>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Bottom Synchronizer: 13 Ecosystems Code Viewer */}
			<div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
				{/* Top bar */}
				<div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
					<div className="flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="font-bold text-xs text-foreground font-mono">
							Universal Code Synchronizer
						</span>
						<Badge variant="ecosystem" className="text-[10px]">
							{selectedFlavor}
						</Badge>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={downloadFile}
							className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
							title="Download component source"
						>
							<Download className="h-3.5 w-3.5" />
							<span>Download Source</span>
						</button>
					</div>
				</div>

				{/* 13 Ecosystem Selector Pills */}
				<div className="border-b border-border bg-background/50 px-4 py-2.5 overflow-x-auto flex items-center gap-1.5">
					{FLAVORS.map((flavor) => {
						const isSelected = selectedFlavor === flavor;
						return (
							<button
								key={flavor}
								type="button"
								onClick={() => {
									setSelectedFlavor(flavor);
									setSelectedFileIdx(0);
								}}
								className={cn(
									'whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-mono transition-all cursor-pointer',
									isSelected
										? 'border-primary bg-primary text-primary-foreground font-bold shadow-xs'
										: 'border-border bg-card text-muted-foreground hover:border-input hover:text-foreground'
								)}
							>
								{ECOSYSTEM_LABELS[flavor]}
							</button>
						);
					})}
				</div>

				{/* Multi-File Tabs (for WordPress Gutenberg, etc.) */}
				{generatedFiles.length > 1 && (
					<div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-2">
						<span className="text-[10px] text-muted-foreground font-mono mr-2">
							Generated Files ({generatedFiles.length}):
						</span>
						{generatedFiles.map((file, idx) => (
							<button
								key={file.filename}
								type="button"
								onClick={() => setSelectedFileIdx(idx)}
								className={cn(
									'rounded-md px-3 py-1 text-xs font-mono transition-colors cursor-pointer',
									selectedFileIdx === idx
										? 'bg-accent text-accent-foreground font-bold shadow-xs'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{file.filename}
							</button>
						))}
					</div>
				)}

				{/* CodeBlock Display */}
				<div className="p-4 bg-muted/10">
					<CodeBlock
						code={activeFile.code}
						filename={activeFile.filename}
						language={
							activeFile.filename.endsWith('.dart')
								? 'dart'
								: activeFile.filename.endsWith('.php')
								? 'php'
								: activeFile.filename.endsWith('.vue')
								? 'vue'
								: activeFile.filename.endsWith('.svelte')
								? 'svelte'
								: activeFile.filename.endsWith('.json')
								? 'json'
								: 'tsx'
						}
					/>
				</div>
			</div>
		</div>
	);
}

export default StudioWorkbench;
