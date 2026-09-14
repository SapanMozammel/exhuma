import React from 'react';
import Link from 'next/link';
import {
  IconArrowRight as ArrowRight,
  IconTerminal2 as Terminal,
  IconShieldCheck as ShieldCheck,
  IconBolt as Zap,
} from '@tabler/icons-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Button } from '@/components/ui/button';

const tocItems = [
	{ id: 'cli-overview', title: 'CLI Overview' },
	{ id: 'command-init', title: 'exhuma init' },
	{ id: 'command-add', title: 'exhuma add' },
	{ id: 'command-list', title: 'exhuma list' },
	{ id: 'command-build', title: 'exhuma build' },
	{ id: 'offline-guarantee', title: 'Offline Embedded Guarantee' },
	{ id: 'next-steps', title: 'Next Steps' },
];

export default function CliReferencePage() {
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
						<span className="text-foreground font-semibold">CLI Reference</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						CLI Reference & Commands
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
						The official <code>exhuma</code> command-line interface provides autonomous framework detection, canonical component retrieval, and offline code generation.
					</p>
				</div>

				{/* 1. CLI Overview */}
				<section id="cli-overview" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						1. CLI Overview
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						The CLI package is published under <code>exhuma</code> on npm. It can be invoked on-demand via <code>npx</code>, <code>pnpm dlx</code>, <code>bunx</code>, or <code>yarn dlx</code> without requiring global installation:
					</p>

					<CodeBlock
						code={`# Display version
npx exhuma --version

# Display global help
npx exhuma --help`}
						language="bash"
						filename="Terminal"
					/>
				</section>

				{/* 2. exhuma init */}
				<section id="command-init" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						2. exhuma init
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Configures Exhuma within your existing project by generating an <code>exhuma.json</code> configuration file.
					</p>

					<CodeBlock
						code={`# Interactive initialization
npx exhuma init

# Non-interactive initialization with explicit flavor
npx exhuma init --flavor=svelte --path=src/lib/components -y`}
						language="bash"
						filename="Terminal"
					/>

					<div className="overflow-x-auto pt-2">
						<table className="w-full text-left border-collapse text-xs">
							<thead>
								<tr className="border-b border-border text-muted-foreground font-mono">
									<th className="py-2 px-3">Flag</th>
									<th className="py-2 px-3">Type</th>
									<th className="py-2 px-3">Description</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--flavor, -f</td>
									<td className="py-2 px-3 text-muted-foreground">string</td>
									<td className="py-2 px-3 text-muted-foreground">Target framework contract (react, nextjs, svelte, vue, etc.)</td>
								</tr>
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--path, -p</td>
									<td className="py-2 px-3 text-muted-foreground">string</td>
									<td className="py-2 px-3 text-muted-foreground">Custom destination directory for components</td>
								</tr>
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--yes, -y</td>
									<td className="py-2 px-3 text-muted-foreground">boolean</td>
									<td className="py-2 px-3 text-muted-foreground">Skip confirmation prompts and accept defaults</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* 3. exhuma add */}
				<section id="command-add" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						3. exhuma add &lt;slug&gt;
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Retrieves and writes the canonical component implementation into your workspace.
					</p>

					<CodeBlock
						code={`# Add single component
npx exhuma add stacking-cards

# Override target flavor on-the-fly
npx exhuma add tilt-card --flavor=flutter

# Overwrite existing component files
npx exhuma add css-masonry --overwrite

# Add all canonical components at once
npx exhuma add --all`}
						language="bash"
						filename="Terminal"
					/>

					<div className="overflow-x-auto pt-2">
						<table className="w-full text-left border-collapse text-xs">
							<thead>
								<tr className="border-b border-border text-muted-foreground font-mono">
									<th className="py-2 px-3">Flag</th>
									<th className="py-2 px-3">Type</th>
									<th className="py-2 px-3">Description</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--all, -a</td>
									<td className="py-2 px-3 text-muted-foreground">boolean</td>
									<td className="py-2 px-3 text-muted-foreground">Installs all 5 canonical components</td>
								</tr>
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--overwrite, -o</td>
									<td className="py-2 px-3 text-muted-foreground">boolean</td>
									<td className="py-2 px-3 text-muted-foreground">Forces file overwrite if already present</td>
								</tr>
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--flavor, -f</td>
									<td className="py-2 px-3 text-muted-foreground">string</td>
									<td className="py-2 px-3 text-muted-foreground">Target framework contract override</td>
								</tr>
								<tr>
									<td className="py-2 px-3 font-mono text-primary">--path, -p</td>
									<td className="py-2 px-3 text-muted-foreground">string</td>
									<td className="py-2 px-3 text-muted-foreground">Explicit destination directory for this command</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* 4. exhuma list */}
				<section id="command-list" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						4. exhuma list
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Inspects available canonical components, categories, and supported frameworks:
					</p>

					<CodeBlock
						code={`npx exhuma list`}
						language="bash"
						filename="Terminal"
					/>
				</section>

				{/* 5. exhuma build */}
				<section id="command-build" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						5. exhuma build
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Generates static registry JSON files for CDN hosting (such as Vercel Edge output in <code>public/registry/*.json</code>).
					</p>

					<CodeBlock
						code={`npx exhuma build --output=public/registry`}
						language="bash"
						filename="Terminal"
					/>
				</section>

				{/* 6. Offline Guarantee */}
				<section id="offline-guarantee" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						6. Offline Embedded Guarantee
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Unlike other CLI tools that fail if internet access is interrupted or an external registry server is down, <code>exhuma</code> packages an embedded fallback dictionary directly within the binary.
					</p>

					<Callout type="important" title="100% Offline Capability">
						If network access fails or no external CDN is configured, the CLI falls back seamlessly to its embedded canonical dictionary. Your builds will never fail in isolated CI/CD environments.
					</Callout>
				</section>

				{/* Next Steps */}
				<section id="next-steps" className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<Link href="/docs/installation">
						<Button variant="outline" className="gap-2">
							<span>← Installation</span>
						</Button>
					</Link>
					<Link href="/docs/ecosystems">
						<Button className="gap-2">
							<span>13 Ecosystem Contracts</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</section>
			</div>

			<DocsToc items={tocItems} />
		</div>
	);
}
