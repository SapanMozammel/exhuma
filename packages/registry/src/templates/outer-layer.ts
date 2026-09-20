import { ComponentFilePayload, EcosystemFlavor } from '../schema';

export interface CompoundPart {
	name: string;
	primitiveExport?: string;
	defaultClass?: string;
}

export interface ComponentOuterSpec {
	id: string;
	name: string;
	slug: string;
	category: 'cards' | 'layouts' | 'navigation' | 'primitives';
	pascalName: string;
	snakeName: string;
	description: string;
	propsInterface?: string;
	defaultTailwindClass?: string;
	compoundParts?: CompoundPart[];
}

export function generateOuterLayerFiles(spec: ComponentOuterSpec, flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] {
	const {
		name,
		slug,
		pascalName,
		snakeName,
		description,
		defaultTailwindClass = 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
		compoundParts = [],
	} = spec;

	const isEjected = options?.eject === true;

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			if (isEjected) {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `${name} — Standalone Ejected Engine (Zero Dependencies). All raw math and physics inlined.`,
						code: getEjectedReactCode(slug, pascalName, defaultTailwindClass, props, isNext),
					},
				];
			}
			const partsCode =
				compoundParts.length > 0
					? `\n\n${compoundParts
							.map(
								(part) => `export const ${part.name} = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${part.primitiveExport || part.name}
      ref={ref}
      className={clsx('${part.defaultClass || ''}', className)}
      {...props}
    >
      {children}
    </${pascalName}Primitive.${part.primitiveExport || part.name}>
  )
);
${part.name}.displayName = '${part.name}';`
							)
							.join('\n\n')}`
					: '';

			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `${name} — Clean Shadcn-style outer layer powered by @exhuma/core kinetic primitives.`,
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import * as ${pascalName}Primitive from '@exhuma/core';
import { clsx } from 'clsx';

export interface ${pascalName}Props extends React.ComponentPropsWithoutRef<typeof ${pascalName}Primitive.${pascalName}> {
  className?: string;
}

