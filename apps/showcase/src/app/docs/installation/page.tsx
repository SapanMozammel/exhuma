import React from 'react';
import Link from 'next/link';
import { IconArrowRight as ArrowRight, IconTerminal2 as Terminal, IconCircleCheck as CheckCircle2, IconShieldCheck as ShieldCheck } from '@tabler/icons-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Button } from '@/components/ui/button';
import { PackageManagerTabs } from '@/components/showcase/PackageManagerTabs';

const tocItems = [
	{ id: 'quickstart', title: 'Interactive Starter Wizard' },
	{ id: 'package-managers', title: 'Package Managers' },
	{ id: 'cli-init', title: 'Manual Project Setup (exhuma init)' },
	{ id: 'config-file', title: 'Configuration (exhuma.json)' },
	{ id: 'adding-components', title: 'Adding Your First Component' },
	{ id: 'next-steps', title: 'Next Steps' },
];

export default function InstallationPage() {
	return (
		<div className='flex gap-10'>
			<div className='max-w-3xl min-w-0 flex-1 space-y-8'>
				{/* Breadcrumb & Title */}
				<div>
					<div className='text-muted-foreground mb-2 flex items-center gap-2 font-mono text-xs'>
						<Link href='/docs' className='hover:text-foreground transition-colors'>
							Documentation
						</Link>
						<span>/</span>
						<span className='text-foreground font-semibold'>Installation</span>
					</div>
					<h1 className='text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl'>Installation & Quickstart</h1>
					<p className='text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base'>
						Get started with Exhuma using the interactive starter wizard or install components directly into your existing project across any package manager.
					</p>
				</div>

				{/* 1. Quickstart */}
				<section id='quickstart' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>1. Interactive Starter Wizard</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>The fastest way to scaffold a new project with Exhuma pre-configured is using the official starter wizard:</p>

					<div className='py-2'>
						<PackageManagerTabs command='create exhuma@latest' />
					</div>

					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						The wizard will prompt you for your project name and preferred framework, then generate a lightweight project with self-contained tactile components ready to run.
					</p>
				</section>

				{/* 2. Package Managers */}
				<section id='package-managers' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>2. Supported Package Managers</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Exhuma supports all major modern JavaScript package managers without installing global binaries:</p>

					<div className='grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2'>
						<div className='border-border bg-card rounded-xl border p-4'>
							<div className='text-foreground mb-1 font-mono text-xs font-semibold'>pnpm</div>
							<code className='text-muted-foreground font-mono text-xs'>pnpm dlx exhuma add &lt;slug&gt;</code>
						</div>
						<div className='border-border bg-card rounded-xl border p-4'>
							<div className='text-foreground mb-1 font-mono text-xs font-semibold'>npm</div>
							<code className='text-muted-foreground font-mono text-xs'>npx exhuma add &lt;slug&gt;</code>
						</div>
						<div className='border-border bg-card rounded-xl border p-4'>
							<div className='text-foreground mb-1 font-mono text-xs font-semibold'>bun</div>
							<code className='text-muted-foreground font-mono text-xs'>bunx exhuma add &lt;slug&gt;</code>
						</div>
						<div className='border-border bg-card rounded-xl border p-4'>
							<div className='text-foreground mb-1 font-mono text-xs font-semibold'>yarn</div>
							<code className='text-muted-foreground font-mono text-xs'>yarn dlx exhuma add &lt;slug&gt;</code>
						</div>
					</div>
				</section>

				{/* 3. CLI Init */}
				<section id='cli-init' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>3. Initializing Existing Projects (exhuma init)</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>To configure Exhuma in an existing codebase, run the initialization command in your repository root:</p>

					<CodeBlock
						code={`# Initialize configuration
npx exhuma init

# Automatically detects framework (React, Next.js, Vue, Svelte, Angular, Astro...)
# Creates an exhuma.json config file`}
						language='bash'
						filename='Terminal'
					/>

					<Callout type='tip' title='Automatic Framework Detection'>
						The CLI inspects your <code>package.json</code>, framework config files (e.g. <code>next.config.js</code>, <code>svelte.config.js</code>, <code>nuxt.config.ts</code>), and file paths to configure
						the target framework contract automatically.
					</Callout>
				</section>

				{/* 4. Configuration file */}
				<section id='config-file' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>4. Configuration File (exhuma.json)</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						The generated <code>exhuma.json</code> stores your framework flavor and preferred component directory:
					</p>

					<CodeBlock
						code={`{
  "$schema": "https://exhuma.dev/schema.json",
  "flavor": "nextjs",
  "paths": {
    "components": "@/components/ui"
  }
}`}
						language='json'
						filename='exhuma.json'
					/>
				</section>

				{/* 5. Adding Components */}
				<section id='adding-components' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>5. Adding Your First Component</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Once initialized, install any canonical component with a single command:</p>

					<CodeBlock
						code={`# Install 3D Tilt Card
npx exhuma add tilt-card

# Install Stacking Cards
npx exhuma add stacking-cards

# Overwrite existing if updating
npx exhuma add horizontal-scroller --overwrite`}
						language='bash'
						filename='Terminal'
					/>
				</section>

				{/* Next Steps */}
				<section id='next-steps' className='border-border flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row'>
					<Link href='/docs'>
						<Button variant='outline' className='gap-2'>
							<span>← Overview</span>
						</Button>
					</Link>
					<Link href='/docs/cli'>
						<Button className='gap-2'>
							<span>CLI Reference Manual</span>
							<ArrowRight className='h-4 w-4' />
						</Button>
					</Link>
				</section>
			</div>

			<DocsToc items={tocItems} />
		</div>
	);
}
