'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ALL_COMPONENTS } from '@/registry';
import {
	IconSearch as Search,
	IconBook2 as BookOpen,
	IconTerminal2 as Terminal,
	IconPackage as Package,
	IconCpu as Cpu,
	IconPalette as Palette,
	IconShieldCheck as ShieldCheck,
	IconStack2 as Layers,
	IconChevronRight as ChevronRight,
	IconActivity as Activity,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function DocsSidebar() {
	const pathname = usePathname();
	const [query, setQuery] = useState('');

	const gettingStartedLinks = [
		{ href: '/docs', label: 'Introduction & Philosophy', icon: BookOpen },
		{ href: '/docs/installation', label: 'Installation', icon: Package },
		{ href: '/docs/theming', label: 'Theming & Dark Mode', icon: Palette },
		{ href: '/docs/cli', label: 'CLI Reference', icon: Terminal },
	];

	const architectureLinks = [
		{ href: '/docs/methodology', label: 'Kinetic Methodology & Big-Ω', icon: Activity },
		{ href: '/docs/ecosystems', label: '13 Ecosystem Contracts', icon: Cpu },
		{ href: '/docs/lifecycle', label: 'Lifecycle & Memory Safety', icon: ShieldCheck },
	];

	const filteredComponents = ALL_COMPONENTS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()));

	return (
		<aside className='h-fit w-full shrink-0 space-y-6 py-4 md:sticky md:top-20 md:w-64'>
			{/* Search Filter */}
			<div className='relative'>
				<Search className='text-muted-foreground absolute top-2.5 left-3 h-3.5 w-3.5' />
				<input
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search documentation...'
					className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-1.5 pr-3 pl-8 text-xs outline-none focus:ring-1'
				/>
			</div>

			{/* Getting Started Section */}
			<div className='space-y-1'>
				<h4 className='text-muted-foreground px-3 font-mono text-[11px] font-bold tracking-wider uppercase'>Getting Started</h4>
				<div className='space-y-0.5 pt-1'>
					{gettingStartedLinks.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
									isActive ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
								)}
							>
								<div className='flex items-center gap-2'>
									<Icon className='h-4 w-4' />
									<span>{item.label}</span>
								</div>
								{isActive && <ChevronRight className='h-3.5 w-3.5' />}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Architecture Section */}
			<div className='space-y-1 pt-1'>
				<h4 className='text-muted-foreground px-3 font-mono text-[11px] font-bold tracking-wider uppercase'>Architecture</h4>
				<div className='space-y-0.5 pt-1'>
					{architectureLinks.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
									isActive ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
								)}
							>
								<div className='flex items-center gap-2'>
									<Icon className='h-4 w-4' />
									<span>{item.label}</span>
								</div>
								{isActive && <ChevronRight className='h-3.5 w-3.5' />}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Canonical Components Section */}
			<div className='space-y-3 pt-1'>
				<div className='flex items-center justify-between px-3'>
					<Link
						href='/docs/components'
						className={cn('hover:text-foreground font-mono text-[11px] font-bold tracking-wider uppercase transition-colors', pathname === '/docs/components' ? 'text-primary' : 'text-muted-foreground')}
					>
						Components
					</Link>
					<span className='kbd text-[9px]'>13 contracts</span>
				</div>

				<div className='space-y-0.5'>
					<Link
						href='/docs/components'
						className={cn(
							'mb-1 flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
							pathname === '/docs/components' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
						)}
					>
						<span>All Components</span>
						<Badge variant='outline' className='px-1 py-0 text-[9px]'>
							{ALL_COMPONENTS.length}
						</Badge>
					</Link>
					{filteredComponents.map((comp) => {
						const href = `/docs/components/${comp.slug}`;
						const isActive = pathname === href;
						return (
							<Link
								key={comp.slug}
								href={href}
								className={cn(
									'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
									isActive ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
								)}
							>
								<div>
									<div>{comp.name}</div>
									<div className='text-muted-foreground font-mono text-[10px] capitalize'>{comp.category}</div>
								</div>
								<Badge variant='outline' className='px-1 py-0 text-[9px]'>
									13
								</Badge>
							</Link>
						);
					})}
				</div>
			</div>
		</aside>
	);
}

export default DocsSidebar;
