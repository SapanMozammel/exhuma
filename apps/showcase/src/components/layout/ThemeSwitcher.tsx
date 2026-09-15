'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  IconSun as Sun,
  IconMoon as Moon,
  IconCircleHalf2 as CircleHalf2,
  IconLoader2 as Loader2,
} from '@tabler/icons-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const themeOptions = [
	{
		name: 'light',
		label: 'Light',
		icon: Sun,
	},
	{
		name: 'dark',
		label: 'Dark',
		icon: Moon,
	},
	{
		name: 'system',
		label: 'System',
		icon: CircleHalf2,
	},
] as const;

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);
	const [popoverOpen, setPopoverOpen] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	// Global Keyboard Shortcut: ⌘⌥T / Ctrl+Alt+T
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
			const baseKey = isMac ? e.metaKey : e.ctrlKey;
			if (baseKey && e.altKey && e.code.toLowerCase() === 'keyt') {
				e.preventDefault();
				const themes = ['light', 'dark', 'system'] as const;
				const currentIdx = themes.indexOf((theme as (typeof themes)[number]) || 'system');
				const nextTheme = themes[(currentIdx + 1) % themes.length];
				setTheme(nextTheme);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [theme, setTheme]);

	if (!mounted) {
		return (
			<button
				type="button"
				className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-xs"
				aria-label="Toggle theme"
				disabled
			>
				<Loader2 className="h-3.5 w-3.5 animate-spin opacity-50" />
			</button>
		);
	}

	const ActiveIcon = themeOptions.find((opt) => opt.name === theme)?.icon || CircleHalf2;

	return (
		<TooltipProvider delayDuration={300}>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<button
								type="button"
								className={cn(
									'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
								)}
								aria-label="Change theme"
							>
								<ActiveIcon className="h-4 w-4 transition-transform duration-200" />
							</button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom" className="flex items-center gap-1.5 text-xs">
						<span>Theme ({theme})</span>
						<span className="ml-1 text-emerald-600 dark:text-emerald-400">⌘⌥T</span>
					</TooltipContent>
				</Tooltip>

				<PopoverContent
					align="end"
					className="w-40 p-1.5 border border-border bg-popover shadow-xl"
				>
					<div className="flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold text-muted-foreground border-b border-border mb-1">
						<span>Appearance</span>
						<span className="text-emerald-600 dark:text-emerald-400">⌘⌥T</span>
					</div>
					<div className="flex flex-col gap-0.5">
						{themeOptions.map((option) => {
							const Icon = option.icon;
							const isSelected = theme === option.name;
							return (
								<button
									key={option.name}
									type="button"
									onClick={() => {
										setTheme(option.name);
										setPopoverOpen(false);
									}}
									className={cn(
										'flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										isSelected
											? 'bg-accent text-accent-foreground font-semibold'
											: 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
									)}
								>
									<span className="capitalize">{option.label}</span>
									<Icon className="h-4 w-4" />
								</button>
							);
						})}
					</div>
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
}

export default ThemeSwitcher;
