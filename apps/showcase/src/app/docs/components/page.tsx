import React from 'react';
import Link from 'next/link';
import { IconAdjustments as Sliders, IconArrowRight as ArrowRight, IconStack2 as Layers, IconBox as Box, IconCpu as Cpu } from '@tabler/icons-react';
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
		<div className='flex gap-10'>
			<div className='max-w-4xl min-w-0 flex-1 space-y-10'>
				{/* Breadcrumb & Header */}
				<div>
					<div className='text-muted-foreground mb-2 flex items-center gap-2 font-mono text-xs'>
						<Link href='/docs' className='hover:text-foreground transition-colors'>
							Documentation
						</Link>
						<span>/</span>
						<span className='text-foreground font-semibold'>Components</span>
					</div>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<h1 className='text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl'>Canonical Components</h1>
							<p className='text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base'>
								23 core interaction systems, layout engines, and kinetic primitives. Every component is authored natively into 13 production framework contracts.
							</p>
						</div>
						<Link href='/studio'>
							<Button variant='outline' size='sm' className='shrink-0 gap-2'>
								<Sliders className='h-3.5 w-3.5' />
								<span>Open Studio</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Quick Add Bar */}
				<section id='quick-add' className='border-border bg-card rounded-2xl border p-4 shadow-xs sm:p-6'>
					<div className='mb-3 flex items-center justify-between'>
						<div className='text-foreground flex items-center gap-2 text-xs font-bold'>
							<Cpu className='text-primary h-4 w-4' />
							<span>Install Any Component via CLI</span>
						</div>
						<span className='text-muted-foreground font-mono text-[11px]'>13 Targets Supported</span>
					</div>
					<PackageManagerTabs command='exhuma add tilt-card' />
				</section>

				{/* Cards Category */}
				<section id='cards' className='border-border space-y-4 border-t pt-4'>
					<div className='flex items-center justify-between'>
						<div>
							<Badge variant='outline' className='mb-1'>
								Category
							</Badge>
							<h2 className='text-foreground text-xl font-bold tracking-tight'>Tactile Cards & Interactions</h2>
							<p className='text-muted-foreground text-xs sm:text-sm'>High-frequency pointer mathematics, 3D perspective gyroscopes, and sticky depth interpolation.</p>
						</div>
					</div>

					<div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2'>
						{cards.map((comp) => (
							<ComponentCard key={comp.slug} slug={comp.slug} name={comp.name} category={comp.category} description={comp.description} />
						))}
					</div>
				</section>

				{/* Layouts Category */}
				<section id='layouts' className='border-border space-y-4 border-t pt-6'>
					<div>
						<Badge variant='outline' className='mb-1'>
							Category
						</Badge>
						<h2 className='text-foreground text-xl font-bold tracking-tight'>Responsive Layout Engines</h2>
						<p className='text-muted-foreground text-xs sm:text-sm'>CSS multi-column masonry with zero layout thrashing, and mathematical auto-fit minmax responsive grid systems.</p>
					</div>

					<div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2'>
						{layouts.map((comp) => (
							<ComponentCard key={comp.slug} slug={comp.slug} name={comp.name} category={comp.category} description={comp.description} />
						))}
					</div>
				</section>

				{/* Navigation Category */}
				<section id='navigation' className='border-border space-y-4 border-t pt-6'>
					<div>
						<Badge variant='outline' className='mb-1'>
							Category
						</Badge>
						<h2 className='text-foreground text-xl font-bold tracking-tight'>Navigation & Rails</h2>
						<p className='text-muted-foreground text-xs sm:text-sm'>Dynamic momentum horizontal rail scrolling with native snap points and wheel-scroll translation.</p>
					</div>

					<div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2'>
						{navigation.map((comp) => (
							<ComponentCard key={comp.slug} slug={comp.slug} name={comp.name} category={comp.category} description={comp.description} />
						))}
					</div>
				</section>

				{/* Primitives Category */}
				<section id='primitives' className='border-border space-y-4 border-t pt-6'>
					<div>
						<Badge variant='outline' className='mb-1'>
							Category
						</Badge>
						<h2 className='text-foreground text-xl font-bold tracking-tight'>Kinetic Primitives & Disclosures</h2>
						<p className='text-muted-foreground text-xs sm:text-sm'>Self-contained dynamic primitives, mathematical springs, coordinate projections, and zero-layout-shift kinetic transitions.</p>
					</div>

					<div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2'>
						{primitives.map((comp) => (
							<ComponentCard key={comp.slug} slug={comp.slug} name={comp.name} category={comp.category} description={comp.description} />
						))}
					</div>
				</section>
			</div>

			{/* On This Page TOC */}
			<DocsToc items={tocItems} />
		</div>
	);
}
