'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ALL_COMPONENTS, COMPONENT_REGISTRY, EcosystemFlavor, ECOSYSTEM_LABELS, CATEGORIES, UniversalComponent, PropDescriptor, ComponentFilePayload } from '@/registry';
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
import { StackingCards, HorizontalScroller, TiltCard, SpotlightCard, BorderBeam, CardSwipeStack, ComparisonSlider, ExpandableCard } from '@exhuma/cards';
import { CssMasonry, AutoGrid, InfiniteMarquee, BentoGrid, BentoCard, BentoHeader, BentoContent, DiamondGrid, ScrollTimeline, StickyParallaxScroll, ParallaxLayer, InteractiveGridPattern } from '@exhuma/layouts';
import { MorphingTabs, Accordion, AnimatedSphere, FloatingDock, NumberTicker, MagneticButton, CursorTooltip } from '@exhuma/core';

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

export function StudioWorkbench({ initialSlug = 'stacking-cards' }: { initialSlug?: string }) {
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
		return ALL_COMPONENTS.filter((c) => c.name.toLowerCase().includes(catalogSearch.toLowerCase()) || c.category.toLowerCase().includes(catalogSearch.toLowerCase()));
	}, [catalogSearch]);

	// Viewport widths (23.4375rem/48rem/64rem = 375px/768px/1024px device breakpoints)
	const viewportWidth = viewportMode === 'mobile' ? 'max-w-[23.4375rem]' : viewportMode === 'tablet' ? 'max-w-[48rem]' : viewportMode === 'laptop' ? 'max-w-[64rem]' : 'w-full';

	// Render interactive canvas preview according to selected component
	const renderCanvasPreview = () => {
		if (selectedSlug === 'stacking-cards') {
			const topIncrement = Number(propValues.topIncrement ?? propValues.stackOffset ?? 24);
			const topStart = Number(propValues.topStart ?? 20);
			const minScale = Number(propValues.minScale ?? 0.92);
			const count = Number(propValues.cardCount ?? 4);

			return (
				<div ref={studioStackingRef} className='border-border bg-background/50 no-scrollbar relative mx-auto h-[31.25rem] w-full max-w-xl overflow-y-auto rounded-2xl border p-6 shadow-inner'>
					<div className='text-muted-foreground text-2xs mb-6 flex items-center justify-center gap-2 text-center font-mono'>
						<span className='kbd text-3xs'>SCROLL DOWN TO TEST DYNAMIC SCALE</span>
						<span>↓</span>
					</div>
					<StackingCards topStart={topStart} topIncrement={topIncrement} minScale={minScale} scaleThreshold={100} scrollContainerRef={studioStackingRef}>
						{Array.from({ length: count }).map((_, idx) => (
							<div key={idx} className='border-border bg-card/95 rounded-2xl border p-6 shadow-xl backdrop-blur-md'>
								<div className='text-muted-foreground mb-3 flex items-center justify-between font-mono text-xs'>
									<span className='kbd text-primary text-3xs font-bold uppercase'>STACK LAYER 0{idx + 1}</span>
									<span className='text-2xs font-semibold text-emerald-500'>Dynamic Physics</span>
								</div>
								<h4 className='text-foreground text-xl font-bold tracking-tight'>Autonomous Stacking Card</h4>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Card stacks with dynamic mathematical scale decay. Zero layout thrashing or parent scroll locking.</p>
								<div className='border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
									<span>Offset: {topIncrement}px</span>
									<span>Layer: #{idx + 1}</span>
								</div>
							</div>
						))}
					</StackingCards>
					<div className='text-muted-foreground flex h-[17.5rem] items-center justify-center font-mono text-xs'>Terminal scroll reached — reverse scaling applied</div>
				</div>
			);
		}

		if (selectedSlug === 'horizontal-scroller') {
			const speed = Number(propValues.speed ?? propValues.scrollSpeed ?? 0.85);
			const gap = Number(propValues.itemGap ?? propValues.gap ?? 16);
			const itemWidth = Number(propValues.itemWidth ?? 280);

			return (
				<div ref={studioHorizontalRef} className='border-border bg-background/50 no-scrollbar relative h-[31.25rem] w-full overflow-y-auto rounded-2xl border shadow-inner'>
					<div className='text-muted-foreground text-2xs pointer-events-none sticky top-4 z-20 mb-2 flex items-center justify-center gap-2 text-center font-mono'>
						<span className='kbd bg-card/90 text-3xs shadow-sm'>VERTICAL SCROLL → HORIZONTAL RAIL</span>
						<span>↓</span>
					</div>
					<HorizontalScroller speed={speed} scrollContainerRef={studioHorizontalRef}>
						{Array.from({ length: 6 }).map((_, idx) => (
							<div key={idx} className='border-border bg-card hover:border-primary/50 shrink-0 rounded-2xl border p-6 shadow-lg transition-all' style={{ width: `${itemWidth}px` }}>
								<div className='text-muted-foreground mb-2 flex items-center justify-between font-mono text-xs'>
									<span className='kbd text-primary text-3xs'>RAIL ITEM #{idx + 1}</span>
									<span className='text-3xs'>Momentum Rail</span>
								</div>
								<h4 className='text-foreground mt-1 text-base font-bold'>Momentum Scroller</h4>
								<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>Dynamic translation mapped to scroll progress via GPU-decoupled CSS variable.</p>
							</div>
						))}
					</HorizontalScroller>
				</div>
			);
		}

		if (selectedSlug === 'tilt-card') {
			return (
				<div className='flex items-center justify-center p-8'>
					<TiltCard
						maxTilt={Number(propValues.maxTilt ?? 15)}
						perspective={Number(propValues.perspective ?? 1000)}
						glare={Boolean(propValues.glare ?? true)}
						className='bg-card border-border w-full max-w-md cursor-pointer border p-8 shadow-2xl'
					>
						<div className='mb-4 flex items-center justify-between'>
							<span className='kbd text-primary text-3xs font-bold'>3D PERSPECTIVE</span>
							<span className='text-muted-foreground font-mono text-xs'>Max Tilt: {Number(propValues.maxTilt ?? 15)}°</span>
						</div>
						<h4 className='text-foreground text-2xl font-black tracking-tight'>Tactile 3D Tilt Card</h4>
						<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
							Perspective: {Number(propValues.perspective ?? 1000)}px | Glare: {Boolean(propValues.glare ?? true) ? 'Active' : 'Disabled'}
						</p>
						<div className='border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
							<span>Physics: Spring Math</span>
							<span className='font-semibold text-emerald-500'>60 FPS Native</span>
						</div>
					</TiltCard>
				</div>
			);
		}

		if (selectedSlug === 'css-masonry') {
			return (
				<CssMasonry columns={Number(propValues.columns ?? 3)} gap={Number(propValues.gap ?? 16)} className='w-full p-6'>
					{[140, 200, 160, 240, 180, 260].map((h, idx) => (
						<div key={idx} className='border-border bg-card hover:border-input mb-4 break-inside-avoid rounded-2xl border p-5 shadow-sm transition-all' style={{ height: `${h}px` }}>
							<div className='text-muted-foreground mb-1 flex items-center justify-between font-mono text-xs'>
								<span className='kbd text-primary text-3xs'>TILE 0{idx + 1}</span>
								<span>{h}px</span>
							</div>
							<div className='text-foreground mt-2 text-sm font-bold'>Dynamic Masonry</div>
							<div className='text-muted-foreground mt-1 text-xs'>CSS-First Flow</div>
						</div>
					))}
				</CssMasonry>
			);
		}

		if (selectedSlug === 'auto-grid') {
			return (
				<AutoGrid minItemWidth={Number(propValues.minItemWidth ?? 200)} gap={Number(propValues.gap ?? 16)} className='w-full p-6'>
					{Array.from({ length: 6 }).map((_, idx) => (
						<div key={idx} className='border-border bg-card hover:border-input rounded-2xl border p-5 shadow-sm transition-all'>
							<span className='kbd text-primary text-3xs'>GRID #{idx + 1}</span>
							<div className='text-foreground mt-2 text-sm font-bold'>Auto Responsive</div>
							<div className='text-muted-foreground mt-1 text-xs'>MinMax Width Flow</div>
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
				<div className='mx-auto w-full max-w-md p-4'>
					<SpotlightCard radius={radius} color={color} opacity={opacity} borderColor={borderColor} className='p-8 shadow-2xl'>
						<div className='flex flex-col gap-3'>
							<span className='kbd text-primary text-3xs'>STUDIO PREVIEW</span>
							<h4 className='text-foreground text-xl font-bold tracking-tight'>Spotlight Card</h4>
							<p className='text-muted-foreground text-xs leading-relaxed'>Interactive pointer tracking with sub-pixel radial border mask. Radius: {radius}px.</p>
							<div className='border-border/50 text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 font-mono text-xs'>
								<span>Glow: {Math.round(opacity * 100)}%</span>
								<span className='font-semibold text-emerald-500'>120Hz rAF</span>
							</div>
						</div>
					</SpotlightCard>
				</div>
			);
		}

		if (selectedSlug === 'morphing-tabs') {
			return (
				<div className='mx-auto w-full max-w-md p-4'>
					<MorphingTabs.Root defaultValue='dashboard'>
						<MorphingTabs.List className='w-full justify-between'>
							<MorphingTabs.Indicator />
							<MorphingTabs.Trigger value='dashboard' className='flex-1'>
								Dashboard
							</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value='analytics' className='flex-1'>
								Analytics
							</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value='settings' className='flex-1'>
								Settings
							</MorphingTabs.Trigger>
						</MorphingTabs.List>
						<MorphingTabs.Content value='dashboard' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Dashboard Metric Stream</div>
							<div className='text-muted-foreground text-xs'>Real-time dynamic system state with zero-jank pill transitions.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value='analytics' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Kinetic Analytics Engine</div>
							<div className='text-muted-foreground text-xs'>Hardware accelerated measurements and analytical spring ODE.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value='settings' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Global Configuration</div>
							<div className='text-muted-foreground text-xs'>WAI-ARIA roving keyboard navigation enabled.</div>
						</MorphingTabs.Content>
					</MorphingTabs.Root>
				</div>
			);
		}

		if (selectedSlug === 'accordion') {
			const mode = (propValues.mode === 'multiple' ? 'multiple' : 'single') as 'single' | 'multiple';

			return (
				<div className='mx-auto w-full max-w-md p-4'>
					<Accordion.Root mode={mode} defaultValue='s-1'>
						<Accordion.Item value='s-1'>
							<Accordion.Trigger>
								<span>Dynamic Height Interpolation</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>Using modern CSS Grid (0fr to 1fr) with zero layout reflows and zero-dependency morphing icon.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value='s-2'>
							<Accordion.Trigger>
								<span>WAI-ARIA Accessibility Standards</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>Full roving arrow keys, aria-expanded, aria-controls, and single/multiple expansion mode.</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			);
		}

		if (selectedSlug === 'infinite-marquee') {
			const speed = Number(propValues.speed ?? 40);
			const pauseOnHover = Boolean(propValues.pauseOnHover ?? true);

			return (
				<div className='mx-auto w-full max-w-2xl py-8'>
					<InfiniteMarquee speed={speed} pauseOnHover={pauseOnHover} gap='1.5rem'>
						{['120Hz ProMotion', 'Zero External Animation Deps', 'Pure rAF Translation', 'Modulo Wrapping', '13 Ecosystems'].map((item, idx) => (
							<div key={idx} className='border-border bg-card/80 flex items-center gap-2 rounded-2xl border px-6 py-4 text-xs font-semibold shadow-xs backdrop-blur-md'>
								<span className='bg-primary h-2 w-2 rounded-full' />
								<span className='text-foreground'>{item}</span>
							</div>
						))}
					</InfiniteMarquee>
				</div>
			);
		}

		if (selectedSlug === 'bento-grid') {
			const cols = Number(propValues.cols ?? 3);
			return (
				<div className='mx-auto w-full max-w-2xl p-4'>
					<BentoGrid cols={cols} gap='1rem'>
						<BentoCard colSpan={2}>
							<BentoHeader>
								<span className='kbd text-primary text-3xs'>ANALYTICAL KINETICS</span>
								<h4 className='text-foreground text-base font-bold'>Continuous Math Engine</h4>
							</BentoHeader>
							<BentoContent>Hardware-accelerated CSS custom properties driven directly by rAF loops.</BentoContent>
						</BentoCard>
						<BentoCard colSpan={1}>
							<BentoHeader>
								<span className='kbd text-3xs text-emerald-500'>BIG-OMEGA</span>
								<h4 className='text-foreground text-base font-bold'>Ω(120Hz)</h4>
							</BentoHeader>
							<BentoContent>Guaranteed lower-bound execution.</BentoContent>
						</BentoCard>
					</BentoGrid>
				</div>
			);
		}

		if (selectedSlug === 'diamond-grid') {
			return (
				<div className='mx-auto w-full max-w-xl p-4'>
					<DiamondGrid gap='0.75vw'>
						{Array.from({ length: 16 }).map((_, idx) => (
							<div
								key={idx}
								className='border-border bg-card/80 hover:border-primary flex aspect-square w-12 flex-col items-center justify-center rounded-2xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 sm:w-16'
							>
								<span className='text-primary text-3xs font-mono font-bold'>#{idx + 1}</span>
							</div>
						))}
					</DiamondGrid>
				</div>
			);
		}

		if (selectedSlug === 'scroll-timeline') {
			return (
				<div className='border-border bg-background/50 no-scrollbar relative mx-auto h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border p-6 shadow-inner'>
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
				<div className='border-border bg-background/50 no-scrollbar relative mx-auto h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border shadow-inner'>
					<StickyParallaxScroll trackHeight='800px'>
						<div className='relative flex size-full items-center justify-center'>
							<ParallaxLayer speed={-0.4}>
								<div className='text-foreground/20 text-4xl font-extrabold select-none'>BACKGROUND</div>
							</ParallaxLayer>
							<ParallaxLayer speed={0.8}>
								<div className='border-primary/40 bg-card rounded-2xl border p-6 text-center shadow-2xl backdrop-blur-md'>
									<span className='kbd text-primary text-3xs'>PARALLAX</span>
									<h4 className='text-foreground mt-1 text-lg font-bold'>Differential Layers</h4>
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
				<div className='border-border bg-card relative mx-auto flex h-64 w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 shadow-xl'>
					<span className='kbd text-primary text-3xs'>PERIMETER TRACE</span>
					<h4 className='text-foreground mt-2 text-xl font-bold'>Border Beam</h4>
					<p className='text-muted-foreground mt-1 text-center text-xs'>Hardware-accelerated conic perimeter trace with zero GC pauses.</p>
					<BorderBeam size={size} duration={duration} borderWidth={borderWidth} />
				</div>
			);
		}

		if (selectedSlug === 'animated-sphere') {
			const color = String(propValues.color ?? '#6366f1');
			const speed = Number(propValues.speed ?? 1.0);
			const radiusScale = Number(propValues.radiusScale ?? 0.475);
			return (
				<div className='flex flex-col items-center justify-center p-4'>
					<AnimatedSphere color={color} speed={speed} radiusScale={radiusScale} className='border-border h-64 w-64 rounded-2xl border bg-black/40 shadow-2xl backdrop-blur-md' />
				</div>
			);
		}

		if (selectedSlug === 'floating-dock') {
			const baseSize = Number(propValues.baseSize ?? 44);
			const maxMagnification = Number(propValues.maxMagnification ?? 0.6);
			const influenceRadius = Number(propValues.influenceRadius ?? 70);
			return (
				<div className='mx-auto flex w-full max-w-md flex-col items-center justify-center py-12'>
					<p className='text-muted-foreground mb-6 text-xs'>Hover over icons to test Gaussian proximity curve</p>
					<FloatingDock
						baseSize={baseSize}
						maxMagnification={maxMagnification}
						influenceRadius={influenceRadius}
						items={[
							{ title: 'Terminal', icon: <Terminal className='h-5 w-5' /> },
							{ title: 'Kinetics', icon: <Sliders className='h-5 w-5' /> },
							{ title: 'Hardware', icon: <Cpu className='h-5 w-5' /> },
							{ title: 'Shaders', icon: <Sparkles className='h-5 w-5' /> },
							{ title: 'Security', icon: <Layers className='h-5 w-5' /> },
						]}
					/>
				</div>
			);
		}

		if (selectedSlug === 'interactive-grid') {
			const width = Number(propValues.width ?? 32);
			const height = Number(propValues.height ?? 32);
			return (
				<div className='border-border bg-background relative mx-auto flex h-[23.75rem] w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 shadow-inner'>
					<InteractiveGridPattern width={width} height={height} squares={[24, 16]} className='mask-[radial-gradient(400px_circle_at_center,white,transparent)] opacity-70' />
					<div className='z-10 flex flex-col items-center text-center'>
						<span className='kbd text-primary text-3xs'>VECTOR KINETICS</span>
						<h4 className='text-foreground mt-1 text-xl font-bold'>Interactive Grid</h4>
						<p className='text-muted-foreground mt-1 max-w-xs text-xs'>Hover over grid squares to trigger hardware-accelerated kinetic active states.</p>
					</div>
				</div>
			);
		}

		if (selectedSlug === 'number-ticker') {
			const value = Number(propValues.value ?? 1000);
			const decimalPlaces = Number(propValues.decimalPlaces ?? 0);
			return (
				<div className='border-border bg-card mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-lg'>
					<span className='kbd text-primary text-3xs mb-2'>ANALYTICAL EASING (rAF)</span>
					<div className='text-foreground font-mono text-6xl font-black tracking-tight'>
						$<NumberTicker value={value} decimalPlaces={decimalPlaces} />
					</div>
					<p className='text-muted-foreground mt-3 text-xs'>Continuous ease-out exponential ticker with zero Framer Motion dependencies.</p>
				</div>
			);
		}

		if (selectedSlug === 'magnetic-button') {
			const strength = Number(propValues.strength ?? 0.35);
			const radius = Number(propValues.radius ?? 120);
			const springDamping = Number(propValues.springDamping ?? 18);
			return (
				<div className='flex flex-col items-center justify-center p-12'>
					<p className='text-muted-foreground mb-6 text-xs'>Move cursor near button to feel inverted magnetic pull field</p>
					<MagneticButton
						strength={strength}
						radius={radius}
						springDamping={springDamping}
						className='border-primary/50 bg-primary/10 text-foreground hover:bg-primary/20 rounded-2xl border px-8 py-4 font-bold shadow-xl backdrop-blur-md transition-colors'
					>
						<span className='flex items-center gap-2'>
							<Sparkles className='text-primary h-4 w-4 shrink-0' />
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
				<div className='mx-auto flex w-full max-w-sm flex-col items-center py-8'>
					<p className='text-muted-foreground mb-4 text-xs'>Drag card left or right to dismiss with momentum fling</p>
					<CardSwipeStack
						thresholdDistance={thresholdDistance}
						maxRotation={maxRotation}
						items={[
							{ id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
							{ id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
							{ id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
						]}
						renderCard={(item) => (
							<div className='border-border bg-card rounded-2xl border p-6 shadow-2xl backdrop-blur-md'>
								<span className='kbd text-primary text-3xs'>{item.tag}</span>
								<h4 className='text-foreground mt-2 text-lg font-bold'>{item.title}</h4>
								<p className='text-muted-foreground mt-1 text-xs'>{item.desc}</p>
								<div className='border-border text-muted-foreground text-3xs mt-4 flex items-center justify-between border-t pt-3 font-mono'>
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
				<div className='mx-auto w-full max-w-md py-4'>
					<ComparisonSlider
						aspectRatio='16/10'
						defaultPosition={defaultPosition}
						before={
							<div className='flex size-full flex-col justify-between bg-linear-to-br from-indigo-950 via-purple-950 to-slate-900 p-6 text-white'>
								<span className='kbd text-3xs self-start bg-white/20 text-white'>ORIGINAL MOCKUP</span>
								<div>
									<h4 className='text-xl font-bold'>Static Canvas</h4>
									<p className='text-xs opacity-70'>Unaccelerated design view</p>
								</div>
							</div>
						}
						after={
							<div className='flex size-full flex-col justify-between bg-linear-to-br from-emerald-950 via-teal-950 to-slate-900 p-6 text-white'>
								<span className='kbd text-3xs self-start bg-emerald-500/30 text-emerald-300'>EXHUMA KINETIC ENGINE</span>
								<div>
									<h4 className='text-xl font-bold'>120Hz ProMotion</h4>
									<p className='text-xs opacity-70'>Analytical physics active</p>
								</div>
							</div>
						}
					/>
				</div>
			);
		}

		if (selectedSlug === 'expandable-card') {
			return (
				<div className='mx-auto w-full max-w-sm py-4'>
					<ExpandableCard
						cardContent={
							<div className='border-border bg-card hover:border-primary/50 rounded-2xl border p-6 shadow-lg transition-all'>
								<span className='kbd text-primary text-3xs'>CLICK TO EXPAND</span>
								<h4 className='text-foreground mt-2 text-lg font-bold'>FLIP Morphing Architecture</h4>
								<p className='text-muted-foreground mt-1 text-xs'>Mathematical geometry snapshot with zero Framer Motion.</p>
							</div>
						}
						expandedContent={
							<div className='space-y-4'>
								<span className='kbd text-primary text-3xs'>MODAL DIALOG (FLIP INVERTED)</span>
								<h3 className='text-foreground text-2xl font-black'>Hardware-Accelerated Dialog</h3>
								<p className='text-muted-foreground text-sm leading-relaxed'>
									The card morphs smoothly from its trigger bounding rect into a centered dialog snapshot using analytical FLIP transformation matrices.
								</p>
								<div className='border-border bg-background text-muted-foreground rounded-xl border p-4 font-mono text-xs'>Press ESC or click backdrop to close</div>
							</div>
						}
					/>
				</div>
			);
		}

		if (selectedSlug === 'cursor-tooltip') {
			const springDamping = Number(propValues.springDamping ?? 22);
			return (
				<div className='flex flex-col items-center justify-center p-12'>
					<CursorTooltip
						springDamping={springDamping}
						content='Exhuma Exponential Cursor Smoothing'
						className='border-border bg-card/80 hover:border-primary cursor-pointer rounded-2xl border p-8 text-center shadow-xl transition-colors'
					>
						<span className='kbd text-primary text-3xs mb-2 inline-block'>HOVER OVER CARD</span>
						<h4 className='text-foreground text-xl font-bold'>Interactive Viewport Target</h4>
						<p className='text-muted-foreground mt-1 text-xs'>Hover cursor anywhere over this card to activate the magnetic trailing tooltip.</p>
					</CursorTooltip>
				</div>
			);
		}

		return null;
	};

	return (
		<div className='w-full space-y-6'>
			{/* Xcode/Figma Top Toolbar */}
			<div className='border-border bg-card flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-sm transition-colors lg:flex-row lg:items-center'>
				{/* Breadcrumb & Component Info */}
				<div className='flex items-center gap-3'>
					<div className='bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl shadow-xs'>
						<Sliders className='h-4 w-4' />
					</div>
					<div>
						<div className='text-muted-foreground flex items-center gap-1.5 font-mono text-xs'>
							<span>Studio Workbench</span>
							<ChevronRight className='h-3 w-3 shrink-0' />
							<span className='text-foreground font-bold'>{component.name}</span>
						</div>
						<div className='mt-0.5 flex items-center gap-2'>
							<Badge variant='ecosystem' className='text-primary text-3xs font-bold uppercase'>
								{component.category}
							</Badge>
							<span className='text-muted-foreground text-xs'>· 13 Native Idioms</span>
						</div>
					</div>
				</div>

				{/* Presets Selector Bar */}
				{Object.keys(presets).length > 0 && (
					<div className='flex items-center gap-2'>
						<span className='text-muted-foreground font-mono text-xs font-medium'>Presets:</span>
						<div className='bg-muted/60 border-border flex items-center gap-1 rounded-lg border p-1'>
							{Object.keys(presets).map((pName) => (
								<button
									key={pName}
									type='button'
									onClick={() => applyPreset(pName)}
									className={cn(
										'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-all',
										activePreset === pName ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									{pName}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Right: Quick CLI & Reset */}
				<div className='flex items-center gap-2.5'>
					<div className='border-border bg-muted/40 text-foreground flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs'>
						<Terminal className='text-primary h-3.5 w-3.5 shrink-0' />
						<span className='text-muted-foreground text-2xs max-w-[11.25rem] truncate sm:max-w-none'>{cliCommand}</span>
						<button type='button' onClick={copyCli} className='text-muted-foreground hover:text-foreground cursor-pointer transition-colors' title='Copy CLI command'>
							{copiedCli ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='h-3.5 w-3.5' />}
						</button>
					</div>

					<Button variant='outline' size='sm' onClick={resetProps} className='cursor-pointer gap-1.5 text-xs' title='Reset all properties'>
						<RefreshCw className='h-3.5 w-3.5' />
						<span className='hidden sm:inline'>Reset</span>
					</Button>
				</div>
			</div>

			{/* Three-Panel Xcode/Figma IDE Stage */}
			<div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-12'>
				{/* 1. Left Component Tree (3 cols) */}
				<div className='border-border bg-card space-y-4 rounded-2xl border p-4 shadow-sm lg:col-span-3'>
					<div className='border-border flex items-center justify-between border-b pb-3'>
						<div className='flex items-center gap-2'>
							<Layers className='text-primary h-4 w-4 shrink-0' />
							<span className='text-foreground font-mono text-xs font-bold tracking-wider uppercase'>Components</span>
						</div>
						<span className='kbd text-4xs'>{ALL_COMPONENTS.length} CANONICAL</span>
					</div>

					{/* Search input */}
					<div className='relative'>
						<Search className='text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5' />
						<input
							type='text'
							value={catalogSearch}
							onChange={(e) => setCatalogSearch(e.target.value)}
							placeholder='Filter components...'
							className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-1.5 pr-3 pl-8 text-xs outline-none focus:ring-1'
						/>
					</div>

					{/* Component Tree Items */}
					<div className='max-h-[32.5rem] space-y-1 overflow-y-auto pr-1'>
						{filteredComponents.map((comp) => {
							const isSelected = comp.slug === selectedSlug;
							return (
								<button
									key={comp.slug}
									type='button'
									onClick={() => handleSelectComponent(comp.slug)}
									className={cn(
										'flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all',
										isSelected ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
									)}
								>
									<div>
										<div className='truncate font-semibold'>{comp.name}</div>
										<div className={cn('text-3xs font-mono capitalize', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{comp.category}</div>
									</div>
									<ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform', isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-40')} />
								</button>
							);
						})}
					</div>
				</div>

				{/* 2. Center Stage Viewport (6 cols) */}
				<div className='border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-6'>
					{/* Responsive Device Toolbar */}
					<div className='border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2 text-xs'>
						{/* Device Frames */}
						<div className='bg-muted/60 border-border/50 flex items-center gap-1 rounded-lg border p-1'>
							<button
								type='button'
								onClick={() => setViewportMode('desktop')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'desktop' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Desktop (100%)'
							>
								<Monitor className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Desktop</span>
							</button>
							<button
								type='button'
								onClick={() => setViewportMode('laptop')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'laptop' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Laptop (1024px)'
							>
								<Laptop className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Laptop</span>
							</button>
							<button
								type='button'
								onClick={() => setViewportMode('tablet')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'tablet' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Tablet (768px)'
							>
								<Tablet className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Tablet</span>
							</button>
							<button
								type='button'
								onClick={() => setViewportMode('mobile')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'mobile' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Mobile (375px)'
							>
								<Smartphone className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Mobile</span>
							</button>
						</div>

						{/* Zoom & Canvas Texture */}
						<div className='text-muted-foreground text-2xs flex items-center gap-3 font-mono'>
							<span className='kbd text-4xs'>{viewportMode === 'mobile' ? '375 × 667 px' : viewportMode === 'tablet' ? '768 × 1024 px' : viewportMode === 'laptop' ? '1024 × 768 px' : 'Fluid 100%'}</span>

							<div className='hidden items-center gap-1 sm:flex'>
								<button type='button' onClick={() => setZoomScale((z) => Math.max(50, z - 25))} className='hover:bg-accent hover:text-foreground cursor-pointer rounded-sm p-1' title='Zoom out'>
									<ZoomOut className='h-3.5 w-3.5' />
								</button>
								<span className='w-8 text-center'>{zoomScale}%</span>
								<button type='button' onClick={() => setZoomScale((z) => Math.min(150, z + 25))} className='hover:bg-accent hover:text-foreground cursor-pointer rounded-sm p-1' title='Zoom in'>
									<ZoomIn className='h-3.5 w-3.5' />
								</button>
							</div>
						</div>
					</div>

					{/* Dot-Grid Canvas Viewport */}
					<div
						className={cn(
							'flex min-h-[30rem] items-center justify-center overflow-auto p-6 transition-colors sm:p-10',
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
				<div className='border-border bg-card space-y-4 rounded-2xl border p-4 shadow-sm lg:col-span-3'>
					<div className='border-border flex items-center justify-between border-b pb-3'>
						<div className='flex items-center gap-2'>
							<Sliders className='text-primary h-4 w-4 shrink-0' />
							<span className='text-foreground font-mono text-xs font-bold tracking-wider uppercase'>Property Inspector</span>
						</div>
						<span className='kbd text-4xs'>{component.props.length} PROPS</span>
					</div>

					{/* Prop Controls List */}
					<div className='max-h-[32.5rem] space-y-4 overflow-y-auto pr-1'>
						{component.props.map((propDef) => {
							const val = propValues[propDef.name] ?? propDef.defaultValue;

							return (
								<div key={propDef.name} className='border-border/60 bg-muted/20 space-y-1.5 rounded-xl border p-3'>
									<div className='flex items-center justify-between text-xs'>
										<label htmlFor={`prop-${propDef.name}`} className='text-foreground text-2xs font-mono font-semibold'>
											{propDef.name}
										</label>
										<span className='kbd text-3xs'>{String(val)}</span>
									</div>

									{propDef.description && <p className='text-muted-foreground text-3xs leading-tight'>{propDef.description}</p>}

									{/* Render Control based on type */}
									{propDef.type === 'boolean' ? (
										<div className='flex items-center gap-2 pt-1'>
											<input
												type='checkbox'
												id={`prop-${propDef.name}`}
												checked={Boolean(val)}
												onChange={(e) => handlePropChange(propDef.name, e.target.checked)}
												className='border-border accent-primary h-4 w-4 cursor-pointer rounded-sm'
											/>
											<label htmlFor={`prop-${propDef.name}`} className='text-muted-foreground cursor-pointer text-xs'>
												{val ? 'Enabled' : 'Disabled'}
											</label>
										</div>
									) : propDef.type === 'select' && propDef.options ? (
										<select
											id={`prop-${propDef.name}`}
											value={String(val)}
											onChange={(e) => handlePropChange(propDef.name, e.target.value)}
											className='border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-2.5 py-1.5 text-xs outline-none focus:ring-1'
										>
											{propDef.options.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
									) : (
										/* Slider + Numerical Input Sync */
										<div className='flex items-center gap-2 pt-1'>
											<input
												type='range'
												id={`prop-${propDef.name}`}
												min={propDef.min ?? 0}
												max={propDef.max ?? 100}
												step={propDef.step ?? 1}
												value={Number(val)}
												onChange={(e) => handlePropChange(propDef.name, Number(e.target.value))}
												className='accent-primary h-1.5 flex-1 cursor-pointer'
											/>
											<input
												type='number'
												min={propDef.min ?? 0}
												max={propDef.max ?? 100}
												step={propDef.step ?? 1}
												value={Number(val)}
												onChange={(e) => handlePropChange(propDef.name, Number(e.target.value))}
												className='border-input bg-background text-foreground text-2xs w-14 rounded-sm border px-1.5 py-0.5 text-right font-mono'
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
			<div className='border-border bg-card overflow-hidden rounded-2xl border shadow-sm'>
				{/* Top bar */}
				<div className='border-border bg-muted/30 flex flex-col items-stretch justify-between gap-3 border-b px-4 py-3 md:flex-row md:items-center'>
					<div className='flex items-center gap-2'>
						<Sparkles className='text-primary h-4 w-4 shrink-0' />
						<span className='text-foreground font-mono text-xs font-bold'>Universal Code Synchronizer</span>
						<Badge variant='ecosystem' className='text-3xs'>
							{selectedFlavor}
						</Badge>
					</div>

					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={downloadFile}
							className='border-border bg-background text-foreground hover:bg-accent inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors'
							title='Download component source'
						>
							<Download className='h-3.5 w-3.5 shrink-0' />
							<span>Download Source</span>
						</button>
					</div>
				</div>

				{/* 13 Ecosystem Selector Pills */}
				<div className='border-border bg-background/50 flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2.5'>
					{FLAVORS.map((flavor) => {
						const isSelected = selectedFlavor === flavor;
						return (
							<button
								key={flavor}
								type='button'
								onClick={() => {
									setSelectedFlavor(flavor);
									setSelectedFileIdx(0);
								}}
								className={cn(
									'cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-all',
									isSelected ? 'border-primary bg-primary text-primary-foreground font-bold shadow-xs' : 'border-border bg-card text-muted-foreground hover:border-input hover:text-foreground'
								)}
							>
								{ECOSYSTEM_LABELS[flavor]}
							</button>
						);
					})}
				</div>

				{/* Multi-File Tabs (for WordPress Gutenberg, etc.) */}
				{generatedFiles.length > 1 && (
					<div className='border-border bg-muted/20 flex items-center gap-1.5 border-b px-4 py-2'>
						<span className='text-muted-foreground text-3xs mr-2 font-mono'>Generated Files ({generatedFiles.length}):</span>
						{generatedFiles.map((file, idx) => (
							<button
								key={file.filename}
								type='button'
								onClick={() => setSelectedFileIdx(idx)}
								className={cn(
									'cursor-pointer rounded-md px-3 py-1 font-mono text-xs transition-colors',
									selectedFileIdx === idx ? 'bg-accent text-accent-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
							>
								{file.filename}
							</button>
						))}
					</div>
				)}

				{/* CodeBlock Display */}
				<div className='bg-muted/10 p-4'>
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
