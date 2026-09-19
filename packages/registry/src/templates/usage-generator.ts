import { ComponentFilePayload, EcosystemFlavor, UniversalComponent } from '../schema';

/**
 * Generates a complete, production-ready usage example for a component across all 13 supported ecosystems.
 * Dynamically injects the active workbench property values.
 */
export function generateComponentUsage(component: UniversalComponent, flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const slug = component.slug;

	if (slug === 'stacking-cards') {
		return getStackingCardsUsage(flavor, props);
	}

	return getGenericComponentUsage(component, flavor, props);
}

function getStackingCardsUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const topStart = Number(props.topStart ?? 20);
	const topIncrement = Number(props.topIncrement ?? 28);
	const cardGap = Number(props.cardGap ?? 20);
	const scaleThreshold = Number(props.scaleThreshold ?? 150);
	const minScale = Number(props.minScale ?? 0.9);
	const reverseScale = props.reverseScale !== false;

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 (App Router) features page with StackingCards.',
				code: `'use client';

import React from 'react';
import { StackingCards } from '@/components/ui/StackingCards';

const CARDS = [
  {
    tag: '01 / ARCHITECTURE',
    title: 'Kinetic Performance Engine',
    desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync refresh with zero layout thrashing.',
    badge: '120 FPS',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/30',
  },
  {
    tag: '02 / MEMORY',
    title: 'Zero-Allocation Pipeline',
    desc: 'Persistent Float64Array typed buffers eliminating garbage collection pauses during scroll.',
    badge: 'Ω(1) HEAP',
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    border: 'border-blue-500/30',
  },
  {
    tag: '03 / ACCELERATION',
    title: 'Sub-Pixel Delta Clamping',
    desc: 'Hardware compositor layer promotion with deadband skipping for static cards.',
    badge: 'GPU ACCEL',
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
    border: 'border-purple-500/30',
  },
  {
    tag: '04 / MOTION',
    title: 'Tiered Reverse Cascade',
    desc: 'Continuous C1 Hermite smoothstep cascade scaling as the stack crowns the viewport.',
    badge: 'HERMITE C1',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    border: 'border-amber-500/30',
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-[200vh] py-24 px-4 bg-background text-foreground">
      <div className="max-w-2xl mx-auto mb-16 text-center">
        <span className="font-mono text-xs font-bold tracking-widest text-emerald-500 uppercase">
          Tactile Physics
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mt-2 sm:text-5xl">
          Kinetic Stacking Cards
        </h1>
        <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto leading-relaxed">
          Scroll down to experience the calibrated 3D depth decay, sticky echelon progression, and reverse scaling exit cascade.
        </p>
      </div>

      <StackingCards
        topStart={${topStart}}
        topIncrement={${topIncrement}}
        cardGap={${cardGap}}
        scaleThreshold={${scaleThreshold}}
        minScale={${minScale}}
        reverseScale={${reverseScale}}
        className="max-w-2xl mx-auto"
      >
        {CARDS.map((card, idx) => (
          <div
            key={idx}
            className={\`rounded-2xl border \${card.border} bg-card/90 p-8 shadow-2xl backdrop-blur-md bg-gradient-to-b \${card.gradient} min-h-[220px] flex flex-col justify-between\`}
          >
            <div>
              <span className="font-mono text-xs font-semibold text-muted-foreground tracking-wider">
                {card.tag}
              </span>
              <h2 className="text-2xl font-bold mt-2">{card.title}</h2>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="pt-6 border-t border-border/40 flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>EXHUMA EKM</span>
              <span className="font-bold text-emerald-500">{card.badge}</span>
            </div>
          </div>
        ))}
      </StackingCards>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'FeaturesSection.tsx',
				language: 'tsx',
				description: 'React component rendering StackingCards with custom feature cards.',
				code: `import React from 'react';
import { StackingCards } from '@/components/ui/StackingCards';

