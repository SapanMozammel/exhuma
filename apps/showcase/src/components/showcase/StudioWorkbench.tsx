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
	Sliders,
	Sparkles,
	RefreshCw,
	Layers,
	Copy,
	Check,
	Laptop,
	Tablet,
	Smartphone,
	Monitor,
	ZoomIn,
	ZoomOut,
	Download,
	Search,
	ChevronRight,
	Grid,
	Maximize2,
	Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
		'Flat Kinetic': { maxTilt: 25, glare: false, maxGlare: 0, scale: 1.06, speed: 400 },
	},
	'css-masonry': {
		Default: { columns: 3, gap: 16, balanceThreshold: 40 },
		Dense: { columns: 4, gap: 8, balanceThreshold: 20 },
		Spacious: { columns: 2, gap: 24, balanceThreshold: 50 },
	},
	'auto-grid': {
		Default: { minItemWidth: 240, gap: 16, autoFit: true },
		'Wide Cards': { minItemWidth: 320, gap: 24, autoFit: true },
		'Compact Grid': { minItemWidth: 180, gap: 12, autoFit: false },
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
			return (
				<div className="w-full max-w-xl mx-auto py-8 px-4">
					{Array.from({ length: 4 }).map((_, idx) => {
						const cardGap = Number(propValues.stackOffset ?? 24);
						const scaleStep = Number(propValues.scaleStep ?? 0.04);
						const scale = 1 - (4 - 1 - idx) * scaleStep;
						return (
							<div
								key={idx}
								className="sticky rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 shadow-xl mb-6 transition-all duration-300"
								style={{
									top: `calc(10% + ${idx * cardGap}px)`,
									transform: `scale(${scale})`,
								}}
							>
								<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
									<span className="kbd text-[10px] uppercase font-bold text-primary">
										STACK LAYER 0{idx + 1}
									</span>
									<span className="text-emerald-500 font-semibold text-[11px]">
										Hardware Accelerated
									</span>
								</div>
								<h4 className="text-xl font-bold tracking-tight text-foreground">
									Autonomous Stacking Card
								</h4>
								<p className="text-xs text-muted-foreground mt-2 leading-relaxed">
									Card stacks with dynamic mathematical scale decay. Zero layout thrashing or parent scroll locking.
								</p>
								<div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
									<span>Offset: {cardGap}px</span>
									<span>Scale: {(scale * 100).toFixed(0)}%</span>
								</div>
							</div>
						);
					})}
				</div>
			);
		}

		if (selectedSlug === 'horizontal-scroller') {
			return (
				<div className="w-full overflow-x-auto py-8 px-4 no-scrollbar">
					<div
						className="flex items-center"
						style={{ gap: `${Number(propValues.gap ?? 16)}px` }}
					>
						{Array.from({ length: 6 }).map((_, idx) => (
							<div
								key={idx}
								className="shrink-0 rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:border-primary/50"
								style={{ width: `${Number(propValues.itemWidth ?? 280)}px` }}
							>
								<div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
									<span className="kbd text-[10px] text-primary">RAIL ITEM #{idx + 1}</span>
									<span className="text-[10px]">Snap Track</span>
								</div>
								<h4 className="text-base font-bold text-foreground mt-1">
									Momentum Scroller
								</h4>
								<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
									Touch and pointer momentum scroll with CSS scroll-snap alignment.
								</p>
							</div>
						))}
					</div>
				</div>
			);
		}

		if (selectedSlug === 'tilt-card') {
			return (
				<div className="flex items-center justify-center p-8">
					<div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/10">
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
							Perspective: {Number(propValues.perspective ?? 1000)}px | Glare Reflection: {Boolean(propValues.glare ?? true) ? 'Active' : 'Disabled'}
						</p>
						<div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
							<span>Physics: Spring Math</span>
							<span className="text-emerald-500 font-semibold">60 FPS Native</span>
						</div>
					</div>
				</div>
			);
		}

		if (selectedSlug === 'css-masonry') {
			return (
				<div
					className="w-full p-6"
					style={{
						columnCount: Number(propValues.columns ?? 3),
						columnGap: `${Number(propValues.gap ?? 16)}px`,
					}}
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
				</div>
			);
		}

		// auto-grid
		return (
			<div
				className="w-full p-6 grid"
				style={{
					gridTemplateColumns: `repeat(auto-fit, minmax(${Number(propValues.minItemWidth ?? 200)}px, 1fr))`,
					gap: `${Number(propValues.gap ?? 16)}px`,
				}}
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
			</div>
		);
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
