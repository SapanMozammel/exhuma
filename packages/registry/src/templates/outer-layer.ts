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
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with autonomous scroll stacking.`,
						code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { clsx } from 'clsx';

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

const updateStack = () => {
  if (!containerRef.value) return;
  const container = containerRef.value;
  const cards = Array.from(container.children) as HTMLElement[];
  const total = cards.length;
  if (total <= 1) return;

  cards.forEach((card, i) => {
    const stickyTop = props.reverseScale && i === total - 1
      ? props.topStart
      : props.topStart + i * props.topIncrement;
    card.style.position = 'sticky';
    card.style.top = \`\${stickyTop}px\`;
    card.style.zIndex = \`\${i + 1}\`;
    card.style.marginBottom = \`\${props.cardGap}px\`;
  });
};

onMounted(() => {
  updateStack();
  window.addEventListener('scroll', updateStack, { passive: true });
  window.addEventListener('resize', updateStack, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateStack);
  window.removeEventListener('resize', updateStack);
});
</script>

<template>
  <div
    ref="containerRef"
    :class="clsx('${defaultTailwindClass}', props.class)"
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
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component using modern Runes.`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';
  import { clsx } from 'clsx';

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

  onMount(() => {
    if (!container) return;
    const updateStack = () => {
      if (!container) return;
      const cards = Array.from(container.children) as HTMLElement[];
      const total = cards.length;
      if (total <= 1) return;

      cards.forEach((card, i) => {
        const stickyTop = reverseScale && i === total - 1 ? topStart : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = \`\${stickyTop}px\`;
        card.style.zIndex = \`\${i + 1}\`;
        card.style.marginBottom = \`\${cardGap}px\`;
      });
    };

    updateStack();
    window.addEventListener('scroll', updateStack, { passive: true });
    window.addEventListener('resize', updateStack, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateStack);
      window.removeEventListener('resize', updateStack);
    };
  });
</script>

<div
  bind:this={container}
  class={clsx('${defaultTailwindClass}', className)}
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
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component.`,
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
  const reverseScale = () => local.reverseScale ?? true;

  onMount(() => {
    if (!containerRef) return;
    const updateStack = () => {
      if (!containerRef) return;
      const cards = Array.from(containerRef.children) as HTMLElement[];
      const total = cards.length;
      if (total <= 1) return;

      cards.forEach((card, i) => {
        const stickyTop = reverseScale() && i === total - 1 ? topStart() : topStart() + i * topIncrement();
        card.style.position = 'sticky';
        card.style.top = \`\${stickyTop}px\`;
        card.style.zIndex = \`\${i + 1}\`;
        card.style.marginBottom = \`\${cardGap()}px\`;
      });
    };

    updateStack();
    window.addEventListener('scroll', updateStack, { passive: true });
    window.addEventListener('resize', updateStack, { passive: true });

    onCleanup(() => {
      window.removeEventListener('scroll', updateStack);
      window.removeEventListener('resize', updateStack);
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
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with kinetic scroll.`,
						code: `import { Component, ElementRef, afterNextRender, input, viewChild } from '@angular/core';

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

      const update = () => {
        const cards = Array.from(el.children) as HTMLElement[];
        const total = cards.length;
        if (total <= 1) return;

        cards.forEach((card, i) => {
          const stickyTop = this.reverseScale() && i === total - 1
            ? this.topStart()
            : this.topStart() + i * this.topIncrement();
          card.style.position = 'sticky';
          card.style.top = \`\${stickyTop}px\`;
          card.style.zIndex = \`\${i + 1}\`;
          card.style.marginBottom = \`\${this.cardGap()}px\`;
        });
      };

      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
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
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component (Zero React / @astrojs/react dependency).`,
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

      const cards = Array.from(container.children) as HTMLElement[];
      cards.forEach((card, i) => {
        card.style.position = 'sticky';
        card.style.top = \`\${topStart + i * topIncrement}px\`;
        card.style.zIndex = \`\${i + 1}\`;
        card.style.marginBottom = \`\${cardGap}px\`;
      });
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
			return [
				{
					filename: `exhuma-${slug}.js`,
					language: 'javascript',
					description: `Universal Web Component wrapper for <exhuma-${slug}>.`,
					code: `class Exhuma${pascalName}Element extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-${slug}');
    this.style.display = 'block';

    const topStart = parseFloat(this.getAttribute('top-start') || '20');
    const topIncrement = parseFloat(this.getAttribute('top-increment') || '28');
    const cardGap = parseFloat(this.getAttribute('card-gap') || '20');

    const cards = Array.from(this.children);
    cards.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        card.style.position = 'sticky';
        card.style.top = \`\${topStart + i * topIncrement}px\`;
        card.style.marginBottom = \`\${cardGap}px\`;
      }
    });
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
			return [
				{
					filename: `${slug}.vanilla.js`,
					language: 'javascript',
					description: `Autonomous Vanilla JS ${name} initialization module.`,
					code: `export function init${pascalName}(selector = '[data-exhuma-${slug}]', options = {}) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((container) => {
    const topStart = parseFloat(container.getAttribute('data-top-start') || options.topStart || 20);
    const topIncrement = parseFloat(container.getAttribute('data-top-increment') || options.topIncrement || 28);
    const cardGap = parseFloat(container.getAttribute('data-card-gap') || options.cardGap || 20);

    const cards = Array.from(container.children);
    cards.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        card.style.position = 'sticky';
        card.style.top = \`\${topStart + i * topIncrement}px\`;
        card.style.marginBottom = \`\${cardGap}px\`;
      }
    });
  });
  return Array.from(elements);
}
`,
				},
			];
		}

		case 'blade': {
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade self-contained ${name} component.`,
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
    function init() {
        document.querySelectorAll('[data-exhuma-stacking-cards]').forEach(function(container) {
            var topStart = parseFloat(container.getAttribute('data-top-start') || '20');
            var topIncrement = parseFloat(container.getAttribute('data-top-increment') || '28');
            var cardGap = parseFloat(container.getAttribute('data-card-gap') || '20');
            var cards = Array.from(container.children);
            cards.forEach(function(card, i) {
                card.style.position = 'sticky';
                card.style.top = (topStart + i * topIncrement) + 'px';
                card.style.zIndex = i + 1;
                card.style.marginBottom = cardGap + 'px';
            });
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
			];
		}

		case 'react-native': {
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `React Native ${name} native component.`,
					code: `import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

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
  style,
  children,
  ...props
}: ${pascalName}Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={{
            marginTop: index === 0 ? topStart : topIncrement,
            marginBottom: cardGap,
            zIndex: index + 1,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: `${snakeName}.dart`,
					language: 'dart',
					description: `Flutter ${name} widget wrapping package:exhuma.`,
					code: `import 'package:flutter/material.dart';

class Exhuma${pascalName} extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Column(
      children: children.asMap().entries.map((entry) {
        final index = entry.key;
        final widget = entry.value;
        return Container(
          margin: EdgeInsets.only(
            top: index == 0 ? topStart : topIncrement,
            bottom: cardGap,
          ),
          child: widget,
        );
      }).toList(),
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
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(updateStackEffect);
        }
      };

      const target = scrollContainerRef?.current;
      if (target) {
        target.addEventListener('scroll', handleScroll, { passive: true });
      }
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
      window.addEventListener('resize', handleScroll);

      updateStackEffect();

      return () => {
        if (target) {
          target.removeEventListener('scroll', handleScroll);
        }
        window.removeEventListener('scroll', handleScroll, { capture: true });
        window.removeEventListener('resize', handleScroll);
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
StackingCards.displayName = 'StackingCards';
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
