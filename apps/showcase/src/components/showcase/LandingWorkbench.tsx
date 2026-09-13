'use client';

import * as React from 'react';
import {
	Eye,
	Code2,
	Sliders,
	Check,
	Copy,
	Terminal,
	Layers,
	Cpu,
	Sparkles,
	ArrowRight,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { EcosystemPills } from './EcosystemPills';
import {
	ALL_COMPONENTS,
	COMPONENT_REGISTRY,
	EcosystemFlavor,
	ECOSYSTEM_LABELS,
} from '@/registry';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function LandingWorkbench() {
	const [activeComponentSlug, setActiveComponentSlug] =
		React.useState<string>('tilt-card');
	const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');
	const [selectedFlavor, setSelectedFlavor] =
		React.useState<EcosystemFlavor>('react');
	const [copied, setCopied] = React.useState(false);

	// Props for the 5 components
	const [tiltMax, setTiltMax] = React.useState(20);
	const [glare, setGlare] = React.useState(true);
	const [stackOffset, setStackOffset] = React.useState(24);
	const [scrollGap, setScrollGap] = React.useState(16);
	const [masonryCols, setMasonryCols] = React.useState(3);
	const [gridMin, setGridMin] = React.useState(200);

	const activeComponent =
		COMPONENT_REGISTRY[activeComponentSlug] || ALL_COMPONENTS[0];

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
	}, [
		activeComponent,
		selectedFlavor,
		tiltMax,
		glare,
		stackOffset,
		scrollGap,
		masonryCols,
		gridMin,
	]);

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

	return (
		<div className="w-full rounded-3xl border border-border bg-card shadow-2xl overflow-hidden transition-colors">
			{/* Top Bar: Component Switcher Segment */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border bg-muted/40 p-3">
				<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
					{ALL_COMPONENTS.map((comp) => {
						const isSelected = comp.slug === activeComponentSlug;
						return (
							<button
								key={comp.slug}
								type="button"
								onClick={() => setActiveComponentSlug(comp.slug)}
								className={cn(
									'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
									isSelected
										? 'bg-background text-foreground font-bold shadow-xs border border-border'
										: 'text-muted-foreground hover:bg-accent hover:text-foreground'
								)}
							>
								{comp.name}
							</button>
						);
					})}
				</div>

				<div className="flex items-center gap-2 self-end sm:self-auto">
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
							<span>Live Sandbox</span>
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
							<span>Source Code</span>
						</button>
					</div>
				</div>
			</div>

			{/* Middle Bar: 13 Ecosystem Selector */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-2.5">
				<div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
					<Cpu className="h-3.5 w-3.5 text-primary" />
					<span>Target Framework:</span>
					<span className="text-foreground font-bold font-sans">
						{ECOSYSTEM_LABELS[selectedFlavor]}
					</span>
				</div>

				{/* 1-Click Copy Badge */}
				<div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground">
					<Terminal className="h-3 w-3 text-primary" />
					<span className="text-[11px] text-muted-foreground truncate select-all max-w-[220px] sm:max-w-none">
						{cliCommand}
					</span>
					<button
						type="button"
						onClick={copyCli}
						className="ml-1 cursor-pointer hover:text-foreground transition-colors"
						title="Copy CLI command"
					>
						{copied ? (
							<Check className="h-3.5 w-3.5 text-emerald-500" />
						) : (
							<Copy className="h-3.5 w-3.5 text-muted-foreground" />
						)}
					</button>
				</div>
			</div>

			{/* Ecosystem Pills */}
			<div className="border-b border-border bg-background/30 px-4 py-2 overflow-x-auto">
				<EcosystemPills
					selectedFlavor={selectedFlavor}
					onSelectFlavor={setSelectedFlavor}
				/>
			</div>

			{/* Main Canvas Stage */}
			<div className="min-h-[460px] p-6 sm:p-10 flex items-center justify-center bg-dot-grid relative overflow-hidden">
				{activeTab === 'preview' ? (
					<div className="w-full flex flex-col items-center gap-8">
						{/* Active Component Live Sandbox */}
						{activeComponentSlug === 'tilt-card' && (
							<div
								onMouseMove={handleMouseMoveTilt}
								onMouseLeave={handleMouseLeaveTilt}
								style={{
									transform: tiltTransform,
									transition: 'transform 120ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
									transformStyle: 'preserve-3d',
								}}
								className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl cursor-pointer overflow-hidden transition-colors"
							>
								{glare && (
									<div
										className="pointer-events-none absolute inset-0 transition-opacity duration-200"
										style={{
											opacity: glareCoord.opacity,
											background: `radial-gradient(circle at ${glareCoord.x}% ${glareCoord.y}%, rgba(255,255,255,0.45) 0%, transparent 60%)`,
										}}
									/>
								)}
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
							</div>
						)}

						{activeComponentSlug === 'stacking-cards' && (
							<div className="w-full max-w-lg space-y-4">
								{Array.from({ length: 3 }).map((_, idx) => {
									const scale = 1 - (3 - 1 - idx) * 0.05;
									return (
										<div
											key={idx}
											className="sticky rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 shadow-xl transition-all"
											style={{
												top: `calc(10% + ${idx * stackOffset}px)`,
												transform: `scale(${scale})`,
											}}
										>
											<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
												<span className="kbd text-[10px]">LAYER 0{idx + 1}</span>
												<span className="text-primary font-bold">Sticky Stack</span>
											</div>
											<h4 className="text-lg font-bold text-foreground">
												Sticky Stacking Card
											</h4>
											<p className="text-xs text-muted-foreground mt-1">
												Scroll to test stacking scale decay.
											</p>
										</div>
									);
								})}
							</div>
						)}

						{activeComponentSlug === 'horizontal-scroller' && (
							<div className="w-full overflow-x-auto py-4 no-scrollbar">
								<div className="flex items-center" style={{ gap: `${scrollGap}px` }}>
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
												Scroll snap alignment.
											</p>
										</div>
									))}
								</div>
							</div>
						)}

						{activeComponentSlug === 'css-masonry' && (
							<div
								className="w-full"
								style={{
									columnCount: masonryCols,
									columnGap: '16px',
								}}
							>
								{[100, 160, 120, 180, 140, 200].map((h, idx) => (
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
							</div>
						)}

						{activeComponentSlug === 'auto-grid' && (
							<div
								className="w-full grid"
								style={{
									gridTemplateColumns: `repeat(auto-fit, minmax(${gridMin}px, 1fr))`,
									gap: '16px',
								}}
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
							</div>
						)}

						{/* Live Interactive Parameter Sliders */}
						<div className="flex flex-wrap items-center justify-center gap-4 bg-card/90 backdrop-blur-md border border-border rounded-2xl p-3 shadow-md text-xs">
							{activeComponentSlug === 'tilt-card' && (
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

							{activeComponentSlug === 'stacking-cards' && (
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

							{activeComponentSlug === 'horizontal-scroller' && (
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

							{activeComponentSlug === 'css-masonry' && (
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

							{activeComponentSlug === 'auto-grid' && (
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

							<Link
								href={`/studio?slug=${activeComponentSlug}`}
								className="text-primary hover:underline font-bold text-[11px] flex items-center gap-1 ml-2"
							>
								<span>Full Studio IDE</span>
								<ArrowRight className="h-3 w-3" />
							</Link>
						</div>
					</div>
				) : (
					<div className="w-full max-w-3xl">
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
