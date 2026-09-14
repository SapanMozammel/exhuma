'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  IconAlignLeft as AlignLeft,
} from '@tabler/icons-react';

interface TocItem {
	id: string;
	title: string;
	level?: number;
}

interface DocsTocProps {
	items: TocItem[];
	className?: string;
}

export function DocsToc({ items, className }: DocsTocProps) {
	const [activeId, setActiveId] = React.useState<string>(items[0]?.id || '');

	React.useEffect(() => {
		const handleScroll = () => {
			const headings = items
				.map((item) => document.getElementById(item.id))
				.filter(Boolean) as HTMLElement[];

			for (let i = headings.length - 1; i >= 0; i--) {
				const heading = headings[i];
				if (heading) {
					const rect = heading.getBoundingClientRect();
					if (rect.top <= 120) {
						setActiveId(items[i]?.id || '');
						break;
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [items]);

	if (!items || items.length === 0) return null;

	return (
		<div className={cn('hidden xl:block w-56 shrink-0 py-6 text-xs', className)}>
			<div className="sticky top-20 space-y-3">
				<div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-muted-foreground text-[11px] font-mono">
					<AlignLeft className="h-3.5 w-3.5" />
					<span>On This Page</span>
				</div>

				<nav className="space-y-1 border-l border-border pl-3">
					{items.map((item) => {
						const isActive = activeId === item.id;
						return (
							<a
								key={item.id}
								href={`#${item.id}`}
								className={cn(
									'block py-1 transition-colors hover:text-foreground',
									isActive
										? 'text-primary font-semibold'
										: 'text-muted-foreground',
									item.level === 3 ? 'pl-2 text-[11px]' : ''
								)}
							>
								{item.title}
							</a>
						);
					})}
				</nav>
			</div>
		</div>
	);
}

export default DocsToc;