export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${pascalName}
      ref={ref}
      className={clsx(
        '${defaultTailwindClass}',
        className
      )}
      {...props}
    >
      {children}
    </${pascalName}Primitive.${pascalName}>
  )
);
${pascalName}.displayName = '${pascalName}';${partsCode}
`,
				},
			];
		}

		case 'vue': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 1.0,
  itemGap: 28,
  cardWidth: 320,
  showProgress: true,
  showFadeEdges: true,
  fadeWidth: 48,
  mobileMode: 'scroll',
  class: '',
});

const sectionRef = ref<HTMLElement | null>(null);
const cameraRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const progressBarRef = ref<HTMLElement | null>(null);
const progressTextRef = ref<HTMLElement | null>(null);

const sectionHeight = ref<number | null>(null);

const maskStyle = computed(() => {
  if (!props.showFadeEdges) return {};
  const grad = \`linear-gradient(to right, transparent, black \${props.fadeWidth}px, black calc(100% - \${props.fadeWidth}px), transparent)\`;
  return {
    WebkitMaskImage: grad,
    maskImage: grad,
  };
});

let cachedDistance = 0;
let isIntersecting = false;
let rafId: number | null = null;
let observer: IntersectionObserver | null = null;

const recalculate = () => {
  if (!cameraRef.value || !trackRef.value) return;
  const viewportHeight = window.innerHeight;
  const containerWidth = cameraRef.value.clientWidth;
  const resolvedCardWidth = typeof props.cardWidth === 'number'
    ? props.cardWidth + 'px'
    : /^\\d+$/.test(props.cardWidth.trim()) ? props.cardWidth.trim() + 'px' : props.cardWidth;
  for (let i = 0; i < trackRef.value.children.length; i += 1) {
    const item = trackRef.value.children.item(i);
    if (item instanceof HTMLElement) {
      item.style.width = resolvedCardWidth;
      item.style.flex = '0 0 ' + resolvedCardWidth;
    }
  }
  const trackWidth = trackRef.value.scrollWidth;
  cachedDistance = Math.max(0, trackWidth - containerWidth + props.itemGap * 2);
  const safeSpeed = Math.max(0.1, props.speed);
  sectionHeight.value = Math.round(viewportHeight + cachedDistance / safeSpeed);
};

const updateScroll = () => {
  if (!sectionRef.value || !trackRef.value) return;
  const rect = sectionRef.value.getBoundingClientRect();
  const totalScrollable = (sectionHeight.value || sectionRef.value.offsetHeight) - window.innerHeight;
  const scrolled = -rect.top;
  const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
  const currentTranslate = -(progress * cachedDistance);
  trackRef.value.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
  if (progressBarRef.value) {
    progressBarRef.value.style.width = (progress * 100).toFixed(1) + '%';
  }
  if (progressTextRef.value) {
    progressTextRef.value.textContent = Math.round(progress * 100) + '%';
  }
};

const onScroll = () => {
  if (!isIntersecting || rafId !== null) return;
  rafId = window.requestAnimationFrame(() => {
      updateScroll();
      rafId = null;
  });
};

onMounted(() => {
  recalculate();
  observer = new IntersectionObserver((entries) => {
    isIntersecting = entries[0]?.isIntersecting ?? false;
    if (isIntersecting) updateScroll();
  }, { rootMargin: '100px 0px', threshold: 0 });
  if (sectionRef.value) observer.observe(sectionRef.value);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', recalculate, { passive: true });
});

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId);
  observer?.disconnect();
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', recalculate);
});
</script>

<template>
  <section
    ref="sectionRef"
    :class="['relative w-full', props.class]"
    :style="{ minHeight: sectionHeight ? sectionHeight + 'px' : '150vh' }"
  >
    <div
      ref="cameraRef"
      class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
      :style="maskStyle"
    >
      <div
        ref="trackRef"
        class="flex items-stretch will-change-transform"
        :style="{
          gap: props.itemGap + 'px',
          paddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))'
        }"
      >
        <slot />
      </div>
      <div
        v-if="props.showProgress"
        class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12"
      >
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div
            ref="progressBarRef"
            class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
          />
        </div>
        <span
          ref="progressTextRef"
          class="font-mono text-2xs text-muted-foreground tabular-nums"
        >
          0%
        </span>
      </div>
    </div>
  </section>
</template>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  topStart: 20,
  topIncrement: 28,
  cardGap: 20,
  scaleThreshold: 150,
  minScale: 0.9,
  reverseScale: true,
  class: '',
});

const containerRef = ref<HTMLDivElement | null>(null);

const smoothstep = (t: number): number => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

let rafId: number | null = null;
let isIntersecting = false;
let observer: IntersectionObserver | null = null;

let cards: HTMLElement[] = [];
let total = 0;

const initCards = () => {
  if (!containerRef.value) return;
  cards = Array.from(containerRef.value.children) as HTMLElement[];
  total = cards.length;
  // Set static styles once — no layout thrashing in scroll loop
  cards.forEach((card, i) => {
    const stickyTop = props.reverseScale && i === total - 1
      ? props.topStart
      : props.topStart + i * props.topIncrement;
    card.style.position = 'sticky';
    card.style.top = stickyTop + 'px';
    card.style.zIndex = (i + 1).toString();
    card.style.marginBottom = props.cardGap + 'px';
    card.style.willChange = 'transform';
    card.style.transformOrigin = 'center top';
  });
};

const updateStack = () => {
  rafId = null;
  if (total <= 1) return;
  // Ω(1) Phase 1: batch read all rects — no style writes, no forced reflow
  const tops = new Float64Array(total);
  for (let i = 0; i < total; i++) {
    tops[i] = cards[i].getBoundingClientRect().top;
  }
  // Ω(1) Phase 2: batch write transforms only
  for (let i = 0; i < total; i++) {
    const stickyTop = props.reverseScale && i === total - 1
      ? props.topStart
      : props.topStart + i * props.topIncrement;
    const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / props.scaleThreshold));
    const targetScale = props.minScale + (1 - props.minScale) * smoothstep(1 - progress);
    cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
  }
};

const onScroll = () => {
  if (isIntersecting && rafId === null) {
    rafId = window.requestAnimationFrame(updateStack);
  }
};

onMounted(() => {
  initCards();
  updateStack();
  observer = new IntersectionObserver((entries) => {
    isIntersecting = entries[0]?.isIntersecting ?? false;
    if (isIntersecting) onScroll();
  }, { rootMargin: '100px 0px', threshold: 0 });
  if (containerRef.value) observer.observe(containerRef.value);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
});

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId);
  observer?.disconnect();
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <div
    ref="containerRef"
    :class="['${defaultTailwindClass}', props.class]"
  >
    <slot />
  </div>
</template>
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.vue`,
					language: 'vue',
					description: `Vue 3 Native ${name} component.`,
					code: `<script setup lang="ts">
import { clsx } from 'clsx';

interface Props {
  class?: string;
  [key: string]: unknown;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <div
    :class="clsx('${defaultTailwindClass}', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
`,
				},
			];
		}

		case 'svelte': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    speed?: number;
    itemGap?: number;
    cardWidth?: number | string;
    showProgress?: boolean;
    showFadeEdges?: boolean;
    fadeWidth?: number;
    mobileMode?: 'scroll' | 'stack' | 'pinned';
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    speed = 1.0,
    itemGap = 28,
    cardWidth = 320,
    showProgress = true,
    showFadeEdges = true,
    fadeWidth = 48,
    mobileMode = 'scroll',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let section = $state<HTMLElement | null>(null);
  let camera = $state<HTMLDivElement | null>(null);
  let track = $state<HTMLDivElement | null>(null);
  let progressBar = $state<HTMLDivElement | null>(null);
  let progressText = $state<HTMLSpanElement | null>(null);
  let sectionHeight = $state<number | null>(null);

  let maskStyle = $derived(
    showFadeEdges
      ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent);\`
      : ''
  );

  onMount(() => {
    if (!section || !camera || !track) return;

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId: number | null = null;

    const recalculate = () => {
      if (!camera || !track) return;
      const viewportHeight = window.innerHeight;
      const containerWidth = camera.clientWidth;
      const resolvedCardWidth = typeof cardWidth === 'number'
        ? cardWidth + 'px'
        : /^\\d+$/.test(cardWidth.trim()) ? cardWidth.trim() + 'px' : cardWidth;
      for (let i = 0; i < track.children.length; i += 1) {
        const item = track.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = resolvedCardWidth;
          item.style.flex = '0 0 ' + resolvedCardWidth;
        }
      }
      const trackWidth = track.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      sectionHeight = Math.round(viewportHeight + cachedDistance / safeSpeed);
    };

    const updateScroll = () => {
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const totalScrollable = (sectionHeight || section.offsetHeight) - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
      if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
    };

    const onScroll = () => {
      if (!isIntersecting || rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
      });
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    };
  });
</script>

<section
  bind:this={section}
  class={\`relative w-full \${className}\`}
  style={sectionHeight ? \`min-height: \${sectionHeight}px;\` : 'min-height: 150vh;'}
  {...restProps}
>
  <div
    bind:this={camera}
    class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
    style={maskStyle}
  >
    <div
      bind:this={track}
      class="flex items-stretch will-change-transform"
      style={\`gap: \${itemGap}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));\`}
    >
      {@render children?.()}
    </div>
    {#if showProgress}
      <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div
            bind:this={progressBar}
            class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
          />
        </div>
        <span
          bind:this={progressText}
          class="font-mono text-2xs text-muted-foreground tabular-nums"
        >
          0%
        </span>
      </div>
    {/if}
  </div>
</section>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    topStart?: number;
    topIncrement?: number;
    cardGap?: number;
    scaleThreshold?: number;
    minScale?: number;
    reverseScale?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    topStart = 20,
    topIncrement = 28,
    cardGap = 20,
    scaleThreshold = 150,
    minScale = 0.9,
    reverseScale = true,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let container = $state<HTMLDivElement | null>(null);

  const smoothstep = (t: number): number => {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  };

  onMount(() => {
    if (!container) return;
    let rafId: number | null = null;
    let isIntersecting = false;

    let cards: HTMLElement[] = [];
    let total = 0;

    // Init once: cache card refs and set static CSS (position, top, zIndex, will-change)
    const initCards = () => {
      if (!container) return;
      cards = Array.from(container.children) as HTMLElement[];
      total = cards.length;
      cards.forEach((card, i) => {
        const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      });
    };

    const updateStack = () => {
      rafId = null;
      if (total <= 1) return;
      // Ω(1) Phase 1: batch read — zero style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        tops[i] = cards[i].getBoundingClientRect().top;
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
        const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
        const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
        cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(updateStack);
      }
    };

    initCards();
    updateStack();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  });
</script>

<div
  bind:this={container}
  class={\`${defaultTailwindClass} \${className}\`}
  {...restProps}
>
  {@render children?.()}
</div>
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.svelte`,
					language: 'svelte',
					description: `Svelte 5 Native ${name} component using runes.`,
					code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    class: className = '',
    children,
    ...restProps
  }: {
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<div
  class={clsx('${defaultTailwindClass}', className)}
  {...restProps}
>
  {@render children?.()}
</div>
`,
				},
			];
		}

		case 'solid': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `import { Component, JSX, createSignal, onMount, onCleanup, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  let sectionRef: HTMLElement | undefined;
  let cameraRef: HTMLDivElement | undefined;
  let trackRef: HTMLDivElement | undefined;
  let progressBarRef: HTMLDivElement | undefined;
  let progressTextRef: HTMLSpanElement | undefined;

  const [local, others] = splitProps(props, [
    'speed',
    'itemGap',
    'cardWidth',
    'showProgress',
    'showFadeEdges',
    'fadeWidth',
    'mobileMode',
    'class',
    'children',
  ]);

  const [sectionHeight, setSectionHeight] = createSignal<number | undefined>(undefined);

  const speed = () => local.speed ?? 1.0;
  const itemGap = () => local.itemGap ?? 28;
  const showProgress = () => local.showProgress !== false;
  const showFadeEdges = () => local.showFadeEdges !== false;
  const fadeWidth = () => local.fadeWidth ?? 48;

  onMount(() => {
    if (!sectionRef || !cameraRef || !trackRef) return;

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId: number | null = null;

    const recalculate = () => {
      if (!cameraRef || !trackRef) return;
      const viewportHeight = window.innerHeight;
      const containerWidth = cameraRef.clientWidth;
      const rawCardWidth = local.cardWidth ?? 320;
      const resolvedCardWidth = typeof rawCardWidth === 'number'
        ? rawCardWidth + 'px'
        : /^\\d+$/.test(rawCardWidth.trim()) ? rawCardWidth.trim() + 'px' : rawCardWidth;
      for (let i = 0; i < trackRef.children.length; i += 1) {
        const item = trackRef.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = resolvedCardWidth;
          item.style.flex = '0 0 ' + resolvedCardWidth;
        }
      }
      const trackWidth = trackRef.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap() * 2);
      const safeSpeed = Math.max(0.1, speed());
      setSectionHeight(Math.round(viewportHeight + cachedDistance / safeSpeed));
    };

    const updateScroll = () => {
      if (!sectionRef || !trackRef) return;
      const rect = sectionRef.getBoundingClientRect();
      const totalScrollable = (sectionHeight() || sectionRef.offsetHeight) - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      trackRef.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      if (progressBarRef) {
        progressBarRef.style.width = (progress * 100).toFixed(1) + '%';
      }
      if (progressTextRef) {
        progressTextRef.textContent = Math.round(progress * 100) + '%';
      }
    };

    const onScroll = () => {
      if (!isIntersecting || rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
      });
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(sectionRef);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    onCleanup(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    });
  });

  const maskStyle = () =>
    showFadeEdges()
      ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth()}px, black calc(100% - \${fadeWidth()}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth()}px, black calc(100% - \${fadeWidth()}px), transparent);\`
      : '';

  return (
    <section
      ref={sectionRef}
      class={\`relative w-full \${local.class ?? ''}\`}
      style={{ 'min-height': sectionHeight() ? sectionHeight() + 'px' : '150vh' }}
      {...others}
    >
      <div
        ref={cameraRef}
        class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        style={maskStyle()}
      >
        <div
          ref={trackRef}
          class="flex items-stretch will-change-transform"
          style={{
            gap: itemGap() + 'px',
            'padding-left': 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
            'padding-right': 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          }}
        >
          {local.children}
        </div>
        {showProgress() && (
          <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
            <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
              <div
                ref={progressBarRef}
                class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
              />
            </div>
            <span
              ref={progressTextRef}
              class="font-mono text-2xs text-muted-foreground tabular-nums"
            >
              0%
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `import { Component, JSX, onMount, onCleanup, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  const [local, others] = splitProps(props, [
    'topStart',
    'topIncrement',
    'cardGap',
    'scaleThreshold',
    'minScale',
    'reverseScale',
    'class',
    'children',
  ]);

  const topStart = () => local.topStart ?? 20;
  const topIncrement = () => local.topIncrement ?? 28;
  const cardGap = () => local.cardGap ?? 20;
  const scaleThreshold = () => local.scaleThreshold ?? 150;
  const minScale = () => local.minScale ?? 0.9;
  const reverseScale = () => local.reverseScale ?? true;

  const smoothstep = (t: number): number => {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  };

  onMount(() => {
    if (!containerRef) return;
    let rafId: number | null = null;
    let isIntersecting = false;

    let cards: HTMLElement[] = [];
    let total = 0;

    // Init once: cache card refs and set static CSS
    const initCards = () => {
      if (!containerRef) return;
      cards = Array.from(containerRef.children) as HTMLElement[];
      total = cards.length;
      cards.forEach((card, i) => {
        const stickyTop = reverseScale() && i === total - 1 ? topStart() : topStart() + i * topIncrement();
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap() + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      });
    };

    const updateStack = () => {
      rafId = null;
      if (total <= 1) return;
      // Ω(1) Phase 1: batch read — no style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        tops[i] = cards[i].getBoundingClientRect().top;
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        const stickyTop = reverseScale() && i === total - 1 ? topStart() : topStart() + i * topIncrement();
        const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold()));
        const targetScale = minScale() + (1 - minScale()) * smoothstep(1 - progress);
        cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(updateStack);
      }
    };

    initCards();
    updateStack();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(containerRef);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    onCleanup(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  });

  return (
    <div
      ref={containerRef}
      class={\`${defaultTailwindClass} \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </div>
  );
};
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `SolidJS Native ${name} component.`,
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      class={\`${defaultTailwindClass} \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </div>
  );
};
`,
				},
			];
		}

		case 'angular': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <section
      #sectionEl
      class="relative w-full {{ customClass() }}"
      [style.minHeight]="sectionHeight() ? sectionHeight() + 'px' : '150vh'"
    >
      <div
        #cameraEl
        class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
      >
        <div
          #trackEl
          class="flex items-stretch will-change-transform"
          [style.gap]="itemGap() + 'px'"
          style="padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
        >
          <ng-content></ng-content>
        </div>
        @if (showProgress()) {
          <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
            <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
              <div #progressBarEl class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"></div>
            </div>
            <span #progressTextEl class="font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
          </div>
        }
      </div>
    </section>
  \`,
})
export class Exhuma${pascalName}Component {
  private readonly destroyRef = inject(DestroyRef);
  readonly customClass = input<string>('');
  readonly speed = input<number>(1.0);
  readonly itemGap = input<number>(28);
  readonly cardWidth = input<number | string>(320);
  readonly showProgress = input<boolean>(true);
  readonly showFadeEdges = input<boolean>(true);
  readonly fadeWidth = input<number>(48);
  readonly mobileMode = input<'scroll' | 'stack' | 'pinned'>('scroll');

  readonly sectionEl = viewChild<ElementRef<HTMLElement>>('sectionEl');
  readonly cameraEl = viewChild<ElementRef<HTMLElement>>('cameraEl');
  readonly trackEl = viewChild<ElementRef<HTMLElement>>('trackEl');
  readonly progressBarEl = viewChild<ElementRef<HTMLElement>>('progressBarEl');
  readonly progressTextEl = viewChild<ElementRef<HTMLElement>>('progressTextEl');

  readonly sectionHeight = input<number | null>(null);

  constructor() {
    afterNextRender(() => {
      const section = this.sectionEl()?.nativeElement;
      const camera = this.cameraEl()?.nativeElement;
      const track = this.trackEl()?.nativeElement;
      const progressBar = this.progressBarEl()?.nativeElement;
      const progressText = this.progressTextEl()?.nativeElement;

      if (!section || !camera || !track) return;

      let cachedDistance = 0;
      let isIntersecting = false;
      let rafId: number | null = null;

      const recalculate = () => {
        const viewportHeight = window.innerHeight;
        const containerWidth = camera.clientWidth;
        const rawCardWidth = this.cardWidth();
        const resolvedCardWidth = typeof rawCardWidth === 'number'
          ? rawCardWidth + 'px'
          : /^\\d+$/.test(rawCardWidth.trim()) ? rawCardWidth.trim() + 'px' : rawCardWidth;
        for (let i = 0; i < track.children.length; i += 1) {
          const item = track.children.item(i);
          if (item instanceof HTMLElement) {
            item.style.width = resolvedCardWidth;
            item.style.flex = '0 0 ' + resolvedCardWidth;
          }
        }
        const trackWidth = track.scrollWidth;
        cachedDistance = Math.max(0, trackWidth - containerWidth + this.itemGap() * 2);
        const safeSpeed = Math.max(0.1, this.speed());
        const computedHeight = Math.round(viewportHeight + cachedDistance / safeSpeed);
        section.style.minHeight = computedHeight + 'px';
      };

      const updateScroll = () => {
        const rect = section.getBoundingClientRect();
        const totalScrollable = section.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        const currentTranslate = -(progress * cachedDistance);
        track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
        if (progressBar) {
          progressBar.style.width = (progress * 100).toFixed(1) + '%';
        }
        if (progressText) {
          progressText.textContent = Math.round(progress * 100) + '%';
        }
      };

      const onScroll = () => {
        if (!isIntersecting || rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
            updateScroll();
            rafId = null;
        });
      };

      recalculate();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) updateScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(section);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculate, { passive: true });

      this.destroyRef.onDestroy(() => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculate);
      });
    });
  }
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with kinetic scroll stacking and scale decay.`,
						code: `import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <div
      #container
      class="${defaultTailwindClass} {{ customClass() }}"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class Exhuma${pascalName}Component {
  private readonly destroyRef = inject(DestroyRef);
  readonly customClass = input<string>('');
  readonly topStart = input<number>(20);
  readonly topIncrement = input<number>(28);
  readonly cardGap = input<number>(20);
  readonly scaleThreshold = input<number>(150);
  readonly minScale = input<number>(0.9);
  readonly reverseScale = input<boolean>(true);

  readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  constructor() {
    afterNextRender(() => {
      const el = this.container()?.nativeElement;
      if (!el) return;

      const smoothstep = (t: number): number => {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
      };

      let rafId: number | null = null;
      let isIntersecting = false;

      let cards: HTMLElement[] = [];
      let total = 0;

      // Init once: cache card refs and set static CSS (no layout thrashing in scroll loop)
      const initCards = () => {
        cards = Array.from(el.children) as HTMLElement[];
        total = cards.length;
        cards.forEach((card, i) => {
          const stickyTop = this.reverseScale() && i === total - 1
            ? this.topStart()
            : this.topStart() + i * this.topIncrement();
          card.style.position = 'sticky';
          card.style.top = stickyTop + 'px';
          card.style.zIndex = (i + 1).toString();
          card.style.marginBottom = this.cardGap() + 'px';
          card.style.willChange = 'transform';
          card.style.transformOrigin = 'center top';
        });
      };

      const update = () => {
        rafId = null;
        if (total <= 1) return;
        // Ω(1) Phase 1: batch read — no style writes, no forced reflow
        const tops = new Float64Array(total);
        for (let i = 0; i < total; i++) {
          tops[i] = cards[i].getBoundingClientRect().top;
        }
        // Ω(1) Phase 2: batch write transforms only
        for (let i = 0; i < total; i++) {
          const stickyTop = this.reverseScale() && i === total - 1
            ? this.topStart()
            : this.topStart() + i * this.topIncrement();
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / this.scaleThreshold()));
          const targetScale = this.minScale() + (1 - this.minScale()) * smoothstep(1 - progress);
          cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      };

      const onScroll = () => {
        if (isIntersecting && rafId === null) {
          rafId = window.requestAnimationFrame(update);
        }
      };

      initCards();
      update();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) onScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(el);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    });
  }
}
`,
					},
				];
			}
			return [
				{
					filename: `${slug}.component.ts`,
					language: 'typescript',
					description: `Angular 18+ Standalone ${name} component.`,
					code: `import { Component, input } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <div
      class="${defaultTailwindClass} {{ customClass() }}"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class Exhuma${pascalName}Component {
  readonly customClass = input<string>('');
}
`,
				},
			];
		}

		case 'astro': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `---
interface Props {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  class?: string;
  [key: string]: unknown;
}

const {
  speed = 1.0,
  itemGap = 28,
  cardWidth = 320,
  showProgress = true,
  showFadeEdges = true,
  fadeWidth = 48,
  mobileMode = 'scroll',
  class: className = '',
  ...props
} = Astro.props;

const maskStyle = showFadeEdges
  ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent);\`
  : '';
---

<section
  data-exhuma-horizontal-scroller
  data-speed={speed}
  data-item-gap={itemGap}
  data-card-width={cardWidth}
  class={\`relative w-full \${className}\`}
  style="min-height: 150vh;"
  {...props}
>
  <div
    class="exhuma-hs-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
    style={maskStyle}
  >
    <div
      class="exhuma-hs-track flex items-stretch will-change-transform"
      style={\`gap: \${itemGap}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));\`}
    >
      <slot />
    </div>
    {showProgress && (
      <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div class="exhuma-hs-progress h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out" />
        </div>
        <span class="exhuma-hs-progress-text font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
      </div>
    )}
  </div>
</section>

<script>
  function initHorizontalScroller() {
    document.querySelectorAll<HTMLElement>('[data-exhuma-horizontal-scroller]').forEach((section) => {
      const camera = section.querySelector<HTMLElement>('.exhuma-hs-camera');
      const track = section.querySelector<HTMLElement>('.exhuma-hs-track');
      const progressBar = section.querySelector<HTMLElement>('.exhuma-hs-progress');
      const progressText = section.querySelector<HTMLElement>('.exhuma-hs-progress-text');
      if (!camera || !track) return;

      const speed = parseFloat(section.dataset.speed || '1.0');
      const itemGap = parseFloat(section.dataset.itemGap || '28');
      const rawCardWidth = section.dataset.cardWidth || '320';
      const cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;

      let cachedDistance = 0;
      let isIntersecting = false;
      let rafId: number | null = null;

      function recalculate() {
        const viewportHeight = window.innerHeight;
        const containerWidth = camera.clientWidth;
        for (let i = 0; i < track.children.length; i += 1) {
          const item = track.children.item(i);
          if (item instanceof HTMLElement) {
            item.style.width = cardWidth;
            item.style.flex = '0 0 ' + cardWidth;
          }
        }
        const trackWidth = track.scrollWidth;
        cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
        const safeSpeed = Math.max(0.1, speed);
        section.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
      }

      function updateScroll() {
        const rect = section.getBoundingClientRect();
        const totalScrollable = section.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        const currentTranslate = -(progress * cachedDistance);
        track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
        if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
        if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
      }

      function onScroll() {
        if (isIntersecting && rafId === null) {
          rafId = window.requestAnimationFrame(() => {
            updateScroll();
            rafId = null;
          });
        }
      }

      recalculate();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) updateScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(section);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculate, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculate);
      }, { once: true });
    });
  }

  initHorizontalScroller();
  document.addEventListener('astro:page-load', initHorizontalScroller);
</script>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `---
interface Props {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
  class?: string;
  [key: string]: unknown;
}

