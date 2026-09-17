'use client';

import * as React from 'react';
import Link from 'next/link';
import { IconCopy as Copy, IconCheck as Check, IconArrowUpRight as ArrowUpRight, IconTerminal2 as Terminal } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComponentCardProps {
	slug: string;
	name: string;
	category: string;
	description: string;
	className?: string;
}

export function ComponentCard({ slug, name, category, description, className }: ComponentCardProps) {
	const [copied, setCopied] = React.useState(false);

	const cliCommand = `npx exhuma add ${slug}`;

	const copyCli = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard.writeText(cliCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={cn('group border-border bg-card hover:border-input relative flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md', className)}>
			<div>
				{/* Header: Category & Studio Link */}
				<div className='mb-3 flex items-center justify-between gap-2'>
					<Badge variant='ecosystem' className='text-[10px] capitalize'>
						{category}
					</Badge>
					<Link href={`/studio?slug=${slug}`} className='text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs transition-colors'>
						<span>Studio</span>
						<ArrowUpRight className='h-3.5 w-3.5' />
					</Link>
				</div>

				{/* Title & Description */}
				<Link href={`/studio?slug=${slug}`} className='block'>
					<h4 className='text-foreground group-hover:text-primary text-lg font-bold tracking-tight transition-colors'>{name}</h4>
					<p className='text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed'>{description}</p>
				</Link>
			</div>

			{/* Bottom: 13 Ecosystems tag + Quick CLI Add */}
			<div className='border-border mt-6 flex items-center justify-between gap-2 border-t pt-4 text-xs'>
				<span className='text-muted-foreground font-mono text-[11px]'>13 Ecosystems</span>
				<button
					type='button'
					onClick={copyCli}
					className='border-border bg-background text-foreground hover:bg-accent flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors'
					title='Copy CLI install command'
				>
					{copied ? (
						<>
							<Check className='h-3 w-3 text-emerald-500' />
							<span className='font-medium text-emerald-500'>Copied</span>
						</>
					) : (
						<>
							<Terminal className='text-muted-foreground h-3 w-3' />
							<span>add {slug}</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
}

export default ComponentCard;
