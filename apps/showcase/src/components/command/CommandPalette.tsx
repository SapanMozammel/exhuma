'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	IconSearch as Search,
	IconStack2 as Layers,
	IconBook2 as BookOpen,
	IconCpu as Cpu,
	IconAdjustments as Sliders,
	IconCopy as Copy,
	IconCheck as Check,
	IconArrowRight as ArrowRight,
	IconCommand as Command,
	IconSparkles as Sparkles,
	IconLayoutGrid as LayoutGrid,
	IconRoute as Route,
	IconBox as Box,
} from '@tabler/icons-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ALL_COMPONENTS, ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';
import { BLOG_POSTS } from '@/lib/blog-data';
import { cn } from '@/lib/utils';

type FilterCategory = 'all' | 'components' | 'ecosystems' | 'docs' | 'actions';
type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn';

const PM_OPTIONS: PackageManager[] = ['pnpm', 'npm', 'bun', 'yarn'];
const RUNNERS: Record<PackageManager, string> = {
	pnpm: 'pnpm dlx',
	npm: 'npx',
	bun: 'bunx',
	yarn: 'yarn dlx',
};
const CREATORS: Record<PackageManager, string> = {
	pnpm: 'pnpm create',
	npm: 'npm create',
	bun: 'bun create',
	yarn: 'yarn create',
};

/** Rewrites a Quick Add command (authored as npx/npm create) for the chosen package manager. */
function withPackageManager(command: string, pm: PackageManager): string {
	if (command.startsWith('npm create ')) {
		return `${CREATORS[pm]} ${command.slice('npm create '.length)}`;
	}
	if (command.startsWith('npx ')) {
		return `${RUNNERS[pm]} ${command.slice('npx '.length)}`;
	}
	return command;
}

