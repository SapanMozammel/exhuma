import React from 'react';
import Link from 'next/link';
import { IconArrowRight as ArrowRight, IconTerminal2 as Terminal, IconShieldCheck as ShieldCheck, IconBolt as Zap } from '@tabler/icons-react';
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
		<div className='flex gap-10'>
			<div className='max-w-3xl min-w-0 flex-1 space-y-8'>
				{/* Breadcrumb & Title */}
				<div>
					<div className='text-muted-foreground mb-2 flex items-center gap-2 font-mono text-xs'>
						<Link href='/docs' className='hover:text-foreground transition-colors'>
							Documentation
						</Link>
						<span>/</span>
						<span className='text-foreground font-semibold'>CLI Reference</span>
					</div>
					<h1 className='text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl'>CLI Reference & Commands</h1>
					<p className='text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base'>
						The official <code>exhuma</code> command-line interface provides autonomous framework detection, canonical component retrieval, and offline code generation.
					</p>
				</div>

				{/* 1. CLI Overview */}
				<section id='cli-overview' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>1. CLI Overview</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						The CLI package is published under <code>exhuma</code> on npm. It can be invoked on-demand via <code>npx</code>, <code>pnpm dlx</code>, <code>bunx</code>, or <code>yarn dlx</code> without
						requiring global installation:
					</p>

					<CodeBlock
						code={`# Display version
npx exhuma --version

# Display global help
npx exhuma --help`}
						language='bash'
						filename='Terminal'
					/>
				</section>

				{/* 2. exhuma init */}
				<section id='command-init' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>2. exhuma init</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Configures Exhuma within your existing project by generating an <code>exhuma.json</code> configuration file.
					</p>

					<CodeBlock
						code={`# Interactive initialization
npx exhuma init

# Non-interactive initialization with explicit flavor
npx exhuma init --flavor=svelte --path=src/lib/components -y`}
						language='bash'
						filename='Terminal'
					/>

					<div className='overflow-x-auto pt-2'>
						<table className='w-full border-collapse text-left text-xs'>
							<thead>
								<tr className='border-border text-muted-foreground border-b font-mono'>
									<th className='px-3 py-2'>Flag</th>
									<th className='px-3 py-2'>Type</th>
									<th className='px-3 py-2'>Description</th>
								</tr>
							</thead>
							<tbody className='divide-border divide-y'>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--flavor, -f</td>
									<td className='text-muted-foreground px-3 py-2'>string</td>
									<td className='text-muted-foreground px-3 py-2'>Target framework contract (react, nextjs, svelte, vue, etc.)</td>
								</tr>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--path, -p</td>
									<td className='text-muted-foreground px-3 py-2'>string</td>
									<td className='text-muted-foreground px-3 py-2'>Custom destination directory for components</td>
								</tr>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--yes, -y</td>
									<td className='text-muted-foreground px-3 py-2'>boolean</td>
									<td className='text-muted-foreground px-3 py-2'>Skip confirmation prompts and accept defaults</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* 3. exhuma add */}
				<section id='command-add' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>3. exhuma add &lt;slug&gt;</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Retrieves and writes the canonical component implementation into your workspace.</p>

					<CodeBlock
						code={`# Add single component
npx exhuma add stacking-cards

# Override target flavor on-the-fly
npx exhuma add tilt-card --flavor=flutter

# Overwrite existing component files
npx exhuma add css-masonry --overwrite

# Add all canonical components at once
npx exhuma add --all`}
						language='bash'
						filename='Terminal'
					/>

					<div className='overflow-x-auto pt-2'>
						<table className='w-full border-collapse text-left text-xs'>
							<thead>
								<tr className='border-border text-muted-foreground border-b font-mono'>
									<th className='px-3 py-2'>Flag</th>
									<th className='px-3 py-2'>Type</th>
									<th className='px-3 py-2'>Description</th>
								</tr>
							</thead>
							<tbody className='divide-border divide-y'>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--all, -a</td>
									<td className='text-muted-foreground px-3 py-2'>boolean</td>
									<td className='text-muted-foreground px-3 py-2'>Installs all 5 canonical components</td>
								</tr>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--overwrite, -o</td>
									<td className='text-muted-foreground px-3 py-2'>boolean</td>
									<td className='text-muted-foreground px-3 py-2'>Forces file overwrite if already present</td>
								</tr>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--flavor, -f</td>
									<td className='text-muted-foreground px-3 py-2'>string</td>
									<td className='text-muted-foreground px-3 py-2'>Target framework contract override</td>
								</tr>
								<tr>
									<td className='text-primary px-3 py-2 font-mono'>--path, -p</td>
									<td className='text-muted-foreground px-3 py-2'>string</td>
									<td className='text-muted-foreground px-3 py-2'>Explicit destination directory for this command</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* 4. exhuma list */}
				<section id='command-list' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>4. exhuma list</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Inspects available canonical components, categories, and supported frameworks:</p>

					<CodeBlock code={`npx exhuma list`} language='bash' filename='Terminal' />
				</section>

				{/* 5. exhuma build */}
				<section id='command-build' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>5. exhuma build</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Generates static registry JSON files for CDN hosting (such as Vercel Edge output in <code>public/registry/*.json</code>).
					</p>

					<CodeBlock code={`npx exhuma build --output=public/registry`} language='bash' filename='Terminal' />
				</section>

				{/* 6. Offline Guarantee */}
				<section id='offline-guarantee' className='border-border space-y-3 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>6. Offline Embedded Guarantee</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Unlike other CLI tools that fail if internet access is interrupted or an external registry server is down, <code>exhuma</code> packages an embedded fallback dictionary directly within the binary.
					</p>

					<Callout type='important' title='100% Offline Capability'>
						If network access fails or no external CDN is configured, the CLI falls back seamlessly to its embedded canonical dictionary. Your builds will never fail in isolated CI/CD environments.
					</Callout>
				</section>

				{/* Next Steps */}
				<section id='next-steps' className='border-border flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row'>
					<Link href='/docs/installation'>
						<Button variant='outline' className='gap-2'>
							<span>← Installation</span>
						</Button>
					</Link>
					<Link href='/docs/ecosystems'>
						<Button className='gap-2'>
							<span>13 Ecosystem Contracts</span>
							<ArrowRight className='h-4 w-4' />
						</Button>
					</Link>
				</section>
			</div>

			<DocsToc items={tocItems} />
		</div>
	);
}
