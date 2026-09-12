import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Exhuma — Unified Developer Suite for Modern React',
	description:
		'Autonomous tactile interactions, masonry layout engines, and production-ready routing architecture.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
				{children}
			</body>
		</html>
	);
}
