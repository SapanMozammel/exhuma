'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  IconAdjustments as Sliders,
  IconTerminal2 as Terminal,
  IconCheck as Check,
  IconCopy as Copy,
  IconEye as Eye,
  IconCode as Code2,
  IconCpu as Cpu,
  IconSparkles as Sparkles,
  IconShieldCheck as ShieldCheck,
  IconAccessible as Accessibility,
  IconArrowRight as ArrowRight,
  IconArrowLeft as ArrowLeft,
  IconExternalLink as ExternalLink,
} from '@tabler/icons-react';
import {
	COMPONENT_REGISTRY,
	ALL_COMPONENTS,
	EcosystemFlavor,
	ECOSYSTEM_LABELS,
	UniversalComponent,
} from '@/registry';
import { EcosystemPills } from './EcosystemPills';
import { CodeBlock } from './CodeBlock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
	BentoVisual,
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

interface ComponentDocViewProps {
	slug: string;
}

export function ComponentDocView({ slug }: ComponentDocViewProps) {
	const component = COMPONENT_REGISTRY[slug] || ALL_COMPONENTS[0];
	const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');
	const [selectedFlavor, setSelectedFlavor] =
		React.useState<EcosystemFlavor>('react');
	const [copied, setCopied] = React.useState(false);
	const [codeMode, setCodeMode] = React.useState<'clean' | 'ejected'>('clean');

	// Component-specific interactive state
	const [tiltMax, setTiltMax] = React.useState(20);
	const [glare, setGlare] = React.useState(true);
	const [stackOffset, setStackOffset] = React.useState(24);
	const [scrollGap, setScrollGap] = React.useState(16);
	const [masonryCols, setMasonryCols] = React.useState(3);
	const [gridMin, setGridMin] = React.useState(200);
	const [spotlightRadius, setSpotlightRadius] = React.useState(350);
	const [accordionMode, setAccordionMode] = React.useState<'single' | 'multiple'>('single');
	const [marqueeSpeed, setMarqueeSpeed] = React.useState(40);
	const [borderBeamDuration, setBorderBeamDuration] = React.useState(8);
	const [sphereAscii, setSphereAscii] = React.useState(false);
	const [tickerValue, setTickerValue] = React.useState(1000);
	const [magneticStrength, setMagneticStrength] = React.useState(0.35);
	const [sliderPos, setSliderPos] = React.useState(0.5);

	const stackingScrollRef = React.useRef<HTMLDivElement>(null);
	const horizontalScrollRef = React.useRef<HTMLDivElement>(null);

	// 3D Tilt Card pointer physics
	const [tiltTransform, setTiltTransform] = React.useState('');
	const [glareCoord, setGlareCoord] = React.useState({ x: 50, y: 50, opacity: 0 });

	const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const rotX = ((y - centerY) / centerY) * -tiltMax;
		const rotY = ((x - centerX) / centerX) * tiltMax;

		setTiltTransform(
			`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`
		);
		if (glare) {
			setGlareCoord({
				x: (x / rect.width) * 100,
				y: (y / rect.height) * 100,
				opacity: 0.4,
			});
		}
	};

	const handleMouseLeaveTilt = () => {
		setTiltTransform(
			'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
		);
		setGlareCoord({ x: 50, y: 50, opacity: 0 });
	};

	// Synthesize code dynamically
	const generatedCode = React.useMemo(() => {
		const props: Record<string, unknown> = {
			...component.defaultProps,
			maxTilt: tiltMax,
			glare,
			perspective: 1000,
			stackOffset,
			gap: scrollGap,
			columns: masonryCols,
			minItemWidth: gridMin,
		};
		const files = component.generateCode(selectedFlavor, props, { eject: codeMode === 'ejected' });
		return files[0]?.code || '';
	}, [
		component,
		selectedFlavor,
		codeMode,
		tiltMax,
		glare,
		stackOffset,
		scrollGap,
		masonryCols,
		gridMin,
	]);

	const cliCommand = `npx exhuma add ${component.slug} --flavor=${selectedFlavor}`;

	const copyCli = () => {
		navigator.clipboard.writeText(cliCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Determine prev / next components
	const currentIndex = ALL_COMPONENTS.findIndex((c) => c.slug === component.slug);
	const prevComp = currentIndex > 0 ? ALL_COMPONENTS[currentIndex - 1] : null;
	const nextComp =
		currentIndex < ALL_COMPONENTS.length - 1 ? ALL_COMPONENTS[currentIndex + 1] : null;

	return (
		<div className="space-y-10">
			{/* Component Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Badge variant="outline" className="capitalize text-[10px]">
							{component.category}
						</Badge>
						<Badge variant="secondary" className="text-[10px] font-mono">
							v{component.version}
						</Badge>
						<span className="text-xs text-muted-foreground font-mono">
							13 Ecosystems
						</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						{component.name}
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
						{component.description}
					</p>
				</div>

				<div className="flex items-center gap-2 self-start sm:self-auto">
					<Link href={`/studio?slug=${component.slug}`}>
						<Button className="gap-2 shadow-sm">
							<Sliders className="h-4 w-4" />
							<span>Open in Studio</span>
						</Button>
					</Link>
				</div>
			</div>

			{/* CLI Quick Install Command Bar */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 sm:px-4 shadow-xs">
				<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
					<Terminal className="h-4 w-4 text-primary" />
					<span className="text-foreground font-semibold">CLI Command:</span>
					<span className="select-all font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
						{cliCommand}
					</span>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={copyCli}
					className="gap-1.5 h-8 text-xs shrink-0 self-end sm:self-auto"
				>
					{copied ? (
						<>
							<Check className="h-3.5 w-3.5 text-emerald-500" />
							<span className="text-emerald-500 font-semibold">Copied!</span>
						</>
					) : (
						<>
							<Copy className="h-3.5 w-3.5" />
							<span>Copy Command</span>
						</>
					)}
				</Button>
			</div>

			{/* Live Interactive Sandbox / Code Stage */}
			<section id="interactive-stage" className="space-y-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Interactive Specification
					</h2>

					{/* [Preview | Code] Segment */}
					<div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60">
						<button
							type="button"
							onClick={() => setActiveTab('preview')}
							className={cn(
								'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
								activeTab === 'preview'
									? 'bg-background text-foreground shadow-xs font-bold'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							<Eye className="h-3.5 w-3.5" />
							<span>Live Preview</span>
						</button>
						<button
							type="button"
							onClick={() => setActiveTab('code')}
							className={cn(
								'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
								activeTab === 'code'
									? 'bg-background text-foreground shadow-xs font-bold'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							<Code2 className="h-3.5 w-3.5" />
							<span>Native Code</span>
						</button>
					</div>
				</div>

				{/* 13-Ecosystem Switcher Bar */}
				<div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
					<div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2 text-xs">
						<div className="flex items-center gap-2">
							<Cpu className="h-3.5 w-3.5 text-primary" />
							<span className="text-muted-foreground font-mono">Contract:</span>
							<span className="font-bold text-foreground">
								{ECOSYSTEM_LABELS[selectedFlavor]}
							</span>
						</div>
					</div>

					<div className="p-3 border-b border-border bg-background/50 overflow-x-auto">
						<EcosystemPills
							selectedFlavor={selectedFlavor}
							onSelectFlavor={setSelectedFlavor}
						/>
					</div>

					{/* Stage Body */}
					<div className="p-6 sm:p-10 min-h-[420px] flex items-center justify-center bg-dot-grid relative">
						{activeTab === 'preview' ? (
							<div className="w-full flex flex-col items-center gap-8">
								{/* 1. Tilt Card */}
								{component.slug === 'tilt-card' && (
									<TiltCard
										maxTilt={tiltMax}
										glare={glare}
										perspective={1000}
										className="w-full max-w-md bg-card p-8 border border-border shadow-2xl cursor-pointer"
									>
										<div className="flex items-center justify-between mb-4">
											<span className="kbd text-[10px] text-primary font-bold">
												INTERACTIVE 3D
											</span>
											<span className="text-xs font-mono text-muted-foreground">
												Max: {tiltMax}°
											</span>
										</div>
										<h3 className="text-2xl font-black tracking-tight text-foreground">
											Tactile 3D Tilt Card
										</h3>
										<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
											Move your cursor across this surface. Calculated with 60 FPS spring physics and zero layout re-renders.
										</p>
										<div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
											<span>Perspective: 1000px</span>
											<span className="text-emerald-500 font-bold">Hardware Accelerated</span>
										</div>
									</TiltCard>
								)}

								{/* 2. Stacking Cards */}
								{component.slug === 'stacking-cards' && (
									<div
										ref={stackingScrollRef}
										className="w-full max-w-md h-[460px] overflow-y-auto rounded-2xl border border-border bg-background/50 p-6 no-scrollbar relative shadow-inner"
									>
										<div className="text-[11px] font-mono text-muted-foreground text-center mb-6 flex items-center justify-center gap-2">
											<span className="kbd text-[10px]">SCROLL DOWN INSIDE STAGE</span>
											<span>↓</span>
										</div>
										<StackingCards
											topStart={20}
											topIncrement={stackOffset}
											minScale={0.92}
											scaleThreshold={100}
											scrollContainerRef={stackingScrollRef}
										>
											{Array.from({ length: 4 }).map((_, idx) => (
												<div
													key={idx}
													className="rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 shadow-xl"
												>
													<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
														<span className="kbd text-[10px]">LAYER 0{idx + 1}</span>
														<span className="text-primary font-bold">Sticky Stack</span>
													</div>
													<h4 className="text-lg font-bold text-foreground">
														Sticky Stacking Card
													</h4>
													<p className="text-xs text-muted-foreground mt-1">
														Scroll down to observe progressive scale decay and reverse exit scaling.
													</p>
												</div>
											))}
										</StackingCards>
										<div className="h-[260px] flex items-center justify-center text-xs font-mono text-muted-foreground">
											Terminal scroll reached
										</div>
									</div>
								)}

								{/* 3. Horizontal Scroller */}
								{component.slug === 'horizontal-scroller' && (
									<div
										ref={horizontalScrollRef}
										className="w-full h-[460px] overflow-y-auto rounded-2xl border border-border bg-background/50 relative no-scrollbar shadow-inner"
									>
										<div className="sticky top-4 z-20 text-[11px] font-mono text-muted-foreground text-center mb-2 flex items-center justify-center gap-2 pointer-events-none">
											<span className="kbd text-[10px] bg-card/90 shadow">VERTICAL SCROLL → HORIZONTAL RAIL</span>
											<span>↓</span>
										</div>
										<HorizontalScroller
											speed={0.85}
											scrollContainerRef={horizontalScrollRef}
										>
											{Array.from({ length: 6 }).map((_, idx) => (
												<div
													key={idx}
													className="shrink-0 w-64 rounded-2xl border border-border bg-card p-6 shadow-md transition-all hover:border-primary"
												>
													<span className="kbd text-[10px] text-primary">SLIDE #{idx + 1}</span>
													<h4 className="text-base font-bold text-foreground mt-2">
														Momentum Rail
													</h4>
													<p className="text-xs text-muted-foreground mt-1">
														Horizontal translation mapped to scroll progress.
													</p>
												</div>
											))}
										</HorizontalScroller>
									</div>
								)}

								{/* 4. CSS Masonry */}
								{component.slug === 'css-masonry' && (
									<CssMasonry
										columns={masonryCols}
										gap={16}
										className="w-full"
									>
										{[90, 150, 110, 170, 130, 190].map((h, idx) => (
											<div
												key={idx}
												className="rounded-xl border border-border bg-card p-4 shadow-sm mb-4 break-inside-avoid"
												style={{ height: `${h}px` }}
											>
												<span className="kbd text-[10px] text-primary">ITEM 0{idx + 1}</span>
												<div className="text-xs font-bold text-foreground mt-1">CSS Masonry</div>
												<div className="text-[10px] text-muted-foreground">{h}px</div>
											</div>
										))}
									</CssMasonry>
								)}

								{/* 5. Auto Grid */}
								{component.slug === 'auto-grid' && (
									<AutoGrid
										minItemWidth={gridMin}
										gap={16}
										className="w-full"
									>
										{Array.from({ length: 6 }).map((_, idx) => (
											<div
												key={idx}
												className="rounded-xl border border-border bg-card p-5 shadow-sm"
											>
												<span className="kbd text-[10px] text-primary">GRID #{idx + 1}</span>
												<div className="text-sm font-bold text-foreground mt-1">Auto-Fit Grid</div>
												<div className="text-xs text-muted-foreground mt-1">MinMax responsive</div>
											</div>
										))}
									</AutoGrid>
								)}

								{/* 6. Spotlight Card */}
								{component.slug === 'spotlight-card' && (
									<SpotlightCard
										radius={spotlightRadius}
										color="rgba(99, 102, 241, 0.25)"
										borderColor="rgba(99, 102, 241, 0.6)"
										className="w-full max-w-md p-8 shadow-xl"
									>
										<div className="flex flex-col gap-3">
											<span className="kbd text-[10px] text-primary">SPOTLIGHT PRIMITIVE</span>
											<h4 className="text-xl font-bold tracking-tight text-foreground">Hardware-Accelerated Glow</h4>
											<p className="text-sm text-muted-foreground leading-relaxed">
												Glide your pointer over this card. Notice the sub-pixel radial edge mask and background sheen driven at 120Hz with zero React re-renders.
											</p>
											<div className="mt-4 flex items-center gap-2">
												<span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
												<span className="text-xs font-mono text-muted-foreground">GPU CSS Variables Active</span>
											</div>
										</div>
									</SpotlightCard>
								)}

								{/* 7. Morphing Tabs */}
								{component.slug === 'morphing-tabs' && (
									<div className="w-full max-w-md">
										<MorphingTabs.Root defaultValue="preview">
											<MorphingTabs.List className="w-full justify-between">
												<MorphingTabs.Indicator />
												<MorphingTabs.Trigger value="preview" className="flex-1">Preview</MorphingTabs.Trigger>
												<MorphingTabs.Trigger value="code" className="flex-1">Code</MorphingTabs.Trigger>
												<MorphingTabs.Trigger value="schema" className="flex-1">Schema</MorphingTabs.Trigger>
											</MorphingTabs.List>
											<MorphingTabs.Content value="preview" className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm">
												<div className="font-bold text-foreground mb-1">Live Interactive Preview Stage</div>
												<div className="text-muted-foreground text-xs">The floating indicator tracks active geometry and morphs dynamically using an analytical spring ODE.</div>
											</MorphingTabs.Content>
											<MorphingTabs.Content value="code" className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm">
												<div className="font-bold text-foreground mb-1">Generated Universal Syntax</div>
												<div className="text-muted-foreground text-xs">Compiles across 13 ecosystems with zero external animation dependencies.</div>
											</MorphingTabs.Content>
											<MorphingTabs.Content value="schema" className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm">
												<div className="font-bold text-foreground mb-1">WAI-ARIA Accessibility Contract</div>
												<div className="text-muted-foreground text-xs">Roving tabindex with circular modulo arrow navigation.</div>
											</MorphingTabs.Content>
										</MorphingTabs.Root>
									</div>
								)}

								{/* 8. Accordion */}
								{component.slug === 'accordion' && (
									<div className="w-full max-w-lg">
										<Accordion.Root mode={accordionMode} defaultValue="faq-1">
											<Accordion.Item value="faq-1">
												<Accordion.Trigger>
													<span>How does Exhuma eliminate animation jank?</span>
													<Accordion.Icon />
												</Accordion.Trigger>
												<Accordion.Content>
													Exhuma uses modern CSS Grid 0fr to 1fr interpolation with exact analytical spring differential equations, eliminating layout reflows and max-height timing glitches.
												</Accordion.Content>
											</Accordion.Item>
											<Accordion.Item value="faq-2">
												<Accordion.Trigger>
													<span>Does this require Framer Motion or GSAP?</span>
													<Accordion.Icon />
												</Accordion.Trigger>
												<Accordion.Content>
													Zero external dependencies. Every component is 100% handcrafted with pure mathematics, DSA, and native browser APIs.
												</Accordion.Content>
											</Accordion.Item>
											<Accordion.Item value="faq-3">
												<Accordion.Trigger>
													<span>Which platforms are supported?</span>
													<Accordion.Icon />
												</Accordion.Trigger>
												<Accordion.Content>
													All 13 major ecosystems including React, Next.js, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.
												</Accordion.Content>
											</Accordion.Item>
										</Accordion.Root>
									</div>
								)}

								{/* 9. Infinite Marquee */}
								{component.slug === 'infinite-marquee' && (
									<div className="w-full max-w-2xl py-4 overflow-hidden">
										<InfiniteMarquee speed={marqueeSpeed} pauseOnHover={true} gap="1.5rem">
											{[
												'120Hz ProMotion Ready',
												'Zero External Animation Deps',
												'Zero Layout Thrashing',
												'Modulo Wrap Arithmetic',
												'13-Ecosystem Universal',
												'Exhuma Kinetic Engine',
											].map((text, i) => (
												<div
													key={i}
													className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3 text-xs font-semibold backdrop-blur-md shadow-xs shrink-0"
												>
													<span className="h-2 w-2 rounded-full bg-primary" />
													<span className="text-foreground">{text}</span>
												</div>
											))}
										</InfiniteMarquee>
									</div>
								)}

								{/* 10. Bento Grid */}
								{component.slug === 'bento-grid' && (
									<div className="w-full max-w-2xl">
										<BentoGrid cols={3} gap="1rem">
											<BentoCard colSpan={2}>
												<BentoHeader>
													<span className="kbd text-[10px] text-primary">ANALYTICAL KINETICS</span>
													<h4 className="text-base font-bold text-foreground">Continuous Math Engine</h4>
												</BentoHeader>
												<BentoContent>
													Hardware-accelerated CSS custom properties driven directly by requestAnimationFrame loops.
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
											<BentoCard colSpan={1}>
												<BentoHeader>
													<span className="kbd text-[10px] text-purple-500">CROSS-PLATFORM</span>
													<h4 className="text-base font-bold text-foreground">13 Targets</h4>
												</BentoHeader>
												<BentoContent>
													Zero runtime dependencies across all targets.
												</BentoContent>
											</BentoCard>
											<BentoCard colSpan={2}>
												<BentoHeader>
													<span className="kbd text-[10px] text-primary">DENSE AUTO-FLOW</span>
													<h4 className="text-base font-bold text-foreground">Dynamic Responsive Matrix</h4>
												</BentoHeader>
												<BentoContent>
													Zero layout shift fluid arrangement on any device.
												</BentoContent>
											</BentoCard>
										</BentoGrid>
									</div>
								)}

								{/* 11. Diamond Grid */}
								{component.slug === 'diamond-grid' && (
									<div className="w-full max-w-xl py-4">
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
								)}

								{/* 12. Scroll Timeline */}
								{component.slug === 'scroll-timeline' && (
									<div className="w-full max-w-md h-[460px] overflow-y-auto rounded-2xl border border-border bg-background/50 p-6 no-scrollbar relative shadow-inner">
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
													title: '13-Ecosystem Compilers',
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
								)}

								{/* 13. Sticky Parallax Scroll */}
								{component.slug === 'sticky-parallax' && (
									<div className="w-full max-w-md h-[460px] overflow-y-auto rounded-2xl border border-border bg-background/50 relative no-scrollbar shadow-inner">
										<StickyParallaxScroll trackHeight="800px">
											<div className="relative w-full h-full flex items-center justify-center">
												<ParallaxLayer speed={-0.4}>
													<div className="text-4xl font-extrabold text-foreground/20 select-none">
														BACKGROUND
													</div>
												</ParallaxLayer>
												<ParallaxLayer speed={0.8}>
													<div className="rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl backdrop-blur-md text-center">
														<span className="kbd text-[10px] text-primary">DIFFERENTIAL MOMENTUM</span>
														<h4 className="text-lg font-bold text-foreground mt-1">Multi-Speed Layers</h4>
														<p className="text-xs text-muted-foreground mt-1">Scroll inside stage to observe parallax</p>
													</div>
												</ParallaxLayer>
											</div>
										</StickyParallaxScroll>
									</div>
								)}

								{/* 14. Border Beam */}
								{component.slug === 'border-beam' && (
									<div className="relative flex h-64 w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl">
										<span className="kbd text-[10px] text-primary">PERIMETER TRACE</span>
										<h4 className="text-xl font-bold text-foreground mt-2">Border Beam</h4>
										<p className="text-xs text-muted-foreground text-center mt-1">
											Conic gradient perimeter trace with sub-pixel exclusion mask and zero-runtime CSS.
										</p>
										<BorderBeam size={180} duration={borderBeamDuration} borderWidth={2} />
									</div>
								)}

								{/* 15. Animated Sphere */}
								{component.slug === 'animated-sphere' && (
									<div className="flex flex-col items-center justify-center p-4">
										<AnimatedSphere
											speed={sphereAscii ? 1.5 : 1.0}
											radiusScale={0.45}
											color="#6366f1"
											className="w-64 h-64 rounded-2xl border border-border bg-black/40 backdrop-blur-md shadow-2xl"
										/>
									</div>
								)}

								{/* 16. Floating Dock */}
								{component.slug === 'floating-dock' && (
									<div className="w-full max-w-md flex flex-col items-center justify-center py-12">
										<p className="text-xs text-muted-foreground mb-6">Hover over icons to experience Gaussian scale distribution</p>
										<FloatingDock
											items={[
												{ title: 'Dashboard', icon: <Terminal className="h-5 w-5" /> },
												{ title: 'Kinetics', icon: <Sliders className="h-5 w-5" /> },
												{ title: 'Hardware', icon: <Cpu className="h-5 w-5" /> },
												{ title: 'Shaders', icon: <Sparkles className="h-5 w-5" /> },
												{ title: 'Security', icon: <ShieldCheck className="h-5 w-5" /> },
											]}
										/>
									</div>
								)}

								{/* 17. Interactive Grid Pattern */}
								{component.slug === 'interactive-grid' && (
									<div className="relative flex h-[380px] w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-inner">
										<InteractiveGridPattern
											width={32}
											height={32}
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
								)}

								{/* 18. Number Ticker */}
								{component.slug === 'number-ticker' && (
									<div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card shadow-lg text-center">
										<span className="kbd text-[10px] text-primary mb-2">ANALYTICAL EASING (rAF)</span>
										<div className="text-6xl font-black tracking-tight text-foreground font-mono">
											$<NumberTicker value={tickerValue} decimalPlaces={0} />
										</div>
										<p className="text-xs text-muted-foreground mt-3">
											Continuous ease-out exponential ticker with zero Framer Motion dependencies.
										</p>
									</div>
								)}

								{/* 19. Magnetic Button */}
								{component.slug === 'magnetic-button' && (
									<div className="flex flex-col items-center justify-center p-12">
										<p className="text-xs text-muted-foreground mb-6">Move cursor near button to feel inverted magnetic pull field</p>
										<MagneticButton
											strength={magneticStrength}
											radius={140}
											className="rounded-2xl border border-primary/50 bg-primary/10 px-8 py-4 font-bold text-foreground backdrop-blur-md shadow-xl hover:bg-primary/20 transition-colors"
										>
											<span className="flex items-center gap-2">
												<Sparkles className="h-4 w-4 text-primary" />
												<span>Magnetic Attraction</span>
											</span>
										</MagneticButton>
									</div>
								)}

								{/* 20. Card Swipe Stack */}
								{component.slug === 'card-swipe-stack' && (
									<div className="w-full max-w-sm py-8 flex flex-col items-center">
										<p className="text-xs text-muted-foreground mb-4">Drag card left or right to dismiss with momentum fling</p>
										<CardSwipeStack
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
								)}

								{/* 21. Comparison Slider */}
								{component.slug === 'comparison-slider' && (
									<div className="w-full max-w-md py-4">
										<ComparisonSlider
											aspectRatio="16/10"
											defaultPosition={sliderPos}
											onPositionChange={setSliderPos}
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
								)}

								{/* 22. Expandable Card */}
								{component.slug === 'expandable-card' && (
									<div className="w-full max-w-sm py-4">
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
								)}

								{/* 23. Cursor Tooltip */}
								{component.slug === 'cursor-tooltip' && (
									<div className="flex flex-col items-center justify-center p-12">
										<CursorTooltip
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
								)}

								{/* Quick Live Sliders */}
								<div className="flex flex-wrap items-center justify-center gap-4 bg-card/90 backdrop-blur-md border border-border rounded-2xl p-3 shadow-md text-xs">
									{component.slug === 'tilt-card' && (
										<>
											<div className="flex items-center gap-2">
												<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
												<span className="text-muted-foreground text-[11px]">Max Tilt:</span>
												<input
													type="range"
													min="5"
													max="40"
													value={tiltMax}
													onChange={(e) => setTiltMax(Number(e.target.value))}
													className="w-24 accent-primary h-1.5 cursor-pointer"
												/>
												<span className="font-mono text-[11px] font-bold w-6">{tiltMax}°</span>
											</div>
											<label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground text-[11px]">
												<input
													type="checkbox"
													checked={glare}
													onChange={(e) => setGlare(e.target.checked)}
													className="rounded border-border accent-primary cursor-pointer"
												/>
												<span>Glare</span>
											</label>
										</>
									)}

									{component.slug === 'stacking-cards' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Offset:</span>
											<input
												type="range"
												min="10"
												max="40"
												value={stackOffset}
												onChange={(e) => setStackOffset(Number(e.target.value))}
												className="w-28 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-8">{stackOffset}px</span>
										</div>
									)}

									{component.slug === 'horizontal-scroller' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Gap:</span>
											<input
												type="range"
												min="8"
												max="32"
												value={scrollGap}
												onChange={(e) => setScrollGap(Number(e.target.value))}
												className="w-28 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-8">{scrollGap}px</span>
										</div>
									)}

									{component.slug === 'css-masonry' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Columns:</span>
											<input
												type="range"
												min="2"
												max="4"
												value={masonryCols}
												onChange={(e) => setMasonryCols(Number(e.target.value))}
												className="w-20 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-4">{masonryCols}</span>
										</div>
									)}

									{component.slug === 'auto-grid' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Min Width:</span>
											<input
												type="range"
												min="150"
												max="280"
												value={gridMin}
												onChange={(e) => setGridMin(Number(e.target.value))}
												className="w-24 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-12">{gridMin}px</span>
										</div>
									)}

									{component.slug === 'spotlight-card' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Radius:</span>
											<input
												type="range"
												min="150"
												max="600"
												step="25"
												value={spotlightRadius}
												onChange={(e) => setSpotlightRadius(Number(e.target.value))}
												className="w-28 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-10">{spotlightRadius}px</span>
										</div>
									)}

									{component.slug === 'accordion' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Mode:</span>
											<button
												type="button"
												onClick={() => setAccordionMode((m) => (m === 'single' ? 'multiple' : 'single'))}
												className="kbd px-2 py-0.5 text-[11px] font-mono hover:border-primary transition-colors cursor-pointer"
											>
												{accordionMode.toUpperCase()}
											</button>
										</div>
									)}

									{component.slug === 'infinite-marquee' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Speed:</span>
											<input
												type="range"
												min="10"
												max="150"
												step="5"
												value={marqueeSpeed}
												onChange={(e) => setMarqueeSpeed(Number(e.target.value))}
												className="w-28 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-12">{marqueeSpeed}px/s</span>
										</div>
									)}

									{component.slug === 'border-beam' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Duration:</span>
											<input
												type="range"
												min="2"
												max="20"
												step="1"
												value={borderBeamDuration}
												onChange={(e) => setBorderBeamDuration(Number(e.target.value))}
												className="w-24 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-6">{borderBeamDuration}s</span>
										</div>
									)}

									{component.slug === 'animated-sphere' && (
										<label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground text-[11px]">
											<input
												type="checkbox"
												checked={sphereAscii}
												onChange={(e) => setSphereAscii(e.target.checked)}
												className="rounded border-border accent-primary cursor-pointer"
											/>
											<span>ASCII Shader Mode</span>
										</label>
									)}

									{component.slug === 'number-ticker' && (
										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={() => setTickerValue((v) => (v === 1000 ? 5420 : 1000))}
												className="kbd px-2 py-0.5 text-[11px] font-mono hover:border-primary transition-colors cursor-pointer"
											>
												RETRIGGER ({tickerValue === 1000 ? '-> 5420' : '-> 1000'})
											</button>
										</div>
									)}

									{component.slug === 'magnetic-button' && (
										<div className="flex items-center gap-2">
											<Sliders className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="text-muted-foreground text-[11px]">Strength:</span>
											<input
												type="range"
												min="0.1"
												max="0.8"
												step="0.05"
												value={magneticStrength}
												onChange={(e) => setMagneticStrength(Number(e.target.value))}
												className="w-24 accent-primary h-1.5 cursor-pointer"
											/>
											<span className="font-mono text-[11px] font-bold w-8">{magneticStrength}</span>
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="w-full space-y-4">
								{/* Dependency Info & Dual-View Switcher */}
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-xs shadow-xs">
									<div className="flex items-center gap-2.5">
										<Cpu className="h-4 w-4 text-primary shrink-0" />
										<div className="flex flex-wrap items-center gap-1.5">
											<span className="font-semibold text-foreground">Inner Engine:</span>
											<code className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground">
												{selectedFlavor === 'flutter' ? 'exhuma: ^1.0.0' : '@exhuma/core'}
											</code>
										</div>
									</div>

									<div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
										<button
											type="button"
											onClick={() => setCodeMode('clean')}
											className={cn(
												'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
												codeMode === 'clean'
													? 'bg-card text-foreground shadow-xs font-semibold'
													: 'text-muted-foreground hover:text-foreground'
											)}
										>
											✨ Clean (Shadcn)
										</button>
										<button
											type="button"
											onClick={() => setCodeMode('ejected')}
											className={cn(
												'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
												codeMode === 'ejected'
													? 'bg-card text-foreground shadow-xs font-semibold'
													: 'text-muted-foreground hover:text-foreground'
											)}
										>
											⚙️ Ejected Engine
										</button>
									</div>
								</div>

								<CodeBlock
									code={generatedCode}
									language={
										selectedFlavor === 'flutter'
											? 'dart'
											: selectedFlavor === 'blade'
											? 'php'
											: selectedFlavor === 'vue'
											? 'vue'
											: selectedFlavor === 'svelte'
											? 'svelte'
											: 'tsx'
									}
									filename={`${component.name.replace(/\s+/g, '')}.${
										selectedFlavor === 'flutter'
											? 'dart'
											: selectedFlavor === 'blade'
											? 'blade.php'
											: selectedFlavor === 'vue'
											? 'vue'
											: selectedFlavor === 'svelte'
											? 'svelte'
											: selectedFlavor === 'angular'
											? 'component.ts'
											: 'tsx'
									}`}
								/>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Props API Reference Table */}
			<section id="props-api" className="space-y-4 pt-4 border-t border-border">
				<div>
					<Badge variant="outline" className="mb-1">API Contract</Badge>
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Props & Configuration
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground">
						Every parameter is statically type-checked and validated across all 13 ecosystem target templates.
					</p>
				</div>

				<div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
					<table className="w-full text-left text-xs">
						<thead className="bg-muted/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
							<tr>
								<th className="px-4 py-3">Prop</th>
								<th className="px-4 py-3">Type</th>
								<th className="px-4 py-3">Default</th>
								<th className="px-4 py-3">Description</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{component.props.map((p) => (
								<tr key={p.name} className="hover:bg-muted/30 transition-colors">
									<td className="px-4 py-3 font-mono font-bold text-primary">
										{p.name}
									</td>
									<td className="px-4 py-3 font-mono text-muted-foreground">
										{p.type}
									</td>
									<td className="px-4 py-3 font-mono text-foreground font-semibold">
										{String(p.defaultValue)}
									</td>
									<td className="px-4 py-3 text-muted-foreground leading-relaxed">
										{p.description || 'Configures dynamic calculation parameters.'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Architectural Guarantees & Lifecycle Cleanup */}
			<section id="lifecycle-safety" className="space-y-4 pt-4 border-t border-border">
				<div>
					<Badge variant="outline" className="mb-1">Architecture</Badge>
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Lifecycle Safety & Performance
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground">
						Designed for high-frequency user interactions with zero memory leaks.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="rounded-xl border border-border bg-card p-4 shadow-xs">
						<div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
							<ShieldCheck className="h-4 w-4 text-emerald-500" />
							<span>Deterministic Cleanup</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							All pointer event listeners, scroll handlers, and resize observers are cleanly destroyed on component unmount, preventing lingering background processes.
						</p>
					</div>

					<div className="rounded-xl border border-border bg-card p-4 shadow-xs">
						<div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
							<Sparkles className="h-4 w-4 text-primary" />
							<span>GPU Compositor Acceleration</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Transform and opacity modifications run directly on the GPU compositor thread using <code className="font-mono text-foreground text-[11px]">will-change: transform</code> without triggering browser layout recalcs.
						</p>
					</div>
				</div>
			</section>

			{/* Accessibility (a11y) */}
			<section id="accessibility" className="space-y-4 pt-4 border-t border-border">
				<div>
					<Badge variant="outline" className="mb-1">a11y</Badge>
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Accessibility Considerations
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground">
						Fully compliant with WCAG guidelines and respects user motion preferences.
					</p>
				</div>

				<div className="rounded-2xl border border-border bg-card p-5 space-y-3">
					<div className="flex items-center gap-2 text-xs font-bold text-foreground">
						<Accessibility className="h-4 w-4 text-primary" />
						<span>prefers-reduced-motion Support</span>
					</div>
					<p className="text-xs text-muted-foreground leading-relaxed">
						When a user has <code className="font-mono text-foreground text-[11px]">prefers-reduced-motion: reduce</code> enabled in their operating system, Exhuma components automatically disable 3D gyroscope tilt and spring animations, rendering static accessible content.
					</p>
				</div>
			</section>

			{/* Previous / Next Navigation */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-border">
				{prevComp ? (
					<Link
						href={`/docs/components/${prevComp.slug}`}
						className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors flex-1"
					>
						<ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
						<div className="text-left">
							<div className="text-[10px] uppercase font-mono text-muted-foreground">Previous</div>
							<div className="text-xs font-bold text-foreground">{prevComp.name}</div>
						</div>
					</Link>
				) : (
					<div className="flex-1" />
				)}

				{nextComp && (
					<Link
						href={`/docs/components/${nextComp.slug}`}
						className="flex items-center justify-end gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors flex-1"
					>
						<div className="text-right">
							<div className="text-[10px] uppercase font-mono text-muted-foreground">Next</div>
							<div className="text-xs font-bold text-foreground">{nextComp.name}</div>
						</div>
						<ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
					</Link>
				)}
			</div>
		</div>
	);
}
