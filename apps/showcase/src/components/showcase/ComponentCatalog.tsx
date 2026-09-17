'use client';

import * as React from 'react';
import Link from 'next/link';
import { IconSearch as Search, IconX as Close } from '@tabler/icons-react';
import { ALL_COMPONENTS, UniversalComponent } from '@/registry';
import { ComponentCard } from './ComponentCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORIES = [
	{ id: 'all', label: 'All Components' },
	{ id: 'cards', label: 'Cards & Depth' },
	{ id: 'layouts', label: 'Layout Engines' },
	{ id: 'primitives', label: 'Kinetic Primitives' },
	{ id: 'navigation', label: 'Navigation' },
] as const;

export function ComponentCatalog() {
	const [activeCategory, setActiveCategory] = React.useState<string>('all');
	const [searchQuery, setSearchQuery] = React.useState<string>('');

	const filteredComponents = React.useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return ALL_COMPONENTS.filter((comp) => {
			const matchesCategory = activeCategory === 'all' || comp.category === activeCategory;
			const matchesSearch =
				!query ||
				comp.name?.toLowerCase().includes(query) ||
				comp.slug?.toLowerCase().includes(query) ||
				comp.description?.toLowerCase().includes(query) ||
				((comp as unknown as { tags?: string[] }).tags?.some((t: string) => t?.toLowerCase().includes(query)) ?? false);

			return matchesCategory && matchesSearch;
		});
	}, [activeCategory, searchQuery]);

	return (
		<div className='space-y-8'>
			{/* Filter and Search Bar */}
			<div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
				{/* Category Pill Tabs */}
				<div className='no-scrollbar -my-1 flex items-center gap-1.5 overflow-x-auto py-1'>
					{CATEGORIES.map((cat) => {
						const isSelected = activeCategory === cat.id;
						const count = cat.id === 'all' ? ALL_COMPONENTS.length : ALL_COMPONENTS.filter((c) => c.category === cat.id).length;

						if (count === 0) return null;

						return (
							<button
								key={cat.id}
								type='button'
								onClick={() => setActiveCategory(cat.id)}
								className={cn(
									'flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
									isSelected ? 'bg-foreground text-background shadow-xs' : 'border-border/80 bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 border'
								)}
							>
								<span className='whitespace-nowrap'>{cat.label}</span>
								<span className={cn('text-3xs rounded-full px-2 py-0.5 font-mono font-bold', isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground')}>{count}</span>
							</button>
						);
					})}
				</div>

				{/* Search Input */}
				<div className='relative w-full md:w-68'>
					<Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2' />
					<input
						type='text'
						placeholder='Filter primitives by name or tag...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='border-border/80 bg-card/80 text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:ring-foreground/10 h-9.5 w-full rounded-full border pr-8 pl-10 text-xs shadow-xs outline-hidden transition-all focus:ring-2'
					/>
					{searchQuery && (
						<button type='button' onClick={() => setSearchQuery('')} className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2' title='Clear search'>
							<Close className='h-3.5 w-3.5' />
						</button>
					)}
				</div>
			</div>

			{/* Component Grid */}
			{filteredComponents.length > 0 ? (
				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{filteredComponents.map((component) => (
						<ComponentCard key={component.slug} slug={component.slug} name={component.name} category={component.category} description={component.description} className='h-full' />
					))}
				</div>
			) : (
				<div className='border-border bg-card/50 flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center'>
					<Search className='text-muted-foreground/50 h-8 w-8 stroke-1' />
					<h4 className='text-foreground mt-3 text-sm font-bold'>No matching primitives</h4>
					<p className='text-muted-foreground mt-1 max-w-sm text-xs'>No component matched &quot;{searchQuery}&quot;. Try selecting a different category or clearing the search.</p>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							setSearchQuery('');
							setActiveCategory('all');
						}}
						className='mt-4'
					>
						Reset filters
					</Button>
				</div>
			)}
		</div>
	);
}

export default ComponentCatalog;
