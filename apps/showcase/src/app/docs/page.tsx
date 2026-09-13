import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tocItems = [
	{ id: 'philosophy', title: 'Philosophy & Motivation' },
	{ id: 'why-copy-paste', title: 'Why Copy-Paste Wins' },
	{ id: '13-ecosystem-contract', title: 'The 13-Ecosystem Contract' },
	{ id: 'ucm-model', title: 'Universal Component Model' },
	{ id: 'next-steps', title: 'Next Steps' },
];

export default function DocsOverviewPage() {
	return (
		<div className="flex gap-10">
			<div className="flex-1 min-w-0 space-y-8 max-w-3xl">
				{/* Breadcrumb & Header */}
				<div>
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
						<span>Documentation</span>
						<span>/</span>
						<span className="text-foreground font-semibold">Overview</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						Universal Component Architecture
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
						Exhuma is an unopinionated, copy-paste headless engineering system. It authors high-performance tactile interactions from fundamental mathematical principles and adapts them into 13 native frontend framework idioms.
					</p>
				</div>

				{/* Philosophy */}
				<section id="philosophy" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Philosophy & Motivation
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Modern frontend development has been fragmented into isolated package ecosystems. A rich layout engine written in React cannot be cleanly used in Vue 3 or Svelte 5 without bundling multiple megabytes of runtime adapters or polyfills.
					</p>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Exhuma inverts this relationship. Rather than shipping a monolithic NPM library, Exhuma maintains a canonical mathematical specification for each component and re-synthesizes it into native code.
					</p>

					<Callout type="note" title="Zero Runtime Wrappers">
						When you add an Exhuma component, you receive 100% pure idiomatic code for your framework. A Svelte 5 component uses Svelte 5 runes ($state, $effect); an Angular component uses Angular 18 signals; a Flutter component uses Dart StatefulWidget.
					</Callout>
				</section>

				{/* Why Copy-Paste Wins */}
				<section id="why-copy-paste" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Why Copy-Paste Wins Over Monolithic NPM
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Inspired by the triumph of <strong>shadcn/ui</strong> and Tailwind CSS, we believe developers should <strong>own their code</strong>. Monolithic component packages introduce:
					</p>
					<ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
						<li>
							<strong className="text-foreground">Dependency Hell:</strong> Conflicting peer dependencies during major framework upgrades.
						</li>
						<li>
							<strong className="text-foreground">CSS Leaks:</strong> Global class collisions and un-overrideable styles.
						</li>
						<li>
							<strong className="text-foreground">Bundle Bloat:</strong> Unused features bundled into your client bundle.
						</li>
					</ul>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						With Exhuma, the code lives in your repository. You can modify physics, rename props, adjust colors, and tune performance without submitting an upstream PR.
					</p>
				</section>

				{/* The 13 Ecosystem Contract */}
				<section id="13-ecosystem-contract" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						The 13-Ecosystem Contract
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Every canonical component adheres to 13 strict contracts:
					</p>

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
						{[
							{ name: 'React 18 / 19', ext: '.tsx' },
							{ name: 'Next.js 15', ext: '.tsx' },
							{ name: 'Vue 3 / Nuxt', ext: '.vue' },
							{ name: 'Svelte 5', ext: '.svelte' },
							{ name: 'Angular 18+', ext: '.ts' },
							{ name: 'SolidJS', ext: '.tsx' },
							{ name: 'Astro', ext: '.astro' },
							{ name: 'Laravel Blade', ext: '.blade.php' },
							{ name: 'Vanilla JS + CSS', ext: '.js / .css' },
							{ name: 'WordPress', ext: 'Gutenberg' },
							{ name: 'Web Components', ext: '<custom-element>' },
							{ name: 'React Native', ext: '.tsx' },
							{ name: 'Flutter', ext: '.dart' },
						].map((item) => (
							<div
								key={item.name}
								className="rounded-lg border border-border bg-card p-2.5 font-mono text-xs shadow-xs"
							>
								<div className="font-semibold text-foreground text-[11px] font-sans">
									{item.name}
								</div>
								<div className="text-[10px] text-primary mt-0.5">{item.ext}</div>
							</div>
						))}
					</div>
				</section>

				{/* UCM Model */}
				<section id="ucm-model" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Universal Component Model (UCM)
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						To guarantee mathematical consistency, each component is implemented against the UCM schema:
					</p>

					<CodeBlock
						code={`export interface UniversalComponent {
  slug: string;
  title: string;
  category: 'cards' | 'layouts' | 'navigation';
  description: string;
  defaultProps: Record<string, unknown>;
  props: ComponentProp[];
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>) => GeneratedFile[];
  renderPreview: (props: Record<string, unknown>) => React.ReactNode;
}`}
						language="typescript"
						filename="schema.ts"
					/>
				</section>

				{/* Next Steps */}
				<section id="next-steps" className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<div>
						<div className="text-xs text-muted-foreground">Ready to begin?</div>
						<div className="text-sm font-bold text-foreground">
							Explore the installation guide
						</div>
					</div>
					<Link href="/docs/installation">
						<Button className="gap-2">
							<span>Installation Guide</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</section>
			</div>

			{/* Table of Contents */}
			<DocsToc items={tocItems} />
		</div>
	);
}