const COMPONENT_CATEGORY_ICONS: Record<string, React.ElementType> = {
	cards: Layers,
	layouts: LayoutGrid,
	navigation: Route,
	primitives: Box,
};

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

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
	const [activeCategory, setActiveCategory] = React.useState<FilterCategory>('all');
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [copied, setCopied] = React.useState(false);
	const [pm, setPm] = React.useState<PackageManager>('pnpm');
	const router = useRouter();
	const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

	// Reset search state whenever the palette closes, so reopening starts fresh
	React.useEffect(() => {
		if (!open) {
			setQuery('');
			setActiveCategory('all');
			setSelectedIndex(0);
		}
	}, [open]);

	// Keep the highlighted row scrolled into view during keyboard navigation
	React.useEffect(() => {
		itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
	}, [selectedIndex]);

	// Global Keyboard Listener
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setOpen((prev) => !prev);
			} else if (e.key === '/' && !open) {
				const activeElement = document.activeElement;
				const isInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
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
				icon: COMPONENT_CATEGORY_ICONS[comp.category] || Layers,
				href: `/docs/components/${comp.slug}`,
				cliCommand: `npx exhuma add ${comp.slug}`,
				description: comp.description,
				badges: [capitalize(comp.category), '13 Ecosystems', 'Zero-CSS-Leak'],
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
				description: 'Why copy-paste headless engineering beats bloated monolithic npm dependencies.',
			},
			{
				id: 'doc-install',
				title: 'Installation & Quickstart',
				subtitle: 'pnpm, npm, bun, yarn & create-exhuma',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/installation',
				cliCommand: 'npm create exhuma@latest',
				description: 'Get up and running with create-exhuma and standalone components in seconds.',
			},
			{
				id: 'doc-cli',
				title: 'CLI Reference & Commands',
				subtitle: 'exhuma init, add, list, build',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/cli',
				cliCommand: 'npx exhuma --help',
				description: 'Complete command-line manual, flags, options, and offline embedded canonical execution.',
			},
			{
				id: 'doc-theming',
				title: 'Theming & Dark Mode',
				subtitle: 'Tailwind CSS v4 & Semantic Tokens',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/theming',
				description: 'Dual-theme CSS variables, Tailwind v4 @theme integration, and custom palette tokens.',
				badges: ['Light/Dark', '⌘⌥T', 'Zero-Flash'],
			},
			{
				id: 'doc-lifecycle',
				title: 'Lifecycle & Memory Safety',
				subtitle: 'Deterministic Teardowns across 13 Frameworks',
				category: 'docs',
				icon: BookOpen,
				href: '/docs/lifecycle',
				description: 'Zero memory leaks, listener detaching, and observer disconnection contracts.',
				badges: ['Safety', 'Garbage Collection', 'Verified'],
			},
			{
				id: 'page-showcase',
				title: 'Community Showcase',
				subtitle: 'Production apps & design systems',
				category: 'docs',
				icon: Sparkles,
				href: '/showcase',
				description: 'Real-world dashboards, developer tools, and mobile shells built with Exhuma.',
				badges: ['Showcase', 'Templates', 'Multi-Framework'],
			},
			{
				id: 'page-blog',
				title: 'Engineering Journal',
				subtitle: 'Technical deep-dives & architecture essays',
				category: 'docs',
				icon: BookOpen,
				href: '/blog',
				description: 'Essays on kinetic spring math, copy-paste architecture, and multi-framework design.',
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
				description: 'Figma & Xcode-style visual inspector with real-time code synthesis across all 13 platforms.',
			},
			{
				id: 'action-cli-init',
				title: 'Copy CLI Init Command',
				subtitle: 'npx exhuma init',
				category: 'actions',
				icon: Copy,
				cliCommand: 'npx exhuma init',
				description: 'Initialize exhuma.json configuration file in your active workspace.',
			}
		);

		return list;
	}, []);

	// Filter by search query & category
	const filteredItems = React.useMemo(() => {
		return items.filter((item) => {
			const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
			if (!matchesCategory) return false;

			if (!query.trim()) return true;
			const q = query.toLowerCase();
			return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
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
			setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
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
			navigator.clipboard.writeText(withPackageManager(selectedItem.cliCommand, pm));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const copyCli = (cmd: string) => {
		navigator.clipboard.writeText(cmd);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const renderQuickAddCommand = (cliCommand: string) => (
		<>
			<div className='border-border/50 bg-muted/60 mb-1.5 flex w-fit items-center gap-0.5 rounded-md border p-0.5'>
				{PM_OPTIONS.map((m) => (
					<button
						key={m}
						type='button'
						onClick={() => setPm(m)}
						className={cn(
							'text-3xs cursor-pointer rounded-sm px-1.5 py-0.5 font-mono font-medium transition-all',
							pm === m ? 'bg-background text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
						)}
					>
						{m}
					</button>
				))}
			</div>
			<div className='border-border bg-card text-foreground text-2xs flex items-center justify-between rounded-md border px-2.5 py-1.5 font-mono'>
				<span className='mr-2 truncate'>{withPackageManager(cliCommand, pm)}</span>
				<button
					type='button'
					onClick={() => copyCli(withPackageManager(cliCommand, pm))}
					className='text-muted-foreground hover:text-foreground shrink-0 cursor-pointer'
					title='Copy command'
					aria-label='Copy command'
				>
					{copied ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='h-3.5 w-3.5' />}
				</button>
			</div>
		</>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='border-border bg-card max-w-3xl gap-0 overflow-hidden rounded-xl p-0 shadow-2xl' onKeyDown={handleKeyDown} showClose={false}>
				<DialogTitle className='sr-only'>Command Palette</DialogTitle>

				{/* Search Input Bar */}
				<div className='border-border bg-muted/20 flex items-center border-b px-4 py-3'>
					<Search className='text-muted-foreground mr-3 h-4 w-4 shrink-0' />
					<input
						type='text'
						role='combobox'
						aria-expanded='true'
						aria-autocomplete='list'
						aria-controls='command-palette-listbox'
						aria-activedescendant={selectedItem ? `command-palette-item-${selectedItem.id}` : undefined}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search components, 13 ecosystems, docs, actions... (⌘K)'
						className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none'
						autoFocus
					/>
					{query && (
						<button type='button' onClick={() => setQuery('')} className='text-muted-foreground hover:text-foreground mr-2 text-xs'>
							Clear
						</button>
					)}
					<span className='kbd text-3xs'>ESC</span>
				</div>

				{/* Category Filter Pills */}
				<div className='border-border bg-muted/10 flex items-center gap-1 overflow-x-auto border-b px-4 py-2'>
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
							type='button'
							onClick={() => setActiveCategory(tab.id)}
							aria-pressed={activeCategory === tab.id}
							className={cn(
								'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
								activeCategory === tab.id ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Dual-Pane Layout */}
				<div className='grid h-[23.75rem] grid-cols-1 md:grid-cols-5'>
					{/* Left Results List (3 cols) */}
					<div id='command-palette-listbox' role='listbox' aria-label='Command palette results' className='border-border space-y-0.5 overflow-y-auto border-r p-2 md:col-span-3'>
						{filteredItems.length === 0 ? (
							<div className='text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center'>
								<Command className='mb-2 h-8 w-8 shrink-0 stroke-1 opacity-50' />
								<p className='text-sm'>No results found for &ldquo;{query}&rdquo;</p>
								<p className='mt-1 text-xs'>Try another keyword or category.</p>
							</div>
						) : (
							filteredItems.map((item, idx) => {
								const Icon = item.icon;
								const isSelected = idx === selectedIndex;
								return (
									<div
										key={item.id}
										id={`command-palette-item-${item.id}`}
										role='option'
										aria-selected={isSelected}
										ref={(el) => {
											itemRefs.current[idx] = el;
										}}
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
											'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-all',
											isSelected ? 'bg-accent text-accent-foreground shadow-xs' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
										)}
									>
										<div className='flex min-w-0 items-center gap-2.5'>
											<div
												className={cn(
													'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs',
													isSelected ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-muted/60 text-muted-foreground'
												)}
											>
												<Icon className='h-4.5 w-4.5' />
											</div>
											<div className='min-w-0'>
												<div className='text-foreground truncate text-xs font-semibold'>{item.title}</div>
												<div className='text-muted-foreground text-2xs truncate'>{item.subtitle}</div>
											</div>
										</div>
										<ArrowRight className={cn('h-3.5 w-3.5 shrink-0 transition-opacity', isSelected ? 'text-primary opacity-100' : 'opacity-0')} />
									</div>
								);
							})
						)}
					</div>

					{/* Right Preview Pane (2 cols) */}
					<div className='bg-muted/20 hidden flex-col justify-between p-4 md:col-span-2 md:flex'>
						{selectedItem ? (
							<div className='space-y-4'>
								<div>
									<span className='text-3xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400'>{selectedItem.category}</span>
									<h4 className='text-foreground mt-1 text-base font-bold tracking-tight'>{selectedItem.title}</h4>
									<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>{selectedItem.description || selectedItem.subtitle}</p>
								</div>

								{selectedItem.badges && (
									<div className='flex flex-wrap gap-1'>
										{selectedItem.badges.map((badge) => (
											<span key={badge} className='border-border bg-card text-muted-foreground text-3xs rounded-sm border px-2 py-0.5 font-mono'>
												{badge}
											</span>
										))}
									</div>
								)}

								{selectedItem.cliCommand && (
									<div className='border-border border-t pt-2'>
										<div className='text-muted-foreground text-2xs mb-1.5 flex items-center justify-between'>
											<span>Quick Add</span>
											<span className='text-emerald-600 dark:text-emerald-400'>⌘C to copy</span>
										</div>
										{renderQuickAddCommand(selectedItem.cliCommand)}
									</div>
								)}
							</div>
						) : (
							<div className='text-muted-foreground flex h-full items-center justify-center text-xs'>Select an item to view preview</div>
						)}

						{/* Footer Helper */}
						<div className='border-border text-muted-foreground text-2xs flex items-center justify-between border-t pt-3'>
							<div className='flex items-center gap-2'>
								<span className='kbd h-6 min-w-6 text-sm'>↑</span>
								<span className='kbd h-6 min-w-6 text-sm'>↓</span>
								<span>Navigate</span>
							</div>
							<div className='flex items-center gap-1.5'>
								<span className='kbd h-6 min-w-6 text-sm'>↵</span>
								<span>Open</span>
							</div>
						</div>
					</div>
				</div>
				{/* Mobile Quick Add (the right preview pane is desktop-only) */}
				{selectedItem?.cliCommand && (
					<div className='border-border bg-muted/20 border-t p-3 md:hidden'>
						<div className='text-muted-foreground text-2xs mb-1.5 flex items-center justify-between'>
							<span className='mr-2 truncate'>Quick Add · {selectedItem.title}</span>
							<span className='shrink-0 text-emerald-600 dark:text-emerald-400'>⌘C to copy</span>
						</div>
						{renderQuickAddCommand(selectedItem.cliCommand)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default CommandPalette;
