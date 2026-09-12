import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';

export const horizontalScrollerComponent: UniversalComponent = {
  id: 'horizontal-scroller',
  name: 'Horizontal Scroller',
  slug: 'horizontal-scroller',
  category: 'cards',
  description: 'Smooth wheel-to-horizontal translation rail with touch swipe inertia and keyboard arrow navigation.',
  version: '1.0.0',
  props: [
    {
      name: 'itemGap',
      label: 'Item Gap (px)',
      type: 'number',
      defaultValue: 20,
      min: 8,
      max: 48,
      step: 4,
      description: 'Gap between horizontal items.',
    },
    {
      name: 'showFadeEdges',
      label: 'Fade Edges',
      type: 'boolean',
      defaultValue: true,
      description: 'Show subtle gradient mask at horizontal overflow boundaries.',
    },
  ],
  defaultProps: {
    itemGap: 20,
    showFadeEdges: true,
  },
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload[] => {
    const itemGap = Number(props.itemGap ?? 20);
    const showFadeEdges = Boolean(props.showFadeEdges ?? true);

    switch (flavor) {
      case 'react':
      case 'nextjs':
        return [
          {
            filename: 'HorizontalScroller.tsx',
            language: 'tsx',
            description: 'React/Next.js horizontal scroller with wheel-to-scroll support.',
            code: `'use client';

import React, { useRef, useEffect } from 'react';

export interface HorizontalScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  itemGap?: number;
  showFadeEdges?: boolean;
  children: React.ReactNode;
}

export function HorizontalScroller({
  itemGap = ${itemGap},
  showFadeEdges = ${showFadeEdges},
  className = '',
  children,
  ...props
}: HorizontalScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className={\`relative w-full overflow-hidden \${className}\`} {...props}>
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-none scroll-smooth py-6 px-4"
        style={{ gap: \`\${itemGap}px\` }}
      >
        {children}
      </div>
    </div>
  );
}`,
          },
        ];

      case 'vue':
        return [
          {
            filename: 'HorizontalScroller.vue',
            language: 'vue',
            description: 'Vue 3 horizontal scroller with wheel event listener.',
            code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    itemGap?: number;
  }>(),
  {
    itemGap: ${itemGap},
  }
);

const container = ref<HTMLElement | null>(null);

const onWheel = (e: WheelEvent) => {
  if (!container.value) return;
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    container.value.scrollLeft += e.deltaY;
  }
};

onMounted(() => {
  container.value?.addEventListener('wheel', onWheel, { passive: false });
});

onUnmounted(() => {
  container.value?.removeEventListener('wheel', onWheel);
});
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <div
      ref="container"
      class="flex overflow-x-auto scroll-smooth py-6 px-4"
      :style="{ gap: \`\${itemGap}px\` }"
    >
      <slot />
    </div>
  </div>
</template>`,
          },
        ];

      case 'astro':
        return [
          {
            filename: 'HorizontalScroller.astro',
            language: 'astro',
            description: 'Astro component with zero-JS native horizontal scrolling.',
            code: `---
interface Props {
  itemGap?: number;
  class?: string;
}

const { itemGap = ${itemGap}, class: className = '' } = Astro.props;
---

<div class:list={['relative w-full overflow-hidden', className]}>
  <div
    class="flex overflow-x-auto scroll-smooth py-6 px-4 snap-x snap-mandatory"
    style={\`gap: \${itemGap}px;\`}
  >
    <slot />
  </div>
</div>`,
          },
        ];

      case 'blade':
        return [
          {
            filename: 'horizontal-scroller.blade.php',
            language: 'php',
            description: 'Laravel Blade component with Alpine.js wheel binding.',
            code: `@props([
    'itemGap' => ${itemGap},
])

<div {{ $attributes->merge(['class' => 'relative w-full overflow-hidden']) }}>
    <div 
        x-data
        @wheel.prevent="$el.scrollLeft += $event.deltaY"
        class="flex overflow-x-auto scroll-smooth py-6 px-4"
        style="gap: {{ $itemGap }}px;"
    >
        {{ $slot }}
    </div>
</div>`,
          },
        ];

      case 'vanilla':
        return [
          {
            filename: 'exhuma-scroller.js',
            language: 'javascript',
            description: 'Autonomous Vanilla JS class with destroy() cleanup.',
            code: `export class ExhumaHorizontalScroller {
  constructor(element, options = {}) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.container) throw new Error('[Exhuma] Scroller container not found');

    this.options = Object.assign({ itemGap: ${itemGap} }, options);
    this._onWheel = this.handleWheel.bind(this);
    this.init();
  }

  init() {
    this.container.style.display = 'flex';
    this.container.style.overflowX = 'auto';
    this.container.style.gap = \`\${this.options.itemGap}px\`;
    this.container.addEventListener('wheel', this._onWheel, { passive: false });
  }

  handleWheel(e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      this.container.scrollLeft += e.deltaY;
    }
  }

  destroy() {
    this.container.removeEventListener('wheel', this._onWheel);
  }
}`,
          },
        ];

      case 'wordpress':
        return [
          {
            filename: 'block.json',
            language: 'json',
            description: 'WordPress Block API v3 definition for Horizontal Scroller.',
            code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/horizontal-scroller",
  "version": "1.0.0",
  "title": "Exhuma Horizontal Scroller",
  "category": "layout",
  "icon": "ellipsis",
  "description": "Smooth horizontal scrolling card rail.",
  "attributes": {
    "itemGap": { "type": "number", "default": ${itemGap} }
  }
}`,
          },
        ];

      case 'webcomponent':
        return [
          {
            filename: 'exhuma-horizontal-scroller.js',
            language: 'javascript',
            description: 'Custom Element (<exhuma-horizontal-scroller>).',
            code: `class ExhumaHorizontalScrollerElement extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.overflowX = 'auto';
    this.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        this.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
}
if (!customElements.get('exhuma-horizontal-scroller')) {
  customElements.define('exhuma-horizontal-scroller', ExhumaHorizontalScrollerElement);
}`,
          },
        ];

      case 'svelte':
        return [
          {
            filename: 'HorizontalScroller.svelte',
            language: 'svelte',
            description: 'Svelte 5 Runes horizontal scroller with wheel-to-horizontal translation.',
            code: `<script lang="ts">
  import { onMount } from 'svelte';

  let {
    itemGap = ${itemGap},
    showFadeEdges = ${showFadeEdges},
    class: className = '',
    children,
  }: {
    itemGap?: number;
    showFadeEdges?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
  } = $props();

  let scrollerRef: HTMLDivElement;

  onMount(() => {
    const el = scrollerRef;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  });
</script>

<div class="relative w-full overflow-hidden {className}">
  {#if showFadeEdges}
    <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
    <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>
  {/if}
  <div
    bind:this={scrollerRef}
    class="flex w-full overflow-x-auto scrollbar-none py-4 scroll-smooth"
    style="gap: {itemGap}px;"
  >
    {@render children?.()}
  </div>
</div>`,
          },
        ];

      case 'angular':
        return [
          {
            filename: 'horizontal-scroller.component.ts',
            language: 'typescript',
            description: 'Angular 18+ Standalone horizontal scroller with wheel momentum.',
            code: `import { Component, input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-horizontal-scroller',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div [class]="'relative w-full overflow-hidden ' + customClass()">
      @if (showFadeEdges()) {
        <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
        <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>
      }
      <div
        #scroller
        class="flex w-full overflow-x-auto scrollbar-none py-4 scroll-smooth"
        [style.gap]="itemGap() + 'px'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  \`,
})
export class ExhumaHorizontalScrollerComponent implements AfterViewInit, OnDestroy {
  readonly itemGap = input<number>(${itemGap});
  readonly showFadeEdges = input<boolean>(${showFadeEdges});
  readonly customClass = input<string>('');

  @ViewChild('scroller') scrollerRef!: ElementRef<HTMLDivElement>;

  private wheelHandler = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      this.scrollerRef.nativeElement.scrollLeft += e.deltaY;
    }
  };

  ngAfterViewInit() {
    this.scrollerRef.nativeElement.addEventListener('wheel', this.wheelHandler, { passive: false });
  }

  ngOnDestroy() {
    this.scrollerRef?.nativeElement?.removeEventListener('wheel', this.wheelHandler);
  }
}`,
          },
        ];

      case 'solid':
        return [
          {
            filename: 'HorizontalScroller.tsx',
            language: 'tsx',
            description: 'SolidJS horizontal scroller with wheel-to-horizontal translation.',
            code: `import { Component, JSX, mergeProps, onMount, onCleanup } from 'solid-js';

