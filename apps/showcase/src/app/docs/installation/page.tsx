import React from 'react';
import Link from 'next/link';
import {
  IconArrowRight as ArrowRight,
  IconTerminal2 as Terminal,
  IconCircleCheck as CheckCircle2,
  IconShieldCheck as ShieldCheck,
} from '@tabler/icons-react';
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
		<div className="flex gap-10">
			<div className="flex-1 min-w-0 space-y-8 max-w-3xl">
				{/* Breadcrumb & Title */}
				<div>
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
						<Link href="/docs" className="hover:text-foreground transition-colors">
							Documentation
						</Link>
						<span>/</span>
						<span className="text-foreground font-semibold">Installation</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						Installation & Quickstart
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
						Get started with Exhuma using the interactive starter wizard or install components directly into your existing project across any package manager.
					</p>
				</div>

				{/* 1. Quickstart */}
				<section id="quickstart" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						1. Interactive Starter Wizard
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						The fastest way to scaffold a new project with Exhuma pre-configured is using the official starter wizard:
					</p>

					<div className="py-2">
						<PackageManagerTabs command="create exhuma@latest" />
					</div>

					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						The wizard will prompt you for your project name and preferred framework, then generate a lightweight project with self-contained tactile components ready to run.
					</p>
				</section>

				{/* 2. Package Managers */}
				<section id="package-managers" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						2. Supported Package Managers
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Exhuma supports all major modern JavaScript package managers without installing global binaries:
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1 font-mono">
								pnpm
							</div>
							<code className="text-xs font-mono text-muted-foreground">
								pnpm dlx exhuma add &lt;slug&gt;
							</code>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1 font-mono">
								npm
							</div>
							<code className="text-xs font-mono text-muted-foreground">
								npx exhuma add &lt;slug&gt;
							</code>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1 font-mono">
								bun
							</div>
							<code className="text-xs font-mono text-muted-foreground">
								bunx exhuma add &lt;slug&gt;
							</code>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1 font-mono">
								yarn
							</div>
							<code className="text-xs font-mono text-muted-foreground">
								yarn dlx exhuma add &lt;slug&gt;
							</code>
						</div>
					</div>
				</section>

				{/* 3. CLI Init */}
				<section id="cli-init" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						3. Initializing Existing Projects (exhuma init)
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						To configure Exhuma in an existing codebase, run the initialization command in your repository root:
					</p>

					<CodeBlock
						code={`# Initialize configuration
npx exhuma init

# Automatically detects framework (React, Next.js, Vue, Svelte, Angular, Astro...)
# Creates an exhuma.json config file`}
						language="bash"
						filename="Terminal"
					/>

					<Callout type="tip" title="Automatic Framework Detection">
						The CLI inspects your <code>package.json</code>, framework config files (e.g. <code>next.config.js</code>, <code>svelte.config.js</code>, <code>nuxt.config.ts</code>), and file paths to configure the target framework contract automatically.
					</Callout>
				</section>

				{/* 4. Configuration file */}
				<section id="config-file" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						4. Configuration File (exhuma.json)
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
						language="json"
						filename="exhuma.json"
					/>
				</section>

				{/* 5. Adding Components */}
				<section id="adding-components" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						5. Adding Your First Component
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Once initialized, install any canonical component with a single command:
					</p>

					<CodeBlock
						code={`# Install 3D Tilt Card
npx exhuma add tilt-card

# Install Stacking Cards
npx exhuma add stacking-cards

# Overwrite existing if updating
npx exhuma add horizontal-scroller --overwrite`}
						language="bash"
						filename="Terminal"
					/>
				</section>

				{/* Next Steps */}
				<section id="next-steps" className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<Link href="/docs">
						<Button variant="outline" className="gap-2">
							<span>← Overview</span>
						</Button>
					</Link>
					<Link href="/docs/cli">
						<Button className="gap-2">
							<span>CLI Reference Manual</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</section>
			</div>

			<DocsToc items={tocItems} />
		</div>
	);
}
