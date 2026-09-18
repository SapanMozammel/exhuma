import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { PackageManagerTabs } from '@/components/showcase/PackageManagerTabs';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { getDocsSection } from '@/components/docs/docs-nav';

const HREF = '/docs/installation';

export const metadata: Metadata = {
	title: 'Installation',
	description: 'Scaffold a new project with the Exhuma starter wizard, or add components to an existing codebase with any package manager.',
};

const toc = [
	{ id: 'quickstart', title: 'Interactive Starter Wizard' },
	{ id: 'package-managers', title: 'Package Managers' },
	{ id: 'cli-init', title: 'Manual Project Setup (exhuma init)' },
	{ id: 'config-file', title: 'Configuration (exhuma.json)' },
	{ id: 'adding-components', title: 'Adding Your First Component' },
];

const PACKAGE_MANAGERS = [
	{ name: 'pnpm', command: 'pnpm dlx exhuma add <slug>' },
	{ name: 'npm', command: 'npx exhuma add <slug>' },
	{ name: 'bun', command: 'bunx exhuma add <slug>' },
	{ name: 'yarn', command: 'yarn dlx exhuma add <slug>' },
];

export default function InstallationPage() {
	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='Installation & Quickstart'
				description='Get started with Exhuma using the interactive starter wizard or install components directly into your existing project across any package manager.'
				meta={['pnpm · npm · bun · yarn', 'No global install']}
			/>

			<DocsSection id='quickstart' index={1} label='Quickstart' title='Interactive Starter Wizard'>
				<DocsProse>The fastest way to scaffold a new project with Exhuma pre-configured is using the official starter wizard:</DocsProse>
				<PackageManagerTabs command='create exhuma@latest' />
				<DocsProse>The wizard will prompt you for your project name and preferred framework, then generate a lightweight project with self-contained tactile components ready to run.</DocsProse>
			</DocsSection>

			<DocsSection id='package-managers' index={2} label='Package Managers' title='Supported Package Managers'>
				<DocsProse>Exhuma supports all major modern JavaScript package managers without installing global binaries:</DocsProse>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					{PACKAGE_MANAGERS.map((manager) => (
						<DocsSpecCard key={manager.name} title={manager.name}>
							<code className='font-mono'>{manager.command}</code>
						</DocsSpecCard>
					))}
				</div>
			</DocsSection>

			<DocsSection id='cli-init' index={3} label='exhuma init' title='Initializing Existing Projects (exhuma init)'>
				<DocsProse>To configure Exhuma in an existing codebase, run the initialization command in your repository root:</DocsProse>
				<CodeBlock
					code={`# Initialize configuration
npx exhuma init

# Automatically detects framework (React, Next.js, Vue, Svelte, Angular, Astro...)
# Creates an exhuma.json config file`}
					language='bash'
					filename='Terminal'
				/>
				<Callout type='tip' title='Automatic Framework Detection'>
					The CLI inspects your <code className='text-foreground font-mono'>package.json</code>, framework config files (e.g. <code className='text-foreground font-mono'>next.config.js</code>,{' '}
					<code className='text-foreground font-mono'>svelte.config.js</code>, <code className='text-foreground font-mono'>nuxt.config.ts</code>), and file paths to configure the target framework contract
					automatically.
				</Callout>
			</DocsSection>

			<DocsSection id='config-file' index={4} label='Configuration' title='Configuration File (exhuma.json)'>
				<DocsProse>
					The generated <code className='text-foreground font-mono'>exhuma.json</code> stores your framework flavor and preferred component directory:
				</DocsProse>
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
			</DocsSection>

			<DocsSection id='adding-components' index={5} label='First Component' title='Adding Your First Component'>
				<DocsProse>Once initialized, install any canonical component with a single command:</DocsProse>
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
			</DocsSection>
		</DocsPage>
	);
}
