'use client';

import * as React from 'react';
import {
	IconEye as Eye,
	IconCode as Code2,
	IconAdjustments as Sliders,
	IconCheck as Check,
	IconCopy as Copy,
	IconTerminal2 as Terminal,
	IconStack2 as Layers,
	IconCpu as Cpu,
	IconSparkles as Sparkles,
	IconArrowRight as ArrowRight,
} from '@tabler/icons-react';
import { CodeBlock } from './CodeBlock';
import { EcosystemPills } from './EcosystemPills';
import { ALL_COMPONENTS, COMPONENT_REGISTRY, EcosystemFlavor, ECOSYSTEM_LABELS } from '@/registry';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { StackingCards, HorizontalScroller, TiltCard } from '@exhuma/cards';
import { CssMasonry, AutoGrid } from '@exhuma/layouts';

export function LandingWorkbench() {
	const [activeComponentSlug, setActiveComponentSlug] = React.useState<string>('tilt-card');
	const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');
	const [selectedFlavor, setSelectedFlavor] = React.useState<EcosystemFlavor>('react');
	const [copied, setCopied] = React.useState(false);

	// Props for the 5 components
	const [tiltMax, setTiltMax] = React.useState(20);
	const [glare, setGlare] = React.useState(true);
	const [stackOffset, setStackOffset] = React.useState(24);
	const [scrollGap, setScrollGap] = React.useState(16);
	const [masonryCols, setMasonryCols] = React.useState(3);
	const [gridMin, setGridMin] = React.useState(200);

	const stackingScrollRef = React.useRef<HTMLDivElement>(null);
	const horizontalScrollRef = React.useRef<HTMLDivElement>(null);

	const activeComponent = COMPONENT_REGISTRY[activeComponentSlug] || ALL_COMPONENTS[0];

	// Synthesize code dynamically
	const generatedCode = React.useMemo(() => {
		const props: Record<string, unknown> = {
			maxTilt: tiltMax,
			glare,
			perspective: 1000,
			stackOffset,
			gap: scrollGap,
			columns: masonryCols,
			minItemWidth: gridMin,
		};
		const files = activeComponent.generateCode(selectedFlavor, props);
		return files[0]?.code || '';
	}, [activeComponent, selectedFlavor, tiltMax, glare, stackOffset, scrollGap, masonryCols, gridMin]);

	const cliCommand = `npx exhuma add ${activeComponentSlug} --flavor=${selectedFlavor}`;

	const copyCli = () => {
		navigator.clipboard.writeText(cliCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

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

	return (
		<div className='border-border bg-card w-full overflow-hidden rounded-3xl border shadow-2xl transition-colors'>
			{/* Top Bar: Component Switcher Segment */}
			<div className='border-border bg-muted/40 flex flex-col items-stretch justify-between gap-3 border-b p-3 sm:flex-row sm:items-center'>
				<div className='no-scrollbar flex items-center gap-1.5 overflow-x-auto'>
					{ALL_COMPONENTS.map((comp) => {
						const isSelected = comp.slug === activeComponentSlug;
						return (
							<button
								key={comp.slug}
								type='button'
								onClick={() => setActiveComponentSlug(comp.slug)}
								className={cn(
									'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
									isSelected ? 'bg-background text-foreground border-border border font-bold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
								)}
							>
								{comp.name}
							</button>
						);
					})}
				</div>

				<div className='flex items-center gap-2 self-end sm:self-auto'>
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
							<span>Live Sandbox</span>
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
							<span>Source Code</span>
						</button>
					</div>
				</div>
			</div>

			{/* Middle Bar: 13 Ecosystem Selector */}
			<div className='border-border bg-background/60 flex flex-col items-start justify-between gap-3 border-b px-4 py-2.5 sm:flex-row sm:items-center'>
				<div className='text-muted-foreground flex items-center gap-2 font-mono text-xs'>
					<Cpu className='text-primary h-3.5 w-3.5' />
					<span>Target Framework:</span>
					<span className='text-foreground font-sans font-bold'>{ECOSYSTEM_LABELS[selectedFlavor]}</span>
				</div>

				{/* 1-Click Copy Badge */}
				<div className='border-border bg-card text-foreground flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs'>
					<Terminal className='text-primary h-3 w-3' />
					<span className='text-muted-foreground max-w-[220px] truncate text-[11px] select-all sm:max-w-none'>{cliCommand}</span>
					<button type='button' onClick={copyCli} className='hover:text-foreground ml-1 cursor-pointer transition-colors' title='Copy CLI command'>
						{copied ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='text-muted-foreground h-3.5 w-3.5' />}
					</button>
				</div>
			</div>

			{/* Ecosystem Pills */}
			<div className='border-border bg-background/30 overflow-x-auto border-b px-4 py-2'>
				<EcosystemPills selectedFlavor={selectedFlavor} onSelectFlavor={setSelectedFlavor} />
			</div>

			{/* Main Canvas Stage */}
			<div className='bg-dot-grid relative flex min-h-[460px] items-center justify-center overflow-hidden p-6 sm:p-10'>
				{activeTab === 'preview' ? (
					<div className='flex w-full flex-col items-center gap-8'>
						{/* Active Component Live Sandbox */}
						{activeComponentSlug === 'tilt-card' && (
							<TiltCard maxTilt={tiltMax} glare={glare} perspective={1000} className='bg-card border-border w-full max-w-md cursor-pointer border p-8 shadow-2xl'>
								<div className='mb-4 flex items-center justify-between'>
									<span className='kbd text-primary text-[10px] font-bold'>INTERACTIVE 3D</span>
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

						{activeComponentSlug === 'stacking-cards' && (
							<div ref={stackingScrollRef} className='border-border bg-background/50 no-scrollbar relative h-[460px] w-full max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-inner'>
								<div className='text-muted-foreground mb-6 flex items-center justify-center gap-2 text-center font-mono text-[11px]'>
									<span className='kbd text-[10px]'>SCROLL DOWN INSIDE STAGE</span>
									<span>↓</span>
								</div>
								<StackingCards topStart={20} topIncrement={stackOffset} minScale={0.92} scaleThreshold={100} scrollContainerRef={stackingScrollRef}>
									{Array.from({ length: 4 }).map((_, idx) => (
										<div key={idx} className='border-border bg-card/95 rounded-2xl border p-6 shadow-xl backdrop-blur-md'>
											<div className='text-muted-foreground mb-2 flex items-center justify-between font-mono text-xs'>
												<span className='kbd text-[10px]'>LAYER 0{idx + 1}</span>
												<span className='text-primary font-bold'>Sticky Stack</span>
											</div>
											<h4 className='text-foreground text-lg font-bold'>Sticky Stacking Card</h4>
											<p className='text-muted-foreground mt-1 text-xs'>Scroll to observe progressive scale decay and reverse exit scaling.</p>
										</div>
									))}
								</StackingCards>
								<div className='text-muted-foreground flex h-[260px] items-center justify-center font-mono text-xs'>Terminal scroll reached</div>
							</div>
						)}

						{activeComponentSlug === 'horizontal-scroller' && (
							<div ref={horizontalScrollRef} className='border-border bg-background/50 no-scrollbar relative h-[460px] w-full overflow-y-auto rounded-2xl border shadow-inner'>
								<div className='text-muted-foreground pointer-events-none sticky top-4 z-20 mb-2 flex items-center justify-center gap-2 text-center font-mono text-[11px]'>
									<span className='kbd bg-card/90 text-[10px] shadow'>VERTICAL SCROLL → HORIZONTAL RAIL</span>
									<span>↓</span>
								</div>
								<HorizontalScroller speed={0.85} scrollContainerRef={horizontalScrollRef}>
									{Array.from({ length: 6 }).map((_, idx) => (
										<div key={idx} className='border-border bg-card hover:border-primary w-64 shrink-0 rounded-2xl border p-6 shadow-md transition-all'>
											<span className='kbd text-primary text-[10px]'>SLIDE #{idx + 1}</span>
											<h4 className='text-foreground mt-2 text-base font-bold'>Momentum Rail</h4>
											<p className='text-muted-foreground mt-1 text-xs'>Horizontal translation mapped to scroll progress.</p>
										</div>
									))}
								</HorizontalScroller>
							</div>
						)}

						{activeComponentSlug === 'css-masonry' && (
							<CssMasonry columns={masonryCols} gap={16} className='w-full'>
								{[100, 160, 120, 180, 140, 200].map((h, idx) => (
									<div key={idx} className='border-border bg-card mb-4 break-inside-avoid rounded-xl border p-4 shadow-sm' style={{ height: `${h}px` }}>
										<span className='kbd text-primary text-[10px]'>ITEM 0{idx + 1}</span>
										<div className='text-foreground mt-1 text-xs font-bold'>CSS Masonry</div>
										<div className='text-muted-foreground text-[10px]'>{h}px</div>
									</div>
								))}
							</CssMasonry>
						)}

						{activeComponentSlug === 'auto-grid' && (
							<AutoGrid minItemWidth={gridMin} gap={16} className='w-full'>
								{Array.from({ length: 6 }).map((_, idx) => (
									<div key={idx} className='border-border bg-card rounded-xl border p-5 shadow-sm'>
										<span className='kbd text-primary text-[10px]'>GRID #{idx + 1}</span>
										<div className='text-foreground mt-1 text-sm font-bold'>Auto-Fit Grid</div>
										<div className='text-muted-foreground mt-1 text-xs'>MinMax responsive</div>
									</div>
								))}
							</AutoGrid>
						)}

						{/* Live Interactive Parameter Sliders */}
						<div className='bg-card/90 border-border flex flex-wrap items-center justify-center gap-4 rounded-2xl border p-3 text-xs shadow-md backdrop-blur-md'>
							{activeComponentSlug === 'tilt-card' && (
								<>
									<div className='flex items-center gap-2'>
										<Sliders className='text-muted-foreground h-3.5 w-3.5' />
										<span className='text-muted-foreground text-[11px]'>Max Tilt:</span>
										<input type='range' min='5' max='40' value={tiltMax} onChange={(e) => setTiltMax(Number(e.target.value))} className='accent-primary h-1.5 w-24 cursor-pointer' />
										<span className='w-6 font-mono text-[11px] font-bold'>{tiltMax}°</span>
									</div>
									<label className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-[11px]'>
										<input type='checkbox' checked={glare} onChange={(e) => setGlare(e.target.checked)} className='border-border accent-primary cursor-pointer rounded' />
										<span>Glare</span>
									</label>
								</>
							)}

							{activeComponentSlug === 'stacking-cards' && (
								<div className='flex items-center gap-2'>
									<Sliders className='text-muted-foreground h-3.5 w-3.5' />
									<span className='text-muted-foreground text-[11px]'>Offset:</span>
									<input type='range' min='10' max='40' value={stackOffset} onChange={(e) => setStackOffset(Number(e.target.value))} className='accent-primary h-1.5 w-28 cursor-pointer' />
									<span className='w-8 font-mono text-[11px] font-bold'>{stackOffset}px</span>
								</div>
							)}

							{activeComponentSlug === 'horizontal-scroller' && (
								<div className='flex items-center gap-2'>
									<Sliders className='text-muted-foreground h-3.5 w-3.5' />
									<span className='text-muted-foreground text-[11px]'>Gap:</span>
									<input type='range' min='8' max='32' value={scrollGap} onChange={(e) => setScrollGap(Number(e.target.value))} className='accent-primary h-1.5 w-28 cursor-pointer' />
									<span className='w-8 font-mono text-[11px] font-bold'>{scrollGap}px</span>
								</div>
							)}

							{activeComponentSlug === 'css-masonry' && (
								<div className='flex items-center gap-2'>
									<Sliders className='text-muted-foreground h-3.5 w-3.5' />
									<span className='text-muted-foreground text-[11px]'>Columns:</span>
									<input type='range' min='2' max='4' value={masonryCols} onChange={(e) => setMasonryCols(Number(e.target.value))} className='accent-primary h-1.5 w-20 cursor-pointer' />
									<span className='w-4 font-mono text-[11px] font-bold'>{masonryCols}</span>
								</div>
							)}

							{activeComponentSlug === 'auto-grid' && (
								<div className='flex items-center gap-2'>
									<Sliders className='text-muted-foreground h-3.5 w-3.5' />
									<span className='text-muted-foreground text-[11px]'>Min Width:</span>
									<input type='range' min='150' max='280' value={gridMin} onChange={(e) => setGridMin(Number(e.target.value))} className='accent-primary h-1.5 w-24 cursor-pointer' />
									<span className='w-12 font-mono text-[11px] font-bold'>{gridMin}px</span>
								</div>
							)}

							<Link href={`/studio?slug=${activeComponentSlug}`} className='text-primary ml-2 flex items-center gap-1 text-[11px] font-bold hover:underline'>
								<span>Full Studio IDE</span>
								<ArrowRight className='h-3 w-3' />
							</Link>
						</div>
					</div>
				) : (
					<div className='w-full max-w-3xl'>
						<CodeBlock
							code={generatedCode}
							language={selectedFlavor === 'flutter' ? 'dart' : selectedFlavor === 'blade' ? 'php' : selectedFlavor === 'vue' ? 'vue' : selectedFlavor === 'svelte' ? 'svelte' : 'tsx'}
							filename={`${activeComponent.name.replace(/\s+/g, '')}.${
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
	);
}

export default LandingWorkbench;