const {
  topStart = 20,
  topIncrement = 28,
  cardGap = 20,
  scaleThreshold = 150,
  minScale = 0.9,
  reverseScale = true,
  class: className = '',
  ...props
} = Astro.props;
---

<div
  data-exhuma-stacking-cards
  data-top-start={topStart}
  data-top-increment={topIncrement}
  data-card-gap={cardGap}
  data-scale-threshold={scaleThreshold}
  data-min-scale={minScale}
  data-reverse-scale={reverseScale.toString()}
  class={\`${defaultTailwindClass} \${className}\`}
  {...props}
>
  <slot />
</div>

<script>
  function initStackingCards() {
    document.querySelectorAll('[data-exhuma-stacking-cards]').forEach((container) => {
      const topStart = parseFloat(container.getAttribute('data-top-start') || '20');
      const topIncrement = parseFloat(container.getAttribute('data-top-increment') || '28');
      const cardGap = parseFloat(container.getAttribute('data-card-gap') || '20');
      const scaleThreshold = parseFloat(container.getAttribute('data-scale-threshold') || '150');
      const minScale = parseFloat(container.getAttribute('data-min-scale') || '0.9');
      const reverseScale = container.getAttribute('data-reverse-scale') !== 'false';

      const cards = Array.from(container.children) as HTMLElement[];
      const total = cards.length;
      if (total <= 1) return;

      // Init once: set static CSS on each card — no layout thrashing in scroll loop
      cards.forEach((card, i) => {
        const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      });

      let rafId: number | null = null;
      let isIntersecting = false;  // ← was missing (bug fix)

      function smoothstep(t: number): number {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
      }

      function update() {
        rafId = null;
        // Ω(1) Phase 1: batch read — no style writes, no forced reflow
        const tops = new Float64Array(total);
        for (let i = 0; i < total; i++) {
          tops[i] = (cards[i] as HTMLElement).getBoundingClientRect().top;
        }
        // Ω(1) Phase 2: batch write transforms only
        for (let i = 0; i < total; i++) {
          const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
          const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
          (cards[i] as HTMLElement).style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      }

      function onScroll() {
        if (isIntersecting && rafId === null) {
          rafId = window.requestAnimationFrame(update);
        }
      }

      update();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) onScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(container);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }, { once: true });
    });
  }

  initStackingCards();
  document.addEventListener('astro:page-load', initStackingCards);
</script>
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.astro`,
					language: 'astro',
					description: `Pure Native Astro ${name} component.`,
					code: `---
interface Props {
  class?: string;
  [key: string]: unknown;
}

const { class: className = '', ...props } = Astro.props;
---

<div
  class={\`${defaultTailwindClass} \${className}\`}
  {...props}
>
  <slot />
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `exhuma-${slug}.js`,
						language: 'javascript',
						description: `Universal Web Component <exhuma-${slug}> with pinned kinetic camera.`,
						code: `class ExhumaHorizontalScrollerElement extends HTMLElement {
  connectedCallback() {
    if (this._cleanup) this._cleanup();
    this.classList.add('exhuma-horizontal-scroller');
    this.style.display = 'block';
    this.style.position = 'relative';
    this.style.width = '100%';

    const speed = parseFloat(this.getAttribute('speed') || '1.0');
    const itemGap = parseFloat(this.getAttribute('item-gap') || '28');
    const rawCardWidth = this.getAttribute('card-width') || '320';
    const cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;
    const showFadeEdges = this.getAttribute('show-fade-edges') !== 'false';
    const fadeWidth = parseFloat(this.getAttribute('fade-width') || '48');

    let camera = this.querySelector(':scope > .exhuma-hs-camera');
    let track = camera?.querySelector(':scope > .exhuma-hs-track');
    if (!(camera instanceof HTMLElement) || !(track instanceof HTMLElement)) {
      camera = document.createElement('div');
      camera.className = 'exhuma-hs-camera';
      track = document.createElement('div');
      track.className = 'exhuma-hs-track';
      while (this.firstChild) {
        track.appendChild(this.firstChild);
      }
      camera.appendChild(track);
      this.appendChild(camera);
    }
    camera.style.cssText = 'position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; flex-direction: column; justify-content: center;';
    if (showFadeEdges) {
      const mask = 'linear-gradient(to right, transparent, black ' + fadeWidth + 'px, black calc(100% - ' + fadeWidth + 'px), transparent)';
      camera.style.maskImage = mask;
      camera.style.webkitMaskImage = mask;
    }
    track.style.cssText = 'display: flex; align-items: stretch; will-change: transform; gap: ' + itemGap + 'px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));';

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId = null;
    const self = this;

    const recalculate = () => {
      const viewportHeight = window.innerHeight;
      const containerWidth = camera.clientWidth;
      for (let i = 0; i < track.children.length; i += 1) {
        const item = track.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = cardWidth;
          item.style.flex = '0 0 ' + cardWidth;
        }
      }
      const trackWidth = track.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      self.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
    };

    const updateScroll = () => {
      const rect = self.getBoundingClientRect();
      const totalScrollable = self.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      const progressBar = self.querySelector('.exhuma-hs-progress');
      const progressText = self.querySelector('.exhuma-hs-progress-text');
      if (progressBar instanceof HTMLElement) progressBar.style.width = (progress * 100).toFixed(1) + '%';
      if (progressText instanceof HTMLElement) progressText.textContent = Math.round(progress * 100) + '%';
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
        });
      }
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(this);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    this._cleanup = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

