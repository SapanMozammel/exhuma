'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconSearch as Search,
  IconSparkles as Sparkles,
  IconStack2 as Layers,
  IconAdjustments as Sliders,
  IconBook2 as BookOpen,
  IconArrowRight as ArrowRight,
  IconStar as Star,
  IconMenu2 as Menu,
  IconX as X,
} from '@tabler/icons-react';
import { ExhumaLogo } from '@/components/brand/ExhumaLogo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const BANNER_DISMISSED_KEY = 'exhuma-announcement-dismissed';

export function GlobalHeader() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
	const [bannerDismissed, setBannerDismissed] = React.useState(false);

	React.useEffect(() => {
		setMobileMenuOpen(false);
	}, [pathname]);

	React.useEffect(() => {
		try {
			if (localStorage.getItem(BANNER_DISMISSED_KEY) === 'true') {
				setBannerDismissed(true);
			}
		} catch {
			// localStorage unavailable (SSR, private browsing, disabled storage) — banner just stays visible
		}
	}, []);

	const dismissBanner = () => {
		setBannerDismissed(true);
		try {
			localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
		} catch {
			// localStorage unavailable — dismissal just won't persist across visits
		}
	};

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

	const isLinkActive = (href: string) =>
		href === '/docs'
			? pathname === '/docs' ||
			  (pathname.startsWith('/docs/') && !pathname.startsWith('/docs/components'))
			: pathname.startsWith(href);

	return (
		<div className="sticky top-0 z-40 w-full">
			{/* Top Announcement Banner (shadcn / Vercel style) */}
			{!bannerDismissed && (
				<div className="relative border-b border-border bg-muted py-1.5 pl-4 pr-10 text-center text-[11px] font-medium transition-colors">
					<Link
						href="https://github.com/SapanMozammel/exhuma"
						target="_blank"
						rel="noreferrer"
						className="inline text-muted-foreground hover:text-foreground transition-colors group"
					>
						<Star className="inline-block h-3 w-3 -mt-0.5 mr-1.5 align-middle text-emerald-500 fill-emerald-500/20" />
						<span>Free &amp; open source, built for every frontend stack.</span>{' '}
						<span className="font-semibold text-foreground">Star Exhuma on GitHub</span>{' '}
						<ArrowRight className="inline-block h-3 w-3 -mt-0.5 ml-0.5 align-middle transition-transform group-hover:translate-x-0.5 text-primary" />
					</Link>
					<button
						type="button"
						onClick={dismissBanner}
						aria-label="Dismiss announcement"
						className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				</div>
			)}

			{/* Main Navigation Bar */}
			<header className="w-full border-b border-border bg-background/85 backdrop-blur-xl transition-colors">
				<div className="container-fluid flex h-14 items-center justify-between gap-4">
					{/* Brand Mark */}
					<div className="flex items-center gap-3 lg:gap-6">
						<Link href="/" className="flex items-center gap-1.5 group">
							<ExhumaLogo size={24} className="text-foreground shrink-0 -mr-0.5" />
							<div className="flex items-start gap-0.5">
								<span className="font-display font-extrabold tracking-tight text-base leading-none text-foreground transition-colors group-hover:text-foreground/80">
									Exhuma
								</span>
								<sup className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider leading-none text-muted-foreground/80">
									Beta
								</sup>
							</div>
						</Link>

						{/* Navigation Links */}
						<nav className="hidden md:flex items-center gap-1">
							{navLinks.map((link) => {
								const isActive = isLinkActive(link.href);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											'flex items-center gap-1.5 rounded-md px-2 lg:px-3 py-1.5 text-xs font-medium transition-colors',
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

					{/* Right Actions: Command Trigger, Theme Switcher, GitHub, Mobile Menu */}
					<div className="flex items-center gap-2">
						{/* Search Trigger Button (Raycast style; icon-only below md) */}
						<button
							type="button"
							onClick={triggerCommandPalette}
							aria-label="Search"
							className="flex h-8 w-8 items-center justify-center gap-2 rounded-md md:rounded-lg border border-border bg-background text-muted-foreground shadow-xs transition-all hover:border-input hover:bg-accent hover:text-foreground cursor-pointer md:w-auto md:px-3"
						>
							<Search className="h-4 w-4 shrink-0" />
							<span className="hidden md:inline lg:hidden whitespace-nowrap text-xs">Search...</span>
							<span className="hidden lg:inline whitespace-nowrap text-xs">Search docs & components...</span>
							<span className="hidden md:inline ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">⌘K</span>
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

						{/* Mobile Navigation Menu (right corner) */}
						<Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition-colors hover:bg-accent md:hidden"
									aria-label="Toggle navigation menu"
								>
									<Menu className="h-4 w-4" />
								</button>
							</PopoverTrigger>
							<PopoverContent align="end" className="w-56 p-1.5 border border-border bg-popover shadow-xl">
								<div className="flex flex-col gap-0.5">
									{navLinks.map((link) => {
										const isActive = isLinkActive(link.href);
										const Icon = link.icon;
										return (
											<Link
												key={link.href}
												href={link.href}
												className={cn(
													'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
													isActive
														? 'bg-accent text-accent-foreground font-semibold'
														: 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
												)}
											>
												<Icon className="h-4 w-4" />
												<span>{link.label}</span>
											</Link>
										);
									})}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</header>
		</div>
	);
}

export default GlobalHeader;
