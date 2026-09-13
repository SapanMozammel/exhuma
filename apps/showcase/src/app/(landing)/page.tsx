import React from 'react';
import Link from 'next/link';
import {
	Sliders,
	Layers,
	Terminal,
	ArrowRight,
	Sparkles,
	BookOpen,
	ShieldCheck,
	Zap,
} from 'lucide-react';
import { ALL_COMPONENTS } from '@/registry';
import { PackageManagerTabs } from '@/components/showcase/PackageManagerTabs';
import { LandingWorkbench } from '@/components/showcase/LandingWorkbench';
import { CapabilityMatrix } from '@/components/showcase/CapabilityMatrix';
import { ComponentCard } from '@/components/showcase/ComponentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
	return (
		<div className="relative min-h-screen">
			{/* Ambient Gradient Glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[350px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none blur-3xl" />

			{/* Hero Section */}
			<section className="relative container pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground mb-6 backdrop-blur-md">
					<Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
					<span>Universal Component Architecture across 13 Ecosystems</span>
				</div>

				<h1 className="text-heading-xlarge max-w-4xl mx-auto text-foreground">
					Autonomous Tactile Interactions.{' '}
					<span className="text-muted-foreground">
						Zero Monolithic Lock-in.
					</span>
				</h1>

				<p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
					One mathematical engine authored natively into 13 production-grade contracts. Copy, customize, and own the code across React, Next.js 15, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla JS, WordPress, Web Components, React Native, and Flutter.
				</p>

				{/* Package Manager Quick Copy */}
				<div className="mt-8 flex justify-center">
					<PackageManagerTabs command="exhuma add tilt-card" />
				</div>

				{/* Interactive Flagship Multi-Component Workbench */}
				<div className="mt-12 max-w-5xl mx-auto text-left">
					<LandingWorkbench />
				</div>
			</section>

			{/* 4 Architectural Guarantees */}
			<section className="container py-16 border-t border-border">
				<div className="text-center max-w-2xl mx-auto mb-12">
					<Badge variant="outline" className="mb-2">
						Guarantees
					</Badge>
					<h2 className="text-heading-large text-foreground">
						Engineered for Absolute Ownership
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground mt-2">
						Stop fighting bloated NPM dependency trees. Exhuma adapts idiomatic component code directly into your repository.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
						<div>
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
								<Zap className="h-5 w-5" />
							</div>
							<h3 className="text-base font-bold text-foreground">
								Zero Runtime Debt
							</h3>
							<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
								No runtime bloatware or heavy external animation dependencies. Written in native primitives with CSS hardware acceleration and 60 FPS spring physics.
							</p>
						</div>
						<div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
							<ShieldCheck className="h-4 w-4" />
							<span>Zero Bloatware</span>
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
						<div>
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
								<Layers className="h-5 w-5" />
							</div>
							<h3 className="text-base font-bold text-foreground">
								13 Native Ecosystems
							</h3>
							<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
								Full syntactic parity across React, Next.js, Vue 3, Svelte 5 (Runes), Angular 18+ (Signals), SolidJS, Astro, Laravel Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.
							</p>
						</div>
						<div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary flex items-center gap-1.5">
							<Terminal className="h-4 w-4" />
							<span>13 Target Contracts</span>
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
						<div>
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
								<ShieldCheck className="h-5 w-5" />
							</div>
							<h3 className="text-base font-bold text-foreground">
								Memory & Lifecycle Safe
							</h3>
							<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
								Guaranteed listener detaching, ResizeObserver disconnects, and spring cancellation on component unmount. Zero memory leaks across client transitions.
							</p>
						</div>
						<div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
							<ShieldCheck className="h-4 w-4" />
							<span>Clean Unmounts</span>
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
						<div>
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
								<Terminal className="h-5 w-5" />
							</div>
							<h3 className="text-base font-bold text-foreground">
								Autonomous CLI
							</h3>
							<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
								Interactive project initialization and component installation via <code className="text-foreground font-mono">npx exhuma add</code>. Direct code ownership with zero lock-in.
							</p>
						</div>
						<div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary flex items-center gap-1.5">
							<BookOpen className="h-4 w-4" />
							<span>100% Owned Code</span>
						</div>
					</div>
				</div>
			</section>

			{/* Canonical Component Catalog Grid */}
			<section className="container py-16 border-t border-border">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
					<div>
						<Badge variant="outline" className="mb-2">
							Registry
						</Badge>
						<h2 className="text-heading-large text-foreground">
							Canonical Components
						</h2>
						<p className="text-xs sm:text-sm text-muted-foreground mt-1">
							All 5 core components implemented across 13 target ecosystems.
						</p>
					</div>

					<Link href="/studio">
						<Button variant="outline" size="sm" className="gap-1.5">
							<Sliders className="h-3.5 w-3.5" />
							<span>Open Studio Playground</span>
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{ALL_COMPONENTS.map((component) => (
						<ComponentCard
							key={component.slug}
							slug={component.slug}
							name={component.name}
							category={component.category}
							description={component.description}
						/>
					))}
				</div>
			</section>

			{/* The 13 Ecosystem Capability Matrix */}
			<section className="container py-16 border-t border-border">
				<CapabilityMatrix />
			</section>

			{/* Call to Action Banner */}
			<section className="container py-20 border-t border-border text-center">
				<div className="rounded-3xl border border-border bg-gradient-to-b from-card to-muted/20 p-8 sm:p-14 shadow-lg max-w-4xl mx-auto">
					<h2 className="text-heading-large text-foreground">
						Experience Studio Workbench
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl mx-auto leading-relaxed">
						Tweak layout physics, spring velocities, and responsive viewport breakpoints in real-time. Export production code across all 13 platforms simultaneously.
					</p>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
						<Link href="/studio">
							<Button size="lg" className="gap-2">
								<Sliders className="h-4 w-4" />
								<span>Launch Studio</span>
							</Button>
						</Link>
						<Link href="/docs">
							<Button variant="outline" size="lg" className="gap-2">
								<BookOpen className="h-4 w-4" />
								<span>Read Documentation</span>
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
