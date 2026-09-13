import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Activity, Cpu, ArrowRight } from 'lucide-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const tocItems = [
	{ id: 'guarantee', title: 'The Zero-Leak Guarantee' },
	{ id: 'listener-cleanup', title: 'Deterministic Listener Teardown' },
	{ id: 'resize-observers', title: 'ResizeObserver Disconnection' },
	{ id: '13-contract-matrix', title: '13 Framework Teardown Matrix' },
	{ id: 'verification', title: 'Automated CI Verification' },
];

export default function LifecycleSafetyPage() {
	return (
		<div className="flex gap-10">
			<div className="flex-1 min-w-0 space-y-10 max-w-3xl">
				{/* Breadcrumb & Header */}
				<div>
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
						<Link href="/docs" className="hover:text-foreground transition-colors">
							Documentation
						</Link>
						<span>/</span>
						<span className="text-foreground font-semibold">Lifecycle & Memory Safety</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						Lifecycle & Memory Safety
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
						How Exhuma guarantees zero memory leaks, deterministic event listener teardowns, and observer unregistrations across all 13 supported frontend runtimes.
					</p>
				</div>

				{/* The Zero-Leak Guarantee */}
				<section id="guarantee" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						The Zero-Leak Guarantee
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Interactive UI components that calculate spring physics, mouse trajectories, and horizontal scroll snaps continuously register event listeners on <code className="text-foreground font-mono">window</code>, <code className="text-foreground font-mono">document</code>, or parent containers. In long-running Single Page Applications, failure to unregister these listeners on component unmount causes runaway memory growth.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<div className="rounded-xl border border-border bg-card p-5 space-y-2">
							<div className="flex items-center gap-2 text-xs font-bold text-foreground">
								<ShieldCheck className="h-4 w-4 text-emerald-500" />
								<span>Detached DOM Prevention</span>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Every listener holds an ephemeral reference. On unmount, all references are nulled to allow browser garbage collection immediately.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-5 space-y-2">
							<div className="flex items-center gap-2 text-xs font-bold text-foreground">
								<Activity className="h-4 w-4 text-primary" />
								<span>Animation Frame Cancellation</span>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Active requestAnimationFrame loops are cleanly canceled via <code className="text-foreground font-mono text-[11px]">cancelAnimationFrame</code> before component destruction.
							</p>
						</div>
					</div>

					<Callout type="note" title="Invariant Specification">
						A component passes Exhuma certification only if 1,000 rapid route transitions produce exactly 0 leaked listeners and zero memory slope on Chrome V8 heap profiler.
					</Callout>
				</section>

				{/* Listener Cleanup */}
				<section id="listener-cleanup" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Deterministic Listener Teardown
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						In React and Next.js, teardowns are anchored in the return callback of <code className="text-foreground font-mono">useEffect</code> with strict AbortController or removeEventListener pairing:
					</p>

					<CodeBlock
						code={`useEffect(() => {
  const handlePointerMove = (e: MouseEvent) => {
    // 60 FPS transform calculation
  };

  window.addEventListener('mousemove', handlePointerMove, { passive: true });

  // Mandatory Teardown:
  return () => {
    window.removeEventListener('mousemove', handlePointerMove);
  };
}, [maxTilt]);`}
						language="typescript"
						filename="React / Next.js Teardown"
					/>
				</section>

				{/* Resize Observers */}
				<section id="resize-observers" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						ResizeObserver Disconnection
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Components like CSS Masonry and Auto-Fit Grid monitor container width changes to dynamically recalculate column tracks. We guarantee immediate disconnection:
					</p>

					<CodeBlock
						code={`const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    updateColumnCount(entry.contentRect.width);
  }
});

observer.observe(containerRef.current);

// Teardown:
return () => observer.disconnect();`}
						language="typescript"
						filename="observer-cleanup.ts"
					/>
				</section>

				{/* 13 Framework Matrix */}
				<section id="13-contract-matrix" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						13 Framework Teardown Matrix
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						How each target framework contract implements lifecycle safety:
					</p>

					<div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
						<table className="w-full text-left text-xs">
							<thead className="bg-muted/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
								<tr>
									<th className="px-4 py-3">Framework</th>
									<th className="px-4 py-3">Lifecycle Cleanup Hook</th>
									<th className="px-4 py-3">Observer Disposal</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border font-mono text-[11px]">
								{[
									{ fw: 'React 18 / 19', hook: 'useEffect() return () => {}', obs: 'disconnect()' },
									{ fw: 'Next.js 15', hook: 'useEffect() return () => {}', obs: 'disconnect()' },
									{ fw: 'Vue 3 / Nuxt', hook: 'onUnmounted(() => {})', obs: 'disconnect()' },
									{ fw: 'Svelte 5', hook: '$effect(() => { return () => {} })', obs: 'disconnect()' },
									{ fw: 'Angular 18+', hook: 'DestroyRef.onDestroy(() => {})', obs: 'disconnect()' },
									{ fw: 'SolidJS', hook: 'onCleanup(() => {})', obs: 'disconnect()' },
									{ fw: 'Astro', hook: 'disconnectedCallback()', obs: 'disconnect()' },
									{ fw: 'Vanilla JS', hook: 'destroy() instance method', obs: 'disconnect()' },
									{ fw: 'Flutter', hook: '@override void dispose()', obs: '_controller.dispose()' },
								].map((row) => (
									<tr key={row.fw} className="hover:bg-muted/30">
										<td className="px-4 py-2.5 font-bold text-foreground font-sans">{row.fw}</td>
										<td className="px-4 py-2.5 text-primary">{row.hook}</td>
										<td className="px-4 py-2.5 text-muted-foreground">{row.obs}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* Next Navigation */}
				<div className="pt-6 border-t border-border flex items-center justify-between">
					<Link href="/docs/ecosystems" className="text-xs text-muted-foreground hover:text-foreground">
						← 13 Ecosystem Contracts
					</Link>
					<Link href="/docs/components">
						<Button className="gap-2">
							<span>Component Catalog</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>

			{/* Table of Contents */}
			<DocsToc items={tocItems} />
		</div>
	);
}
