'use client';

import * as React from 'react';
import { IconCheck as Check, IconCopy as Copy, IconTerminal2 as Terminal } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type PackageManager = 'pnpm dlx' | 'npx' | 'bunx' | 'yarn dlx';

interface PackageManagerTabsProps {
	command?: string;
	className?: string;
}

export function PackageManagerTabs({ command = 'exhuma add stacking-cards', className }: PackageManagerTabsProps) {
	const [activeManager, setActiveManager] = React.useState<PackageManager>('pnpm dlx');
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
		<div className={cn('border-border bg-card flex max-w-xl flex-col items-stretch rounded-xl border p-1.5 shadow-sm transition-all sm:flex-row sm:items-center', className)}>
			{/* Manager Selector Segment */}
			<div className='bg-muted/60 border-border/50 flex shrink-0 items-center gap-1 rounded-lg border p-1'>
				{managers.map((m) => (
					<button
						key={m.id}
						type='button'
						onClick={() => setActiveManager(m.id)}
						className={cn(
							'cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-all',
							activeManager === m.id ? 'bg-background text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
						)}
					>
						{m.label}
					</button>
				))}
			</div>

			{/* Command Display with Prompt & Copy */}
			<div className='mt-1 flex flex-1 items-center justify-between overflow-hidden py-1 pr-1 pl-3 font-mono text-xs sm:mt-0 sm:py-0'>
				<div className='text-muted-foreground flex items-center gap-2 truncate select-all'>
					<Terminal className='text-primary h-3.5 w-3.5 shrink-0' />
					<span className='text-foreground truncate font-medium'>{fullCommand}</span>
				</div>
				<button
					type='button'
					onClick={copyToClipboard}
					className='border-border bg-background text-foreground hover:bg-accent ml-2 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border shadow-xs transition-all active:scale-95'
					title='Copy command'
				>
					{copied ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='text-muted-foreground h-3.5 w-3.5' />}
				</button>
			</div>
		</div>
	);
}

export default PackageManagerTabs;
