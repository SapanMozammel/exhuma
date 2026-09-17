import React from 'react';
import Link from 'next/link';
import { IconSparkles as Sparkles, IconPalette as Palette, IconSun as Sun, IconMoon as Moon, IconDeviceLaptop as Laptop, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const tocItems = [
	{ id: 'dual-engine', title: 'Dual-Theme Architecture' },
	{ id: 'css-variables', title: 'Semantic CSS Variables' },
	{ id: 'tailwind-v4', title: 'Tailwind CSS v4 Integration' },
	{ id: 'next-themes', title: 'NextThemes Hydration Setup' },
	{ id: 'palette-customization', title: 'Customizing Theme Palettes' },
];

export default function ThemingPage() {
	return (
		<div className='flex gap-10'>
			<div className='max-w-3xl min-w-0 flex-1 space-y-10'>
				{/* Breadcrumb & Header */}
				<div>
					<div className='text-muted-foreground mb-2 flex items-center gap-2 font-mono text-xs'>
						<Link href='/docs' className='hover:text-foreground transition-colors'>
							Documentation
						</Link>
						<span>/</span>
						<span className='text-foreground font-semibold'>Theming</span>
					</div>
					<h1 className='text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl'>Theming & Dark Mode</h1>
					<p className='text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base'>
						Exhuma features an unopinionated, high-contrast dual-theme engine built on semantic CSS variables and Tailwind CSS v4 design tokens.
					</p>
				</div>

				{/* Dual Theme Engine */}
				<section id='dual-engine' className='border-border space-y-4 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Dual-Theme Architecture</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Every component in Exhuma automatically respects your application's current theme state. We avoid hardcoded hex codes like <code className='text-foreground font-mono'>#000000</code> or{' '}
						<code className='text-foreground font-mono'>#ffffff</code>, instead linking all backgrounds, borders, typography, and accents to CSS variables declared in HSL.
					</p>

					<div className='grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3'>
						<div className='border-border bg-card space-y-2 rounded-xl border p-4'>
							<div className='text-foreground flex items-center gap-2 text-xs font-bold'>
								<Sun className='h-4 w-4 shrink-0 text-amber-500' />
								<span>Light Theme</span>
							</div>
							<p className='text-muted-foreground text-2xs leading-relaxed'>Optimized for crisp readability in high-ambient lighting with gentle contrast borders.</p>
						</div>

						<div className='border-border bg-card space-y-2 rounded-xl border p-4'>
							<div className='text-foreground flex items-center gap-2 text-xs font-bold'>
								<Moon className='h-4 w-4 shrink-0 text-indigo-400' />
								<span>Dark Theme</span>
							</div>
							<p className='text-muted-foreground text-2xs leading-relaxed'>OLED-tuned true blacks and deep neutral slates matching Raycast and shadcn/ui.</p>
						</div>

						<div className='border-border bg-card space-y-2 rounded-xl border p-4'>
							<div className='text-foreground flex items-center gap-2 text-xs font-bold'>
								<Laptop className='text-primary h-4 w-4 shrink-0' />
								<span>System Sync</span>
							</div>
							<p className='text-muted-foreground text-2xs leading-relaxed'>Automatic synchronization with operating system dark mode preferences with zero layout flash.</p>
						</div>
					</div>

					<Callout type='tip' title='Global Keyboard Shortcut'>
						You can cycle themes instantly anywhere on this documentation site by pressing <span className='kbd text-3xs'>⌘⌥T</span> (or Alt+T on Windows/Linux).
					</Callout>
				</section>

				{/* Semantic CSS Variables */}
				<section id='css-variables' className='border-border space-y-4 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Semantic CSS Variables</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Themes are declared in <code className='text-foreground font-mono'>src/styles/themes.scss</code>:
					</p>

					<CodeBlock
						code={`:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 9%;
  --radius: 0.75rem;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 4.8%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 4.8%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
}`}
						language='typescript'
						filename='themes.scss'
					/>
				</section>

				{/* Tailwind v4 */}
				<section id='tailwind-v4' className='border-border space-y-4 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Tailwind CSS v4 Integration</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						In Tailwind CSS v4, tokens are declared directly using the <code className='text-foreground font-mono'>@theme</code> directive without needing a legacy{' '}
						<code className='text-foreground font-mono'>tailwind.config.js</code> file:
					</p>

					<CodeBlock
						code={`@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
}`}
						language='typescript'
						filename='themes.scss (@theme)'
					/>
				</section>

				{/* NextThemes */}
				<section id='next-themes' className='border-border space-y-4 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>NextThemes Hydration Setup</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>To guarantee seamless theme switching without hydration mismatch warnings in Next.js 15 App Router:</p>

					<CodeBlock
						code={`// src/providers/theme-provider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}`}
						language='typescript'
						filename='theme-provider.tsx'
					/>
				</section>

				{/* Customizing Theme Palettes */}
				<section id='palette-customization' className='border-border space-y-4 border-t pt-4'>
					<h2 className='text-foreground text-xl font-bold tracking-tight'>Customizing Theme Palettes</h2>
					<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Want an emerald, violet, or amber brand identity? Simply override the <code className='text-foreground font-mono'>--primary</code> variable in your root CSS. Exhuma components will instantly
						inherit your brand styling across all 13 framework contracts.
					</p>
				</section>

				{/* Next Navigation */}
				<div className='border-border flex items-center justify-between border-t pt-6'>
					<Link href='/docs/installation' className='text-muted-foreground hover:text-foreground text-xs'>
						← Installation
					</Link>
					<Link href='/docs/cli'>
						<Button className='gap-2'>
							<span>CLI Reference</span>
							<ArrowRight className='h-4 w-4' />
						</Button>
					</Link>
				</div>
			</div>

			{/* Table of Contents */}
			<DocsToc items={tocItems} />
		</div>
	);
}
