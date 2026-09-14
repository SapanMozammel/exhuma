import React from 'react';
import Link from 'next/link';
import {
  IconAdjustments as Sliders,
  IconArrowRight as ArrowRight,
  IconStack2 as Layers,
  IconBox as Box,
  IconCpu as Cpu,
} from '@tabler/icons-react';
import { ALL_COMPONENTS, CATEGORIES } from '@/registry';
import { ComponentCard } from '@/components/showcase/ComponentCard';
import { PackageManagerTabs } from '@/components/showcase/PackageManagerTabs';
import { DocsToc } from '@/components/layout/DocsToc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tocItems = [
	{ id: 'overview', title: 'Component Overview' },
	{ id: 'cards', title: 'Tactile Cards & Interactions' },
	{ id: 'layouts', title: 'Responsive Layout Engines' },
	{ id: 'navigation', title: 'Navigation & Rails' },
	{ id: 'primitives', title: 'Kinetic Primitives & Disclosures' },
	{ id: 'quick-add', title: 'CLI Quick Add' },
];

export default function ComponentsHubPage() {
	const cards = ALL_COMPONENTS.filter((c) => c.category === 'cards');
	const layouts = ALL_COMPONENTS.filter((c) => c.category === 'layouts');
	const navigation = ALL_COMPONENTS.filter((c) => c.category === 'navigation');
	const primitives = ALL_COMPONENTS.filter((c) => c.category === 'primitives');

	return (
		<div className="flex gap-10">
			<div className="flex-1 min-w-0 space-y-10 max-w-4xl">
				{/* Breadcrumb & Header */}
				<div>
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
						<Link href="/docs" className="hover:text-foreground transition-colors">
							Documentation
						</Link>
						<span>/</span>
						<span className="text-foreground font-semibold">Components</span>
					</div>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
								Canonical Components
							</h1>
							<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
								23 core interaction systems, layout engines, and kinetic primitives. Every component is authored natively into 13 production framework contracts.
							</p>
						</div>
						<Link href="/studio">
							<Button variant="outline" size="sm" className="gap-2 shrink-0">
								<Sliders className="h-3.5 w-3.5" />
								<span>Open Studio</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Quick Add Bar */}
				<section id="quick-add" className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2 text-xs font-bold text-foreground">
							<Cpu className="h-4 w-4 text-primary" />
							<span>Install Any Component via CLI</span>
						</div>
						<span className="text-[11px] font-mono text-muted-foreground">13 Targets Supported</span>
					</div>
					<PackageManagerTabs command="exhuma add tilt-card" />
				</section>

				{/* Cards Category */}
				<section id="cards" className="space-y-4 pt-4 border-t border-border">
					<div className="flex items-center justify-between">
						<div>
							<Badge variant="outline" className="mb-1">Category</Badge>
							<h2 className="text-xl font-bold tracking-tight text-foreground">
								Tactile Cards & Interactions
							</h2>
							<p className="text-xs sm:text-sm text-muted-foreground">
								High-frequency pointer mathematics, 3D perspective gyroscopes, and sticky depth interpolation.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
						{cards.map((comp) => (
							<ComponentCard
								key={comp.slug}
								slug={comp.slug}
								name={comp.name}
								category={comp.category}
								description={comp.description}
							/>
						))}
					</div>
				</section>

				{/* Layouts Category */}
				<section id="layouts" className="space-y-4 pt-6 border-t border-border">
					<div>
						<Badge variant="outline" className="mb-1">Category</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Responsive Layout Engines
						</h2>
						<p className="text-xs sm:text-sm text-muted-foreground">
							CSS multi-column masonry with zero layout thrashing, and mathematical auto-fit minmax responsive grid systems.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
						{layouts.map((comp) => (
							<ComponentCard
								key={comp.slug}
								slug={comp.slug}
								name={comp.name}
								category={comp.category}
								description={comp.description}
							/>
						))}
					</div>
				</section>

				{/* Navigation Category */}
				<section id="navigation" className="space-y-4 pt-6 border-t border-border">
					<div>
						<Badge variant="outline" className="mb-1">Category</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Navigation & Rails
						</h2>
						<p className="text-xs sm:text-sm text-muted-foreground">
							Dynamic momentum horizontal rail scrolling with native snap points and wheel-scroll translation.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
						{navigation.map((comp) => (
							<ComponentCard
								key={comp.slug}
								slug={comp.slug}
								name={comp.name}
								category={comp.category}
								description={comp.description}
							/>
						))}
					</div>
				</section>

				{/* Primitives Category */}
				<section id="primitives" className="space-y-4 pt-6 border-t border-border">
					<div>
						<Badge variant="outline" className="mb-1">Category</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Kinetic Primitives & Disclosures
						</h2>
						<p className="text-xs sm:text-sm text-muted-foreground">
							Self-contained dynamic primitives, mathematical springs, coordinate projections, and zero-layout-shift kinetic transitions.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
						{primitives.map((comp) => (
							<ComponentCard
								key={comp.slug}
								slug={comp.slug}
								name={comp.name}
								category={comp.category}
								description={comp.description}
							/>
						))}
					</div>
				</section>
			</div>

			{/* On This Page TOC */}
			<DocsToc items={tocItems} />
		</div>
	);
}
