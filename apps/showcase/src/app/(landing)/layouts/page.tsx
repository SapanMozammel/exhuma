'use client';

import React, { useState } from 'react';
import { AutoGrid, CssMasonry } from '@exhuma/layouts';

const sampleCards = [
	{
		title: 'Subterranean Excavation',
		height: 'h-48',
		desc: 'Unearthing hidden algorithmic structures and layout mechanisms from the depths of modern web development.',
		tag: 'Architecture',
	},
	{
		title: 'Dynamic Column Balancing',
		height: 'h-72',
		desc: 'Masonry structures require careful column balancing to prevent awkward visual gaps and uneven vertical gutters across diverse screen sizes.',
		tag: 'Layout',
	},
	{
		title: 'Zero-Dependency Pure CSS',
		height: 'h-40',
		desc: 'Native CSS column-count rendering with automatic break-inside: avoid handles image loading seamlessly.',
		tag: 'Performance',
	},
	{
		title: 'Fluid Auto-Fit Calculations',
		height: 'h-64',
		desc: 'Grid templates adapt to container dimensions without requiring manual media query breakpoints at every step.',
		tag: 'Responsive',
	},
	{
		title: 'Cinematic Visual Identity',
		height: 'h-52',
		desc: 'Deep blacks, subtle borders, and luminous emerald accents create a distinctive aesthetic.',
		tag: 'Design',
	},
	{
		title: 'Component Decoupling',
		height: 'h-80',
		desc: 'By organizing features into independent @exhuma/* packages, developers can choose between selective installation or the unified @exhuma/core meta-package.',
		tag: 'Engineering',
	},
];

export default function LayoutsPlaygroundPage() {
	const [activeTab, setActiveTab] = useState<'masonry' | 'autogrid'>('masonry');
	const [columns, setColumns] = useState(3);

	return (
		<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="mb-12 text-center">
				<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
					@exhuma/layouts
				</div>
				<h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
					Layout Engines Playground
				</h1>
				<p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
					Inspect zero-dependency CSS masonry layouts and fluid AutoGrids with variable height content.
				</p>

				{/* Controls / Tabs */}
				<div className="mt-8 flex items-center justify-center gap-4">
					<div className="flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-1">
						<button
							onClick={() => setActiveTab('masonry')}
							className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
								activeTab === 'masonry'
									? 'bg-emerald-500 text-zinc-950 shadow'
									: 'text-zinc-400 hover:text-white'
							}`}
						>
							CSS Masonry
						</button>
						<button
							onClick={() => setActiveTab('autogrid')}
							className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
								activeTab === 'autogrid'
									? 'bg-emerald-500 text-zinc-950 shadow'
									: 'text-zinc-400 hover:text-white'
							}`}
						>
							AutoGrid
						</button>
					</div>

					{activeTab === 'masonry' && (
						<div className="flex items-center gap-2 text-xs text-zinc-400">
							<span>Columns:</span>
							{[2, 3, 4].map((col) => (
								<button
									key={col}
									onClick={() => setColumns(col)}
									className={`h-7 w-7 rounded-md border text-xs font-mono transition-colors ${
										columns === col
											? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
											: 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
									}`}
								>
									{col}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Playground Canvas */}
			<div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
				{activeTab === 'masonry' ? (
					<CssMasonry columns={columns} gap="1.5rem">
						{sampleCards.map((card, idx) => (
							<div
								key={idx}
								className={`rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 flex flex-col justify-between shadow-lg hover:border-zinc-700 transition-colors ${card.height}`}
							>
								<div>
									<span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
										{card.tag}
									</span>
									<h3 className="text-base font-bold text-white mt-2">
										{card.title}
									</h3>
									<p className="text-xs text-zinc-400 mt-2 leading-relaxed">
										{card.desc}
									</p>
								</div>
								<div className="text-[10px] font-mono text-zinc-500 mt-4">
									item #{idx + 1}
								</div>
							</div>
						))}
					</CssMasonry>
				) : (
					<AutoGrid minItemWidth={260} gap="1.5rem">
						{sampleCards.map((card, idx) => (
							<div
								key={idx}
								className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 flex flex-col justify-between shadow-lg hover:border-zinc-700 transition-colors h-64"
							>
								<div>
									<span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-teal-400">
										{card.tag}
									</span>
									<h3 className="text-base font-bold text-white mt-2">
										{card.title}
									</h3>
									<p className="text-xs text-zinc-400 mt-2 leading-relaxed">
										{card.desc}
									</p>
								</div>
								<div className="text-[10px] font-mono text-zinc-500 mt-4">
									grid cell #{idx + 1}
								</div>
							</div>
						))}
					</AutoGrid>
				)}
			</div>
		</div>
	);
}
