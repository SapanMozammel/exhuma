'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Sparkles,
	Sliders,
	ExternalLink,
	Eye,
	Layers,
	Cpu,
	Code2,
	Check,
	Copy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ShowcaseProject {
	id: string;
	title: string;
	tagline: string;
	description: string;
	framework: string;
	category: 'dashboards' | 'devtools' | 'mobile' | 'creative';
	components: string[];
	demoSlug: string;
	gradient: string;
	author: string;
}

const PROJECTS: ShowcaseProject[] = [
	{
		id: 'linear-workspace',
		title: 'Linear Issue Workspace',
		tagline: 'Tactile Project Management Board',
		description:
			'A high-density sprint planning board leveraging Sticky Stacking Cards and Horizontal Momentum Rails for rapid issue triage.',
		framework: 'Next.js 15',
		category: 'dashboards',
		components: ['stacking-cards', 'horizontal-scroller'],
		demoSlug: 'stacking-cards',
		gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
		author: 'Exhuma Labs',
	},
	{
		id: 'raycast-launcher',
		title: 'Raycast Command Hub',
		tagline: 'Keyboard-Driven Palette Interface',
		description:
			'An ultra-responsive desktop launcher using 3D Tilt Cards with 60 FPS gyroscope spring physics and zero layout recalculation.',
		framework: 'React 19',
		category: 'devtools',
		components: ['tilt-card'],
		demoSlug: 'tilt-card',
		gradient: 'from-red-600/20 via-amber-600/10 to-transparent',
		author: 'Sapan Mozammel',
	},
	{
		id: 'figma-token-studio',
		title: 'Figma Token Explorer',
		tagline: 'Design System Variable Visualizer',
		description:
			'A dynamic CSS Masonry layout engine rendering multi-column color swatches, typography scales, and spring curves without DOM thrashing.',
		framework: 'Vue 3 / Nuxt',
		category: 'creative',
		components: ['css-masonry'],
		demoSlug: 'css-masonry',
		gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
		author: 'Design Eng Group',
	},
	{
		id: 'svelte-runes-console',
		title: 'Runes Analytics Console',
		tagline: 'Zero-Runtime Reactive Dashboard',
		description:
			'A modern responsive analytics workspace authored with Svelte 5 Runes and Auto-Fit MinMax responsive grid architecture.',
		framework: 'Svelte 5',
		category: 'dashboards',
		components: ['auto-grid', 'tilt-card'],
		demoSlug: 'auto-grid',
		gradient: 'from-orange-600/20 via-amber-600/10 to-transparent',
		author: 'Svelte Community',
	},
	{
		id: 'flutter-tactile-shell',
		title: 'Flutter Tactile Shell',
		tagline: 'Native Mobile Interaction Sandbox',
		description:
			'Pure Dart and Flutter StatefulWidget implementation of 3D tilt cards and smooth momentum horizontal list snapping for iOS & Android.',
		framework: 'Flutter (Dart)',
		category: 'mobile',
		components: ['tilt-card', 'horizontal-scroller'],
		demoSlug: 'tilt-card',
		gradient: 'from-cyan-600/20 via-sky-600/10 to-transparent',
		author: 'Mobile Craftsmen',
	},
	{
		id: 'astro-docs-engine',
		title: 'Astro Content Platform',
		tagline: 'High-Performance Static Documentation',
		description:
			'Zero-JS static site generation paired with Exhuma horizontal navigation rails and auto-grid layout specifications.',
		framework: 'Astro',
		category: 'devtools',
		components: ['horizontal-scroller', 'auto-grid'],
		demoSlug: 'horizontal-scroller',
		gradient: 'from-purple-600/20 via-pink-600/10 to-transparent',
		author: 'Astro Creators',
	},
];

type CategoryFilter = 'all' | 'dashboards' | 'devtools' | 'mobile' | 'creative';

export default function ShowcasePage() {
	const [activeFilter, setActiveFilter] = React.useState<CategoryFilter>('all');
	const [previewProject, setPreviewProject] =
		React.useState<ShowcaseProject | null>(null);

	const filteredProjects = React.useMemo(() => {
		if (activeFilter === 'all') return PROJECTS;
		return PROJECTS.filter((p) => p.category === activeFilter);
	}, [activeFilter]);

	return (
		<div className="container py-12 sm:py-16 space-y-12">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div className="max-w-2xl space-y-4">
					<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
						<Sparkles className="h-3.5 w-3.5 text-primary" />
						<span>Ecosystem In Action</span>
					</div>
					<h1 className="text-heading-xlarge text-foreground tracking-tight">
						Showcase
					</h1>
					<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
						Discover production applications, design systems, and developer tools built with Exhuma universal component architecture.
					</p>
				</div>

				<Link href="/studio">
					<Button className="gap-2 shrink-0 shadow-sm">
						<Sliders className="h-4 w-4" />
						<span>Open Studio Workbench</span>
					</Button>
				</Link>
			</div>

			{/* Filter Pills Bar */}
			<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
				{[
					{ id: 'all', label: 'All Projects' },
					{ id: 'dashboards', label: 'Dashboards' },
					{ id: 'devtools', label: 'Developer Tools' },
					{ id: 'mobile', label: 'Mobile & Native' },
					{ id: 'creative', label: 'Creative & Design' },
				].map((tab) => {
					const isActive = activeFilter === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveFilter(tab.id as CategoryFilter)}
							className={cn(
								'whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
								isActive
									? 'bg-primary text-primary-foreground font-semibold shadow-xs'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Project Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProjects.map((project) => (
					<div
						key={project.id}
						className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-all hover:shadow-xl relative overflow-hidden"
					>
						{/* Gradient Glow */}
						<div
							className={cn(
								'absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity bg-gradient-to-br',
								project.gradient
							)}
						/>

						<div className="space-y-4 relative">
							<div className="flex items-center justify-between gap-2">
								<Badge variant="outline" className="text-[10px] font-mono">
									{project.framework}
								</Badge>
								<span className="text-[11px] font-mono text-muted-foreground">
									{project.author}
								</span>
							</div>

							<div>
								<div className="text-[11px] font-bold uppercase tracking-wider text-primary font-mono">
									{project.tagline}
								</div>
								<h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight mt-1">
									{project.title}
								</h3>
							</div>

							<p className="text-xs text-muted-foreground leading-relaxed">
								{project.description}
							</p>

							{/* Components Used */}
							<div className="pt-2 flex flex-wrap gap-1.5">
								{project.components.map((comp) => (
									<Link
										key={comp}
										href={`/docs/components/${comp}`}
										className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-0.5 text-[10px] font-mono text-foreground hover:bg-accent transition-colors"
									>
										<Layers className="h-3 w-3 text-primary" />
										<span>{comp}</span>
									</Link>
								))}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="pt-6 mt-6 border-t border-border flex items-center justify-between gap-2 relative">
							<Link
								href={`/studio?slug=${project.demoSlug}`}
								className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
							>
								<span>Inspect in Studio</span>
								<ExternalLink className="h-3 w-3" />
							</Link>

							<Link href={`/docs/components/${project.demoSlug}`}>
								<Button variant="outline" size="sm" className="h-7 text-[11px]">
									View Docs
								</Button>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
