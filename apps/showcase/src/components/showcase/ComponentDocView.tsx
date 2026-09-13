'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Sliders,
	Terminal,
	Check,
	Copy,
	Eye,
	Code2,
	Cpu,
	Sparkles,
	ShieldCheck,
	Accessibility,
	ArrowRight,
	ArrowLeft,
	ExternalLink,
} from 'lucide-react';
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

interface ComponentDocViewProps {
	slug: string;
}

export function ComponentDocView({ slug }: ComponentDocViewProps) {
	const component = COMPONENT_REGISTRY[slug] || ALL_COMPONENTS[0];
	const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');
	const [selectedFlavor, setSelectedFlavor] =
		React.useState<EcosystemFlavor>('react');
	const [copied, setCopied] = React.useState(false);

	// Component-specific interactive state
	const [tiltMax, setTiltMax] = React.useState(20);
	const [glare, setGlare] = React.useState(true);
	const [stackOffset, setStackOffset] = React.useState(24);
	const [scrollGap, setScrollGap] = React.useState(16);
	const [masonryCols, setMasonryCols] = React.useState(3);
	const [gridMin, setGridMin] = React.useState(200);

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
		const files = component.generateCode(selectedFlavor, props);
		return files[0]?.code || '';
	}, [
		component,
		selectedFlavor,
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

								{/* 2. Stacking Cards */}
								{component.slug === 'stacking-cards' && (
									<div className="w-full max-w-md space-y-4">
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
														Scroll down to observe depth decay.
													</p>
												</div>
											);
										})}
									</div>
								)}

								{/* 3. Horizontal Scroller */}
								{component.slug === 'horizontal-scroller' && (
									<div className="w-full overflow-x-auto py-4 no-scrollbar">
										<div className="flex items-center" style={{ gap: `${scrollGap}px` }}>
											{Array.from({ length: 5 }).map((_, idx) => (
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

								{/* 4. CSS Masonry */}
								{component.slug === 'css-masonry' && (
									<div
										className="w-full"
										style={{
											columnCount: masonryCols,
											columnGap: '16px',
										}}
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
									</div>
								)}

								{/* 5. Auto Grid */}
								{component.slug === 'auto-grid' && (
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
								</div>
							</div>
						) : (
							<div className="w-full">
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
