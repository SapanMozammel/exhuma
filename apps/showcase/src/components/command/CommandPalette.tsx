'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	Search,
	Layers,
	BookOpen,
	Cpu,
	Sliders,
	Copy,
	Check,
	ArrowRight,
	ExternalLink,
	Command,
	Sparkles,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ALL_COMPONENTS, ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';
import { BLOG_POSTS } from '@/lib/blog-data';
import { cn } from '@/lib/utils';

type FilterCategory = 'all' | 'components' | 'ecosystems' | 'docs' | 'actions';

interface PaletteItem {
	id: string;
	title: string;
	subtitle: string;
	category: 'components' | 'ecosystems' | 'docs' | 'actions';
	icon: React.ElementType;
	href?: string;
	cliCommand?: string;
	action?: () => void;
	badges?: string[];
	description?: string;
}

export function CommandPalette() {
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState('');
	const [activeCategory, setActiveCategory] =
		React.useState<FilterCategory>('all');
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [copied, setCopied] = React.useState(false);
	const router = useRouter();

	// Global Keyboard Listener
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setOpen((prev) => !prev);
			} else if (e.key === '/' && !open) {
				const activeElement = document.activeElement;
				const isInput =
					activeElement instanceof HTMLInputElement ||
					activeElement instanceof HTMLTextAreaElement;
				if (!isInput) {
					e.preventDefault();
					setOpen(true);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open]);

	// Build search index
	const items = React.useMemo<PaletteItem[]>(() => {
		const list: PaletteItem[] = [];

		// 1. Components
		ALL_COMPONENTS.forEach((comp) => {
			list.push({
				id: `component-${comp.slug}`,
				title: comp.name,
				subtitle: `Canonical Component (${comp.category})`,
				category: 'components',
				icon: Layers,
				href: `/docs/components/${comp.slug}`,
				cliCommand: `npx exhuma add ${comp.slug}`,
				description: comp.description,
				badges: ['13 Ecosystems', 'Self-Contained', 'Zero-CSS-Leak'],
			});
		});

		// 2. Ecosystems
		(Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[]).forEach((flavor) => {
			list.push({
				id: `eco-${flavor}`,
				title: ECOSYSTEM_LABELS[flavor],
				subtitle: `Target Platform Contract (.${flavor})`,
				category: 'ecosystems',
				icon: Cpu,
				href: `/docs/ecosystems#${flavor}`,
				cliCommand: `npx exhuma add stacking-cards --flavor=${flavor}`,
				description: `Universal contract and native idiomatic architecture for ${ECOSYSTEM_LABELS[flavor]}.`,
				badges: [flavor, 'Native Idiom', 'Teardown Safety'],
			});
		});

		// 3. Documentation
		list.push(
			{
				id: 'doc-overview',
				title: 'Overview & Philosophy',
				subtitle: 'Universal Component Model (UCM)',
				category: 'docs',
				icon: BookOpen,
				href: '/docs',
				description:
					'Why copy-paste headless engineering beats bloated monolithic npm dependencies.',
			},
			{
				id: 'doc-install',
				title: 'Installation & Quickstart',
				subtitle: 'pnpm, npm, bun, yarn & create-exhuma',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/installation',
				cliCommand: 'npm create exhuma@latest',
				description:
					'Get up and running with create-exhuma and standalone components in seconds.',
			},
			{
				id: 'doc-cli',
				title: 'CLI Reference & Commands',
				subtitle: 'exhuma init, add, list, build',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/cli',
				cliCommand: 'npx exhuma --help',
				description:
					'Complete command-line manual, flags, options, and offline embedded canonical execution.',
			},
			{
				id: 'doc-theming',
				title: 'Theming & Dark Mode',
				subtitle: 'Tailwind CSS v4 & Semantic Tokens',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/theming',
				description:
					'Dual-theme CSS variables, Tailwind v4 @theme integration, and custom palette tokens.',
				badges: ['Light/Dark', '⌘⌥T', 'Zero-Flash'],
			},
			{
				id: 'doc-lifecycle',
				title: 'Lifecycle & Memory Safety',
				subtitle: 'Deterministic Teardowns across 13 Frameworks',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/lifecycle',
				description:
					'Zero memory leaks, listener detaching, and observer disconnection contracts.',
				badges: ['Safety', 'Garbage Collection', 'Verified'],
			},
			{
				id: 'page-showcase',
				title: 'Community Showcase',
				subtitle: 'Production apps & design systems',
				category: 'docs',
				icon: Sparkles,
				href: '/showcase',
				description:
					'Real-world dashboards, developer tools, and mobile shells built with Exhuma.',
				badges: ['Showcase', 'Templates', 'Multi-Framework'],
			},
			{
				id: 'page-blog',
				title: 'Engineering Journal',
				subtitle: 'Technical deep-dives & architecture essays',
				category: 'docs',
				icon: BookOpen,
				href: '/blog',
				description:
					'Essays on kinetic spring math, copy-paste architecture, and multi-framework design.',
				badges: ['Articles', 'Journal'],
			}
		);

		// 4. Blog Articles
		BLOG_POSTS.forEach((post) => {
			list.push({
				id: `blog-${post.slug}`,
				title: post.title,
				subtitle: `Article · ${post.readTime}`,
				category: 'docs',
				icon: BookOpen,
				href: `/blog/${post.slug}`,
				description: post.description,
				badges: post.tags,
			});
		});

		// 4. Studio Actions
		list.push(
			{
				id: 'action-studio',
				title: 'Open Studio Workbench',
				subtitle: 'Visual Parameter IDE',
				category: 'actions',
				icon: Sliders,
				href: '/studio',
				description:
					'Figma & Xcode-style visual inspector with real-time code synthesis across all 13 platforms.',
			},
			{
				id: 'action-cli-init',
				title: 'Copy CLI Init Command',
				subtitle: 'npx exhuma init',
				category: 'actions',
				icon: Copy,
				cliCommand: 'npx exhuma init',
				description:
					'Initialize exhuma.json configuration file in your active workspace.',
			}
		);

		return list;
	}, []);

	// Filter by search query & category
	const filteredItems = React.useMemo(() => {
		return items.filter((item) => {
			const matchesCategory =
				activeCategory === 'all' || item.category === activeCategory;
			if (!matchesCategory) return false;

			if (!query.trim()) return true;
			const q = query.toLowerCase();
			return (
				item.title.toLowerCase().includes(q) ||
				item.subtitle.toLowerCase().includes(q) ||
				(item.description && item.description.toLowerCase().includes(q))
			);
		});
	}, [items, query, activeCategory]);

	// Keep selection within bounds
	React.useEffect(() => {
		setSelectedIndex(0);
	}, [query, activeCategory]);

	const selectedItem = filteredItems[selectedIndex] || filteredItems[0];

	// Keyboard Navigation inside modal
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (filteredItems.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setSelectedIndex(
				(prev) => (prev - 1 + filteredItems.length) % filteredItems.length
			);
		} else if (e.key === 'Enter' && selectedItem) {
			e.preventDefault();
			if (selectedItem.action) {
				selectedItem.action();
				setOpen(false);
			} else if (selectedItem.href) {
				router.push(selectedItem.href);
				setOpen(false);
			}
		} else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c' && selectedItem?.cliCommand) {
			e.preventDefault();
			navigator.clipboard.writeText(selectedItem.cliCommand);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const copyCli = (cmd: string) => {
		navigator.clipboard.writeText(cmd);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="max-w-3xl p-0 gap-0 overflow-hidden border-border bg-card shadow-2xl rounded-xl"
				onKeyDown={handleKeyDown}
			>
				<DialogTitle className="sr-only">Command Palette</DialogTitle>

				{/* Search Input Bar */}
				<div className="flex items-center border-b border-border px-4 py-3 bg-muted/20">
					<Search className="h-4 w-4 shrink-0 text-muted-foreground mr-3" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search components, 13 ecosystems, docs, actions... (⌘K)"
						className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
						autoFocus
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery('')}
							className="text-xs text-muted-foreground hover:text-foreground mr-2"
						>
							Clear
						</button>
					)}
					<span className="kbd text-[10px]">ESC</span>
				</div>

				{/* Category Filter Pills */}
				<div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/10 overflow-x-auto">
					{(
						[
							{ id: 'all', label: 'All' },
							{ id: 'components', label: 'Components' },
							{ id: 'ecosystems', label: 'Ecosystems' },
							{ id: 'docs', label: 'Docs' },
							{ id: 'actions', label: 'Actions' },
						] as const
					).map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveCategory(tab.id)}
							className={cn(
								'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
								activeCategory === tab.id
									? 'bg-primary text-primary-foreground font-semibold shadow-xs'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Dual-Pane Layout */}
				<div className="grid grid-cols-1 md:grid-cols-5 h-[380px]">
					{/* Left Results List (3 cols) */}
					<div className="md:col-span-3 overflow-y-auto border-r border-border p-2 space-y-0.5">
						{filteredItems.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
								<Command className="h-8 w-8 mb-2 stroke-1 opacity-50" />
								<p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
								<p className="text-xs mt-1">Try another keyword or category.</p>
							</div>
						) : (
							filteredItems.map((item, idx) => {
								const Icon = item.icon;
								const isSelected = idx === selectedIndex;
								return (
									<div
										key={item.id}
										onClick={() => {
											if (item.action) {
												item.action();
												setOpen(false);
											} else if (item.href) {
												router.push(item.href);
												setOpen(false);
											}
										}}
										onMouseEnter={() => setSelectedIndex(idx)}
										className={cn(
											'flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all',
											isSelected
												? 'bg-accent text-accent-foreground shadow-xs'
												: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
										)}
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<div
												className={cn(
													'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs',
													isSelected
														? 'border-primary/40 bg-primary/10 text-primary'
														: 'border-border bg-muted/60 text-muted-foreground'
												)}
											>
												<Icon className="h-3.5 w-3.5" />
											</div>
											<div className="min-w-0">
												<div className="text-xs font-semibold text-foreground truncate">
													{item.title}
												</div>
												<div className="text-[11px] text-muted-foreground truncate">
													{item.subtitle}
												</div>
											</div>
										</div>
										<ArrowRight
											className={cn(
												'h-3.5 w-3.5 shrink-0 transition-opacity',
												isSelected ? 'opacity-100 text-primary' : 'opacity-0'
											)}
										/>
									</div>
								);
							})
						)}
					</div>

					{/* Right Preview Pane (2 cols) */}
					<div className="hidden md:flex md:col-span-2 flex-col justify-between p-4 bg-muted/20">
						{selectedItem ? (
							<div className="space-y-4">
								<div>
									<span className="kbd text-[10px] uppercase font-bold text-primary tracking-wider">
										{selectedItem.category}
									</span>
									<h4 className="text-base font-bold text-foreground mt-1 tracking-tight">
										{selectedItem.title}
									</h4>
									<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
										{selectedItem.description || selectedItem.subtitle}
									</p>
								</div>

								{selectedItem.badges && (
									<div className="flex flex-wrap gap-1">
										{selectedItem.badges.map((badge) => (
											<span
												key={badge}
												className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
											>
												{badge}
											</span>
										))}
									</div>
								)}

								{selectedItem.cliCommand && (
									<div className="pt-2 border-t border-border">
										<div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
											<span>Quick Add</span>
											<span className="kbd text-[9px]">⌘C to copy</span>
										</div>
										<div className="flex items-center justify-between rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-foreground">
											<span className="truncate mr-2">
												{selectedItem.cliCommand}
											</span>
											<button
												type="button"
												onClick={() => copyCli(selectedItem.cliCommand!)}
												className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
												title="Copy command"
											>
												{copied ? (
													<Check className="h-3.5 w-3.5 text-emerald-500" />
												) : (
													<Copy className="h-3.5 w-3.5" />
												)}
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center justify-center h-full text-xs text-muted-foreground">
								Select an item to view preview
							</div>
						)}

						{/* Footer Helper */}
						<div className="flex items-center justify-between pt-3 border-t border-border text-[11px] text-muted-foreground">
							<div className="flex items-center gap-2">
								<span className="kbd text-[9px]">↑</span>
								<span className="kbd text-[9px]">↓</span>
								<span>Navigate</span>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="kbd text-[9px]">↵</span>
								<span>Open</span>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default CommandPalette;
