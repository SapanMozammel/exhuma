'use client';

import * as React from 'react';
import { ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';
import { cn } from '@/lib/utils';

interface EcosystemPillsProps {
	selectedFlavor: EcosystemFlavor;
	onSelectFlavor: (flavor: EcosystemFlavor) => void;
	className?: string;
}

export function EcosystemPills({
	selectedFlavor,
	onSelectFlavor,
	className,
}: EcosystemPillsProps) {
	const flavors = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

	return (
		<div
			className={cn(
				'flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar',
				className
			)}
		>
			{flavors.map((flavor) => {
				const isSelected = selectedFlavor === flavor;
				return (
					<button
						key={flavor}
						type="button"
						onClick={() => onSelectFlavor(flavor)}
						className={cn(
							'flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-mono transition-all cursor-pointer',
							isSelected
								? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
								: 'border-border bg-card text-muted-foreground hover:border-input hover:text-foreground'
						)}
					>
						<span>{ECOSYSTEM_LABELS[flavor]}</span>
					</button>
				);
			})}
		</div>
	);
}

export default EcosystemPills;
