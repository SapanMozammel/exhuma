'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ALL_COMPONENTS } from '@/registry';
import {
  IconSearch as Search,
  IconBook2 as BookOpen,
  IconTerminal2 as Terminal,
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
		{ href: '/docs/installation', label: 'Installation', icon: Terminal },
		{ href: '/docs/theming', label: 'Theming & Dark Mode', icon: Palette },
		{ href: '/docs/cli', label: 'CLI Reference', icon: Terminal },
	];

	const architectureLinks = [
		{ href: '/docs/methodology', label: 'Kinetic Methodology & Big-Ω', icon: Activity },
		{ href: '/docs/ecosystems', label: '13 Ecosystem Contracts', icon: Cpu },
		{ href: '/docs/lifecycle', label: 'Lifecycle & Memory Safety', icon: ShieldCheck },
	];

	const filteredComponents = ALL_COMPONENTS.filter(
		(c) =>
			c.name.toLowerCase().includes(query.toLowerCase()) ||
			c.description.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<aside className="w-full md:w-64 shrink-0 space-y-6 md:sticky md:top-20 h-fit py-4">
			{/* Search Filter */}
			<div className="relative">
				<Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-2.5" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search documentation..."
					className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
				/>
			</div>

			{/* Getting Started Section */}
			<div className="space-y-1">
				<h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
					Getting Started
				</h4>
				<div className="space-y-0.5 pt-1">
					{gettingStartedLinks.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
									isActive
										? 'bg-primary text-primary-foreground font-semibold shadow-xs'
										: 'text-muted-foreground hover:bg-accent hover:text-foreground'
								)}
							>
								<div className="flex items-center gap-2">
									<Icon className="h-3.5 w-3.5" />
									<span>{item.label}</span>
								</div>
								{isActive && <ChevronRight className="h-3.5 w-3.5" />}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Architecture Section */}
			<div className="space-y-1 pt-1">
				<h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
					Architecture
				</h4>
				<div className="space-y-0.5 pt-1">
					{architectureLinks.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
									isActive
										? 'bg-primary text-primary-foreground font-semibold shadow-xs'
										: 'text-muted-foreground hover:bg-accent hover:text-foreground'
								)}
							>
								<div className="flex items-center gap-2">
									<Icon className="h-3.5 w-3.5" />
									<span>{item.label}</span>
								</div>
								{isActive && <ChevronRight className="h-3.5 w-3.5" />}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Canonical Components Section */}
			<div className="space-y-3 pt-1">
				<div className="flex items-center justify-between px-3">
					<Link
						href="/docs/components"
						className={cn(
							'text-[11px] font-bold uppercase tracking-wider font-mono hover:text-foreground transition-colors',
							pathname === '/docs/components' ? 'text-primary' : 'text-muted-foreground'
						)}
					>
						Components
					</Link>
					<span className="kbd text-[9px]">13 contracts</span>
				</div>

				<div className="space-y-0.5">
					<Link
						href="/docs/components"
						className={cn(
							'flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all mb-1',
							pathname === '/docs/components'
								? 'bg-primary text-primary-foreground font-semibold shadow-xs'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'
						)}
					>
						<span>All Components</span>
						<Badge variant="outline" className="text-[9px] py-0 px-1">
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
									isActive
										? 'bg-accent text-accent-foreground font-semibold'
										: 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
								)}
							>
								<div>
									<div>{comp.name}</div>
									<div className="text-[10px] text-muted-foreground font-mono capitalize">
										{comp.category}
									</div>
								</div>
								<Badge variant="outline" className="text-[9px] py-0 px-1">
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
