'use client';

import React from 'react';
import { Footer, Header, LandingLayout } from '@exhuma/router';

export default function LandingRouteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<LandingLayout
			header={
				<Header
					brand={
						<a href="/" className="flex items-center gap-2 group">
							<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-sm group-hover:scale-105 transition-transform">
								E
							</span>
							<span className="font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
								Exhuma
							</span>
						</a>
					}
					navItems={[
						{ label: 'Overview', href: '/' },
						{ label: 'Interactive Cards', href: '/cards' },
						{ label: 'Layout Engines', href: '/layouts' },
						{ label: 'Studio Preview', href: '/dashboard' },
					]}
					actions={
						<div className="flex items-center gap-3">
							<a
								href="/access"
								className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
							>
								Sign In
							</a>
							<a
								href="https://github.com/SapanMozammel/react-toolkit"
								target="_blank"
								rel="noreferrer"
								className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-sm shadow-emerald-500/20"
							>
								GitHub
							</a>
						</div>
					}
				/>
			}
			footer={
				<Footer
					brand={
						<div className="flex items-center gap-2">
							<div className="h-5 w-5 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
								E
							</div>
							<span className="text-sm font-semibold text-zinc-200">
								Exhuma Suite
							</span>
						</div>
					}
					links={[
						{ label: 'Cards', href: '/cards' },
						{ label: 'Layouts', href: '/layouts' },
						{ label: 'Dashboard', href: '/dashboard' },
						{ label: 'Auth', href: '/access' },
					]}
				/>
			}
		>
			{children}
		</LandingLayout>
	);
}
