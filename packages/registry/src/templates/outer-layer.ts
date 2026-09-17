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
      className={cn('${part.defaultClass || ''}', className)}
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
import { cn } from '@/lib/utils';

export interface ${pascalName}Props extends React.ComponentPropsWithoutRef<typeof ${pascalName}Primitive.${pascalName}> {
  className?: string;
}

export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${pascalName}
      ref={ref}
      className={cn(
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
			return [
				{
					filename: `${pascalName}.vue`,
					language: 'vue',
					description: `Vue 3 ${name} outer adapter wrapping @exhuma/core headless primitive.`,
					code: `<script setup lang="ts">
import { ${pascalName} as ${pascalName}Primitive } from '@exhuma/core';
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
  [key: string]: unknown;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <${pascalName}Primitive
    v-bind="props"
    :class="cn('${defaultTailwindClass}', props.class)"
  >
    <slot />
  </${pascalName}Primitive>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: `${pascalName}.svelte`,
					language: 'svelte',
					description: `Svelte 5 ${name} adapter using runes and @exhuma/core primitives.`,
					code: `<script lang="ts">
  import { ${pascalName} as ${pascalName}Primitive } from '@exhuma/core';
  import { cn } from '$lib/utils';

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

<${pascalName}Primitive
  class={cn('${defaultTailwindClass}', className)}
  {...restProps}
>
  {@render children?.()}
</${pascalName}Primitive>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `SolidJS ${name} adapter wrapping @exhuma/core headless primitive.`,
					code: `import { Component, JSX, splitProps } from 'solid-js';
import * as ${pascalName}Primitive from '@exhuma/core';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <${pascalName}Primitive.${pascalName}
      class={\`${defaultTailwindClass} \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </${pascalName}Primitive.${pascalName}>
  );
};
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: `${slug}.component.ts`,
					language: 'typescript',
					description: `Angular 18+ Standalone ${name} component.`,
					code: `import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  imports: [CommonModule],
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
			return [
				{
					filename: `${pascalName}.astro`,
					language: 'astro',
					description: `Astro ${name} component with @exhuma/core primitive.`,
					code: `---
import * as ${pascalName}Primitive from '@exhuma/core';

interface Props {
  class?: string;
  [key: string]: unknown;
}

const { class: className = '', ...props } = Astro.props;
---

<${pascalName}Primitive.${pascalName}
  client:visible
  className={\`${defaultTailwindClass} \${className}\`}
  {...props}
>
  <slot />
</${pascalName}Primitive.${pascalName}>
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
					code: `import { ${pascalName} } from '@exhuma/core';

class Exhuma${pascalName}Element extends HTMLElement {
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
			return [
				{
					filename: `exhuma-${slug}.js`,
					language: 'javascript',
					description: `Autonomous Vanilla JS ${name} initialization module.`,
					code: `import { ${pascalName} } from '@exhuma/core';

export function init${pascalName}(selector = '[data-exhuma-${slug}]', options = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements);
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: `${slug}.blade.php`,
					language: 'php',
					description: `Laravel Blade component for ${name} with Alpine / data attributes.`,
					code: `@props([])

<exhuma-${slug}
    {{ $attributes->merge([
        'class' => '${defaultTailwindClass} block',
    ]) }}
>
    {{ $slot }}
</exhuma-${slug}>
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
							attributes: {},
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
					description: `React Native ${name} adapter wrapping @exhuma/core touch primitive.`,
					code: `import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import * as ${pascalName}Primitive from '@exhuma/core';

export interface ${pascalName}Props extends ViewProps {
  children?: React.ReactNode;
}

export function ${pascalName}({ style, children, ...props }: ${pascalName}Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    padding: 20,
    overflow: 'hidden',
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
import 'package:exhuma/exhuma.dart' as exhuma;

class Exhuma${pascalName} extends StatelessWidget {
  final Widget child;

  const Exhuma${pascalName}({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: Theme.of(context).dividerColor),
        color: Theme.of(context).cardColor,
      ),
      padding: const EdgeInsets.all(20.0),
      child: child,
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
	const header = `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';\nimport { cn } from '@/lib/utils';\n\n`;

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
        className={cn('${defaultClass}', className)}
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
        className={cn('${defaultClass}', className)}
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
      <span ref={ref} className={cn('${defaultClass}', className)} {...props}>
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
        className={cn('${defaultClass}', className)}
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
        className={cn('${defaultClass}', className)}
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