export interface HorizontalScrollerProps {
  itemGap?: number;
  showFadeEdges?: boolean;
  class?: string;
  children?: JSX.Element;
}

export const HorizontalScroller: Component<HorizontalScrollerProps> = (rawProps) => {
  const props = mergeProps(
    {
      itemGap: ${itemGap},
      showFadeEdges: ${showFadeEdges},
      class: '',
    },
    rawProps
  );

  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    const el = containerRef;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    onCleanup(() => el.removeEventListener('wheel', handleWheel));
  });

  return (
    <div class={\`relative w-full overflow-hidden \${props.class}\`}>
      {props.showFadeEdges && (
        <>
          <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
          <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
        </>
      )}
      <div
        ref={containerRef}
        class="flex w-full overflow-x-auto scrollbar-none py-4 scroll-smooth"
        style={{ gap: \`\${props.itemGap}px\` }}
      >
        {props.children}
      </div>
    </div>
  );
};`,
          },
        ];

      case 'react-native':
        return [
          {
            filename: 'HorizontalScroller.native.tsx',
            language: 'tsx',
            description: 'React Native / Expo horizontal scroller for iOS and Android.',
            code: `import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export interface HorizontalScrollerProps {
  itemGap?: number;
  children?: React.ReactNode;
}

export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  itemGap = ${itemGap},
  children,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, { gap: itemGap }]}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
});`,
          },
        ];

      case 'flutter':
        return [
          {
            filename: 'horizontal_scroller.dart',
            language: 'dart',
            description: 'Flutter horizontal scroll rail widget for iOS, Android, and Desktop.',
            code: `import 'package:flutter/material.dart';

class ExhumaHorizontalScroller extends StatelessWidget {
  final List<Widget> children;
  final double itemGap;

  const ExhumaHorizontalScroller({
    super.key,
    required this.children,
    this.itemGap = ${itemGap}.0,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (int i = 0; i < children.length; i++) ...[
            children[i],
            if (i < children.length - 1) SizedBox(width: itemGap),
          ],
        ],
      ),
    );
  }
}`,
          },
        ];
    }
  },
};