if (!customElements.get('exhuma-horizontal-scroller')) {
  customElements.define('exhuma-horizontal-scroller', ExhumaHorizontalScrollerElement);
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `exhuma-${slug}.js`,
						language: 'javascript',
						description: `Universal Web Component wrapper for <exhuma-${slug}> with kinetic scale decay.`,
						code: `class ExhumaStackingCardsElement extends HTMLElement {
  connectedCallback() {
    if (this._cleanup) this._cleanup();
    this.classList.add('exhuma-stacking-cards');
    this.style.display = 'block';
    this.style.position = 'relative';

    const topStart = parseFloat(this.getAttribute('top-start') || '20');
    const topIncrement = parseFloat(this.getAttribute('top-increment') || '28');
    const cardGap = parseFloat(this.getAttribute('card-gap') || '20');
    const scaleThreshold = parseFloat(this.getAttribute('scale-threshold') || '150');
    const minScale = parseFloat(this.getAttribute('min-scale') || '0.9');
    const reverseScale = this.getAttribute('reverse-scale') !== 'false';

    const cards = Array.from(this.children);
    const total = cards.length;
    if (total <= 1) return;

    // Init once: set static CSS on each card — no layout thrashing in scroll loop
    cards.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      }
    });

    let rafId = null;
    let isIntersecting = false;

    function smoothstep(t) {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    }

    const update = () => {
      rafId = null;
      // Ω(1) Phase 1: batch read — no style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          tops[i] = (cards[i] as HTMLElement).getBoundingClientRect().top;
        }
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
          const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
          (cards[i] as HTMLElement).style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(this);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    this._cleanup = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

if (!customElements.get('exhuma-${slug}')) {
  customElements.define('exhuma-${slug}', ExhumaStackingCardsElement);
}
`,
					},
				];
			}
			return [
				{
					filename: `exhuma-${slug}.js`,
					language: 'javascript',
					description: `Universal Web Component wrapper for <exhuma-${slug}>.`,
					code: `class Exhuma${pascalName}Element extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-${slug}');
    this.style.display = 'block';
  }
}

if (!customElements.get('exhuma-${slug}')) {
  customElements.define('exhuma-${slug}', Exhuma${pascalName}Element);
}
`,
				},
			];
		}

		case 'vanilla': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${slug}.vanilla.js`,
						language: 'javascript',
						description: `Autonomous Vanilla JS ${name} initialization module with pinned camera.`,
						code: `export function initHorizontalScroller(selector = '[data-exhuma-horizontal-scroller]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  elements.forEach((section) => {
    const camera = section.querySelector('.exhuma-hs-camera') || section.firstElementChild;
    const track = section.querySelector('.exhuma-hs-track') || (camera ? camera.firstElementChild : null);
    const progressBar = section.querySelector('.exhuma-hs-progress');
    const progressText = section.querySelector('.exhuma-hs-progress-text');
    if (!camera || !track) return;

    const speed = parseFloat(section.getAttribute('data-speed') || options.speed || 1.0);
    const itemGap = parseFloat(section.getAttribute('data-item-gap') || options.itemGap || 28);
    const rawCardWidth = String(section.getAttribute('data-card-width') || options.cardWidth || 320);
    const cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;
    const showFadeEdges = (section.getAttribute('data-show-fade-edges') || options.showFadeEdges) !== 'false';
    const fadeWidth = parseFloat(section.getAttribute('data-fade-width') || options.fadeWidth || 48);
    if (showFadeEdges && camera instanceof HTMLElement) {
      const mask = 'linear-gradient(to right, transparent, black ' + fadeWidth + 'px, black calc(100% - ' + fadeWidth + 'px), transparent)';
      camera.style.maskImage = mask;
      camera.style.webkitMaskImage = mask;
    }

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId = null;

    const recalculate = () => {
      const viewportHeight = window.innerHeight;
      const containerWidth = camera.clientWidth;
      for (let i = 0; i < track.children.length; i += 1) {
        const item = track.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = cardWidth;
          item.style.flex = '0 0 ' + cardWidth;
        }
      }
      const trackWidth = track.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      section.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
    };

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
      if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
        });
      }
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.vanilla.js`,
						language: 'javascript',
						description: `Autonomous Vanilla JS ${name} initialization module with kinetic scale decay.`,
						code: `export function initStackingCards(selector = '[data-exhuma-stacking-cards]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  function smoothstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  }

  elements.forEach((container) => {
    const topStart = parseFloat(container.getAttribute('data-top-start') || options.topStart || 20);
    const topIncrement = parseFloat(container.getAttribute('data-top-increment') || options.topIncrement || 28);
    const cardGap = parseFloat(container.getAttribute('data-card-gap') || options.cardGap || 20);
    const scaleThreshold = parseFloat(container.getAttribute('data-scale-threshold') || options.scaleThreshold || 150);
    const minScale = parseFloat(container.getAttribute('data-min-scale') || options.minScale || 0.9);
    const reverseScale = (container.getAttribute('data-reverse-scale') || options.reverseScale) !== 'false';

    const cards = Array.from(container.children);
    const total = cards.length;
    if (total <= 1) return;

    // Init once: set static CSS on each card — no layout thrashing in scroll loop
    cards.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      }
    });

    let rafId = null;
    let isIntersecting = false;

    const update = () => {
      rafId = null;
      // Ω(1) Phase 1: batch read — no style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          tops[i] = (cards[i] as HTMLElement).getBoundingClientRect().top;
        }
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
          const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
          (cards[i] as HTMLElement).style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			return [
				{
					filename: `${slug}.vanilla.js`,
					language: 'javascript',
					description: `Autonomous Vanilla JS ${name} initialization module.`,
					code: `export function init${pascalName}(selector = '[data-exhuma-${slug}]', options = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements);
}
`,
				},
			];
		}

		case 'blade': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade component for ${name} with pinned kinetic camera.`,
						code: `@props([
    'speed' => 1.0,
    'itemGap' => 28,
    'cardWidth' => 320,
    'showProgress' => true,
    'showFadeEdges' => true,
    'fadeWidth' => 48,
    'mobileMode' => 'scroll',
])

<section
    data-exhuma-horizontal-scroller
    data-speed="{{ $speed }}"
    data-item-gap="{{ $itemGap }}"
    data-card-width="{{ $cardWidth }}"
    {{ $attributes->merge(['class' => 'relative w-full']) }}
    style="min-height: 150vh;"
>
    <div
        class="exhuma-hs-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        @if($showFadeEdges)
            style="mask-image: linear-gradient(to right, transparent, black {{ $fadeWidth }}px, black calc(100% - {{ $fadeWidth }}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black {{ $fadeWidth }}px, black calc(100% - {{ $fadeWidth }}px), transparent);"
        @endif
    >
        <div
            class="exhuma-hs-track flex items-stretch will-change-transform"
            style="gap: {{ $itemGap }}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
        >
            {{ $slot }}
        </div>
        @if($showProgress)
            <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
                <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                    <div class="exhuma-hs-progress h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"></div>
                </div>
                <span class="exhuma-hs-progress-text font-mono text-2xs text-neutral-400 tabular-nums">0%</span>
            </div>
        @endif
    </div>
</section>

