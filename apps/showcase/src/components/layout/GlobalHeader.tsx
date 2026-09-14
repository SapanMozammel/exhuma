'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconSearch as Search,
  IconTerminal2 as Terminal,
  IconSparkles as Sparkles,
  IconStack2 as Layers,
  IconAdjustments as Sliders,
  IconBook2 as BookOpen,
  IconArrowRight as ArrowRight,
  IconExternalLink as ExternalLink,
} from '@tabler/icons-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function GlobalHeader() {
	const pathname = usePathname();

	const navLinks = [
		{ href: '/docs', label: 'Docs', icon: BookOpen },
		{ href: '/docs/components', label: 'Components', icon: Layers },
		{ href: '/showcase', label: 'Showcase', icon: Sparkles },
		{ href: '/blog', label: 'Blog', icon: BookOpen },
		{ href: '/studio', label: 'Studio', icon: Sliders },
	];

	const triggerCommandPalette = () => {
		const event = new KeyboardEvent('keydown', {
			key: 'k',
			metaKey: true,
			bubbles: true,
		});
		window.dispatchEvent(event);
	};

	return (
		<div className="sticky top-0 z-40 w-full">
			{/* Top Announcement Banner (shadcn / Vercel style) */}
			<div className="border-b border-border bg-muted py-1.5 px-4 text-center text-[11px] font-medium transition-colors">
				<Link
					href="/docs/ecosystems"
					className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
				>
					<span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
					<span className="font-semibold text-foreground">Exhuma v0.1.1</span>
					<span>— 13 Universal Framework Contracts with Teardown Safety</span>
					<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 text-primary" />
				</Link>
			</div>

			{/* Main Navigation Bar */}
			<header className="w-full border-b border-border bg-background/85 backdrop-blur-xl transition-colors">
				<div className="container-fluid flex h-14 items-center justify-between gap-4">
					{/* Brand Mark */}
					<div className="flex items-center gap-6">
						<Link href="/" className="flex items-center gap-2.5 group">
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
								<Sparkles className="h-4 w-4" />
							</div>
							<div className="flex items-center gap-2">
								<span className="font-black tracking-tight text-foreground text-base">
									Exhuma
								</span>
								<Badge variant="ecosystem" className="hidden sm:inline-flex py-0 px-1.5 text-[10px]">
									v0.1.1
								</Badge>
							</div>
						</Link>

						{/* Navigation Links */}
						<nav className="hidden md:flex items-center gap-1">
							{navLinks.map((link) => {
								const isActive =
									link.href === '/'
										? pathname === '/'
										: link.href === '/docs'
										? pathname === '/docs' ||
										  (pathname.startsWith('/docs/') &&
												!pathname.startsWith('/docs/components'))
										: pathname.startsWith(link.href);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
											isActive
												? 'bg-accent text-accent-foreground font-semibold shadow-xs'
												: 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
										)}
									>
										<span>{link.label}</span>
									</Link>
								);
							})}
						</nav>
					</div>

					{/* Right Actions: Command Trigger, Theme Switcher, GitHub */}
					<div className="flex items-center gap-2">
						{/* Search Trigger Button (Raycast style) */}
						<button
							type="button"
							onClick={triggerCommandPalette}
							className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition-all hover:border-input hover:bg-accent/40 hover:text-foreground cursor-pointer"
						>
							<Search className="h-3.5 w-3.5" />
							<span className="hidden sm:inline">Search docs & components...</span>
							<span className="sm:hidden">Search...</span>
							<div className="flex items-center gap-0.5 ml-2">
								<span className="kbd text-[10px]">⌘K</span>
							</div>
						</button>

						{/* Theme Switcher */}
						<ThemeSwitcher />

						{/* GitHub Repository */}
						<Link
							href="https://github.com/SapanMozammel/exhuma"
							target="_blank"
							rel="noreferrer"
							className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground"
							aria-label="GitHub repository"
						>
							<svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
								<path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
							</svg>
						</Link>
					</div>
				</div>
			</header>
		</div>
	);
}

export default GlobalHeader;
