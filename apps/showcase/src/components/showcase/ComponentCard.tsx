'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  IconCopy as Copy,
  IconCheck as Check,
  IconArrowUpRight as ArrowUpRight,
  IconTerminal2 as Terminal,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComponentCardProps {
	slug: string;
	name: string;
	category: string;
	description: string;
	className?: string;
}

export function ComponentCard({
	slug,
	name,
	category,
	description,
	className,
}: ComponentCardProps) {
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
		<div
			className={cn(
				'group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-input hover:shadow-md',
				className
			)}
		>
			<div>
				{/* Header: Category & Studio Link */}
				<div className="flex items-center justify-between gap-2 mb-3">
					<Badge variant="ecosystem" className="capitalize text-[10px]">
						{category}
					</Badge>
					<Link
						href={`/studio?slug=${slug}`}
						className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
					>
						<span>Studio</span>
						<ArrowUpRight className="h-3.5 w-3.5" />
					</Link>
				</div>

				{/* Title & Description */}
				<Link href={`/studio?slug=${slug}`} className="block">
					<h4 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
						{name}
					</h4>
					<p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
						{description}
					</p>
				</Link>
			</div>

			{/* Bottom: 13 Ecosystems tag + Quick CLI Add */}
			<div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2 text-xs">
				<span className="text-[11px] font-mono text-muted-foreground">
					13 Ecosystems
				</span>
				<button
					type="button"
					onClick={copyCli}
					className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-mono text-foreground hover:bg-accent transition-colors cursor-pointer"
					title="Copy CLI install command"
				>
					{copied ? (
						<>
							<Check className="h-3 w-3 text-emerald-500" />
							<span className="text-emerald-500 font-medium">Copied</span>
						</>
					) : (
						<>
							<Terminal className="h-3 w-3 text-muted-foreground" />
							<span>add {slug}</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
}

export default ComponentCard;