const CARDS = [
  {
    tag: '01 / ARCHITECTURE',
    title: 'Kinetic Performance Engine',
    desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync refresh with zero layout thrashing.',
    badge: '120 FPS',
  },
  {
    tag: '02 / MEMORY',
    title: 'Zero-Allocation Pipeline',
    desc: 'Persistent Float64Array typed buffers eliminating garbage collection pauses during scroll.',
    badge: 'Ω(1) HEAP',
  },
  {
    tag: '03 / ACCELERATION',
    title: 'Sub-Pixel Delta Clamping',
    desc: 'Hardware compositor layer promotion with deadband skipping for static cards.',
    badge: 'GPU ACCEL',
  },
  {
    tag: '04 / MOTION',
    title: 'Tiered Reverse Cascade',
    desc: 'Continuous C1 Hermite smoothstep cascade scaling as the stack crowns the viewport.',
    badge: 'HERMITE C1',
  },
];

export function FeaturesSection() {
  return (
    <section className="min-h-[180vh] py-20 px-4 bg-background text-foreground">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h2 className="text-3xl font-bold">Kinetic Stacking Architecture</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Scroll down to experience depth decay scaling and reverse exit mechanics.
        </p>
      </div>

      <StackingCards
        topStart={${topStart}}
        topIncrement={${topIncrement}}
        cardGap={${cardGap}}
        scaleThreshold={${scaleThreshold}}
        minScale={${minScale}}
        reverseScale={${reverseScale}}
        className="max-w-2xl mx-auto"
      >
        {CARDS.map((card, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl backdrop-blur-md min-h-[220px] flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {card.tag}
              </span>
              <h3 className="text-2xl font-bold mt-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="pt-6 border-t border-border/40 flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>EXHUMA EKM</span>
              <span className="font-bold text-emerald-500">{card.badge}</span>
            </div>
          </div>
        ))}
      </StackingCards>
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'App.vue',
				language: 'vue',
				description: 'Vue 3 SFC using StackingCards template with v-for loop.',
				code: `<script setup lang="ts">
import StackingCards from '@/components/ui/StackingCards.vue';

const cards = [
  { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
  { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
  { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
  { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
];
</script>

<template>
  <main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
    <div class="max-w-2xl mx-auto mb-12 text-center">
      <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
      <p class="text-muted-foreground text-sm mt-2">Scroll to experience the 3D depth decay.</p>
    </div>

    <StackingCards
      :top-start="${topStart}"
      :top-increment="${topIncrement}"
      :card-gap="${cardGap}"
      :scale-threshold="${scaleThreshold}"
      :min-scale="${minScale}"
      :reverse-scale="${reverseScale}"
      class="max-w-2xl mx-auto"
    >
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between"
      >
        <div>
          <span class="font-mono text-xs text-muted-foreground">{{ card.tag }}</span>
          <h2 class="text-2xl font-bold mt-2">{{ card.title }}</h2>
          <p class="text-muted-foreground text-sm mt-2">{{ card.desc }}</p>
        </div>
        <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
          <span>EXHUMA EKM</span>
          <span class="text-emerald-500 font-bold">{{ card.badge }}</span>
        </div>
      </div>
    </StackingCards>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'App.svelte',
				language: 'svelte',
				description: 'Svelte 5 Runes template with StackingCards snippet.',
				code: `<script lang="ts">
  import StackingCards from '$lib/components/StackingCards.svelte';

  const cards = [
    { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
    { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
    { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
    { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
  ];
</script>

<main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
  <div class="max-w-2xl mx-auto mb-12 text-center">
    <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
    <p class="text-muted-foreground text-sm mt-2">Scroll to experience the 3D depth decay.</p>
  </div>

  <StackingCards
    topStart={${topStart}}
    topIncrement={${topIncrement}}
    cardGap={${cardGap}}
    scaleThreshold={${scaleThreshold}}
    minScale={${minScale}}
    reverseScale={${reverseScale}}
    class="max-w-2xl mx-auto"
  >
    {#each cards as card}
      <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
        <div>
          <span class="font-mono text-xs text-muted-foreground">{card.tag}</span>
          <h2 class="text-2xl font-bold mt-2">{card.title}</h2>
          <p class="text-muted-foreground text-sm mt-2">{card.desc}</p>
        </div>
        <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
          <span>EXHUMA EKM</span>
          <span class="text-emerald-500 font-bold">{card.badge}</span>
        </div>
      </div>
    {/each}
  </StackingCards>
</main>
`,
			};
		}

		case 'astro': {
			return {
				filename: 'index.astro',
				language: 'astro',
				description: 'Astro component using StackingCards with client:visible hydration.',
				code: `---
import StackingCards from '@/components/ui/StackingCards.astro';

const cards = [
  { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
  { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
  { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
  { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
];
---

<main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
  <div class="max-w-2xl mx-auto mb-12 text-center">
    <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
    <p class="text-muted-foreground text-sm mt-2">Scroll to experience the 3D depth decay.</p>
  </div>

  <StackingCards
    topStart={${topStart}}
    topIncrement={${topIncrement}}
    cardGap={${cardGap}}
    scaleThreshold={${scaleThreshold}}
    minScale={${minScale}}
    reverseScale={${reverseScale}}
    class="max-w-2xl mx-auto"
  >
    {cards.map((card) => (
      <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
        <div>
          <span class="font-mono text-xs text-muted-foreground">{card.tag}</span>
          <h2 class="text-2xl font-bold mt-2">{card.title}</h2>
          <p class="text-muted-foreground text-sm mt-2">{card.desc}</p>
        </div>
        <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
          <span>EXHUMA EKM</span>
          <span class="text-emerald-500 font-bold">{card.badge}</span>
        </div>
      </div>
    ))}
  </StackingCards>
</main>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'SolidJS application showcasing StackingCards reactive primitive.',
				code: `import { For } from 'solid-js';
import { StackingCards } from '@/components/ui/StackingCards';

const CARDS = [
  { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
  { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
  { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
  { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
];

export default function App() {
  return (
    <main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
      <div class="max-w-2xl mx-auto mb-12 text-center">
        <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
      </div>

      <StackingCards
        topStart={${topStart}}
        topIncrement={${topIncrement}}
        cardGap={${cardGap}}
        scaleThreshold={${scaleThreshold}}
        minScale={${minScale}}
        reverseScale={${reverseScale}}
        class="max-w-2xl mx-auto"
      >
        <For each={CARDS}>
          {(card) => (
            <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
              <div>
                <span class="font-mono text-xs text-muted-foreground">{card.tag}</span>
                <h2 class="text-2xl font-bold mt-2">{card.title}</h2>
                <p class="text-muted-foreground text-sm mt-2">{card.desc}</p>
              </div>
              <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
                <span>EXHUMA EKM</span>
                <span class="text-emerald-500 font-bold">{card.badge}</span>
              </div>
            </div>
          )}
        </For>
      </StackingCards>
    </main>
  );
}
`,
			};
		}

		case 'angular': {
			return {
				filename: 'features.component.ts',
				language: 'typescript',
				description: 'Angular 18+ Standalone component template consuming StackingCards.',
				code: `import { Component } from '@angular/core';
import { ExhumaStackingCardsComponent } from './components/stacking-cards.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [ExhumaStackingCardsComponent],
  template: \`
    <main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
      <div class="max-w-2xl mx-auto mb-12 text-center">
        <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
        <p class="text-muted-foreground text-sm mt-2">Scroll down to experience depth decay scaling.</p>
      </div>

      <exhuma-stacking-cards
        [topStart]="${topStart}"
        [topIncrement]="${topIncrement}"
        [cardGap]="${cardGap}"
        [scaleThreshold]="${scaleThreshold}"
        [minScale]="${minScale}"
        [reverseScale]="${reverseScale}"
        customClass="max-w-2xl mx-auto"
      >
        @for (card of cards; track card.tag) {
          <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
            <div>
              <span class="font-mono text-xs text-muted-foreground">{{ card.tag }}</span>
              <h2 class="text-2xl font-bold mt-2">{{ card.title }}</h2>
              <p class="text-muted-foreground text-sm mt-2 leading-relaxed">{{ card.desc }}</p>
            </div>
            <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
              <span>EXHUMA EKM</span>
              <span class="text-emerald-500 font-bold">{{ card.badge }}</span>
            </div>
          </div>
        }
      </exhuma-stacking-cards>
    </main>
  \`,
})
export class FeaturesComponent {
  cards = [
    { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
    { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
    { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
    { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
  ];
}
`,
			};
		}

		case 'blade': {
			return {
				filename: 'features.blade.php',
				language: 'php',
				description: 'Laravel Blade component template consuming StackingCards.',
				code: `<section class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
  <div class="max-w-2xl mx-auto mb-12 text-center">
    <h2 class="text-3xl font-bold">Kinetic Stacking Architecture</h2>
    <p class="text-muted-foreground text-sm mt-2">Scroll down to experience depth decay scaling.</p>
  </div>

  <x-exhuma-stacking-cards
    :top-start="${topStart}"
    :top-increment="${topIncrement}"
    :card-gap="${cardGap}"
    :scale-threshold="${scaleThreshold}"
    :min-scale="${minScale}"
    :reverse-scale="${reverseScale ? 'true' : 'false'}"
    class="max-w-2xl mx-auto"
  >
    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">01 / ARCHITECTURE</span>
        <h3 class="text-2xl font-bold mt-2">Kinetic Performance Engine</h3>
        <p class="text-muted-foreground text-sm mt-2">Batched read-write cycles guaranteeing 120Hz V-Sync.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">120 FPS</span>
      </div>
    </div>

    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">02 / MEMORY</span>
        <h3 class="text-2xl font-bold mt-2">Zero-Allocation Pipeline</h3>
        <p class="text-muted-foreground text-sm mt-2">Persistent Float64Array typed buffers eliminating GC pauses.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">Ω(1) HEAP</span>
      </div>
    </div>

    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">03 / ACCELERATION</span>
        <h3 class="text-2xl font-bold mt-2">Sub-Pixel Delta Clamping</h3>
        <p class="text-muted-foreground text-sm mt-2">Hardware compositor promotion with deadband skipping.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">GPU ACCEL</span>
      </div>
    </div>

    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">04 / MOTION</span>
        <h3 class="text-2xl font-bold mt-2">Tiered Reverse Cascade</h3>
        <p class="text-muted-foreground text-sm mt-2">Continuous C1 Hermite smoothstep cascade scaling.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">HERMITE C1</span>
      </div>
    </div>
  </x-exhuma-stacking-cards>
</section>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML5 markup with data attributes and ESM initialization.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Stacking Cards — Exhuma</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-[200vh]">
  <div class="max-w-2xl mx-auto py-20 px-4">
    <h1 class="text-3xl font-bold text-center mb-12">Kinetic Stacking Architecture</h1>

    <!-- StackingCards Container -->
    <div
      data-exhuma-stacking-cards
      data-top-start="${topStart}"
      data-top-increment="${topIncrement}"
      data-card-gap="${cardGap}"
      data-scale-threshold="${scaleThreshold}"
      data-min-scale="${minScale}"
      data-reverse-scale="${reverseScale}"
      class="flex flex-col w-full"
    >
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">01 / ARCHITECTURE</span>
        <h2 class="text-2xl font-bold mt-2">Kinetic Performance Engine</h2>
        <p class="text-slate-400 text-sm mt-2">Batched read-write cycles guaranteeing 120Hz V-Sync.</p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">02 / MEMORY</span>
        <h2 class="text-2xl font-bold mt-2">Zero-Allocation Pipeline</h2>
        <p class="text-slate-400 text-sm mt-2">Persistent Float64Array buffers eliminating GC pauses.</p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">03 / ACCELERATION</span>
        <h2 class="text-2xl font-bold mt-2">Sub-Pixel Delta Clamping</h2>
        <p class="text-slate-400 text-sm mt-2">Hardware compositor promotion with deadband skipping.</p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">04 / MOTION</span>
        <h2 class="text-2xl font-bold mt-2">Tiered Reverse Cascade</h2>
        <p class="text-slate-400 text-sm mt-2">Continuous C1 Hermite smoothstep cascade scaling.</p>
      </div>
    </div>
  </div>

  <script type="module">
    import { initStackingCards } from './stacking-cards.vanilla.js';

    // Auto-discover and hydrate all [data-exhuma-stacking-cards] on the page
    initStackingCards();
  </script>
</body>
</html>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Custom Element <exhuma-stacking-cards> standard usage.',
				code: `<!-- Custom Element <exhuma-stacking-cards> -->
<exhuma-stacking-cards
  top-start="${topStart}"
  top-increment="${topIncrement}"
  card-gap="${cardGap}"
  scale-threshold="${scaleThreshold}"
  min-scale="${minScale}"
  reverse-scale="${reverseScale}"
  class="max-w-2xl mx-auto"
>
  <article class="rounded-2xl border border-border bg-card p-8 shadow-xl min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">01 / ARCHITECTURE</span>
    <h2 class="text-2xl font-bold mt-2">Kinetic Performance Engine</h2>
    <p class="text-muted-foreground text-sm mt-2">120Hz V-Sync unblocked scrolling.</p>
  </article>

  <article class="rounded-2xl border border-border bg-card p-8 shadow-xl min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">02 / MEMORY</span>
    <h2 class="text-2xl font-bold mt-2">Zero-Allocation Pipeline</h2>
    <p class="text-muted-foreground text-sm mt-2">Zero GC overhead during interaction.</p>
  </article>

  <article class="rounded-2xl border border-border bg-card p-8 shadow-xl min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">03 / ACCELERATION</span>
    <h2 class="text-2xl font-bold mt-2">Sub-Pixel Delta Clamping</h2>
    <p class="text-muted-foreground text-sm mt-2">Hardware compositor promotion with deadband skipping.</p>
  </article>

  <article class="rounded-2xl border border-border bg-card p-8 shadow-xl min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">04 / MOTION</span>
    <h2 class="text-2xl font-bold mt-2">Tiered Reverse Cascade</h2>
    <p class="text-muted-foreground text-sm mt-2">Continuous C1 Hermite smoothstep cascade scaling.</p>
  </article>
</exhuma-stacking-cards>

<!-- Load Universal Web Component Definition -->
<script type="module" src="./exhuma-stacking-cards.js"></script>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg Block dynamic server-side render template.',
				code: `<?php
/**
 * Dynamic Render Template for exhuma/stacking-cards Block.
 */
$top_start = $attributes['topStart'] ?? ${topStart};
$top_increment = $attributes['topIncrement'] ?? ${topIncrement};
$card_gap = $attributes['cardGap'] ?? ${cardGap};
$scale_threshold = $attributes['scaleThreshold'] ?? ${scaleThreshold};
$min_scale = $attributes['minScale'] ?? ${minScale};
$reverse_scale = $attributes['reverseScale'] ?? ${reverseScale ? 'true' : 'false'};
?>

<div
  class="exhuma-stacking-cards-block max-w-2xl mx-auto"
  data-exhuma-stacking-cards
  data-top-start="<?php echo esc_attr($top_start); ?>"
  data-top-increment="<?php echo esc_attr($top_increment); ?>"
  data-card-gap="<?php echo esc_attr($card_gap); ?>"
  data-scale-threshold="<?php echo esc_attr($scale_threshold); ?>"
  data-min-scale="<?php echo esc_attr($min_scale); ?>"
  data-reverse-scale="<?php echo esc_attr($reverse_scale ? 'true' : 'false'); ?>"
>
  <?php echo $content; ?>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen using StackingCards mobile primitive.',
				code: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { StackingCards } from './components/StackingCards';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Kinetic Stacking</Text>
        <StackingCards
          topStart={${topStart}}
          topIncrement={${topIncrement}}
          cardGap={${cardGap}}
          scaleThreshold={${scaleThreshold}}
          minScale={${minScale}}
          reverseScale={${reverseScale}}
        >
          <View style={styles.card}>
            <Text style={styles.tag}>01 / ARCHITECTURE</Text>
            <Text style={styles.title}>Kinetic Performance</Text>
            <Text style={styles.desc}>Smooth 120Hz V-Sync depth decay.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.tag}>02 / MEMORY</Text>
            <Text style={styles.title}>Zero-Allocation</Text>
            <Text style={styles.desc}>Persistent buffer architecture.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.tag}>03 / ACCELERATION</Text>
            <Text style={styles.title}>Sub-Pixel Clamping</Text>
            <Text style={styles.desc}>Hardware compositor layer promotion.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.tag}>04 / MOTION</Text>
            <Text style={styles.title}>Tiered Reverse Cascade</Text>
            <Text style={styles.desc}>Continuous C1 Hermite smoothstep exit.</Text>
          </View>
        </StackingCards>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  scroll: { padding: 20, minHeight: 1200 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
  card: { padding: 24, borderRadius: 20, backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', minHeight: 180, marginBottom: 16 },
  tag: { fontSize: 11, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  desc: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 20 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'features_screen.dart',
				language: 'dart',
				description: 'Flutter Dart screen implementing ExhumaStackingCards widget.',
				code: `import 'package:flutter/material.dart';
import 'package:exhuma/exhuma.dart';

class FeaturesScreen extends StatelessWidget {
  const FeaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 60.0),
          child: Column(
            children: [
              const Text(
                'Kinetic Stacking',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 32),
              ExhumaStackingCards(
                topStart: ${topStart},
                topIncrement: ${topIncrement},
                cardGap: ${cardGap},
                scaleThreshold: ${scaleThreshold},
                minScale: ${minScale},
                reverseScale: ${reverseScale},
                children: [
                  _buildCard('01 / ARCHITECTURE', 'Kinetic Performance Engine', '120 FPS'),
                  _buildCard('02 / MEMORY', 'Zero-Allocation Pipeline', 'Ω(1) HEAP'),
                  _buildCard('03 / ACCELERATION', 'Sub-Pixel Delta Clamping', 'GPU ACCEL'),
                  _buildCard('04 / MOTION', 'Tiered Reverse Cascade', 'HERMITE C1'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(String tag, String title, String badge) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16.0),
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF131C2E),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFF223252)),
        boxShadow: const [BoxShadow(blurRadius: 16, color: Colors.black45, offset: Offset(0, 8))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(tag, style: const TextStyle(fontSize: 11, color: Color(0xFF60A5FA), fontWeight: FontWeight.bold)),
              Text(badge, style: const TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'Standard usage snippet.',
				code: `import { StackingCards } from '@/components/ui/StackingCards';\n\nexport default function Example() {\n  return (\n    <StackingCards>\n      <div>Card 1</div>\n      <div>Card 2</div>\n    </StackingCards>\n  );\n}`,
			};
		}
	}
}

function getGenericComponentUsage(component: UniversalComponent, flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const pascalName = component.name.replace(/\s+/g, '');
	const slug = component.slug;

	const propEntries = Object.entries(props)
		.map(([key, val]) => {
			if (typeof val === 'number') return `${key}={${val}}`;
			if (typeof val === 'boolean') return val ? key : `${key}={false}`;
			if (typeof val === 'string') return `${key}="${val}"`;
			return null;
		})
		.filter(Boolean)
		.join(' ');

	const jsxProps = propEntries ? ` ${propEntries}` : '';

	switch (flavor) {
		case 'nextjs':
		case 'react':
			return {
				filename: flavor === 'nextjs' ? 'page.tsx' : 'Example.tsx',
				language: 'tsx',
				description: `${component.name} consumption in React / Next.js.`,
				code: `${flavor === 'nextjs' ? "'use client';\n\n" : ''}import React from 'react';
import { ${pascalName} } from '@/components/ui/${pascalName}';

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <${pascalName}${jsxProps}>
        <div className="p-6 text-foreground">
          <h3 className="text-xl font-bold">${component.name} Content</h3>
          <p className="text-sm text-muted-foreground mt-2">${component.description}</p>
        </div>
      </${pascalName}>
    </div>
  );
}
`,
			};

		case 'vue':
			return {
				filename: 'App.vue',
				language: 'vue',
				description: `${component.name} consumption in Vue 3.`,
				code: `<script setup lang="ts">
import ${pascalName} from '@/components/ui/${pascalName}.vue';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <${pascalName}>
      <div class="p-6 text-foreground">
        <h3 class="text-xl font-bold">${component.name}</h3>
        <p class="text-sm text-muted-foreground mt-2">${component.description}</p>
      </div>
    </${pascalName}>
  </div>
</template>
`,
			};

		case 'svelte':
			return {
				filename: 'App.svelte',
				language: 'svelte',
				description: `${component.name} consumption in Svelte 5.`,
				code: `<script lang="ts">
  import ${pascalName} from '$lib/components/${pascalName}.svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <${pascalName}>
    <div class="p-6 text-foreground">
      <h3 class="text-xl font-bold">${component.name}</h3>
      <p class="text-sm text-muted-foreground mt-2">${component.description}</p>
    </div>
  </${pascalName}>
</div>
`,
			};

		default:
			return {
				filename: 'Example.tsx',
				language: 'tsx',
				description: `${component.name} generic usage.`,
				code: `// ${component.name} usage for ${flavor}\nimport { ${pascalName} } from '@/components/ui/${pascalName}';\n`,
			};
	}
}
