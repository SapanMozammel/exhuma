import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';

export const autoGridComponent: UniversalComponent = {
  id: 'auto-grid',
  name: 'Auto Grid',
  slug: 'auto-grid',
  category: 'layouts',
  description: 'Responsive CSS Grid with auto-fit / auto-fill minmax repeat tracks with zero media queries.',
  version: '1.0.0',
  props: [
    {
      name: 'minItemWidth',
      label: 'Min Width (px)',
      type: 'number',
      defaultValue: 280,
      min: 150,
      max: 450,
      step: 10,
      description: 'Minimum width of each grid column before wrapping to the next line.',
    },
    {
      name: 'gap',
      label: 'Grid Gap (px)',
      type: 'number',
      defaultValue: 24,
      min: 8,
      max: 48,
      step: 4,
      description: 'Gap between grid items.',
    },
  ],
  defaultProps: {
    minItemWidth: 280,
    gap: 24,
  },
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload[] => {
    const minWidth = Number(props.minItemWidth ?? 280);
    const gap = Number(props.gap ?? 24);

    switch (flavor) {
      case 'react':
      case 'nextjs':
        return [
          {
            filename: 'AutoGrid.tsx',
            language: 'tsx',
            description: 'React/Next.js Auto Grid component.',
            code: `import React from 'react';

export interface AutoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  minItemWidth?: number;
  gap?: number;
  children: React.ReactNode;
}

export function AutoGrid({
  minItemWidth = ${minWidth},
  gap = ${gap},
  className = '',
  children,
  ...props
}: AutoGridProps) {
  return (
    <div
      className={\`grid w-full \${className}\`}
      style={{
        gridTemplateColumns: \`repeat(auto-fit, minmax(\${minItemWidth}px, 1fr))\`,
        gap: \`\${gap}px\`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}`,
          },
        ];

      case 'vue':
        return [
          {
            filename: 'AutoGrid.vue',
            language: 'vue',
            description: 'Vue 3 Auto Grid component.',
            code: `<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    minItemWidth?: number;
    gap?: number;
  }>(),
  {
    minItemWidth: ${minWidth},
    gap: ${gap},
  }
);
</script>

<template>
  <div
    class="grid w-full"
    :style="{
      gridTemplateColumns: \`repeat(auto-fit, minmax(\${minItemWidth}px, 1fr))\`,
      gap: \`\${gap}px\`,
    }"
  >
    <slot />
  </div>
</template>`,
          },
        ];

      case 'astro':
        return [
          {
            filename: 'AutoGrid.astro',
            language: 'astro',
            description: 'Astro Auto Grid component.',
            code: `---
interface Props {
  minItemWidth?: number;
  gap?: number;
  class?: string;
}

const { minItemWidth = ${minWidth}, gap = ${gap}, class: className = '' } = Astro.props;
---

<div
  class:list={['grid w-full', className]}
  style={\`grid-template-columns: repeat(auto-fit, minmax(\${minItemWidth}px, 1fr)); gap: \${gap}px;\`}
>
  <slot />
</div>`,
          },
        ];

      case 'blade':
        return [
          {
            filename: 'auto-grid.blade.php',
            language: 'php',
            description: 'Laravel Blade Auto Grid component.',
            code: `@props([
    'minItemWidth' => ${minWidth},
    'gap' => ${gap},
])

<div 
    {{ $attributes->merge(['class' => 'grid w-full']) }}
    style="grid-template-columns: repeat(auto-fit, minmax({{ $minItemWidth }}px, 1fr)); gap: {{ $gap }}px;"
>
    {{ $slot }}
</div>`,
          },
        ];

      case 'vanilla':
        return [
          {
            filename: 'auto-grid.css',
            language: 'css',
            description: 'Pure CSS Auto Grid with minmax repeat.',
            code: `@layer exhuma {
  .exhuma-auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}px, 1fr));
    gap: ${gap}px;
    width: 100%;
  }
}`,
          },
        ];

      case 'wordpress':
        return [
          {
            filename: 'block.json',
            language: 'json',
            description: 'WordPress Block API v3 for Auto Grid.',
            code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/auto-grid",
  "version": "1.0.0",
  "title": "Exhuma Auto Grid",
  "category": "layout",
  "icon": "grid-view",
  "attributes": {
    "minItemWidth": { "type": "number", "default": ${minWidth} },
    "gap": { "type": "number", "default": ${gap} }
  }
}`,
          },
        ];

      case 'webcomponent':
        return [
          {
            filename: 'exhuma-auto-grid.js',
            language: 'javascript',
            description: 'Web Component: <exhuma-auto-grid min-width="280" gap="24">.',
            code: `class ExhumaAutoGridElement extends HTMLElement {
  connectedCallback() {
    const minW = this.getAttribute('min-width') || ${minWidth};
    const gap = this.getAttribute('gap') || ${gap};
    this.style.display = 'grid';
    this.style.gridTemplateColumns = \`repeat(auto-fit, minmax(\${minW}px, 1fr))\`;
    this.style.gap = \`\${gap}px\`;
  }
}
if (!customElements.get('exhuma-auto-grid')) {
  customElements.define('exhuma-auto-grid', ExhumaAutoGridElement);
}`,
          },
        ];

      case 'svelte':
        return [
          {
            filename: 'AutoGrid.svelte',
            language: 'svelte',
            description: 'Svelte 5 Runes Auto Grid layout component.',
            code: `<script lang="ts">
  let {
    minItemWidth = ${minWidth},
    gap = ${gap},
    class: className = '',
    children,
  }: {
    minItemWidth?: number;
    gap?: number;
    class?: string;
    children?: import('svelte').Snippet;
  } = $props();
</script>

<div
  class="grid w-full {className}"
  style="grid-template-columns: repeat(auto-fit, minmax(min({minItemWidth}px, 100%), 1fr)); gap: {gap}px;"
>
  {@render children?.()}
</div>`,
          },
        ];

      case 'angular':
        return [
          {
            filename: 'auto-grid.component.ts',
            language: 'typescript',
            description: 'Angular 18+ Standalone Auto Grid layout component.',
            code: `import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-auto-grid',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      [class]="'grid w-full ' + customClass()"
      [style.gridTemplateColumns]="gridTemplate()"
      [style.gap]="gap() + 'px'"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class ExhumaAutoGridComponent {
  readonly minItemWidth = input<number>(${minWidth});
  readonly gap = input<number>(${gap});
  readonly customClass = input<string>('');

  readonly gridTemplate = computed(() => {
    return \`repeat(auto-fit, minmax(min(\${this.minItemWidth()}px, 100%), 1fr))\`;
  });
}`,
          },
        ];

      case 'solid':
        return [
          {
            filename: 'AutoGrid.tsx',
            language: 'tsx',
            description: 'SolidJS Auto Grid component with dynamic repeat minmax tracks.',
            code: `import { Component, JSX, mergeProps } from 'solid-js';

export interface AutoGridProps {
  minItemWidth?: number;
  gap?: number;
  class?: string;
  children?: JSX.Element;
}

export const AutoGrid: Component<AutoGridProps> = (rawProps) => {
  const props = mergeProps(
    {
      minItemWidth: ${minWidth},
      gap: ${gap},
      class: '',
    },
    rawProps
  );

  return (
    <div
      class={\`grid w-full \${props.class}\`}
      style={{
        'grid-template-columns': \`repeat(auto-fit, minmax(min(\${props.minItemWidth}px, 100%), 1fr))\`,
        gap: \`\${props.gap}px\`,
      }}
    >
      {props.children}
    </div>
  );
};`,
          },
        ];

      case 'react-native':
        return [
          {
            filename: 'AutoGrid.native.tsx',
            language: 'tsx',
            description: 'React Native / Expo Auto Grid responsive wrap layout for iOS and Android.',
            code: `import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

export interface AutoGridProps {
  minItemWidth?: number;
  gap?: number;
  children?: React.ReactNode;
}

export const AutoGrid: React.FC<AutoGridProps> = ({
  minItemWidth = ${minWidth},
  gap = ${gap},
  children,
}) => {
  const screenWidth = Dimensions.get('window').width - 32;
  const numColumns = Math.max(1, Math.floor(screenWidth / minItemWidth));
  const itemWidth = (screenWidth - (numColumns - 1) * gap) / numColumns;

  return (
    <View style={[styles.container, { gap }]}>
      {React.Children.map(children, (child) => (
        <View style={{ width: itemWidth }}>{child}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 16,
  },
});`,
          },
        ];

      case 'flutter':
        return [
          {
            filename: 'auto_grid.dart',
            language: 'dart',
            description: 'Flutter dynamic extent grid layout widget for iOS, Android, and Desktop.',
            code: `import 'package:flutter/material.dart';

class ExhumaAutoGrid extends StatelessWidget {
  final List<Widget> children;
  final double minItemWidth;
  final double gap;

  const ExhumaAutoGrid({
    super.key,
    required this.children,
    this.minItemWidth = ${minWidth}.0,
    this.gap = ${gap}.0,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Wrap(
          spacing: gap,
          runSpacing: gap,
          children: children.map((child) {
            return ConstrainedBox(
              constraints: BoxConstraints(
                minWidth: minItemWidth,
                maxWidth: constraints.maxWidth,
              ),
              child: child,
            );
          }).toList(),
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
