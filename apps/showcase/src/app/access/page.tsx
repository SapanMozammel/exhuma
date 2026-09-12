'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@exhuma/router';

export default function AccessPage() {
	const [isSplit, setIsSplit] = useState(true);

	return (
		<div>
			{/* Mode toggle bar */}
			<div className="fixed top-4 right-4 z-50 rounded-lg border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-md">
				<button
					onClick={() => setIsSplit(!isSplit)}
					className="rounded px-3 py-1 text-xs font-semibold text-zinc-300 hover:text-white"
				>
					Toggle Layout Mode: {isSplit ? 'Split Hero' : 'Centered Card'}
				</button>
			</div>

			<AuthLayout
				split={isSplit}
				brand={
					<a href="/" className="flex items-center gap-2">
						<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
							E
						</span>
						<span className="font-bold tracking-tight text-white">Exhuma</span>
					</a>
				}
				title="Welcome back to Exhuma"
				subtitle="Enter your credentials to access the developer studio"
			>
				<form
					onSubmit={(e) => e.preventDefault()}
					className="space-y-4"
				>
					<div>
						<label className="block text-xs font-medium text-zinc-300 mb-1.5">
							Email Address
						</label>
						<input
							type="email"
							placeholder="developer@exhuma.dev"
							className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-zinc-300 mb-1.5">
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••••••"
							className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-lg bg-emerald-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 mt-2"
					>
						Sign In to Studio
					</button>

					<div className="text-center pt-2">
						<a
							href="/"
							className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
						>
							&larr; Back to Exhuma Overview
						</a>
					</div>
				</form>
			</AuthLayout>
		</div>
	);
}
