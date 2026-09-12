import React from 'react';

export default function HomePage() {
	return (
		<div className="relative overflow-hidden">
			{/* Subterranean glow effect */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none blur-3xl" />

			{/* Hero */}
			<section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 mb-8 backdrop-blur-sm">
					<span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
					Exhuma v0.1.0 Released — Unearth Modern React
				</div>

				<h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
					Tactile Cards. Fluid Layouts.{' '}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
						Foundational Routing.
					</span>
				</h1>

				<p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
					One unified developer suite bringing together physics-driven card interactions, zero-dependency masonry layout engines, and production-grade routing skeletons.
				</p>

				{/* Quick Install Banner */}
				<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
					<div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 font-mono text-sm text-zinc-300 shadow-inner">
						<span className="text-emerald-400">$</span>
						<span>pnpm add @exhuma/core</span>
					</div>
					<div className="flex items-center gap-3">
						<a
							href="/cards"
							className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
						>
							Explore Cards
						</a>
						<a
							href="/layouts"
							className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all"
						>
							View Layouts
						</a>
					</div>
				</div>
			</section>

			{/* Three Pillars Section */}
			<section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-900">
				<div className="text-center mb-16">
					<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
						Modular Tools Built For Production
					</h2>
					<p className="mt-3 text-sm text-zinc-400">
						Install only what you need, or take advantage of the unified meta-package.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Pillar 1 */}
					<div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 hover:border-emerald-500/40 transition-colors group">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-6 group-hover:scale-110 transition-transform">
							01
						</div>
						<h3 className="text-xl font-bold text-white mb-2">@exhuma/cards</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-6">
							Physics-driven micro-interactions: 3D stacking cards with depth decay and horizontal rail scrollers converting natural vertical scroll into horizontal travel.
						</p>
						<a
							href="/cards"
							className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
						>
							Launch Card Demos &rarr;
						</a>
					</div>

					{/* Pillar 2 */}
					<div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 hover:border-emerald-500/40 transition-colors group">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-6 group-hover:scale-110 transition-transform">
							02
						</div>
						<h3 className="text-xl font-bold text-white mb-2">@exhuma/layouts</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-6">
							Zero-dependency CSS column-count masonry, balanced Macy height calculations, dynamic AutoGrids, and custom layout re-indexing hooks.
						</p>
						<a
							href="/layouts"
							className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
						>
							Explore Layout Engines &rarr;
						</a>
					</div>

					{/* Pillar 3 */}
					<div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 hover:border-emerald-500/40 transition-colors group">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-6 group-hover:scale-110 transition-transform">
							03
						</div>
						<h3 className="text-xl font-bold text-white mb-2">@exhuma/router</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-6">
							Clean architecture templates: split-screen authentication frames, responsive dashboard skeletons with collapsible rails, and client route guards.
						</p>
						<a
							href="/dashboard"
							className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
						>
							Preview Studio &rarr;
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
