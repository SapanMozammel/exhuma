import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, ShieldCheck, Check } from 'lucide-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tocItems = [
	{ id: 'contract-standards', title: 'Universal Engineering Standards' },
	{ id: 'react-nextjs', title: 'React 18/19 & Next.js 15' },
	{ id: 'vue-svelte', title: 'Vue 3 & Svelte 5' },
	{ id: 'angular-solid', title: 'Angular 18+ & SolidJS' },
	{ id: 'astro-blade', title: 'Astro & Laravel Blade' },
	{ id: 'vanilla-webcomponents', title: 'Vanilla JS & Web Components' },
	{ id: 'wordpress', title: 'WordPress Gutenberg Blocks' },
	{ id: 'mobile-native', title: 'React Native & Flutter' },
];

export default function EcosystemsDocPage() {
	return (
		<div className="flex gap-10">
			<div className="flex-1 min-w-0 space-y-8 max-w-3xl">
				{/* Breadcrumb & Title */}
				<div>
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
						<Link href="/docs" className="hover:text-foreground transition-colors">
							Documentation
						</Link>
						<span>/</span>
						<span className="text-foreground font-semibold">Ecosystems</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						The 13 Ecosystem Contracts
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
						Exhuma avoids polyfills or cross-compilation abstraction layers. Every canonical component is re-authored from fundamental mathematical models into the native idioms of each target platform.
					</p>
				</div>

				{/* 1. Standards */}
				<section id="contract-standards" className="space-y-3 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						1. Universal Engineering Standards
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Every implementation across the 13 supported ecosystems must satisfy four non-negotiable guarantees:
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1">
								1. Zero CSS Leakage
							</div>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								Scoped styles or unique class prefixes prevent collision with host applications.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1">
								2. Teardown Safety
							</div>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								Every event listener and requestAnimationFrame handle is properly canceled during unmount or destroy.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1">
								3. Idiomatic Reactivity
							</div>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								Uses the framework&apos;s first-class state primitives (Runes, Signals, Composition, StatefulWidget).
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="font-semibold text-xs text-foreground mb-1">
								4. Zero Runtime Overhead
							</div>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								No proprietary middleman library. Pure self-contained component source code.
							</p>
						</div>
					</div>
				</section>

				{/* 2. React & Next.js */}
				<section id="react-nextjs" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Web</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							React 18/19 & Next.js 15
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Next.js components include the <code>&quot;use client&quot;</code> directive to seamlessly support the React Server Components (RSC) App Router. They utilize <code>useRef</code> for direct DOM manipulation to maintain 60 FPS animation performance without triggering React re-render cycles.
					</p>

					<CodeBlock
						code={`'use client';

import React, { useRef, useEffect } from 'react';

export function TiltCard({ children, maxTilt = 20 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Zero-lag pointer listener with proper cleanup
    const node = cardRef.current;
    if (!node) return;
    // ...
    return () => { /* Memory teardown */ };
  }, [maxTilt]);

  return <div ref={cardRef}>{children}</div>;
}`}
						language="tsx"
						filename="TiltCard.tsx"
					/>
				</section>

				{/* 3. Vue 3 & Svelte 5 */}
				<section id="vue-svelte" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Modern Reactive</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Vue 3 & Svelte 5
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Vue 3 uses the <code>&lt;script setup lang=&quot;ts&quot;&gt;</code> Composition API with <code>onBeforeUnmount</code> cleanup. Svelte 5 leverages the newest <strong>Runes</strong> system (<code>$state</code>, <code>$derived</code>, and <code>$effect</code>) with destructor return cleanup.
					</p>

					<CodeBlock
						code={`<script lang="ts">
  let { children, maxTilt = 20 } = $props();
  let cardElement: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!cardElement) return;
    // Active pointer math...
    return () => {
      // Svelte 5 rune teardown guarantee
    };
  });
</script>

<div bind:this={cardElement}>
  {@render children?.()}
</div>`}
						language="svelte"
						filename="TiltCard.svelte"
					/>
				</section>

				{/* 4. Angular & SolidJS */}
				<section id="angular-solid" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Enterprise & Performance</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Angular 18+ & SolidJS
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Angular components use <strong>Standalone Components</strong> with modern Signals (<code>input()</code> and <code>effect()</code>) and <code>ngOnDestroy</code> lifecycle safety. SolidJS utilizes fine-grained primitives (<code>createSignal</code>, <code>createEffect</code>, <code>onCleanup</code>).
					</p>
				</section>

				{/* 5. Astro & Laravel Blade */}
				<section id="astro-blade" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Server First</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Astro & Laravel Blade
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Astro components render zero runtime client JavaScript by default or mount via client directives. Laravel Blade components output standard PHP component templates integrating with Alpine.js or scoped inline JS.
					</p>
				</section>

				{/* 6. Vanilla & Web Components */}
				<section id="vanilla-webcomponents" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Universal Standards</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Vanilla JS & Web Components
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Vanilla JS outputs clean ES modules exposing factory functions (<code>createTiltCard(element, options)</code>) with an explicit <code>destroy()</code> method. Web Components extend <code>HTMLElement</code> with Custom Elements v1 and <code>disconnectedCallback()</code>.
					</p>
				</section>

				{/* 7. WordPress Gutenberg */}
				<section id="wordpress" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">CMS</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							WordPress Gutenberg Blocks
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Outputs full Gutenberg block definitions: <code>block.json</code> metadata, React <code>edit.tsx</code> for the WP Admin editor canvas, <code>save.tsx</code> for database serialization, and <code>render.php</code> for server-side dynamic rendering.
					</p>
				</section>

				{/* 8. Mobile Native */}
				<section id="mobile-native" className="space-y-3 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Mobile Native</Badge>
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							React Native & Flutter
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						React Native components use <code>Animated</code> with <code>PanResponder</code> driving the native UI thread. Flutter components output Dart <code>StatefulWidget</code> classes calculating 3D perspective transforms with <code>Matrix4</code> and <code>Transform</code>.
					</p>
				</section>

				{/* Next Steps */}
				<section className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<Link href="/docs/cli">
						<Button variant="outline" className="gap-2">
							<span>← CLI Reference</span>
						</Button>
					</Link>
					<Link href="/studio">
						<Button className="gap-2">
							<span>Explore Studio Playground</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</section>
			</div>

			<DocsToc items={tocItems} />
		</div>
	);
}
