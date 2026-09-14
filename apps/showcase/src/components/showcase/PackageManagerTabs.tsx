'use client';

import * as React from 'react';
import {
  IconCheck as Check,
  IconCopy as Copy,
  IconTerminal2 as Terminal,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type PackageManager = 'pnpm dlx' | 'npx' | 'bunx' | 'yarn dlx';

interface PackageManagerTabsProps {
	command?: string;
	className?: string;
}

export function PackageManagerTabs({
	command = 'exhuma add stacking-cards',
	className,
}: PackageManagerTabsProps) {
	const [activeManager, setActiveManager] =
		React.useState<PackageManager>('pnpm dlx');
	const [copied, setCopied] = React.useState(false);

	const fullCommand = `${activeManager} ${command}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(fullCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const managers: { id: PackageManager; label: string }[] = [
		{ id: 'pnpm dlx', label: 'pnpm' },
		{ id: 'npx', label: 'npm' },
		{ id: 'bunx', label: 'bun' },
		{ id: 'yarn dlx', label: 'yarn' },
	];

	return (
		<div
			className={cn(
				'flex flex-col sm:flex-row items-stretch sm:items-center rounded-xl border border-border bg-card p-1.5 shadow-sm max-w-xl transition-all',
				className
			)}
		>
			{/* Manager Selector Segment */}
			<div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50 shrink-0">
				{managers.map((m) => (
					<button
						key={m.id}
						type="button"
						onClick={() => setActiveManager(m.id)}
						className={cn(
							'px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all cursor-pointer',
							activeManager === m.id
								? 'bg-background text-foreground shadow-xs font-semibold'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{m.label}
					</button>
				))}
			</div>

			{/* Command Display with Prompt & Copy */}
			<div className="flex flex-1 items-center justify-between pl-3 pr-1 py-1 sm:py-0 mt-1 sm:mt-0 font-mono text-xs overflow-hidden">
				<div className="flex items-center gap-2 truncate text-muted-foreground select-all">
					<Terminal className="h-3.5 w-3.5 text-primary shrink-0" />
					<span className="text-foreground font-medium truncate">
						{fullCommand}
					</span>
				</div>
				<button
					type="button"
					onClick={copyToClipboard}
					className="ml-2 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs hover:bg-accent active:scale-95 transition-all"
					title="Copy command"
				>
					{copied ? (
						<Check className="h-3.5 w-3.5 text-emerald-500" />
					) : (
						<Copy className="h-3.5 w-3.5 text-muted-foreground" />
					)}
				</button>
			</div>
		</div>
	);
}

export default PackageManagerTabs;
