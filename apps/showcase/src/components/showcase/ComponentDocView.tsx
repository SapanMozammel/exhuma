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
import { COMPONENT_REGISTRY, ALL_COMPONENTS, EcosystemFlavor, ECOSYSTEM_LABELS, UniversalComponent } from '@/registry';
import { EcosystemPills } from './EcosystemPills';
import { CodeBlock } from './CodeBlock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { StackingCards, HorizontalScroller, TiltCard, SpotlightCard, BorderBeam, CardSwipeStack, ComparisonSlider, ExpandableCard } from '@exhuma/cards';
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
import { MorphingTabs, Accordion, AnimatedSphere, FloatingDock, NumberTicker, MagneticButton, CursorTooltip } from '@exhuma/core';

interface ComponentDocViewProps {
	slug: string;
}

export function ComponentDocView({ slug }: ComponentDocViewProps) {
	const component = COMPONENT_REGISTRY[slug] || ALL_COMPONENTS[0];
	const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');
	const [selectedFlavor, setSelectedFlavor] = React.useState<EcosystemFlavor>('react');
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

		setTiltTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`);
		if (glare) {
			setGlareCoord({
				x: (x / rect.width) * 100,
				y: (y / rect.height) * 100,
				opacity: 0.4,
			});
		}
	};

	const handleMouseLeaveTilt = () => {
		setTiltTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
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
	}, [component, selectedFlavor, codeMode, tiltMax, glare, stackOffset, scrollGap, masonryCols, gridMin]);

	const cliCommand = `npx exhuma add ${component.slug} --flavor=${selectedFlavor}`;

	const copyCli = () => {
		navigator.clipboard.writeText(cliCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Determine prev / next components
	const currentIndex = ALL_COMPONENTS.findIndex((c) => c.slug === component.slug);
	const prevComp = currentIndex > 0 ? ALL_COMPONENTS[currentIndex - 1] : null;
	const nextComp = currentIndex < ALL_COMPONENTS.length - 1 ? ALL_COMPONENTS[currentIndex + 1] : null;

	return (
		<div className='space-y-10'>
			{/* Component Header */}
			<div className='border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<div className='mb-2 flex items-center gap-2'>
						<Badge variant='outline' className='text-3xs capitalize'>
							{component.category}
						</Badge>
						<Badge variant='secondary' className='text-3xs font-mono'>
							v{component.version}
						</Badge>
						<span className='text-muted-foreground font-mono text-xs'>13 Ecosystems</span>
					</div>
					<h1 className='text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl'>{component.name}</h1>
					<p className='text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed sm:text-base'>{component.description}</p>
				</div>

				<div className='flex items-center gap-2 self-start sm:self-auto'>
					<Link href={`/studio?slug=${component.slug}`}>
						<Button className='gap-2 shadow-sm'>
							<Sliders className='h-4 w-4 shrink-0' />
							<span>Open in Studio</span>
						</Button>
					</Link>
				</div>
			</div>

			{/* CLI Quick Install Command Bar */}
			<div className='border-border bg-card flex flex-col items-start justify-between gap-3 rounded-2xl border p-3 shadow-xs sm:flex-row sm:items-center sm:px-4'>
				<div className='text-muted-foreground flex items-center gap-2 font-mono text-xs'>
					<Terminal className='text-primary h-4 w-4 shrink-0' />
					<span className='text-foreground font-semibold'>CLI Command:</span>
					<span className='text-muted-foreground bg-muted/60 rounded-md px-2 py-0.5 font-mono select-all'>{cliCommand}</span>
				</div>
				<Button variant='outline' size='sm' onClick={copyCli} className='h-8 shrink-0 gap-1.5 self-end text-xs sm:self-auto'>
					{copied ? (
						<>
							<Check className='h-3.5 w-3.5 text-emerald-500' />
							<span className='font-semibold text-emerald-500'>Copied!</span>
						</>
					) : (
						<>
							<Copy className='h-3.5 w-3.5' />
							<span>Copy Command</span>
						</>
					)}
				</Button>
			</div>

			{/* Live Interactive Sandbox / Code Stage */}
			<section id='interactive-stage' className='space-y-4'>
				<div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Interactive Specification</h2>

					{/* [Preview | Code] Segment */}
					<div className='bg-muted/60 border-border/60 flex items-center gap-1 rounded-lg border p-1'>
						<button
							type='button'
							onClick={() => setActiveTab('preview')}
							className={cn(
								'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
								activeTab === 'preview' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							<Eye className='h-3.5 w-3.5' />
							<span>Live Preview</span>
						</button>
						<button
							type='button'
							onClick={() => setActiveTab('code')}
							className={cn(
								'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
								activeTab === 'code' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							<Code2 className='h-3.5 w-3.5' />
							<span>Native Code</span>
						</button>
					</div>
				</div>

				{/* 13-Ecosystem Switcher Bar */}
				<div className='border-border bg-card overflow-hidden rounded-2xl border shadow-sm'>
					<div className='border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2 text-xs'>
						<div className='flex items-center gap-2'>
							<Cpu className='text-primary h-3.5 w-3.5 shrink-0' />
							<span className='text-muted-foreground font-mono'>Contract:</span>
							<span className='text-foreground font-bold'>{ECOSYSTEM_LABELS[selectedFlavor]}</span>
						</div>
					</div>

					<div className='border-border bg-background/50 overflow-x-auto border-b p-3'>
						<EcosystemPills selectedFlavor={selectedFlavor} onSelectFlavor={setSelectedFlavor} />
					</div>

					{/* Stage Body */}
					<div className='bg-dot-grid relative flex min-h-[26.25rem] items-center justify-center p-6 sm:p-10'>
						{activeTab === 'preview' ? (
							<div className='flex w-full flex-col items-center gap-8'>
								{/* 1. Tilt Card */}
								{component.slug === 'tilt-card' && (
									<TiltCard maxTilt={tiltMax} glare={glare} perspective={1000} className='bg-card border-border w-full max-w-md cursor-pointer border p-8 shadow-2xl'>
										<div className='mb-4 flex items-center justify-between'>
											<span className='kbd text-primary text-3xs font-bold'>INTERACTIVE 3D</span>
											<span className='text-muted-foreground font-mono text-xs'>Max: {tiltMax}°</span>
										</div>
										<h3 className='text-foreground text-2xl font-black tracking-tight'>Tactile 3D Tilt Card</h3>
										<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Move your cursor across this surface. Calculated with 60 FPS spring physics and zero layout re-renders.</p>
										<div className='border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
											<span>Perspective: 1000px</span>
											<span className='font-bold text-emerald-500'>Hardware Accelerated</span>
										</div>
									</TiltCard>
								)}

								{/* 2. Stacking Cards */}
								{component.slug === 'stacking-cards' && (
									<div ref={stackingScrollRef} className='border-border bg-background/50 no-scrollbar relative h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border p-6 shadow-inner'>
										<div className='text-muted-foreground text-2xs mb-6 flex items-center justify-center gap-2 text-center font-mono'>
											<span className='kbd text-3xs'>SCROLL DOWN INSIDE STAGE</span>
											<span>↓</span>
										</div>
										<StackingCards topStart={20} topIncrement={stackOffset} minScale={0.92} scaleThreshold={100} scrollContainerRef={stackingScrollRef}>
											{Array.from({ length: 4 }).map((_, idx) => (
												<div key={idx} className='border-border bg-card/95 rounded-2xl border p-6 shadow-xl backdrop-blur-md'>
													<div className='text-muted-foreground mb-2 flex items-center justify-between font-mono text-xs'>
														<span className='kbd text-3xs'>LAYER 0{idx + 1}</span>
														<span className='text-primary font-bold'>Sticky Stack</span>
													</div>
													<h4 className='text-foreground text-lg font-bold'>Sticky Stacking Card</h4>
													<p className='text-muted-foreground mt-1 text-xs'>Scroll down to observe progressive scale decay and reverse exit scaling.</p>
												</div>
											))}
										</StackingCards>
										<div className='text-muted-foreground flex h-[16.25rem] items-center justify-center font-mono text-xs'>Terminal scroll reached</div>
									</div>
								)}

								{/* 3. Horizontal Scroller */}
								{component.slug === 'horizontal-scroller' && (
									<div ref={horizontalScrollRef} className='border-border bg-background/50 no-scrollbar relative h-[28.75rem] w-full overflow-y-auto rounded-2xl border shadow-inner'>
										<div className='text-muted-foreground text-2xs pointer-events-none sticky top-4 z-20 mb-2 flex items-center justify-center gap-2 text-center font-mono'>
											<span className='kbd bg-card/90 text-3xs shadow-sm'>VERTICAL SCROLL → HORIZONTAL RAIL</span>
											<span>↓</span>
										</div>
										<HorizontalScroller speed={0.85} scrollContainerRef={horizontalScrollRef}>
											{Array.from({ length: 6 }).map((_, idx) => (
												<div key={idx} className='border-border bg-card hover:border-primary w-64 shrink-0 rounded-2xl border p-6 shadow-md transition-all'>
													<span className='kbd text-primary text-3xs'>SLIDE #{idx + 1}</span>
													<h4 className='text-foreground mt-2 text-base font-bold'>Momentum Rail</h4>
													<p className='text-muted-foreground mt-1 text-xs'>Horizontal translation mapped to scroll progress.</p>
												</div>
											))}
										</HorizontalScroller>
									</div>
								)}

								{/* 4. CSS Masonry */}
								{component.slug === 'css-masonry' && (
									<CssMasonry columns={masonryCols} gap={16} className='w-full'>
										{[90, 150, 110, 170, 130, 190].map((h, idx) => (
											<div key={idx} className='border-border bg-card mb-4 break-inside-avoid rounded-xl border p-4 shadow-sm' style={{ height: `${h}px` }}>
												<span className='kbd text-primary text-3xs'>ITEM 0{idx + 1}</span>
												<div className='text-foreground mt-1 text-xs font-bold'>CSS Masonry</div>
												<div className='text-muted-foreground text-3xs'>{h}px</div>
											</div>
										))}
									</CssMasonry>
								)}

								{/* 5. Auto Grid */}
								{component.slug === 'auto-grid' && (
									<AutoGrid minItemWidth={gridMin} gap={16} className='w-full'>
										{Array.from({ length: 6 }).map((_, idx) => (
											<div key={idx} className='border-border bg-card rounded-xl border p-5 shadow-sm'>
												<span className='kbd text-primary text-3xs'>GRID #{idx + 1}</span>
												<div className='text-foreground mt-1 text-sm font-bold'>Auto-Fit Grid</div>
												<div className='text-muted-foreground mt-1 text-xs'>MinMax responsive</div>
											</div>
										))}
									</AutoGrid>
								)}

								{/* 6. Spotlight Card */}
								{component.slug === 'spotlight-card' && (
									<SpotlightCard radius={spotlightRadius} color='rgba(99, 102, 241, 0.25)' borderColor='rgba(99, 102, 241, 0.6)' className='w-full max-w-md p-8 shadow-xl'>
										<div className='flex flex-col gap-3'>
											<span className='kbd text-primary text-3xs'>SPOTLIGHT PRIMITIVE</span>
											<h4 className='text-foreground text-xl font-bold tracking-tight'>Hardware-Accelerated Glow</h4>
											<p className='text-muted-foreground text-sm leading-relaxed'>
												Glide your pointer over this card. Notice the sub-pixel radial edge mask and background sheen driven at 120Hz with zero React re-renders.
											</p>
											<div className='mt-4 flex items-center gap-2'>
												<span className='inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
												<span className='text-muted-foreground font-mono text-xs'>GPU CSS Variables Active</span>
											</div>
										</div>
									</SpotlightCard>
								)}

								{/* 7. Morphing Tabs */}
								{component.slug === 'morphing-tabs' && (
									<div className='w-full max-w-md'>
										<MorphingTabs.Root defaultValue='preview'>
											<MorphingTabs.List className='w-full justify-between'>
												<MorphingTabs.Indicator />
												<MorphingTabs.Trigger value='preview' className='flex-1'>
													Preview
												</MorphingTabs.Trigger>
												<MorphingTabs.Trigger value='code' className='flex-1'>
													Code
												</MorphingTabs.Trigger>
												<MorphingTabs.Trigger value='schema' className='flex-1'>
													Schema
												</MorphingTabs.Trigger>
											</MorphingTabs.List>
											<MorphingTabs.Content value='preview' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
												<div className='text-foreground mb-1 font-bold'>Live Interactive Preview Stage</div>
												<div className='text-muted-foreground text-xs'>The floating indicator tracks active geometry and morphs dynamically using an analytical spring ODE.</div>
											</MorphingTabs.Content>
											<MorphingTabs.Content value='code' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
												<div className='text-foreground mb-1 font-bold'>Generated Universal Syntax</div>
												<div className='text-muted-foreground text-xs'>Compiles across 13 ecosystems with zero external animation dependencies.</div>
											</MorphingTabs.Content>
											<MorphingTabs.Content value='schema' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
												<div className='text-foreground mb-1 font-bold'>WAI-ARIA Accessibility Contract</div>
												<div className='text-muted-foreground text-xs'>Roving tabindex with circular modulo arrow navigation.</div>
											</MorphingTabs.Content>
										</MorphingTabs.Root>
									</div>
								)}

								{/* 8. Accordion */}
								{component.slug === 'accordion' && (
									<div className='w-full max-w-lg'>
										<Accordion.Root mode={accordionMode} defaultValue='faq-1'>
											<Accordion.Item value='faq-1'>
												<Accordion.Trigger>
													<span>How does Exhuma eliminate animation jank?</span>
													<Accordion.Icon />
												</Accordion.Trigger>
												<Accordion.Content>
													Exhuma uses modern CSS Grid 0fr to 1fr interpolation with exact analytical spring differential equations, eliminating layout reflows and max-height timing glitches.
												</Accordion.Content>
											</Accordion.Item>
											<Accordion.Item value='faq-2'>
												<Accordion.Trigger>
													<span>Does this require Framer Motion or GSAP?</span>
													<Accordion.Icon />
												</Accordion.Trigger>
												<Accordion.Content>Zero external dependencies. Every component is 100% handcrafted with pure mathematics, DSA, and native browser APIs.</Accordion.Content>
											</Accordion.Item>
											<Accordion.Item value='faq-3'>
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
									<div className='w-full max-w-2xl overflow-hidden py-4'>
										<InfiniteMarquee speed={marqueeSpeed} pauseOnHover={true} gap='1.5rem'>
											{['120Hz ProMotion Ready', 'Zero External Animation Deps', 'Zero Layout Thrashing', 'Modulo Wrap Arithmetic', '13-Ecosystem Universal', 'Exhuma Kinetic Engine'].map(
												(text, i) => (
													<div key={i} className='border-border bg-card/80 flex shrink-0 items-center gap-2 rounded-xl border px-5 py-3 text-xs font-semibold shadow-xs backdrop-blur-md'>
														<span className='bg-primary h-2 w-2 rounded-full' />
														<span className='text-foreground'>{text}</span>
													</div>
												)
											)}
										</InfiniteMarquee>
									</div>
								)}

								{/* 10. Bento Grid */}
								{component.slug === 'bento-grid' && (
									<div className='w-full max-w-2xl'>
										<BentoGrid cols={3} gap='1rem'>
											<BentoCard colSpan={2}>
												<BentoHeader>
													<span className='kbd text-primary text-3xs'>ANALYTICAL KINETICS</span>
													<h4 className='text-foreground text-base font-bold'>Continuous Math Engine</h4>
												</BentoHeader>
												<BentoContent>Hardware-accelerated CSS custom properties driven directly by requestAnimationFrame loops.</BentoContent>
											</BentoCard>
											<BentoCard colSpan={1}>
												<BentoHeader>
													<span className='kbd text-3xs text-emerald-500'>BIG-OMEGA</span>
													<h4 className='text-foreground text-base font-bold'>Ω(120Hz)</h4>
												</BentoHeader>
												<BentoContent>Guaranteed lower-bound execution.</BentoContent>
											</BentoCard>
											<BentoCard colSpan={1}>
												<BentoHeader>
													<span className='kbd text-3xs text-purple-500'>CROSS-PLATFORM</span>
													<h4 className='text-foreground text-base font-bold'>13 Targets</h4>
												</BentoHeader>
												<BentoContent>Zero runtime dependencies across all targets.</BentoContent>
											</BentoCard>
											<BentoCard colSpan={2}>
												<BentoHeader>
													<span className='kbd text-primary text-3xs'>DENSE AUTO-FLOW</span>
													<h4 className='text-foreground text-base font-bold'>Dynamic Responsive Matrix</h4>
												</BentoHeader>
												<BentoContent>Zero layout shift fluid arrangement on any device.</BentoContent>
											</BentoCard>
										</BentoGrid>
									</div>
								)}

								{/* 11. Diamond Grid */}
								{component.slug === 'diamond-grid' && (
									<div className='w-full max-w-xl py-4'>
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
								)}

								{/* 12. Scroll Timeline */}
								{component.slug === 'scroll-timeline' && (
									<div className='border-border bg-background/50 no-scrollbar relative h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border p-6 shadow-inner'>
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
									<div className='border-border bg-background/50 no-scrollbar relative h-[28.75rem] w-full max-w-md overflow-y-auto rounded-2xl border shadow-inner'>
										<StickyParallaxScroll trackHeight='800px'>
											<div className='relative flex size-full items-center justify-center'>
												<ParallaxLayer speed={-0.4}>
													<div className='text-foreground/20 text-4xl font-extrabold select-none'>BACKGROUND</div>
												</ParallaxLayer>
												<ParallaxLayer speed={0.8}>
													<div className='border-primary/40 bg-card rounded-2xl border p-6 text-center shadow-2xl backdrop-blur-md'>
														<span className='kbd text-primary text-3xs'>DIFFERENTIAL MOMENTUM</span>
														<h4 className='text-foreground mt-1 text-lg font-bold'>Multi-Speed Layers</h4>
														<p className='text-muted-foreground mt-1 text-xs'>Scroll inside stage to observe parallax</p>
													</div>
												</ParallaxLayer>
											</div>
										</StickyParallaxScroll>
									</div>
								)}

								{/* 14. Border Beam */}
								{component.slug === 'border-beam' && (
									<div className='border-border bg-card relative flex h-64 w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 shadow-xl'>
										<span className='kbd text-primary text-3xs'>PERIMETER TRACE</span>
										<h4 className='text-foreground mt-2 text-xl font-bold'>Border Beam</h4>
										<p className='text-muted-foreground mt-1 text-center text-xs'>Conic gradient perimeter trace with sub-pixel exclusion mask and zero-runtime CSS.</p>
										<BorderBeam size={180} duration={borderBeamDuration} borderWidth={2} />
									</div>
								)}

								{/* 15. Animated Sphere */}
								{component.slug === 'animated-sphere' && (
									<div className='flex flex-col items-center justify-center p-4'>
										<AnimatedSphere speed={sphereAscii ? 1.5 : 1.0} radiusScale={0.45} color='#6366f1' className='border-border h-64 w-64 rounded-2xl border bg-black/40 shadow-2xl backdrop-blur-md' />
									</div>
								)}

								{/* 16. Floating Dock */}
								{component.slug === 'floating-dock' && (
									<div className='flex w-full max-w-md flex-col items-center justify-center py-12'>
										<p className='text-muted-foreground mb-6 text-xs'>Hover over icons to experience Gaussian scale distribution</p>
										<FloatingDock
											items={[
												{ title: 'Dashboard', icon: <Terminal className='h-5 w-5' /> },
												{ title: 'Kinetics', icon: <Sliders className='h-5 w-5' /> },
												{ title: 'Hardware', icon: <Cpu className='h-5 w-5' /> },
												{ title: 'Shaders', icon: <Sparkles className='h-5 w-5' /> },
												{ title: 'Security', icon: <ShieldCheck className='h-5 w-5' /> },
											]}
										/>
									</div>
								)}

								{/* 17. Interactive Grid Pattern */}
								{component.slug === 'interactive-grid' && (
									<div className='border-border bg-background relative flex h-[23.75rem] w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 shadow-inner'>
										<InteractiveGridPattern width={32} height={32} squares={[24, 16]} className='mask-[radial-gradient(400px_circle_at_center,white,transparent)] opacity-70' />
										<div className='z-10 flex flex-col items-center text-center'>
											<span className='kbd text-primary text-3xs'>VECTOR KINETICS</span>
											<h4 className='text-foreground mt-1 text-xl font-bold'>Interactive Grid</h4>
											<p className='text-muted-foreground mt-1 max-w-xs text-xs'>Hover over grid squares to trigger hardware-accelerated kinetic active states.</p>
										</div>
									</div>
								)}

								{/* 18. Number Ticker */}
								{component.slug === 'number-ticker' && (
									<div className='border-border bg-card flex flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-lg'>
										<span className='kbd text-primary text-3xs mb-2'>ANALYTICAL EASING (rAF)</span>
										<div className='text-foreground font-mono text-6xl font-black tracking-tight'>
											$<NumberTicker value={tickerValue} decimalPlaces={0} />
										</div>
										<p className='text-muted-foreground mt-3 text-xs'>Continuous ease-out exponential ticker with zero Framer Motion dependencies.</p>
									</div>
								)}

								{/* 19. Magnetic Button */}
								{component.slug === 'magnetic-button' && (
									<div className='flex flex-col items-center justify-center p-12'>
										<p className='text-muted-foreground mb-6 text-xs'>Move cursor near button to feel inverted magnetic pull field</p>
										<MagneticButton
											strength={magneticStrength}
											radius={140}
											className='border-primary/50 bg-primary/10 text-foreground hover:bg-primary/20 rounded-2xl border px-8 py-4 font-bold shadow-xl backdrop-blur-md transition-colors'
										>
											<span className='flex items-center gap-2'>
												<Sparkles className='text-primary h-4 w-4 shrink-0' />
												<span>Magnetic Attraction</span>
											</span>
										</MagneticButton>
									</div>
								)}

								{/* 20. Card Swipe Stack */}
								{component.slug === 'card-swipe-stack' && (
									<div className='flex w-full max-w-sm flex-col items-center py-8'>
										<p className='text-muted-foreground mb-4 text-xs'>Drag card left or right to dismiss with momentum fling</p>
										<CardSwipeStack
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
								)}

								{/* 21. Comparison Slider */}
								{component.slug === 'comparison-slider' && (
									<div className='w-full max-w-md py-4'>
										<ComparisonSlider
											aspectRatio='16/10'
											defaultPosition={sliderPos}
											onPositionChange={setSliderPos}
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
								)}

								{/* 22. Expandable Card */}
								{component.slug === 'expandable-card' && (
									<div className='w-full max-w-sm py-4'>
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
								)}

								{/* 23. Cursor Tooltip */}
								{component.slug === 'cursor-tooltip' && (
									<div className='flex flex-col items-center justify-center p-12'>
										<CursorTooltip
											content='Exhuma Exponential Cursor Smoothing'
											className='border-border bg-card/80 hover:border-primary cursor-pointer rounded-2xl border p-8 text-center shadow-xl transition-colors'
										>
											<span className='kbd text-primary text-3xs mb-2 inline-block'>HOVER OVER CARD</span>
											<h4 className='text-foreground text-xl font-bold'>Interactive Viewport Target</h4>
											<p className='text-muted-foreground mt-1 text-xs'>Hover cursor anywhere over this card to activate the magnetic trailing tooltip.</p>
										</CursorTooltip>
									</div>
								)}

								{/* Quick Live Sliders */}
								<div className='bg-card/90 border-border flex flex-wrap items-center justify-center gap-4 rounded-2xl border p-3 text-xs shadow-md backdrop-blur-md'>
									{component.slug === 'tilt-card' && (
										<>
											<div className='flex items-center gap-2'>
												<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
												<span className='text-muted-foreground text-2xs'>Max Tilt:</span>
												<input type='range' min='5' max='40' value={tiltMax} onChange={(e) => setTiltMax(Number(e.target.value))} className='accent-primary h-1.5 w-24 cursor-pointer' />
												<span className='text-2xs w-6 font-mono font-bold'>{tiltMax}°</span>
											</div>
											<label className='text-muted-foreground hover:text-foreground text-2xs flex cursor-pointer items-center gap-1.5'>
												<input type='checkbox' checked={glare} onChange={(e) => setGlare(e.target.checked)} className='border-border accent-primary cursor-pointer rounded-sm' />
												<span>Glare</span>
											</label>
										</>
									)}

									{component.slug === 'stacking-cards' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Offset:</span>
											<input type='range' min='10' max='40' value={stackOffset} onChange={(e) => setStackOffset(Number(e.target.value))} className='accent-primary h-1.5 w-28 cursor-pointer' />
											<span className='text-2xs w-8 font-mono font-bold'>{stackOffset}px</span>
										</div>
									)}

									{component.slug === 'horizontal-scroller' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Gap:</span>
											<input type='range' min='8' max='32' value={scrollGap} onChange={(e) => setScrollGap(Number(e.target.value))} className='accent-primary h-1.5 w-28 cursor-pointer' />
											<span className='text-2xs w-8 font-mono font-bold'>{scrollGap}px</span>
										</div>
									)}

									{component.slug === 'css-masonry' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Columns:</span>
											<input type='range' min='2' max='4' value={masonryCols} onChange={(e) => setMasonryCols(Number(e.target.value))} className='accent-primary h-1.5 w-20 cursor-pointer' />
											<span className='text-2xs w-4 font-mono font-bold'>{masonryCols}</span>
										</div>
									)}

									{component.slug === 'auto-grid' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Min Width:</span>
											<input type='range' min='150' max='280' value={gridMin} onChange={(e) => setGridMin(Number(e.target.value))} className='accent-primary h-1.5 w-24 cursor-pointer' />
											<span className='text-2xs w-12 font-mono font-bold'>{gridMin}px</span>
										</div>
									)}

									{component.slug === 'spotlight-card' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Radius:</span>
											<input
												type='range'
												min='150'
												max='600'
												step='25'
												value={spotlightRadius}
												onChange={(e) => setSpotlightRadius(Number(e.target.value))}
												className='accent-primary h-1.5 w-28 cursor-pointer'
											/>
											<span className='text-2xs w-10 font-mono font-bold'>{spotlightRadius}px</span>
										</div>
									)}

									{component.slug === 'accordion' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Mode:</span>
											<button
												type='button'
												onClick={() => setAccordionMode((m) => (m === 'single' ? 'multiple' : 'single'))}
												className='kbd hover:border-primary text-2xs cursor-pointer px-2 py-0.5 font-mono transition-colors'
											>
												{accordionMode.toUpperCase()}
											</button>
										</div>
									)}

									{component.slug === 'infinite-marquee' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Speed:</span>
											<input
												type='range'
												min='10'
												max='150'
												step='5'
												value={marqueeSpeed}
												onChange={(e) => setMarqueeSpeed(Number(e.target.value))}
												className='accent-primary h-1.5 w-28 cursor-pointer'
											/>
											<span className='text-2xs w-12 font-mono font-bold'>{marqueeSpeed}px/s</span>
										</div>
									)}

									{component.slug === 'border-beam' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Duration:</span>
											<input
												type='range'
												min='2'
												max='20'
												step='1'
												value={borderBeamDuration}
												onChange={(e) => setBorderBeamDuration(Number(e.target.value))}
												className='accent-primary h-1.5 w-24 cursor-pointer'
											/>
											<span className='text-2xs w-6 font-mono font-bold'>{borderBeamDuration}s</span>
										</div>
									)}

									{component.slug === 'animated-sphere' && (
										<label className='text-muted-foreground hover:text-foreground text-2xs flex cursor-pointer items-center gap-1.5'>
											<input type='checkbox' checked={sphereAscii} onChange={(e) => setSphereAscii(e.target.checked)} className='border-border accent-primary cursor-pointer rounded-sm' />
											<span>ASCII Shader Mode</span>
										</label>
									)}

									{component.slug === 'number-ticker' && (
										<div className='flex items-center gap-2'>
											<button
												type='button'
												onClick={() => setTickerValue((v) => (v === 1000 ? 5420 : 1000))}
												className='kbd hover:border-primary text-2xs cursor-pointer px-2 py-0.5 font-mono transition-colors'
											>
												RETRIGGER ({tickerValue === 1000 ? '-> 5420' : '-> 1000'})
											</button>
										</div>
									)}

									{component.slug === 'magnetic-button' && (
										<div className='flex items-center gap-2'>
											<Sliders className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
											<span className='text-muted-foreground text-2xs'>Strength:</span>
											<input
												type='range'
												min='0.1'
												max='0.8'
												step='0.05'
												value={magneticStrength}
												onChange={(e) => setMagneticStrength(Number(e.target.value))}
												className='accent-primary h-1.5 w-24 cursor-pointer'
											/>
											<span className='text-2xs w-8 font-mono font-bold'>{magneticStrength}</span>
										</div>
									)}
								</div>
							</div>
						) : (
							<div className='w-full space-y-4'>
								{/* Dependency Info & Dual-View Switcher */}
								<div className='border-border bg-card/60 flex flex-col justify-between gap-3 rounded-xl border p-3.5 text-xs shadow-xs sm:flex-row sm:items-center'>
									<div className='flex items-center gap-2.5'>
										<Cpu className='text-primary h-4 w-4 shrink-0' />
										<div className='flex flex-wrap items-center gap-1.5'>
											<span className='text-foreground font-semibold'>Inner Engine:</span>
											<code className='bg-muted text-foreground text-2xs rounded-sm px-2 py-0.5 font-mono'>{selectedFlavor === 'flutter' ? 'exhuma: ^1.0.0' : '@exhuma/core'}</code>
										</div>
									</div>

									<div className='border-border bg-muted/40 flex items-center gap-1 rounded-lg border p-1'>
										<button
											type='button'
											onClick={() => setCodeMode('clean')}
											className={cn(
												'text-2xs cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors',
												codeMode === 'clean' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
											)}
										>
											✨ Clean (Shadcn)
										</button>
										<button
											type='button'
											onClick={() => setCodeMode('ejected')}
											className={cn(
												'text-2xs cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors',
												codeMode === 'ejected' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
											)}
										>
											⚙️ Ejected Engine
										</button>
									</div>
								</div>

								<CodeBlock
									code={generatedCode}
									language={selectedFlavor === 'flutter' ? 'dart' : selectedFlavor === 'blade' ? 'php' : selectedFlavor === 'vue' ? 'vue' : selectedFlavor === 'svelte' ? 'svelte' : 'tsx'}
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
			<section id='props-api' className='border-border space-y-4 border-t pt-4'>
				<div>
					<Badge variant='outline' className='mb-1'>
						API Contract
					</Badge>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Props & Configuration</h2>
					<p className='text-muted-foreground text-xs sm:text-sm'>Every parameter is statically type-checked and validated across all 13 ecosystem target templates.</p>
				</div>

				<div className='border-border bg-card overflow-x-auto rounded-2xl border shadow-xs'>
					<table className='w-full text-left text-xs'>
						<thead className='bg-muted/50 text-muted-foreground border-border text-2xs border-b font-mono tracking-wider uppercase'>
							<tr>
								<th className='px-4 py-3'>Prop</th>
								<th className='px-4 py-3'>Type</th>
								<th className='px-4 py-3'>Default</th>
								<th className='px-4 py-3'>Description</th>
							</tr>
						</thead>
						<tbody className='divide-border divide-y'>
							{component.props.map((p) => (
								<tr key={p.name} className='hover:bg-muted/30 transition-colors'>
									<td className='text-primary px-4 py-3 font-mono font-bold'>{p.name}</td>
									<td className='text-muted-foreground px-4 py-3 font-mono'>{p.type}</td>
									<td className='text-foreground px-4 py-3 font-mono font-semibold'>{String(p.defaultValue)}</td>
									<td className='text-muted-foreground px-4 py-3 leading-relaxed'>{p.description || 'Configures dynamic calculation parameters.'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Architectural Guarantees & Lifecycle Cleanup */}
			<section id='lifecycle-safety' className='border-border space-y-4 border-t pt-4'>
				<div>
					<Badge variant='outline' className='mb-1'>
						Architecture
					</Badge>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Lifecycle Safety & Performance</h2>
					<p className='text-muted-foreground text-xs sm:text-sm'>Designed for high-frequency user interactions with zero memory leaks.</p>
				</div>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<div className='border-border bg-card rounded-xl border p-4 shadow-xs'>
						<div className='text-foreground mb-2 flex items-center gap-2 text-xs font-bold'>
							<ShieldCheck className='h-4 w-4 shrink-0 text-emerald-500' />
							<span>Deterministic Cleanup</span>
						</div>
						<p className='text-muted-foreground text-xs leading-relaxed'>
							All pointer event listeners, scroll handlers, and resize observers are cleanly destroyed on component unmount, preventing lingering background processes.
						</p>
					</div>

					<div className='border-border bg-card rounded-xl border p-4 shadow-xs'>
						<div className='text-foreground mb-2 flex items-center gap-2 text-xs font-bold'>
							<Sparkles className='text-primary h-4 w-4 shrink-0' />
							<span>GPU Compositor Acceleration</span>
						</div>
						<p className='text-muted-foreground text-xs leading-relaxed'>
							Transform and opacity modifications run directly on the GPU compositor thread using <code className='text-foreground text-2xs font-mono'>will-change: transform</code> without triggering
							browser layout recalcs.
						</p>
					</div>
				</div>
			</section>

			{/* Accessibility (a11y) */}
			<section id='accessibility' className='border-border space-y-4 border-t pt-4'>
				<div>
					<Badge variant='outline' className='mb-1'>
						a11y
					</Badge>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Accessibility Considerations</h2>
					<p className='text-muted-foreground text-xs sm:text-sm'>Fully compliant with WCAG guidelines and respects user motion preferences.</p>
				</div>

				<div className='border-border bg-card space-y-3 rounded-2xl border p-5'>
					<div className='text-foreground flex items-center gap-2 text-xs font-bold'>
						<Accessibility className='text-primary h-4 w-4 shrink-0' />
						<span>prefers-reduced-motion Support</span>
					</div>
					<p className='text-muted-foreground text-xs leading-relaxed'>
						When a user has <code className='text-foreground text-2xs font-mono'>prefers-reduced-motion: reduce</code> enabled in their operating system, Exhuma components automatically disable 3D gyroscope
						tilt and spring animations, rendering static accessible content.
					</p>
				</div>
			</section>

			{/* Previous / Next Navigation */}
			<div className='border-border flex flex-col items-stretch justify-between gap-4 border-t pt-8 sm:flex-row sm:items-center'>
				{prevComp ? (
					<Link href={`/docs/components/${prevComp.slug}`} className='border-border hover:bg-muted/50 flex flex-1 items-center gap-3 rounded-xl border p-4 transition-colors'>
						<ArrowLeft className='text-muted-foreground h-4 w-4 shrink-0' />
						<div className='text-left'>
							<div className='text-muted-foreground text-3xs font-mono uppercase'>Previous</div>
							<div className='text-foreground text-xs font-bold'>{prevComp.name}</div>
						</div>
					</Link>
				) : (
					<div className='flex-1' />
				)}

				{nextComp && (
					<Link href={`/docs/components/${nextComp.slug}`} className='border-border hover:bg-muted/50 flex flex-1 items-center justify-end gap-3 rounded-xl border p-4 transition-colors'>
						<div className='text-right'>
							<div className='text-muted-foreground text-3xs font-mono uppercase'>Next</div>
							<div className='text-foreground text-xs font-bold'>{nextComp.name}</div>
						</div>
						<ArrowRight className='text-muted-foreground h-4 w-4 shrink-0' />
					</Link>
				)}
			</div>
		</div>
	);
}
