'use client';

import React from 'react';
import { DashboardLayout } from '@exhuma/router';

export default function DashboardPreviewPage() {
	return (
		<DashboardLayout
			sidebar={
				<div className="flex h-full flex-col justify-between p-6">
					<div>
						<a href="/" className="flex items-center gap-2 mb-8">
							<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
								E
							</span>
							<span className="font-bold tracking-tight text-white">
								Exhuma Studio
							</span>
						</a>

						<nav className="space-y-1">
							{[
								{ label: 'Overview', active: true },
								{ label: 'Cards Inspector', active: false },
								{ label: 'Layout Grid Sandbox', active: false },
								{ label: 'Route Schemas', active: false },
								{ label: 'Settings', active: false },
							].map((item, idx) => (
								<div
									key={idx}
									className={`rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
										item.active
											? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
											: 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
									}`}
								>
									{item.label}
								</div>
							))}
						</nav>
					</div>

					<div className="border-t border-zinc-800 pt-4">
						<a
							href="/"
							className="text-xs text-zinc-500 hover:text-zinc-300 block mb-2"
						>
							&larr; Exit to Public Showcase
						</a>
						<div className="text-[10px] text-zinc-600 font-mono">
							Exhuma v0.1.0 • Dev Mode
						</div>
					</div>
				</div>
			}
			header={
				<div className="flex h-16 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-6 backdrop-blur-md">
					<div className="text-sm font-semibold text-white">
						Studio Dashboard Preview
					</div>
					<div className="flex items-center gap-3">
						<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
						<span className="text-xs text-zinc-400 font-mono">
							Workspace Connected
						</span>
					</div>
				</div>
			}
			breadcrumbs={
				<div className="flex items-center gap-2">
					<span className="text-zinc-500">Exhuma</span>
					<span className="text-zinc-600">/</span>
					<span className="text-zinc-500">Studio</span>
					<span className="text-zinc-600">/</span>
					<span className="text-zinc-200">Overview</span>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Stat Cards */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
						<div className="text-xs font-medium text-zinc-400">Total Packages</div>
						<div className="text-2xl font-bold text-white mt-1">4</div>
						<div className="text-xs text-emerald-400 mt-2">
							cards, layouts, router, core
						</div>
					</div>
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
						<div className="text-xs font-medium text-zinc-400">Bundle Status</div>
						<div className="text-2xl font-bold text-white mt-1">ESM + CJS</div>
						<div className="text-xs text-teal-400 mt-2">Dual tsup output</div>
					</div>
					<div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
						<div className="text-xs font-medium text-zinc-400">Stars Preserved</div>
						<div className="text-2xl font-bold text-white mt-1">2 ★</div>
						<div className="text-xs text-cyan-400 mt-2">
							From react-toolkit repo
						</div>
					</div>
				</div>

				{/* Info Box */}
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
					<h3 className="text-base font-bold text-white mb-2">
						DashboardLayout Integration
					</h3>
					<p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
						This dashboard demonstrates the full power of &lt;DashboardLayout&gt; from
						@exhuma/router. It features a responsive sidebar slot, top navigation
						rail, dynamic breadcrumbs, and a scroll-safe content viewport.
					</p>
				</div>
			</div>
		</DashboardLayout>
	);
}
