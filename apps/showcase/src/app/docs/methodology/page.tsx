import React from 'react';
import Link from 'next/link';
import {
  IconActivity as Activity,
  IconShieldCheck as ShieldCheck,
  IconBolt as Zap,
  IconCpu as Cpu,
  IconArrowRight as ArrowRight,
  IconCircleCheck as CheckCircle2,
} from '@tabler/icons-react';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const tocItems = [
	{ id: 'principle', title: 'The Big-Omega (Ω) Invariant' },
	{ id: 'pillars', title: 'The 5 EKM Architectural Pillars' },
	{ id: 'dual-channel', title: 'Dual-Channel State Pipeline' },
	{ id: 'fsm', title: 'Deterministic 5-State Gesture FSM' },
	{ id: 'spring-math', title: 'Closed-Form Analytical Springs' },
	{ id: 'verification', title: 'Automated CI & Big-Omega Gates' },
];

export default function MethodologyPage() {
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
						<span className="text-foreground font-semibold">Methodology & Big-Omega</span>
					</div>
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						The Exhuma Kinetic Methodology (EKM)
					</h1>
					<p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
						Mathematical foundations, algorithmic complexity invariants, and Big-Omega ($\Omega$) lower-bound guarantees across all Exhuma primitives.
					</p>
				</div>

				{/* The Big-Omega Invariant */}
				<section id="principle" className="space-y-4 pt-4 border-t border-border">
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="font-mono text-xs text-primary">
							CORE MANDATE
						</Badge>
						<span className="text-xs font-mono text-muted-foreground">Complexity Theory</span>
					</div>
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						The Big-Omega ($\Omega$) Lower-Bound Invariant
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						In computational complexity theory, $\Omega(g(n))$ defines the <strong>tight lower bound</strong> of a system. Most UI component libraries only describe their best-case scenarios ($O$), degrading rapidly under high-frequency inputs or on mobile devices.
					</p>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Exhuma is engineered so that runtime performance, frame rates, memory stability, and state determinism <strong>are mathematically guaranteed never to drop below our established lower bounds</strong>.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
						<div className="rounded-xl border border-border bg-card p-5 space-y-2">
							<div className="flex items-center gap-2 text-xs font-bold text-foreground">
								<Activity className="h-4 w-4 text-primary" />
								<span>Frame Rate Floor</span>
							</div>
							<div className="text-xl font-extrabold font-mono text-foreground">Ω(120Hz)</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Frame computation budget ≤ 8.33ms. Never drops a single frame due to main-thread blockage.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-5 space-y-2">
							<div className="flex items-center gap-2 text-xs font-bold text-foreground">
								<Zap className="h-4 w-4 text-emerald-500" />
								<span>Time Complexity</span>
							</div>
							<div className="text-xl font-extrabold font-mono text-foreground">Ω(1) = O(1)</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Constant-time kinetic dispatch pipeline directly mutating CSS variables via rAF. Zero DOM tree traversals.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-5 space-y-2">
							<div className="flex items-center gap-2 text-xs font-bold text-foreground">
								<ShieldCheck className="h-4 w-4 text-purple-500" />
								<span>Memory Invariant</span>
							</div>
							<div className="text-xl font-extrabold font-mono text-foreground">Ω(1) Heap</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Zero dynamic allocations in motion loops. Static circular ring buffers eliminate Garbage Collection pauses.
							</p>
						</div>
					</div>
				</section>

				{/* The 5 EKM Architectural Pillars */}
				<section id="pillars" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						The 5 EKM Architectural Pillars
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Every component in Exhuma adheres to these 5 architectural pillars, ensuring uniform developer experience and bulletproof quality across all 13 ecosystems.
					</p>

					<div className="space-y-3 pt-2">
						<div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
							<div className="text-xs font-bold text-primary font-mono">PILLAR 1</div>
							<h3 className="text-sm font-bold text-foreground">Decoupled Mathematical Kernels</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								All physics, coordinate normalization, and layout math are isolated into pure TypeScript functions with zero framework dependencies.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
							<div className="text-xs font-bold text-primary font-mono">PILLAR 2</div>
							<h3 className="text-sm font-bold text-foreground">Kinetic Compound Composition</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Radix-style composable slots (<code className="text-foreground font-mono">Root</code>, <code className="text-foreground font-mono">Trigger</code>, <code className="text-foreground font-mono">Content</code>) paired with independent hardware-accelerated <code className="text-foreground font-mono">Indicator</code> primitives.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
							<div className="text-xs font-bold text-primary font-mono">PILLAR 3</div>
							<h3 className="text-sm font-bold text-foreground">Dual-Channel State Separation</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								High-frequency 120Hz continuous inputs bypass virtual DOM reconciliation entirely, writing directly to element style variables.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
							<div className="text-xs font-bold text-primary font-mono">PILLAR 4</div>
							<h3 className="text-sm font-bold text-foreground">Deterministic 5-State Gesture FSM</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Formally complete automaton with slop-angle trajectory filtering to guarantee zero mobile page scroll hijacking.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
							<div className="text-xs font-bold text-primary font-mono">PILLAR 5</div>
							<h3 className="text-sm font-bold text-foreground">Universal Cross-Ecosystem Parity Contract</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Zero runtime dependencies. Identical behavioral contracts compiled to React, Next.js, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.
							</p>
						</div>
					</div>
				</section>

				{/* Dual-Channel State Pipeline */}
				<section id="dual-channel" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Dual-Channel State Pipeline
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Why do standard React animation libraries stutter? Because they pass mouse coordinates through React state (<code className="text-foreground font-mono">setState</code>), triggering 120 virtual DOM diffs per second. Exhuma strictly bifurcates state into two isolated channels:
					</p>

					<CodeBlock
						code={`// EXHUMA DUAL-CHANNEL STATE PATTERN
// Channel 1: Kinetic GPU Channel (Continuous 120Hz — Zero Re-renders)
const handlePointerMove = (e: React.PointerEvent) => {
  const coords = calculateSpotlightCoordinates(e.clientX, e.clientY, rect);
  targetX.current = coords.x;
  targetY.current = coords.y;
  
  // Directly writes to GPU custom properties on requestAnimationFrame
  el.style.setProperty('--exhuma-spotlight-x', \`\${coords.x}px\`);
};

// Channel 2: Discrete Logical Channel (On Action Only)
const handleSelectTab = (tabId: string) => {
  setActiveTab(tabId); // Standard controlled/uncontrolled state
  onValueChange?.(tabId);
};`}
						language="tsx"
						filename="DualChannelPipeline.tsx"
					/>
				</section>

				{/* Deterministic Gesture FSM */}
				<section id="fsm" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Deterministic 5-State Gesture FSM
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Mobile touch interactions fail when horizontal gestures fight native vertical page scroll. Exhuma implements a provably complete automaton with an angular slop filter:
					</p>

					<div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
						<div className="text-primary font-bold">STATE TRANSITIONS:</div>
						<div className="text-muted-foreground">IDLE ──(PointerDown)──► TRACKING</div>
						<div className="text-muted-foreground">TRACKING ──(Angle &lt; 30° &amp; Δ &gt; 8px)──► CLAIMED (Capture Touch)</div>
						<div className="text-muted-foreground">TRACKING ──(Angle ≥ 30°)──► IDLE (Yield to Page Scroll)</div>
						<div className="text-muted-foreground">CLAIMED ──(PointerUp)──► DECELERATING ──(v → 0)──► IDLE</div>
					</div>
				</section>

				{/* Closed-Form Analytical Springs */}
				<section id="spring-math" className="space-y-4 pt-4 border-t border-border">
					<h2 className="text-xl font-bold tracking-tight text-foreground">
						Closed-Form Analytical Spring Physics
					</h2>
					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						Euler numerical integration approximations accumulate floating-point error over time. Exhuma uses the exact closed-form solution to the second-order differential equation for critical damping (ζ = 1.0):
					</p>

					<div className="rounded-xl border border-border bg-card p-5 font-mono text-sm text-center text-primary">
						{"x(t) = x_target + (x_0 - x_target) * e^(-ω_n * t) * (1 + ω_n * t)"}
					</div>

					<p className="text-xs text-muted-foreground leading-relaxed">
						This provides instantaneous position calculation with provable asymptotic convergence, zero oscillation, and zero external physics libraries.
					</p>
				</section>

				{/* Next Steps CTA */}
				<div className="pt-6 border-t border-border flex items-center justify-between">
					<Link href="/docs/installation">
						<Button variant="outline" size="sm" className="gap-2">
							Installation Guide
						</Button>
					</Link>
					<Link href="/docs/components">
						<Button size="sm" className="gap-2">
							Explore 23 Primitives
							<ArrowRight className="h-3.5 w-3.5" />
						</Button>
					</Link>
				</div>
			</div>

			<DocsToc items={tocItems} />
		</div>
	);
}
