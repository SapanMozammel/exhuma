import type { Metadata } from 'next';
import '@/styles/global.scss';


import { Providers } from '@/providers';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalFooter } from '@/components/layout/GlobalFooter';
import { CommandPalette } from '@/components/command/CommandPalette';

export const metadata: Metadata = {
	title: 'Exhuma — Universal Component Architecture for 13 Ecosystems',
	description:
		'Autonomous tactile interactions, masonry layout engines, and production-ready routing architecture adapted natively for React, Next.js, Vue, Svelte, Angular, Solid, Astro, Blade, Vanilla, WordPress, Web Components, React Native, and Flutter.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary"
			>
				<Providers>
					<div className="relative flex min-h-screen flex-col">
						<GlobalHeader />
						<main className="flex-1">{children}</main>
						<GlobalFooter />
						<CommandPalette />
					</div>
				</Providers>
			</body>
		</html>
	);
}