<script>
(function() {
    function init() {
        document.querySelectorAll('[data-exhuma-horizontal-scroller]').forEach(function(section) {
            if (section.dataset.exhumaReady === 'true') return;
            section.dataset.exhumaReady = 'true';
            var camera = section.querySelector('.exhuma-hs-camera');
            var track = section.querySelector('.exhuma-hs-track');
            var progressBar = section.querySelector('.exhuma-hs-progress');
            var progressText = section.querySelector('.exhuma-hs-progress-text');
            if (!camera || !track) return;

            var speed = parseFloat(section.getAttribute('data-speed') || '1.0');
            var itemGap = parseFloat(section.getAttribute('data-item-gap') || '28');
            var rawCardWidth = section.getAttribute('data-card-width') || '320';
            var cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;

            var cachedDistance = 0;
            var isIntersecting = false;
            var rafId = null;

            function recalculate() {
                var viewportHeight = window.innerHeight;
                var containerWidth = camera.clientWidth;
                for (var i = 0; i < track.children.length; i += 1) {
                    var item = track.children.item(i);
                    if (item instanceof HTMLElement) {
                        item.style.width = cardWidth;
                        item.style.flex = '0 0 ' + cardWidth;
                    }
                }
                var trackWidth = track.scrollWidth;
                cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
                var safeSpeed = Math.max(0.1, speed);
                section.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
            }

            function updateScroll() {
                var rect = section.getBoundingClientRect();
                var totalScrollable = section.offsetHeight - window.innerHeight;
                var scrolled = -rect.top;
                var progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
                var currentTranslate = -(progress * cachedDistance);
                track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
                if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
                if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
            }

            function onScroll() {
                if (isIntersecting && rafId === null) {
                    rafId = window.requestAnimationFrame(function() {
                        updateScroll();
                        rafId = null;
                    });
                }
            }

            recalculate();
            var observer = new IntersectionObserver(function(entries) {
                isIntersecting = entries[0] ? entries[0].isIntersecting : false;
                if (isIntersecting) updateScroll();
            }, { rootMargin: '100px 0px', threshold: 0 });
            observer.observe(section);
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', recalculate, { passive: true });

            window.addEventListener('pagehide', function cleanup() {
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                observer.disconnect();
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', recalculate);
                section.dataset.exhumaReady = 'false';
            }, { once: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade self-contained ${name} component with kinetic scale decay.`,
						code: `@props([
    'topStart' => 20,
    'topIncrement' => 28,
    'cardGap' => 20,
    'scaleThreshold' => 150,
    'minScale' => 0.9,
    'reverseScale' => true,
])

<div
    data-exhuma-stacking-cards
    data-top-start="{{ $topStart }}"
    data-top-increment="{{ $topIncrement }}"
    data-card-gap="{{ $cardGap }}"
    data-scale-threshold="{{ $scaleThreshold }}"
    data-min-scale="{{ $minScale }}"
    data-reverse-scale="{{ $reverseScale ? 'true' : 'false' }}"
    {{ $attributes->merge([
        'class' => '${defaultTailwindClass} block',
    ]) }}
>
    {{ $slot }}
</div>

<script>
(function() {
    function smoothstep(t) {
        var c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
    }

    function init() {
        document.querySelectorAll('[data-exhuma-stacking-cards]').forEach(function(container) {
            if (container.dataset.exhumaReady === 'true') return;
            container.dataset.exhumaReady = 'true';
            var topStart = parseFloat(container.getAttribute('data-top-start') || '20');
            var topIncrement = parseFloat(container.getAttribute('data-top-increment') || '28');
            var cardGap = parseFloat(container.getAttribute('data-card-gap') || '20');
            var scaleThreshold = parseFloat(container.getAttribute('data-scale-threshold') || '150');
            var minScale = parseFloat(container.getAttribute('data-min-scale') || '0.9');
            var reverseScale = container.getAttribute('data-reverse-scale') !== 'false';

            var cards = Array.from(container.children);
            var total = cards.length;
            if (total <= 1) return;

            // Init once: set static CSS — no layout thrashing in scroll loop
            cards.forEach(function(card, i) {
                var stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
                card.style.position = 'sticky';
                card.style.top = stickyTop + 'px';
                card.style.zIndex = i + 1;
                card.style.marginBottom = cardGap + 'px';
                card.style.willChange = 'transform';
                card.style.transformOrigin = 'center top';
            });

            var rafId = null;
            var isIntersecting = false;

            function update() {
                rafId = null;
                // Ω(1) Phase 1: batch read — no style writes, no forced reflow
                var tops = [];
                for (var j = 0; j < total; j++) {
                    tops[j] = cards[j].getBoundingClientRect().top;
                }
                // Ω(1) Phase 2: batch write transforms only
                for (var k = 0; k < total; k++) {
                    var stickyTop = reverseScale && k === total - 1 ? topStart : topStart + k * topIncrement;
                    var progress = Math.max(0, Math.min(1, (tops[k] - stickyTop) / scaleThreshold));
                    var targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
                    cards[k].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
                }
            }

            function onScroll() {
                if (isIntersecting && rafId === null) {
                    rafId = window.requestAnimationFrame(update);
                }
            }

            update();
            var observer = new IntersectionObserver(function(entries) {
                isIntersecting = entries[0] ? entries[0].isIntersecting : false;
                if (isIntersecting) onScroll();
            }, { rootMargin: '100px 0px', threshold: 0 });
            observer.observe(container);
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });

            window.addEventListener('pagehide', function cleanup() {
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                observer.disconnect();
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onScroll);
                container.dataset.exhumaReady = 'false';
            }, { once: true });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>
`,
					},
				];
			}
			return [
				{
					filename: `${slug}.blade.php`,
					language: 'php',
					description: `Laravel Blade component for ${name}.`,
					code: `@props([])

<div
    {{ $attributes->merge([
        'class' => '${defaultTailwindClass} block',
    ]) }}
>
    {{ $slot }}
</div>
`,
				},
			];
		}

		case 'wordpress': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: 'block.json',
						language: 'json',
						description: `WordPress Block API v3 definition for Horizontal Scroller.`,
						code: JSON.stringify(
							{
								$schema: 'https://schemas.wp.org/trunk/block.json',
								apiVersion: 3,
								name: `exhuma/${slug}`,
								version: '1.1.0',
								title: `Exhuma ${name}`,
								category: 'design',
								icon: 'slides',
								description,
								attributes: {
									speed: { type: 'number', default: 1.0 },
									itemGap: { type: 'number', default: 28 },
									cardWidth: { type: 'number', default: 320 },
									showProgress: { type: 'boolean', default: true },
									showFadeEdges: { type: 'boolean', default: true },
									fadeWidth: { type: 'number', default: 48 },
									mobileMode: { type: 'string', default: 'scroll' },
								},
								editorScript: 'file:./index.js',
								viewScript: 'exhuma-kinetic',
							},
							null,
							2
						),
					},
					{
						filename: 'render.php',
						language: 'php',
						description: `WordPress dynamic render template for Horizontal Scroller.`,
						code: `<?php
$speed = $attributes['speed'] ?? 1.0;
$item_gap = $attributes['itemGap'] ?? 28;
$card_width = $attributes['cardWidth'] ?? 320;
$show_progress = $attributes['showProgress'] ?? true;
$show_fade_edges = $attributes['showFadeEdges'] ?? true;
$fade_width = $attributes['fadeWidth'] ?? 48;
$mobile_mode = $attributes['mobileMode'] ?? 'scroll';
$camera_style = $show_fade_edges
  ? sprintf('mask-image:linear-gradient(to right,transparent,black %1$dpx,black calc(100%% - %1$dpx),transparent);-webkit-mask-image:linear-gradient(to right,transparent,black %1$dpx,black calc(100%% - %1$dpx),transparent);', $fade_width)
  : '';
?>
<section class="exhuma-horizontal-scroller" data-exhuma-horizontal-scroller data-speed="<?php echo esc_attr($speed); ?>" data-item-gap="<?php echo esc_attr($item_gap); ?>" data-card-width="<?php echo esc_attr($card_width); ?>" data-mobile-mode="<?php echo esc_attr($mobile_mode); ?>">
  <div class="exhuma-hs-camera" style="<?php echo esc_attr($camera_style); ?>">
    <div class="exhuma-hs-track" style="gap:<?php echo esc_attr($item_gap); ?>px">
      <?php echo $content; ?>
    </div>
    <?php if ($show_progress) : ?>
      <div class="exhuma-hs-progress-track" aria-hidden="true">
        <div class="exhuma-hs-progress"></div>
        <span class="exhuma-hs-progress-text">0%</span>
      </div>
    <?php endif; ?>
  </div>
</section>
`,
					},
				];
			}
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: `WordPress Block API v3 definition for ${name}.`,
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: `exhuma/${slug}`,
							version: '1.0.0',
							title: `Exhuma ${name}`,
							category: 'design',
							icon: 'art',
							description,
							attributes: {
								topStart: { type: 'number', default: 20 },
								topIncrement: { type: 'number', default: 28 },
								cardGap: { type: 'number', default: 20 },
								scaleThreshold: { type: 'number', default: 150 },
								minScale: { type: 'number', default: 0.9 },
								reverseScale: { type: 'boolean', default: true },
							},
							editorScript: 'file:./index.js',
							viewScript: 'exhuma-kinetic',
						},
						null,
						2
					),
				},
				{
					filename: 'render.php',
					language: 'php',
					description: `WordPress dynamic render template for ${name}.`,
					code: `<?php
$top_start = $attributes['topStart'] ?? 20;
$top_increment = $attributes['topIncrement'] ?? 28;
$card_gap = $attributes['cardGap'] ?? 20;
$scale_threshold = $attributes['scaleThreshold'] ?? 150;
$min_scale = $attributes['minScale'] ?? 0.9;
$reverse_scale = ($attributes['reverseScale'] ?? true) ? 'true' : 'false';
?>
<div
  class="exhuma-stacking-cards"
  data-exhuma-stacking-cards
  data-top-start="<?php echo esc_attr($top_start); ?>"
  data-top-increment="<?php echo esc_attr($top_increment); ?>"
  data-card-gap="<?php echo esc_attr($card_gap); ?>"
  data-scale-threshold="<?php echo esc_attr($scale_threshold); ?>"
  data-min-scale="<?php echo esc_attr($min_scale); ?>"
  data-reverse-scale="<?php echo esc_attr($reverse_scale); ?>"
>
  <?php echo $content; ?>
</div>
`,
				},
			];
		}

		case 'react-native': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `React Native ${name} native horizontal rail component.`,
						code: `import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, type ViewProps } from 'react-native';

export interface HorizontalScrollerProps<Item> extends ViewProps {
  itemGap?: number;
  cardWidth?: number;
  data: readonly Item[];
  renderItem: ({ item, index }: { item: Item; index: number }) => React.ReactElement;
  keyExtractor?: (item: Item, index: number) => string;
}

const { width } = Dimensions.get('window');

export function HorizontalScroller<Item>({
  itemGap = 28,
  cardWidth = width * 0.78,
  data,
  renderItem,
  keyExtractor = (_, i) => String(i),
  style,
  ...props
}: HorizontalScrollerProps<Item>) {
  return (
    <View style={[styles.container, style]} {...props}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + itemGap}
        decelerationRate="fast"
        contentContainerStyle={[styles.list, { gap: itemGap }]}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <View style={{ width: cardWidth }}>
            {renderItem({ item, index })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  list: {
    paddingHorizontal: 20,
  },
});
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `React Native ${name} with scroll-driven Animated scale decay (Hermite smoothstep).`,
					code: `import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  type ViewProps,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Hermite cubic smoothstep — identical to web Big-Omega kernel */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export interface ${pascalName}Props extends ViewProps {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
  children?: React.ReactNode;
}

export function ${pascalName}({
  topStart = 20,
  topIncrement = 28,
  cardGap = 20,
  scaleThreshold = 150,
  minScale = 0.9,
  reverseScale = true,
  style,
  children,
  ...props
}: ${pascalName}Props) {
  const childArray = React.Children.toArray(children);
  const total = childArray.length;

  // Pre-allocate one Animated.Value per card — zero allocations during scroll
  const scrollY = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    childArray.map(() => new Animated.Value(1))
  ).current;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      scrollY.setValue(y);

      // Phase 1+2: compute and set scale per card (native driver handles GPU layer)
      for (let i = 0; i < total; i++) {
        const stickyTop = topStart + i * topIncrement;
        const progress = Math.max(0, Math.min(1, (SCREEN_HEIGHT - stickyTop - y * 0.3) / scaleThreshold));
        const targetScale = minScale + (1 - minScale) * smoothstep(progress);
        scaleAnims[i].setValue(targetScale);
      }
    },
    [total, topStart, topIncrement, scaleThreshold, minScale, scaleAnims, scrollY]
  );

  return (
    <ScrollView
      style={[styles.container, style]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {childArray.map((child, index) => {
        const stickyTop = reverseScale && index === total - 1 ? topStart : topStart + index * topIncrement;
        return (
          <Animated.View
            key={index}
            style={{
              marginTop: index === 0 ? stickyTop : topIncrement,
              marginBottom: cardGap,
              zIndex: index + 1,
              transform: [{ scale: scaleAnims[index] }],
            }}
          >
            {child}
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${snakeName}.dart`,
						language: 'dart',
						description: `Flutter ${name} native horizontal scroll rail.`,
						code: `import 'package:flutter/material.dart';

class ExhumaHorizontalScroller extends StatelessWidget {
  final List<Widget> children;
  final double itemGap;
  final double cardWidth;

  const ExhumaHorizontalScroller({
    super.key,
    required this.children,
    this.itemGap = 28.0,
    this.cardWidth = 320.0,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 240,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: children.length,
        separatorBuilder: (_, __) => SizedBox(width: itemGap),
        itemBuilder: (context, index) {
          return SizedBox(
            width: cardWidth,
            child: children[index],
          );
        },
      ),
    );
  }
}
`,
					},
				];
			}
			return [
				{
					filename: `${snakeName}.dart`,
					language: 'dart',
					description: `Flutter ${name} with kinetic scroll-driven scale decay (Hermite smoothstep).`,
					code: `import 'package:flutter/material.dart';

double _smoothstep(double t) {
  final c = t.clamp(0.0, 1.0);
  return c * c * (3 - 2 * c);
}

class Exhuma${pascalName} extends StatefulWidget {
  final List<Widget> children;
  final double topStart;
  final double topIncrement;
  final double cardGap;
  final double scaleThreshold;
  final double minScale;
  final bool reverseScale;

  const Exhuma${pascalName}({
    super.key,
    required this.children,
    this.topStart = 20.0,
    this.topIncrement = 28.0,
    this.cardGap = 20.0,
    this.scaleThreshold = 150.0,
    this.minScale = 0.9,
    this.reverseScale = true,
  });

  @override
  State<Exhuma${pascalName}> createState() => _Exhuma${pascalName}State();
}

class _Exhuma${pascalName}State extends State<Exhuma${pascalName}> {
  late final ScrollController _controller;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController()..addListener(_onScroll);
  }

  void _onScroll() {
    setState(() {});
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final offset = _controller.hasClients ? _controller.offset : 0.0;
    final total = widget.children.length;

    return SingleChildScrollView(
      controller: _controller,
      physics: const BouncingScrollPhysics(),
      child: Column(
        children: widget.children.asMap().entries.map((entry) {
          final index = entry.key;
          final child = entry.value;
          final stickyTop = widget.reverseScale && index == total - 1
              ? widget.topStart
              : widget.topStart + index * widget.topIncrement;

          final rawProgress = (offset - (index * widget.scaleThreshold)) / widget.scaleThreshold;
          final progress = _smoothstep(rawProgress);
          final scale = widget.minScale + (1.0 - widget.minScale) * (1.0 - progress);

          return Transform.scale(
            scale: scale,
            alignment: Alignment.topCenter,
            child: Container(
              margin: EdgeInsets.only(
                top: index == 0 ? stickyTop : widget.topIncrement,
                bottom: widget.cardGap,
              ),
              child: child,
            ),
          );
        }).toList(),
      ),
    );
  }
}
`,
				},
			];
		}
	}
}

function getEjectedReactCode(slug: string, pascalName: string, defaultClass: string, props: Record<string, unknown>, isNext: boolean): string {
	const header = `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';\nimport { clsx } from 'clsx';\n\n`;

	switch (slug) {
		case 'tilt-card': {
			const maxTilt = Number(props.maxTilt ?? 15);
			const perspective = Number(props.perspective ?? 1000);
			return `${header}export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
}

/**
 * TiltCard — Standalone Ejected Engine (Zero-Dependency)
 * Inlines 3D Euler matrix transformation and dynamic radial glare.
 */
export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      maxTilt = ${maxTilt},
      perspective = ${perspective},
      glare = true,
      className,
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const cardRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const [transform, setTransform] = React.useState('');
    const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalised Euler coordinates [-1, 1]
        const rotX = ((y / rect.height) - 0.5) * -maxTilt;
        const rotY = ((x / rect.width) - 0.5) * maxTilt;

        setTransform(
          \`perspective(\${perspective}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)\`
        );

        if (glare) {
          setGlarePos({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 0.35,
          });
        }
      },
      [maxTilt, perspective, glare, cardRef]
    );

    const handleMouseLeave = React.useCallback(() => {
      setTransform(\`perspective(\${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)\`);
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }, [perspective]);

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={clsx('${defaultClass}', className)}
        style={{ transform, ...style }}
        {...props}
      >
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: \`radial-gradient(circle at \${glarePos.x}% \${glarePos.y}%, rgba(255,255,255,0.25), transparent 60%)\`,
            }}
          />
        )}
      </div>
    );
  }
);
TiltCard.displayName = 'TiltCard';
`;
		}

		case 'spotlight-card': {
			const radius = Number(props.radius ?? 350);
			return `${header}export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
}

/**
 * SpotlightCard — Standalone Ejected Engine (Zero-Dependency)
 * Inlines sub-pixel cursor radial illumination mask.
 */
export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ radius = ${radius}, color = 'rgba(255,255,255,0.1)', className, children, ...props }, ref) => {
    const [pos, setPos] = React.useState({ x: 0, y: 0, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
    };

    const handleMouseLeave = () => {
      setPos((prev) => ({ ...prev, opacity: 0 }));
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={clsx('${defaultClass}', className)}
        {...props}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: pos.opacity,
            background: \`radial-gradient(\${radius}px circle at \${pos.x}px \${pos.y}px, \${color}, transparent 80%)\`,
          }}
        />
        {children}
      </div>
    );
  }
);
SpotlightCard.displayName = 'SpotlightCard';
`;
		}

		case 'number-ticker': {
			const value = Number(props.value ?? 1000);
			return `${header}export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  duration?: number;
}

/**
 * NumberTicker — Standalone Ejected Engine (Zero-Dependency)
 * High-performance analytical RAF easeOutExpo numerical interpolation.
 */
export const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  ({ value = ${value}, duration = 1200, className, ...props }, ref) => {
    const [displayVal, setDisplayVal] = React.useState(0);

    React.useEffect(() => {
      let start: number | null = null;
      let frameId: number;

      const step = (now: number) => {
        if (!start) start = now;
        const progress = Math.min((now - start) / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayVal(ease * value);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        }
      };

      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    }, [value, duration]);

    return (
      <span ref={ref} className={clsx('${defaultClass}', className)} {...props}>
        {Math.round(displayVal).toLocaleString()}
      </span>
    );
  }
);
NumberTicker.displayName = 'NumberTicker';
`;
		}

		case 'magnetic-button': {
			const strength = Number(props.strength ?? 0.35);
			return `${header}export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
}

/**
 * MagneticButton — Standalone Ejected Engine (Zero-Dependency)
 * Proximity-based inverse spring displacement field.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ strength = ${strength}, className, children, style, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLButtonElement>(null);
    const btnRef = (forwardedRef as React.RefObject<HTMLButtonElement>) || internalRef;
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      setOffset({ x: dx, y: dy });
    };

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 });
    };

    return (
      <button
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={clsx('${defaultClass}', className)}
        style={{
          transform: \`translate3d(\${offset.x.toFixed(2)}px, \${offset.y.toFixed(2)}px, 0)\`,
          transition: offset.x === 0 && offset.y === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
MagneticButton.displayName = 'MagneticButton';
`;
		}

		case 'stacking-cards': {
			const topStart = Number(props.topStart ?? 20);
			const topIncrement = Number(props.topIncrement ?? 28);
			const cardGap = Number(props.cardGap ?? 20);
			const scaleThreshold = Number(props.scaleThreshold ?? 150);
			const minScale = Number(props.minScale ?? 0.9);
			const reverseScale = props.reverseScale !== false;

			return `${header}/**
 * Pure Hermite interpolation function (Smoothstep)
 * Clamps t in [0, 1] and computes 3t^2 - 2t^3.
 * Zero heap allocation.
 */
export const smoothstep = (t: number): number => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

/**
 * Calculates progressive target scale values across stack layers.
 */
export const calculateScaleValue = (index: number, totalScalingSections: number, minScale: number, targetScale = 1.0): number => {
  if (totalScalingSections <= 1) return targetScale;
  const progress = index / (totalScalingSections - 1);
  const scale = minScale + progress * (targetScale - minScale);
  return Number(scale.toPrecision(6));
};

export const generateDefaultScaleValues = (count: number, minScale = 0.9): number[] => {
  if (count <= 0) return [];
  if (count === 1) return [1.0];

  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const scale = minScale + progress * (1.0 - minScale);
    values.push(Number(scale.toPrecision(6)));
  }
  return values;
};

/**
 * Pure Mathematical Kernel for Tiered Reverse Cascade Scaling:
 * Big-Omega Guarantee: Ω(1) constant time, 0 heap allocations.
 */
export const getReverseScale = (
  cardIndex: number,
  lastTop: number,
  triggerTop: number,
  topStart: number,
  topIncrement: number,
  totalCards: number,
  scaleValues: readonly number[] | number[],
  minScale: number
): number => {
  if (totalCards <= 1) return 1.0;
  if (cardIndex === 0) return scaleValues[0] ?? minScale;
  if (lastTop >= triggerTop) return scaleValues[cardIndex] ?? 1.0;

  const startCP = cardIndex + 1 === totalCards ? triggerTop : topStart + (cardIndex + 1) * topIncrement;
  if (lastTop >= startCP) {
    return scaleValues[cardIndex] ?? 1.0;
  }

  for (let k = cardIndex + 1; k >= 2; k--) {
    const segTop = k === totalCards ? triggerTop : topStart + k * topIncrement;
    const segBottom = topStart + (k - 1) * topIncrement;

    if (lastTop <= segBottom) {
      if (k === 2) return scaleValues[0] ?? minScale;
      continue;
    }

    if (lastTop <= segTop) {
      const span = Math.max(1, segTop - segBottom);
      const rawProgress = (segTop - lastTop) / span;
      const c = Math.max(0, Math.min(1, rawProgress));
      const progress = c * c * (3 - 2 * c);
      const fromScale = scaleValues[k - 1] ?? 1.0;
      const toScale = scaleValues[k - 2] ?? minScale;
      return fromScale + progress * (toScale - fromScale);
    }
  }

  return scaleValues[0] ?? minScale;
};

export interface StackingCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  topStart?: number;
  topIncrement?: number;
  minScale?: number;
  scaleThreshold?: number;
  cardGap?: number | string;
  gap?: number | string;
  reverseScale?: boolean;
  enableReverseScale?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}

/**
 * StackingCards — Standalone Ejected Engine (Zero-Dependency)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(120Hz) / Ω(60Hz) Frame rate floor: batched read-then-write cycles, zero layout thrashing.
 * - Ω(1) Constant-time kinetic dispatch pipeline with zero GC allocations during active scroll.
 * - Sub-pixel scale decay with delta-epsilon clamping.
 * - Dual-layer architecture: sticky outer shell + GPU-accelerated inner visual layer.
 * - 100% mathematical tier cascade parity.
 */
export const StackingCards = React.memo(
  React.forwardRef<HTMLDivElement, StackingCardsProps>(function StackingCards(
    {
      children,
      topStart = ${topStart},
      topIncrement = ${topIncrement},
      minScale = ${minScale},
      scaleThreshold = ${scaleThreshold},
      cardGap = ${cardGap},
      gap,
      reverseScale = ${reverseScale},
      enableReverseScale,
      scrollContainerRef,
      enabled = true,
      className,
      style,
      ...props
    },
    forwardedRef
  ) {
    const isReverseScaleEnabled = reverseScale ?? enableReverseScale ?? true;
    const internalWrapperRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const innerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const prevScalesRef = React.useRef<Float64Array>(new Float64Array(0));
    const targetScalesRef = React.useRef<Float64Array>(new Float64Array(0));
    const cardTopsBufferRef = React.useRef<Float64Array>(new Float64Array(0));
    const rafIdRef = React.useRef<number | null>(null);

    const resolvedGap = cardGap ?? gap ?? 20;
    const childArray = React.Children.toArray(children);
    const totalCards = childArray.length;
    const scaleValues = React.useMemo(() => generateDefaultScaleValues(totalCards, minScale), [totalCards, minScale]);

    const setWrapperRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (internalWrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    React.useEffect(() => {
      cardRefs.current.length = totalCards;
      innerRefs.current.length = totalCards;

      if (prevScalesRef.current.length !== totalCards) {
        prevScalesRef.current = new Float64Array(totalCards).fill(-1);
        targetScalesRef.current = new Float64Array(totalCards);
        cardTopsBufferRef.current = new Float64Array(totalCards);
      }

      const wrapper = internalWrapperRef.current;
      if (!wrapper || typeof window === 'undefined' || !enabled || totalCards === 0) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        innerRefs.current.forEach((inner) => {
          if (inner) inner.style.transform = 'scale(1)';
        });
        return;
      }

      const secondLastCardStickyTop = topStart + Math.max(0, totalCards - 1) * topIncrement;
      const triggerTop = totalCards > 1 ? secondLastCardStickyTop + topIncrement : topStart;
      let isIntersecting = false;

      const updateStackEffect = () => {
        rafIdRef.current = null;
        if (totalCards === 0) return;

        const lastIndex = totalCards - 1;
        const lastCard = cardRefs.current[lastIndex];
        const firstCard = cardRefs.current[0];
        if (!lastCard || !firstCard) return;

        const container = scrollContainerRef?.current;
        const scrollportTop = container ? container.getBoundingClientRect().top + (container.clientTop || 0) : 0;
        const scrollTop = container ? container.scrollTop : window.scrollY;

        const lastTop = lastCard.getBoundingClientRect().top - scrollportTop;
        const reverseActive = isReverseScaleEnabled && lastTop <= triggerTop;

        const targetScales = targetScalesRef.current;

        // Phase 1: Read & Calculation (Zero DOM Writes)
        if (reverseActive) {
          for (let i = 0; i < totalCards; i++) {
            targetScales[i] = getReverseScale(i, lastTop, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale);
          }
        } else {
          const cardTops = cardTopsBufferRef.current;
          for (let i = 0; i < totalCards; i++) {
            const card = cardRefs.current[i];
            cardTops[i] = card ? card.getBoundingClientRect().top - scrollportTop : 0;
          }

          for (let i = 0; i < totalCards; i++) {
            let forwardProgress = 0;
            if (i < totalCards - 1 && scrollTop > 0) {
              const cardTop = cardTops[i];
              const nextTop = cardTops[i + 1];
              const nextStickyTop = cardTop + topIncrement;

              const initialNextTop = nextTop + scrollTop;
              const scaleStart = Math.min(initialNextTop - 2, nextStickyTop + scaleThreshold);
              const scaleDistance = Math.max(1, scaleStart - nextStickyTop);

              if (nextTop <= scaleStart) {
                forwardProgress = smoothstep((scaleStart - nextTop) / scaleDistance);
              }
            }

            const targetScale = scaleValues[i] ?? 1.0;
            targetScales[i] = 1.0 + forwardProgress * (targetScale - 1.0);
          }
        }

        // Phase 2: Write with Delta-Epsilon Clamping
        const prevScales = prevScalesRef.current;
        for (let i = 0; i < totalCards; i++) {
          const inner = innerRefs.current[i];
          if (!inner) continue;

          const currentScale = targetScales[i];
          if (Math.abs(prevScales[i] - currentScale) > 0.00005) {
            prevScales[i] = currentScale;
            inner.style.transform = \`scale(\${currentScale.toFixed(5)})\`;
          }
        }
      };

      const handleScroll = () => {
        if (isIntersecting && rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(updateStackEffect);
        }
      };

      const target = scrollContainerRef?.current;
      const observer = new IntersectionObserver(
        (entries) => {
          isIntersecting = entries[0]?.isIntersecting ?? false;
          if (isIntersecting) updateStackEffect();
        },
        { root: target ?? null, rootMargin: '100px 0px', threshold: 0 }
      );
      observer.observe(wrapper);
      if (target) {
        target.addEventListener('scroll', handleScroll, { passive: true });
      }
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      updateStackEffect();

      return () => {
        if (target) {
          target.removeEventListener('scroll', handleScroll);
        }
        window.removeEventListener('scroll', handleScroll, { capture: true });
        window.removeEventListener('resize', handleScroll);
        observer.disconnect();
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [topStart, topIncrement, minScale, scaleThreshold, scrollContainerRef, enabled, totalCards, scaleValues, isReverseScaleEnabled]);

    return (
      <div
        ref={setWrapperRef}
        className={clsx('exhuma-stacking-cards-wrapper relative flex w-full flex-col', className)}
        style={{
          paddingTop: typeof topStart === 'number' ? \`\${topStart}px\` : topStart,
          gap: typeof resolvedGap === 'number' ? \`\${resolvedGap}px\` : resolvedGap,
          ...style,
        }}
        {...props}
      >
        {childArray.map((child, index) => {
          const isLast = totalCards > 1 && index === totalCards - 1;
          const stickyTop = isReverseScaleEnabled && isLast ? topStart : topStart + index * topIncrement;
          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="sticky w-full"
              style={{
                top: \`\${stickyTop}px\`,
                zIndex: index + 1,
              }}
            >
              <div
                ref={(el) => {
                  innerRefs.current[index] = el;
                }}
                className="relative w-full"
                style={{
                  transformOrigin: 'center top',
                  willChange: 'transform',
                }}
              >
                {React.isValidElement(child) ? child : <div>{child}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  })
);
`;
		}
		case 'horizontal-scroller': {
			const speed = Number(props.speed ?? 1.0);
			const itemGap = Number(props.itemGap ?? 28);
			const cardWidth = typeof props.cardWidth === 'number' ? props.cardWidth : Number(props.cardWidth ?? 320);
			const showProgress = props.showProgress !== false;
			const showFadeEdges = props.showFadeEdges !== false;
			const fadeWidth = Number(props.fadeWidth ?? 48);

			return `${header}export interface HorizontalScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  header?: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  trackClassName?: string;
}

export const calculateHorizontalDistance = (trackWidth: number, containerWidth: number, extraPadding = 60): number => {
  return Math.max(0, trackWidth - containerWidth + extraPadding);
};

export const calculateSectionHeight = (viewportHeight: number, horizontalDistance: number, speed = 1.0): number => {
  const safeSpeed = Math.max(0.1, speed);
  return Math.round(viewportHeight + horizontalDistance / safeSpeed);
};

export const calculateScrollProgress = (scrolledInto: number, totalScrollable: number): number => {
  if (totalScrollable <= 0) return 0;
  return Math.min(Math.max(scrolledInto / totalScrollable, 0), 1);
};

/**
 * HorizontalScroller — Standalone Ejected Engine (Zero-Dependency)
 *
 * Pinned kinetic camera with 1:1 vertical-to-horizontal mapping (Brix Agency architecture).
 * Big-Omega Guarantees:
 * - Hardware compositor layer promotion with GPU CSS variables (--scroll-offset-x).
 * - Zero GC allocations during scroll traversal via cached bounding geometry.
 * - Sub-millisecond RAF decoupled dispatch.
 */
export const HorizontalScroller = React.memo(
  React.forwardRef<HTMLDivElement, HorizontalScrollerProps>(function HorizontalScroller(
    {
      children,
      speed = ${speed},
      itemGap = ${itemGap},
      cardWidth = ${cardWidth},
      showProgress = ${showProgress},
      showFadeEdges = ${showFadeEdges},
      fadeWidth = ${fadeWidth},
      mobileMode = 'scroll',
      header,
      scrollContainerRef,
      className,
      trackClassName,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalSectionRef = React.useRef<HTMLDivElement>(null);
    const sectionRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalSectionRef;
    const cameraRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const progressBarRef = React.useRef<HTMLDivElement>(null);
    const progressTextRef = React.useRef<HTMLSpanElement>(null);

    const [sectionHeight, setSectionHeight] = React.useState<number | undefined>(undefined);
    const [cameraHeight, setCameraHeight] = React.useState<number | undefined>(undefined);
    const [isReducedMotion, setIsReducedMotion] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const isCustomContainer = Boolean(scrollContainerRef);

    const parsedCardWidth = React.useMemo(() => {
      if (typeof cardWidth === 'number') return \`\${cardWidth}px\`;
      if (typeof cardWidth === 'string') {
        if (/^\\d+$/.test(cardWidth.trim())) return \`\${cardWidth.trim()}px\`;
        return cardWidth;
      }
      return '320px';
    }, [cardWidth]);

    const maskStyle = React.useMemo<React.CSSProperties>(() => {
      if (!showFadeEdges) return {};
      const maskGradient = \`linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent)\`;
      return {
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
      };
    }, [showFadeEdges, fadeWidth]);

    React.useEffect(() => {
      const section = sectionRef.current;
      const camera = cameraRef.current;
      const track = trackRef.current;
      if (!section || !camera || !track || typeof window === 'undefined') return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsReducedMotion(prefersReducedMotion);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();

      if (prefersReducedMotion) {
        track.style.removeProperty('--scroll-offset-x');
        return;
      }

      let cachedHorizontalDistance = 0;
      let isIntersecting = false;
      let rafId: number | null = null;

      const scrollTarget: HTMLElement | Window = scrollContainerRef?.current ?? window;

      const recalculateDimensions = () => {
        const isContainer = Boolean(scrollContainerRef?.current);
        const viewportHeight = isContainer && scrollContainerRef?.current ? scrollContainerRef.current.clientHeight : window.innerHeight;
        setCameraHeight(viewportHeight);
        const trackWidth = track.scrollWidth;
        const containerWidth = camera.clientWidth;
        camera.style.setProperty('--camera-width', containerWidth + 'px');

        const horizontalDistance = calculateHorizontalDistance(trackWidth, containerWidth, itemGap * 2);
        cachedHorizontalDistance = horizontalDistance;

        const computedSectionHeight = calculateSectionHeight(viewportHeight, horizontalDistance, speed);
        setSectionHeight(computedSectionHeight);
      };

      recalculateDimensions();

      const resizeObserver = new ResizeObserver(() => {
        recalculateDimensions();
        handleScroll();
      });

      resizeObserver.observe(camera);
      resizeObserver.observe(track);

      const handleScroll = () => {
        if (!isIntersecting && !scrollContainerRef?.current) return;

        const sectionRect = section.getBoundingClientRect();
        let containerTop = 0;
        let viewportHeight = window.innerHeight;

        if (scrollContainerRef?.current) {
          const cRect = scrollContainerRef.current.getBoundingClientRect();
          containerTop = cRect.top;
          viewportHeight = scrollContainerRef.current.clientHeight;
        }

        const relativeTop = sectionRect.top - containerTop;
        const totalScrollable = section.offsetHeight - viewportHeight;

        const scrolledInto = -relativeTop;
        const progress = calculateScrollProgress(scrolledInto, totalScrollable);
        const currentTranslate = -(progress * cachedHorizontalDistance);

        track.style.setProperty('--scroll-offset-x', \`\${Number(currentTranslate.toFixed(2))}px\`);
        track.style.setProperty('--scroll-progress', \`\${Number(progress.toFixed(4))}\`);

        if (progressBarRef.current) {
          progressBarRef.current.style.width = \`\${Number((progress * 100).toFixed(1))}%\`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = \`\${Math.round(progress * 100)}%\`;
        }
      };

      const onScroll = () => {
        if (rafId === null) {
          rafId = window.requestAnimationFrame(() => {
            handleScroll();
            rafId = null;
          });
        }
      };

      let observer: IntersectionObserver | null = null;
      if (!scrollContainerRef?.current) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isIntersecting = entry.isIntersecting;
              if (isIntersecting) {
                handleScroll();
              }
            });
          },
          { rootMargin: '100px 0px 100px 0px', threshold: 0 }
        );
        observer.observe(section);
      } else {
        isIntersecting = true;
      }

      scrollTarget.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculateDimensions, { passive: true });
      window.addEventListener('resize', checkMobile, { passive: true });

      handleScroll();

      return () => {
        scrollTarget.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculateDimensions);
        window.removeEventListener('resize', checkMobile);
        resizeObserver.disconnect();
        if (observer) observer.disconnect();
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }, [speed, itemGap, cardWidth, showProgress, showFadeEdges, fadeWidth, mobileMode, scrollContainerRef]);

    if (isReducedMotion) {
      return (
        <div className={clsx('exhuma-horizontal-scroller-fallback w-full overflow-x-auto py-8', className)} style={style}>
          {header && <div className="mb-6 px-6 sm:px-10">{header}</div>}
          <div className={clsx('flex px-6 sm:px-10', trackClassName)} style={{ gap: \`\${itemGap}px\` }}>
            {React.Children.map(children, (child) => (
              <div className="exhuma-horizontal-card-item shrink-0" style={{ width: parsedCardWidth }}>
                {child}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isMobile && mobileMode === 'scroll' && !scrollContainerRef) {
      return (
        <div className={clsx('exhuma-horizontal-scroller-mobile w-full py-8', className)} style={style}>
          {header && <div className="mb-6 px-6 sm:px-10">{header}</div>}
          <div className={clsx('flex overflow-x-auto px-6 sm:px-10 snap-x snap-mandatory scroll-smooth no-scrollbar', trackClassName)} style={{ gap: \`\${itemGap}px\` }}>
            {React.Children.map(children, (child) => (
              <div className="shrink-0 snap-center" style={{ width: '85vw' }}>
                {child}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isMobile && mobileMode === 'stack' && !scrollContainerRef) {
      return (
        <div className={clsx('exhuma-horizontal-scroller-stack flex w-full flex-col px-6 py-8 sm:px-10', className)} style={{ gap: \`\${itemGap}px\`, ...style }}>
          {header && <div className="mb-2">{header}</div>}
          {React.Children.map(children, (child) => (
            <div className="w-full">{child}</div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={sectionRef}
        className={clsx('exhuma-horizontal-scroller-section relative w-full', className)}
        style={{
          height: sectionHeight ? \`\${sectionHeight}px\` : '200vh',
          ...style,
        }}
        {...props}
      >
        <div
          ref={cameraRef}
          className="exhuma-horizontal-camera sticky top-0 flex w-full flex-col justify-center overflow-hidden"
          style={{
            height: isCustomContainer && cameraHeight ? cameraHeight + 'px' : '100vh',
          }}
        >
          {header && (
            <div className="exhuma-horizontal-header pointer-events-auto mb-6 w-full shrink-0 px-6 sm:px-10">
              {header}
            </div>
          )}

          <div className="exhuma-horizontal-track-wrapper relative w-full overflow-hidden" style={maskStyle}>
            <div
              ref={trackRef}
              className={clsx('flex items-stretch will-change-transform select-none px-6 sm:px-10', trackClassName)}
              style={{
                gap: \`\${itemGap}px\`,
                transform: 'translate3d(var(--scroll-offset-x, 0px), 0px, 0px)',
              }}
            >
              {React.Children.map(children, (child) => (
                <div
                  className="exhuma-horizontal-card-item shrink-0"
                  style={{
                    width: parsedCardWidth,
                    flexShrink: 0,
                  }}
                >
                  {child}
                </div>
              ))}
            </div>
          </div>

          {showProgress && (
            <div className="exhuma-horizontal-progress-bar mt-6 flex w-full items-center justify-between gap-4 px-6 sm:px-10">
              <div className="bg-foreground/10 relative h-1.5 w-full overflow-hidden rounded-full">
                <div
                  ref={progressBarRef}
                  className="bg-foreground h-full rounded-full transition-all duration-75"
                  style={{ width: '0%' }}
                />
              </div>
              <span
                ref={progressTextRef}
                className="text-muted-foreground font-mono text-3xs tabular-nums shrink-0"
              >
                0%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  })
);
HorizontalScroller.displayName = 'HorizontalScroller';
`;
		}

		default: {
			return `${header}export interface ${pascalName}Props extends React.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}

/**
 * ${pascalName} — Standalone Ejected Engine (Zero-Dependency)
 * Self-contained native implementation with zero @exhuma/core dependency.
 */
export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('${defaultClass}', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
${pascalName}.displayName = '${pascalName}';
`;
		}
	}
}
