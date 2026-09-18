import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import '@/styles/global.scss';

import { Providers } from '@/providers';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalFooter } from '@/components/layout/GlobalFooter';
import { FooterVisibility } from '@/components/layout/FooterVisibility';
import { CommandPalette } from '@/components/command/CommandPalette';
import { ECOSYSTEM_LABELS } from '@/registry';

const bricolageGrotesque = Bricolage_Grotesque({
	subsets: ['latin'],
	weight: ['700', '800'],
	variable: '--font-display',
	display: 'swap',
});

export const metadata: Metadata = {
	title: `Exhuma — Universal Component Architecture for ${Object.keys(ECOSYSTEM_LABELS).length} Ecosystems`,
	description:
		'Autonomous tactile interactions, masonry layout engines, and production-ready routing architecture adapted natively for React, Next.js, Vue, Svelte, Angular, Solid, Astro, Blade, Vanilla, WordPress, Web Components, React Native, and Flutter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className={bricolageGrotesque.variable}>
			<body suppressHydrationWarning className='bg-background text-foreground selection:bg-primary/10 selection:text-primary min-h-screen antialiased'>
				<Providers>
					<div className='relative flex min-h-screen flex-col'>
						<GlobalHeader />
						<main className='flex-1'>{children}</main>
						<FooterVisibility>
							<GlobalFooter />
						</FooterVisibility>
						<CommandPalette />
					</div>
				</Providers>
			</body>
		</html>
	);
}
