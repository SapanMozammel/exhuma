import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';

export const stackingCardsComponent: UniversalComponent = {
  id: 'stacking-cards',
  name: 'Stacking Cards',
  slug: 'stacking-cards',
  category: 'cards',
  description: 'Layered 3D sticky stack cards with progressive scroll depth scale decay and CSS sticky positioning.',
  version: '1.0.0',
  props: [
    {
      name: 'cardGap',
      label: 'Card Gap (px)',
      type: 'number',
      defaultValue: 24,
      min: 8,
      max: 64,
      step: 4,
      description: 'Vertical distance in pixels between each stacked card in the viewport.',
    },
    {
      name: 'scaleDecay',
      label: 'Scale Decay',
      type: 'number',
      defaultValue: 0.04,
      min: 0.01,
      max: 0.1,
      step: 0.01,
      description: 'Amount by which earlier cards scale down as later cards slide over them.',
    },
    {
      name: 'cardCount',
      label: 'Card Count',
      type: 'number',
      defaultValue: 4,
      min: 2,
      max: 6,
      step: 1,
      description: 'Number of demo cards rendered in the preview stack.',
    },
  ],
  defaultProps: {
    cardGap: 24,
    scaleDecay: 0.04,
    cardCount: 4,
  },
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload[] => {
    const cardGap = Number(props.cardGap ?? 24);
    const scaleDecay = Number(props.scaleDecay ?? 0.04);
    const cardCount = Number(props.cardCount ?? 4);

    switch (flavor) {
      case 'react':
        return [
          {
            filename: 'StackingCards.tsx',
            language: 'tsx',
            description: 'Idiomatic React 18/19 component with forwardRef and typed props.',
            code: `'use client';

import React, { forwardRef } from 'react';

export interface StackingCardsItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  bg?: string;
}

export interface StackingCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StackingCardsItem[];
  cardGap?: number;
  scaleDecay?: number;
}

export const StackingCards = forwardRef<HTMLDivElement, StackingCardsProps>(
  ({ items, cardGap = ${cardGap}, scaleDecay = ${scaleDecay}, className = '', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={\`relative w-full max-w-4xl mx-auto py-12 \${className}\`}
        style={style}
        {...props}
      >
        {items.map((item, index) => {
          const depthScale = 1 - (items.length - 1 - index) * scaleDecay;
          return (
            <div
              key={item.id}
              className="sticky rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl transition-transform duration-300 mb-8"
              style={{
                top: \`calc(10vh + \${index * cardGap}px)\`,
                transform: \`scale(\${depthScale})\`,
                transformOrigin: 'top center',
              }}
            >
              {item.badge && (
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-4">
                  {item.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
);

StackingCards.displayName = 'StackingCards';`,
          },
        ];

      case 'nextjs':
        return [
          {
            filename: 'stacking-cards.tsx',
            language: 'tsx',
            description: 'Next.js 15 App Router component with client boundary.',
            code: `'use client';

import React from 'react';

const DEMO_ITEMS = [
  { id: '1', title: 'Tactile Architecture', description: 'Zero-latency feedback loop with hardware-accelerated 3D transforms.', badge: 'Core' },
  { id: '2', title: 'Universal Registry', description: 'Write once, deploy seamlessly across React, Next.js, Vue, Astro, and Blade.', badge: 'Ecosystem' },
  { id: '3', title: 'Enterprise Compliance', description: 'Rigorous memory teardown with zero detached listeners or leaks.', badge: 'Reliability' },
  { id: '4', title: 'Production Velocity', description: 'Ready-to-copy code blocks tested against real compiler suites.', badge: 'Speed' },
];

export default function StackingCardsDemo() {
  const cardGap = ${cardGap};
  const scaleDecay = ${scaleDecay};

  return (
    <section className="relative w-full max-w-4xl mx-auto py-16 px-4">
      {DEMO_ITEMS.map((item, index) => (
        <div
          key={item.id}
          className="sticky rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-8 shadow-xl mb-8"
          style={{
            top: \`calc(10vh + \${index * cardGap}px)\`,
            transform: \`scale(\${1 - (DEMO_ITEMS.length - 1 - index) * scaleDecay})\`,
            transformOrigin: 'top center',
          }}
        >
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            {item.badge}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 mb-2">{item.title}</h3>
          <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
        </div>
      ))}
    </section>
  );
}`,
          },
        ];

      case 'vue':
        return [
          {
            filename: 'StackingCards.vue',
            language: 'vue',
            description: 'Vue 3 Single-File Component with script setup and TypeScript.',
            code: `<script setup lang="ts">
interface StackingItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

const props = withDefaults(
  defineProps<{
    items?: StackingItem[];
    cardGap?: number;
    scaleDecay?: number;
  }>(),
  {
    cardGap: ${cardGap},
    scaleDecay: ${scaleDecay},
    items: () => [
      { id: '1', title: 'Tactile Performance', description: 'Silky smooth sticky scroll with hardware acceleration.', badge: 'Core' },
      { id: '2', title: 'Zero Leakage', description: 'Zero memory leaks, clean teardowns, perfectly scoped styles.', badge: 'Safety' },
      { id: '3', title: 'Multi-Framework', description: 'Pure Vue 3 Composition API with full TypeScript props.', badge: 'Ecosystem' },
    ],
  }
);
</script>

<template>
  <div class="relative w-full max-w-4xl mx-auto py-12 px-4">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="sticky rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl mb-8 transition-transform duration-300"
      :style="{
        top: \`calc(10vh + \${index * cardGap}px)\`,
        transform: \`scale(\${1 - (items.length - 1 - index) * scaleDecay})\`,
        transformOrigin: 'top center',
      }"
    >
      <span v-if="item.badge" class="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
        {{ item.badge }}
      </span>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">{{ item.title }}</h3>
      <p class="text-slate-600 dark:text-slate-400">{{ item.description }}</p>
    </div>
  </div>
</template>`,
          },
        ];

      case 'astro':
        return [
          {
            filename: 'StackingCards.astro',
            language: 'astro',
            description: 'Native Astro component with zero-JS client overhead by default.',
            code: `---
interface Item {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

interface Props {
  items?: Item[];
  cardGap?: number;
  scaleDecay?: number;
  class?: string;
}

const {
  cardGap = ${cardGap},
  scaleDecay = ${scaleDecay},
  class: className = '',
  items = [
    { id: '1', title: 'Astro Zero-JS', description: 'Renders pure HTML and CSS transforms with zero client JavaScript runtime.', badge: 'Speed' },
    { id: '2', title: 'Content Collections Ready', description: 'Pass markdown collections or CMS data straight into props.', badge: 'Docs' },
    { id: '3', title: 'Responsive Stacking', description: 'CSS sticky positioning handles dynamic viewports effortlessly.', badge: 'Layout' },
  ],
} = Astro.props;
---

<div class:list={['relative w-full max-w-4xl mx-auto py-12 px-4', className]}>
  {items.map((item, index) => {
    const scale = 1 - (items.length - 1 - index) * scaleDecay;
    return (
      <div
        class="sticky rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl mb-8"
        style={\`top: calc(10vh + \${index * cardGap}px); transform: scale(\${scale}); transform-origin: top center;\`}
      >
        {item.badge && (
          <span class="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
            {item.badge}
          </span>
        )}
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
        <p class="text-slate-600 dark:text-slate-400">{item.description}</p>
      </div>
    );
  })}
</div>`,
          },
        ];

      case 'blade':
        return [
          {
            filename: 'stacking-cards.blade.php',
            language: 'php',
            description: 'Laravel Blade anonymous component (resources/views/components/exhuma/stacking-cards.blade.php).',
            code: `@props([
    'items' => [
        ['id' => '1', 'title' => 'TALL Stack Ready', 'description' => 'Drop directly into Laravel with Tailwind CSS and Alpine.js.', 'badge' => 'Laravel'],
        ['id' => '2', 'title' => 'Blade Component', 'description' => 'Pass collections, Eloquent models, or array items seamlessly.', 'badge' => 'Fullstack'],
        ['id' => '3', 'title' => 'Dynamic Calculation', 'description' => 'Zero external JavaScript bundle required for sticky scaling.', 'badge' => 'Blade'],
    ],
    'cardGap' => ${cardGap},
    'scaleDecay' => ${scaleDecay},
])

<div {{ $attributes->merge(['class' => 'relative w-full max-w-4xl mx-auto py-12 px-4']) }}>
    @foreach($items as $index => $item)
        @php
            $scale = 1 - (count($items) - 1 - $index) * $scaleDecay;
            $top = "calc(10vh + " . ($index * $cardGap) . "px)";
        @endphp
        <div 
            class="sticky rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl mb-8 transition-transform duration-300"
            style="top: {{ $top }}; transform: scale({{ $scale }}); transform-origin: top center;"
        >
            @if(!empty($item['badge']))
                <span class="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
                    {{ $item['badge'] }}
                </span>
            @endif
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">{{ $item['title'] }}</h3>
            <p class="text-slate-600 dark:text-slate-400">{{ $item['description'] }}</p>
        </div>
    @endforeach
</div>`,
          },
        ];

      case 'vanilla':
        return [
          {
            filename: 'exhuma-stacking-cards.js',
            language: 'javascript',
            description: 'Zero-dependency autonomous ES6 class with strict destroy() memory cleanup.',
            code: `/**
 * Exhuma Stacking Cards — Pure Vanilla JS
 * Zero external dependencies. Strict lifecycle: init(), update(), destroy().
 */
export class ExhumaStackingCards {
  constructor(element, options = {}) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.container) throw new Error('[Exhuma] Target element not found');

    this.options = Object.assign(
      {
        cardGap: ${cardGap},
        scaleDecay: ${scaleDecay},
      },
      options
    );

    this._listeners = [];
    this.init();
  }

  init() {
    this.cards = Array.from(this.container.querySelectorAll('.exhuma-card'));
    this.applyStyles();
  }

  applyStyles() {
    const total = this.cards.length;
    this.cards.forEach((card, index) => {
      const scale = 1 - (total - 1 - index) * this.options.scaleDecay;
      card.style.position = 'sticky';
      card.style.top = \`calc(10vh + \${index * this.options.cardGap}px)\`;
      card.style.transform = \`scale(\${scale})\`;
      card.style.transformOrigin = 'top center';
      card.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  update(newOptions = {}) {
    this.options = Object.assign(this.options, newOptions);
    this.applyStyles();
  }

  destroy() {
    this.cards.forEach((card) => {
      card.style.position = '';
      card.style.top = '';
      card.style.transform = '';
      card.style.transformOrigin = '';
      card.style.transition = '';
    });
    this._listeners.forEach(({ target, event, handler }) => target.removeEventListener(event, handler));
    this._listeners = [];
  }
}

// Auto-bootstrap when data-exhuma="stacking-cards" is present
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-exhuma="stacking-cards"]').forEach((el) => {
      new ExhumaStackingCards(el);
    });
  });
}`,
          },
          {
            filename: 'exhuma-stacking-cards.css',
            language: 'css',
            description: 'Scoped CSS with @layer isolation to prevent theme pollution.',
            code: `@layer exhuma {
  .exhuma-stacking-container {
    position: relative;
    width: 100%;
    max-width: 56rem;
    margin: 0 auto;
    padding: 3rem 1rem;
  }

  .exhuma-card {
    background: var(--exhuma-card-bg, #ffffff);
    border: 1px solid var(--exhuma-border, #e2e8f0);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    .exhuma-card {
      background: var(--exhuma-card-bg-dark, #0f172a);
      border-color: var(--exhuma-border-dark, #1e293b);
      color: #f8fafc;
    }
  }
}`,
          },
        ];

      case 'wordpress':
        return [
          {
            filename: 'block.json',
            language: 'json',
            description: 'WordPress Block API v3 metadata specification.',
            code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/stacking-cards",
  "version": "1.0.0",
  "title": "Exhuma Stacking Cards",
  "category": "design",
  "icon": "slides",
  "description": "Progressive sticky stacking cards with depth scale decay.",
  "attributes": {
    "cardGap": { "type": "number", "default": ${cardGap} },
    "scaleDecay": { "type": "number", "default": ${scaleDecay} }
  },
  "editorScript": "file:./index.js",
  "style": "file:./style.css"
}`,
          },
          {
            filename: 'functions.php',
            language: 'php',
            description: 'PHP enqueue helper for classic themes or page builders.',
            code: `<?php
/**
 * Enqueue Exhuma Stacking Cards assets in WordPress
 */
function exhuma_enqueue_stacking_cards() {
    wp_enqueue_style('exhuma-stacking-cards', get_template_directory_uri() . '/css/exhuma-stacking-cards.css', array(), '1.0.0');
    wp_enqueue_script('exhuma-stacking-cards', get_template_directory_uri() . '/js/exhuma-stacking-cards.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'exhuma_enqueue_stacking_cards');`,
          },
        ];

      case 'webcomponent':
        return [
          {
            filename: 'exhuma-stacking-cards.js',
            language: 'javascript',
            description: 'Autonomous Custom Element v1 (<exhuma-stacking-cards>).',
            code: `/**
 * Universal Custom Element: <exhuma-stacking-cards>
 * Framework-agnostic: works natively in Svelte, Angular, Vue, or static HTML.
 */
class ExhumaStackingCardsElement extends HTMLElement {
  static get observedAttributes() {
    return ['card-gap', 'scale-decay'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const cardGap = parseFloat(this.getAttribute('card-gap')) || ${cardGap};
    const scaleDecay = parseFloat(this.getAttribute('scale-decay')) || ${scaleDecay};
    const cards = Array.from(this.querySelectorAll('.exhuma-card'));

    cards.forEach((card, index) => {
      const scale = 1 - (cards.length - 1 - index) * scaleDecay;
      card.style.position = 'sticky';
      card.style.top = \`calc(10vh + \${index * cardGap}px)\`;
      card.style.transform = \`scale(\${scale})\`;
      card.style.transformOrigin = 'top center';
    });
  }
}

if (!customElements.get('exhuma-stacking-cards')) {
  customElements.define('exhuma-stacking-cards', ExhumaStackingCardsElement);
}`,
          },
        ];

      case 'svelte':
        return [
          {
            filename: 'StackingCards.svelte',
            language: 'svelte',
            description: 'Svelte 5 Runes ($props, $derived) component with reactive scale calculations.',
            code: `<script lang="ts">
  interface StackingCardsItem {
    id: string;
    title: string;
    description: string;
    badge?: string;
    bg?: string;
  }

  let {
    cardGap = ${cardGap},
    scaleDecay = ${scaleDecay},
    class: className = '',
    items = [],
  }: {
    cardGap?: number;
    scaleDecay?: number;
    class?: string;
    items?: StackingCardsItem[];
  } = $props();

  const fallbackItems: StackingCardsItem[] = [
    {
      id: '1',
      title: 'Architectural Sovereignty',
      description: 'Zero runtime dependencies. Pure CSS sticky layout engine.',
      badge: 'Core Engine',
      bg: '#18181b',
    },
    {
      id: '2',
      title: 'Universal Portability',
      description: 'Compiles across 13 frontend ecosystems with zero friction.',
      badge: 'Cross Platform',
      bg: '#27272a',
    },
    {
      id: '3',
      title: 'Zero Memory Leaks',
      description: 'Strict lifecycle teardown and disposal hooks across all targets.',
      badge: 'Performance',
      bg: '#09090b',
    },
  ];

  const displayItems = $derived(items.length > 0 ? items : fallbackItems);
</script>

<div class="relative w-full max-w-2xl mx-auto py-12 px-4 {className}">
  {#each displayItems as item, index (item.id)}
    {@const scale = 1 - (displayItems.length - 1 - index) * scaleDecay}
    <div
      class="sticky w-full rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-md transition-all duration-300"
      style="top: calc(10vh + {index * cardGap}px); transform: scale({scale}); transform-origin: top center; background: {item.bg || '#18181b'};"
    >
      <div class="flex items-center justify-between mb-4">
        {#if item.badge}
          <span class="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/80 font-mono">
            {item.badge}
          </span>
        {/if}
        <span class="text-xs font-mono text-zinc-500">0{index + 1}</span>
      </div>
      <h3 class="text-2xl font-bold text-white mb-2">{item.title}</h3>
      <p class="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
    </div>
  {/each}
</div>`,
          },
        ];

      case 'angular':
        return [
          {
            filename: 'stacking-cards.component.ts',
            language: 'typescript',
            description: 'Angular 18+ Standalone component with Signals (input, computed).',
            code: `import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StackingCardsItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  bg?: string;
}

@Component({
  selector: 'exhuma-stacking-cards',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div [class]="'relative w-full max-w-2xl mx-auto py-12 px-4 ' + customClass()">
      @for (item of displayItems(); track item.id; let i = $index) {
        <div
          class="sticky w-full rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-md transition-all duration-300"
          [style.top]="'calc(10vh + ' + (i * cardGap()) + 'px)'"
          [style.transform]="'scale(' + getScale(i) + ')'"
          [style.transform-origin]="'top center'"
          [style.background]="item.bg || '#18181b'"
        >
          <div class="flex items-center justify-between mb-4">
            @if (item.badge) {
              <span class="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/80 font-mono">
                {{ item.badge }}
              </span>
            }
            <span class="text-xs font-mono text-zinc-500">0{{ i + 1 }}</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">{{ item.title }}</h3>
          <p class="text-zinc-400 text-sm leading-relaxed">{{ item.description }}</p>
        </div>
      }
    </div>
  \`,
})
export class ExhumaStackingCardsComponent {
  readonly cardGap = input<number>(${cardGap});
  readonly scaleDecay = input<number>(${scaleDecay});
  readonly customClass = input<string>('');
  readonly items = input<StackingCardsItem[]>([]);

  readonly defaultItems: StackingCardsItem[] = [
    {
      id: '1',
      title: 'Architectural Sovereignty',
      description: 'Zero runtime dependencies. Pure CSS sticky layout engine.',
      badge: 'Core Engine',
      bg: '#18181b',
    },
    {
      id: '2',
      title: 'Universal Portability',
      description: 'Compiles across 13 frontend ecosystems with zero friction.',
      badge: 'Cross Platform',
      bg: '#27272a',
    },
    {
      id: '3',
      title: 'Zero Memory Leaks',
      description: 'Strict lifecycle teardown and disposal hooks across all targets.',
      badge: 'Performance',
      bg: '#09090b',
    },
  ];

  readonly displayItems = computed(() => {
    const list = this.items();
    return list && list.length > 0 ? list : this.defaultItems;
  });

  getScale(index: number): number {
    return 1 - (this.displayItems().length - 1 - index) * this.scaleDecay();
  }
}`,
          },
        ];

      case 'solid':
        return [
          {
            filename: 'StackingCards.tsx',
            language: 'tsx',
            description: 'SolidJS component with fine-grained reactive primitives.',
            code: `import { Component, For, mergeProps } from 'solid-js';

export interface StackingCardsItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  bg?: string;
}

export interface StackingCardsProps {
  items?: StackingCardsItem[];
  cardGap?: number;
  scaleDecay?: number;
  class?: string;
}

const defaultItems: StackingCardsItem[] = [
  {
    id: '1',
    title: 'Architectural Sovereignty',
    description: 'Zero runtime dependencies. Pure CSS sticky layout engine.',
    badge: 'Core Engine',
    bg: '#18181b',
  },
  {
    id: '2',
    title: 'Universal Portability',
    description: 'Compiles across 13 frontend ecosystems with zero friction.',
    badge: 'Cross Platform',
    bg: '#27272a',
  },
  {
    id: '3',
    title: 'Zero Memory Leaks',
    description: 'Strict lifecycle teardown and disposal hooks across all targets.',
    badge: 'Performance',
    bg: '#09090b',
  },
];

export const StackingCards: Component<StackingCardsProps> = (rawProps) => {
  const props = mergeProps(
    {
      cardGap: ${cardGap},
      scaleDecay: ${scaleDecay},
      items: defaultItems,
      class: '',
    },
    rawProps
  );

  return (
    <div class={\`relative w-full max-w-2xl mx-auto py-12 px-4 \${props.class}\`}>
      <For each={props.items}>
        {(item, index) => {
          const scale = 1 - (props.items.length - 1 - index()) * props.scaleDecay;
          return (
            <div
              class="sticky w-full rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-md transition-all duration-300"
              style={{
                top: \`calc(10vh + \${index() * props.cardGap}px)\`,
                transform: \`scale(\${scale})\`,
                'transform-origin': 'top center',
                background: item.bg || '#18181b',
              }}
            >
              <div class="flex items-center justify-between mb-4">
                {item.badge && (
                  <span class="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/80 font-mono">
                    {item.badge}
                  </span>
                )}
                <span class="text-xs font-mono text-zinc-500">0{index() + 1}</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          );
        }}
      </For>
    </div>
  );
};`,
          },
        ];

      case 'react-native':
        return [
          {
            filename: 'StackingCards.native.tsx',
            language: 'tsx',
            description: 'React Native / Expo component for iOS and Android with StyleSheet / NativeWind compatibility.',
            code: `import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export interface StackingCardsItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  bg?: string;
}

export interface StackingCardsProps {
  items?: StackingCardsItem[];
  cardGap?: number;
}

const defaultItems: StackingCardsItem[] = [
  {
    id: '1',
    title: 'Architectural Sovereignty',
    description: 'Zero runtime dependencies. Pure native layout engine.',
    badge: 'Core Engine',
    bg: '#18181b',
  },
  {
    id: '2',
    title: 'Universal Portability',
    description: 'Compiles across 13 frontend ecosystems with zero friction.',
    badge: 'Cross Platform',
    bg: '#27272a',
  },
  {
    id: '3',
    title: 'Zero Memory Leaks',
    description: 'Strict lifecycle teardown and disposal hooks across all targets.',
    badge: 'Performance',
    bg: '#09090b',
  },
];

export const StackingCards: React.FC<StackingCardsProps> = ({
  items = defaultItems,
  cardGap = ${cardGap},
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor: item.bg || '#18181b',
              marginTop: index === 0 ? 0 : -cardGap,
            },
          ]}
        >
          <View style={styles.header}>
            {item.badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            ) : null}
            <Text style={styles.indexText}>0{index + 1}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  indexText: {
    fontSize: 12,
    color: '#71717a',
    fontFamily: 'Courier',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
});`,
          },
        ];

      case 'flutter':
        return [
          {
            filename: 'stacking_cards.dart',
            language: 'dart',
            description: 'Idiomatic Flutter widget for iOS, Android, and Desktop with scale transform.',
            code: `import 'package:flutter/material.dart';

class StackingCardItem {
  final String id;
  final String title;
  final String description;
  final String? badge;
  final Color? bg;

  const StackingCardItem({
    required this.id,
    required this.title,
    required this.description,
    this.badge,
    this.bg,
  });
}

class ExhumaStackingCards extends StatelessWidget {
  final List<StackingCardItem>? items;
  final double cardGap;
  final double scaleDecay;

  const ExhumaStackingCards({
    super.key,
    this.items,
    this.cardGap = ${cardGap}.0,
    this.scaleDecay = ${scaleDecay},
  });

  static const List<StackingCardItem> _defaultItems = [
    StackingCardItem(
      id: '1',
      title: 'Architectural Sovereignty',
      description: 'Zero runtime dependencies. Pure layout engine.',
      badge: 'Core Engine',
      bg: Color(0xFF18181B),
    ),
    StackingCardItem(
      id: '2',
      title: 'Universal Portability',
      description: 'Compiles across 13 frontend ecosystems with zero friction.',
      badge: 'Cross Platform',
      bg: Color(0xFF27272A),
    ),
    StackingCardItem(
      id: '3',
      title: 'Zero Memory Leaks',
      description: 'Strict lifecycle teardown and disposal hooks across all targets.',
      badge: 'Performance',
      bg: Color(0xFF09090B),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final displayItems = (items != null && items!.isNotEmpty) ? items! : _defaultItems;

    return ListView.builder(
      shrinkWrap: true,
      physics: const ClampingScrollPhysics(),
      padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 16.0),
      itemCount: displayItems.length,
      itemBuilder: (context, index) {
        final item = displayItems[index];
        final scale = 1.0 - (displayItems.length - 1 - index) * scaleDecay;

        return Transform.scale(
          scale: scale.clamp(0.7, 1.0),
          alignment: Alignment.topCenter,
          child: Container(
            margin: EdgeInsets.only(bottom: cardGap),
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: item.bg ?? const Color(0xFF18181B),
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.4),
                  blurRadius: 16.0,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (item.badge != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          item.badge!,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    Text(
                      '0\${index + 1}',
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  item.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  item.description,
                  style: const TextStyle(color: Colors.white60, fontSize: 14),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}`,
          },
        ];
    }
  },
};
