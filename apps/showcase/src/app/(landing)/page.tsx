import React from 'react';
import Link from 'next/link';
import {
	IconAdjustments as Sliders,
	IconStack2 as Layers,
	IconTerminal2 as Terminal,
	IconArrowRight as ArrowRight,
	IconSparkles as Sparkles,
	IconBook2 as BookOpen,
	IconShieldCheck as ShieldCheck,
	IconBolt as Zap,
} from '@tabler/icons-react';
import { ALL_COMPONENTS } from '@/registry';
import { PackageManagerTabs } from '@/components/showcase/PackageManagerTabs';
import { LandingWorkbench } from '@/components/showcase/LandingWorkbench';
import { CapabilityMatrix } from '@/components/showcase/CapabilityMatrix';
import { ComponentCard } from '@/components/showcase/ComponentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
	return (
		<div className='relative min-h-screen'>
			{/* Ambient Gradient Glow */}
			<div className='from-primary/10 via-primary/5 pointer-events-none absolute top-0 left-1/2 h-[350px] w-full max-w-6xl -translate-x-1/2 bg-gradient-to-b to-transparent blur-3xl' />

			{/* Hero Section */}
			<section className='relative container pt-16 pb-12 text-center sm:pt-24 sm:pb-16'>
				<div className='border-border bg-muted/60 text-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold backdrop-blur-md'>
					<Sparkles className='text-primary h-3.5 w-3.5 animate-pulse' />
					<span>Universal Component Architecture across 13 Ecosystems</span>
				</div>

				<h1 className='text-heading-xlarge text-foreground mx-auto max-w-4xl'>
					Autonomous Tactile Interactions. <span className='text-muted-foreground'>Zero Monolithic Lock-in.</span>
				</h1>

				<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg'>
					One mathematical engine authored natively into 13 production-grade contracts. Copy, customize, and own the code across React, Next.js 15, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla
					JS, WordPress, Web Components, React Native, and Flutter.
				</p>

				{/* Package Manager Quick Copy */}
				<div className='mt-8 flex justify-center'>
					<PackageManagerTabs command='exhuma add tilt-card' />
				</div>

				{/* Interactive Flagship Multi-Component Workbench */}
				<div className='mx-auto mt-12 max-w-5xl text-left'>
					<LandingWorkbench />
				</div>
			</section>

			{/* 4 Architectural Guarantees */}
			<section className='border-border container border-t py-16'>
				<div className='mx-auto mb-12 max-w-2xl text-center'>
					<Badge variant='outline' className='mb-2'>
						Guarantees
					</Badge>
					<h2 className='text-heading-large text-foreground'>Engineered for Absolute Ownership</h2>
					<p className='text-muted-foreground mt-2 text-xs sm:text-sm'>Stop fighting bloated NPM dependency trees. Exhuma adapts idiomatic component code directly into your repository.</p>
				</div>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
					<div className='border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm'>
						<div>
							<div className='bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-xl'>
								<Zap className='h-5 w-5' />
							</div>
							<h3 className='text-foreground text-base font-bold'>Zero Runtime Debt</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								No runtime bloatware or heavy external animation dependencies. Written in native primitives with CSS hardware acceleration and 60 FPS spring physics.
							</p>
						</div>
						<div className='border-border/60 mt-4 flex items-center gap-1.5 border-t pt-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400'>
							<ShieldCheck className='h-4 w-4' />
							<span>Zero Bloatware</span>
						</div>
					</div>

					<div className='border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm'>
						<div>
							<div className='bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-xl'>
								<Layers className='h-5 w-5' />
							</div>
							<h3 className='text-foreground text-base font-bold'>13 Native Ecosystems</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Full syntactic parity across React, Next.js, Vue 3, Svelte 5 (Runes), Angular 18+ (Signals), SolidJS, Astro, Laravel Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.
							</p>
						</div>
						<div className='border-border/60 text-primary mt-4 flex items-center gap-1.5 border-t pt-3 font-mono text-[11px]'>
							<Terminal className='h-4 w-4' />
							<span>13 Target Contracts</span>
						</div>
					</div>

					<div className='border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm'>
						<div>
							<div className='bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-xl'>
								<ShieldCheck className='h-5 w-5' />
							</div>
							<h3 className='text-foreground text-base font-bold'>Memory & Lifecycle Safe</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Guaranteed listener detaching, ResizeObserver disconnects, and spring cancellation on component unmount. Zero memory leaks across client transitions.
							</p>
						</div>
						<div className='border-border/60 mt-4 flex items-center gap-1.5 border-t pt-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400'>
							<ShieldCheck className='h-4 w-4' />
							<span>Clean Unmounts</span>
						</div>
					</div>

					<div className='border-border bg-card flex flex-col justify-between rounded-2xl border p-6 shadow-sm'>
						<div>
							<div className='bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-xl'>
								<Terminal className='h-5 w-5' />
							</div>
							<h3 className='text-foreground text-base font-bold'>Autonomous CLI</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Interactive project initialization and component installation via <code className='text-foreground font-mono'>npx exhuma add</code>. Direct code ownership with zero lock-in.
							</p>
						</div>
						<div className='border-border/60 text-primary mt-4 flex items-center gap-1.5 border-t pt-3 font-mono text-[11px]'>
							<BookOpen className='h-4 w-4' />
							<span>100% Owned Code</span>
						</div>
					</div>
				</div>
			</section>

			{/* Canonical Component Catalog Grid */}
			<section className='border-border container border-t py-16'>
				<div className='mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
					<div>
						<Badge variant='outline' className='mb-2'>
							Registry
						</Badge>
						<h2 className='text-heading-large text-foreground'>Canonical Components</h2>
						<p className='text-muted-foreground mt-1 text-xs sm:text-sm'>All 23 components engineered under the Exhuma Kinetic Methodology across 13 target ecosystems.</p>
					</div>

					<Link href='/studio'>
						<Button variant='outline' size='sm' className='gap-1.5'>
							<Sliders className='h-3.5 w-3.5' />
							<span>Open Studio Playground</span>
						</Button>
					</Link>
				</div>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{ALL_COMPONENTS.map((component) => (
						<ComponentCard key={component.slug} slug={component.slug} name={component.name} category={component.category} description={component.description} />
					))}
				</div>
			</section>

			{/* The 13 Ecosystem Capability Matrix */}
			<section className='border-border container border-t py-16'>
				<CapabilityMatrix />
			</section>

			{/* Call to Action Banner */}
			<section className='border-border container border-t py-20 text-center'>
				<div className='border-border from-card to-muted/20 mx-auto max-w-4xl rounded-3xl border bg-gradient-to-b p-8 shadow-lg sm:p-14'>
					<h2 className='text-heading-large text-foreground'>Experience Studio Workbench</h2>
					<p className='text-muted-foreground mx-auto mt-2 max-w-xl text-xs leading-relaxed sm:text-sm'>
						Tweak layout physics, spring velocities, and responsive viewport breakpoints in real-time. Export production code across all 13 platforms simultaneously.
					</p>
					<div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
						<Link href='/studio'>
							<Button size='lg' className='gap-2'>
								<Sliders className='h-4 w-4' />
								<span>Launch Studio</span>
							</Button>
						</Link>
						<Link href='/docs'>
							<Button variant='outline' size='lg' className='gap-2'>
								<BookOpen className='h-4 w-4' />
								<span>Read Documentation</span>
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
