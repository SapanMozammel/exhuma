'use client';

import React from 'react';
import { HorizontalScroller, StackingCards } from '@exhuma/cards';

export default function CardsPlaygroundPage() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			{/* Page Header */}
			<div className="mb-16 text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
					@exhuma/cards
				</div>
				<h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
					Interactive Cards Playground
				</h1>
				<p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
					Explore tactile micro-interactions: 3D stacking card physics and wheel-driven horizontal rail scrolling.
				</p>
			</div>

			{/* Demo 1: Stacking Cards */}
			<section className="mb-32">
				<div className="mb-8 border-b border-zinc-900 pb-4">
					<h2 className="text-xl font-bold text-white">01. Stacking Cards</h2>
					<p className="text-xs text-zinc-400 mt-1">
						Scroll down to observe sticky pinning, depth decay scaling, and layered z-index interpolation.
					</p>
				</div>

				<StackingCards topStart={120} topIncrement={24} minScale={0.88}>
					{/* Card 1 */}
					<div className="h-80 w-full rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between">
								<span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
									Layer 01 // Surface
								</span>
								<span className="text-xs text-zinc-500">Depth: 0m</span>
							</div>
							<h3 className="text-2xl font-bold text-white mt-4">
								Subterranean Scroll Physics
							</h3>
							<p className="text-sm text-zinc-400 mt-2 max-w-lg">
								As you scroll past this card, it locks at the sticky threshold while subsequent cards smoothly stack over it.
							</p>
						</div>
						<div className="flex gap-2">
							<span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
								transform: scale()
							</span>
							<span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
								position: sticky
							</span>
						</div>
					</div>

					{/* Card 2 */}
					<div className="h-80 w-full rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-emerald-950/20 p-8 shadow-2xl flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between">
								<span className="text-xs font-mono font-bold text-teal-400 tracking-wider uppercase">
									Layer 02 // Strata
								</span>
								<span className="text-xs text-zinc-500">Depth: 10m</span>
							</div>
							<h3 className="text-2xl font-bold text-white mt-4">
								Layered Scale Decay
							</h3>
							<p className="text-sm text-zinc-400 mt-2 max-w-lg">
								Earlier cards decrease in scale proportionally to create an authentic 3D perspective illusion.
							</p>
						</div>
						<div className="flex gap-2">
							<span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
								minScale: 0.88
							</span>
							<span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
								topIncrement: 24px
							</span>
						</div>
					</div>

					{/* Card 3 */}
					<div className="h-80 w-full rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-cyan-950/20 p-8 shadow-2xl flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between">
								<span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
									Layer 03 // Abyssal
								</span>
								<span className="text-xs text-zinc-500">Depth: 30m</span>
							</div>
							<h3 className="text-2xl font-bold text-white mt-4">
								Frictionless Performance
							</h3>
							<p className="text-sm text-zinc-400 mt-2 max-w-lg">
								Zero external animation heavyweights. Built entirely with React hooks, CSS hardware acceleration, and requestAnimationFrame.
							</p>
						</div>
						<div className="flex gap-2">
							<span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
								GPU Accelerated
							</span>
							<span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
								SSR Safe
							</span>
						</div>
					</div>
				</StackingCards>
			</section>

			{/* Demo 2: Horizontal Scroller */}
			<section>
				<div className="mb-8 border-b border-zinc-900 pb-4">
					<h2 className="text-xl font-bold text-white">02. Horizontal Rail Scroller</h2>
					<p className="text-xs text-zinc-400 mt-1">
						Natural vertical page scroll dynamically converts into horizontal rail navigation across cards.
					</p>
				</div>

				<HorizontalScroller speed={0.85}>
					{[1, 2, 3, 4, 5, 6].map((num) => (
						<div
							key={num}
							className="h-80 w-80 flex-shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between shadow-xl hover:border-emerald-500/40 transition-colors"
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-mono text-emerald-400">Card #0{num}</span>
								<span className="h-2 w-2 rounded-full bg-emerald-500/60" />
							</div>
							<div>
								<h4 className="text-lg font-bold text-white">
									Interactive Rail Item {num}
								</h4>
								<p className="text-xs text-zinc-400 mt-1">
									Smooth wheel-driven horizontal translation with responsive track sizing.
								</p>
							</div>
							<div className="text-[11px] font-mono text-zinc-500">
								translateX: auto
							</div>
						</div>
					))}
				</HorizontalScroller>
			</section>
		</div>
	);
}
