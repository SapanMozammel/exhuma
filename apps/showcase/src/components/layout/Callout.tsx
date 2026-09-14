import * as React from 'react';
import {
  IconInfoCircle as Info,
  IconBulb as Lightbulb,
  IconAlertTriangle as AlertTriangle,
  IconShieldExclamation as ShieldAlert,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type CalloutType = 'note' | 'tip' | 'warning' | 'important';

interface CalloutProps {
	type?: CalloutType;
	title?: string;
	children: React.ReactNode;
	className?: string;
}

const calloutConfig = {
	note: {
		icon: Info,
		containerClass:
			'border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-200',
		iconClass: 'text-blue-500',
		defaultTitle: 'Note',
	},
	tip: {
		icon: Lightbulb,
		containerClass:
			'border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200',
		iconClass: 'text-emerald-500',
		defaultTitle: 'Tip',
	},
	warning: {
		icon: AlertTriangle,
		containerClass:
			'border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200',
		iconClass: 'text-amber-500',
		defaultTitle: 'Warning',
	},
	important: {
		icon: ShieldAlert,
		containerClass:
			'border-purple-500/30 bg-purple-500/5 text-purple-900 dark:text-purple-200',
		iconClass: 'text-purple-500',
		defaultTitle: 'Important',
	},
};

export function Callout({
	type = 'note',
	title,
	children,
	className,
}: CalloutProps) {
	const config = calloutConfig[type];
	const Icon = config.icon;

	return (
		<div
			className={cn(
				'my-4 flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed',
				config.containerClass,
				className
			)}
		>
			<Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.iconClass)} />
			<div className="flex-1">
				<div className="font-semibold mb-1 text-foreground">
					{title || config.defaultTitle}
				</div>
				<div className="text-muted-foreground text-xs [&>p]:leading-relaxed">
					{children}
				</div>
			</div>
		</div>
	);
}

export default Callout;
