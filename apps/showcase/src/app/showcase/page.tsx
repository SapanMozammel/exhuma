'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	IconSparkles as Sparkles,
	IconAdjustments as Sliders,
	IconExternalLink as ExternalLink,
	IconEye as Eye,
	IconStack2 as Layers,
	IconCpu as Cpu,
	IconCode as Code2,
	IconCheck as Check,
	IconCopy as Copy,
} from '@tabler/icons-react';
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
		description: 'A high-density sprint planning board leveraging Sticky Stacking Cards and Horizontal Momentum Rails for rapid issue triage.',
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
		description: 'An ultra-responsive desktop launcher using 3D Tilt Cards with 60 FPS gyroscope spring physics and zero layout recalculation.',
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
		description: 'A dynamic CSS Masonry layout engine rendering multi-column color swatches, typography scales, and spring curves without DOM thrashing.',
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
		description: 'A modern responsive analytics workspace authored with Svelte 5 Runes and Auto-Fit MinMax responsive grid architecture.',
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
		description: 'Pure Dart and Flutter StatefulWidget implementation of 3D tilt cards and smooth momentum horizontal list snapping for iOS & Android.',
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
		description: 'Zero-JS static site generation paired with Exhuma horizontal navigation rails and auto-grid layout specifications.',
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
	const [previewProject, setPreviewProject] = React.useState<ShowcaseProject | null>(null);

	const filteredProjects = React.useMemo(() => {
		if (activeFilter === 'all') return PROJECTS;
		return PROJECTS.filter((p) => p.category === activeFilter);
	}, [activeFilter]);

	return (
		<div className='container space-y-12 py-12 sm:py-16'>
			{/* Header */}
			<div className='flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
				<div className='max-w-2xl space-y-4'>
					<div className='border-border bg-muted/60 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold backdrop-blur-md'>
						<Sparkles className='text-primary h-3.5 w-3.5 shrink-0' />
						<span>Ecosystem In Action</span>
					</div>
					<h1 className='text-heading-xlarge text-foreground tracking-tight'>Showcase</h1>
					<p className='text-muted-foreground text-base leading-relaxed sm:text-lg'>Discover production applications, design systems, and developer tools built with Exhuma universal component architecture.</p>
				</div>

				<Link href='/docs/components'>
					<Button className='shrink-0 gap-2 shadow-sm'>
						<Sliders className='h-4 w-4' />
						<span>Interactive Playground</span>
					</Button>
				</Link>
			</div>

			{/* Filter Pills Bar */}
			<div className='border-border flex items-center gap-2 overflow-x-auto border-b pb-2'>
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
							type='button'
							onClick={() => setActiveFilter(tab.id as CategoryFilter)}
							className={cn(
								'cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
								isActive ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Project Grid */}
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{filteredProjects.map((project) => (
					<div
						key={project.id}
						className='group border-border bg-card hover:border-primary/50 relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-xl'
					>
						{/* Gradient Glow */}
						<div className={cn('pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-linear-to-br opacity-40 blur-3xl transition-opacity group-hover:opacity-70', project.gradient)} />

						<div className='relative space-y-4'>
							<div className='flex items-center justify-between gap-2'>
								<Badge variant='outline' className='text-3xs font-mono'>
									{project.framework}
								</Badge>
								<span className='text-muted-foreground text-2xs font-mono'>{project.author}</span>
							</div>

							<div>
								<div className='text-primary text-2xs font-mono font-bold tracking-wider uppercase'>{project.tagline}</div>
								<h3 className='text-foreground group-hover:text-primary mt-1 text-xl font-extrabold tracking-tight transition-colors'>{project.title}</h3>
							</div>

							<p className='text-muted-foreground text-xs leading-relaxed'>{project.description}</p>

							{/* Components Used */}
							<div className='flex flex-wrap gap-1.5 pt-2'>
								{project.components.map((comp) => (
									<Link
										key={comp}
										href={`/docs/components/${comp}`}
										className='bg-muted/70 text-foreground hover:bg-accent text-3xs inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono transition-colors'
									>
										<Layers className='text-primary h-3 w-3 shrink-0' />
										<span>{comp}</span>
									</Link>
								))}
							</div>
						</div>

						{/* Action Buttons */}
						<div className='border-border relative mt-6 flex items-center justify-between gap-2 border-t pt-6'>
							<Link href={`/docs/components/${project.demoSlug}`} className='text-primary flex items-center gap-1 text-xs font-semibold hover:underline'>
								<span>Interactive Playground</span>
								<ExternalLink className='h-3 w-3' />
							</Link>

							<Link href={`/docs/components/${project.demoSlug}`}>
								<Button variant='outline' size='sm' className='text-2xs h-7'>
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
