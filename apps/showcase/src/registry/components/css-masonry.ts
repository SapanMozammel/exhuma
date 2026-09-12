import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';

export const cssMasonryComponent: UniversalComponent = {
  id: 'css-masonry',
  name: 'CSS Masonry',
  slug: 'css-masonry',
  category: 'layouts',
  description: 'Pure CSS multi-column responsive masonry layout with zero external JavaScript runtime overhead.',
  version: '1.0.0',
  props: [
    {
      name: 'columns',
      label: 'Desktop Columns',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 6,
      step: 1,
      description: 'Number of columns on desktop viewports.',
    },
    {
      name: 'gap',
      label: 'Column Gap (px)',
      type: 'number',
      defaultValue: 16,
      min: 8,
      max: 48,
      step: 4,
      description: 'Gap between masonry columns and items.',
    },
  ],
  defaultProps: {
    columns: 3,
    gap: 16,
  },
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload[] => {
    const columns = Number(props.columns ?? 3);
    const gap = Number(props.gap ?? 16);

    switch (flavor) {
      case 'react':
      case 'nextjs':
        return [
          {
            filename: 'CssMasonry.tsx',
            language: 'tsx',
            description: 'Pure CSS masonry component for React & Next.js.',
            code: `import React from 'react';

export interface CssMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
}

export function CssMasonry({
  columns = ${columns},
  gap = ${gap},
  className = '',
  children,
  ...props
}: CssMasonryProps) {
  return (
    <div
      className={\`w-full \${className}\`}
      style={{
        columnCount: columns,
        columnGap: \`\${gap}px\`,
      }}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <div style={{ breakInside: 'avoid', marginBottom: \`\${gap}px\` }}>
          {child}
        </div>
      ))}
    </div>
  );
}`,
          },
        ];

      case 'vue':
        return [
          {
            filename: 'CssMasonry.vue',
            language: 'vue',
            description: 'Vue 3 pure CSS masonry component.',
            code: `<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    columns?: number;
    gap?: number;
  }>(),
  {
    columns: ${columns},
    gap: ${gap},
  }
);
</script>

<template>
  <div
    class="w-full"
    :style="{
      columnCount: columns,
      columnGap: \`\${gap}px\`,
    }"
  >
    <div
      v-for="(slotItem, index) in $slots.default ? $slots.default() : []"
      :key="index"
      :style="{ breakInside: 'avoid', marginBottom: \`\${gap}px\` }"
    >
      <component :is="slotItem" />
    </div>
  </div>
</template>`,
          },
        ];

      case 'astro':
        return [
          {
            filename: 'CssMasonry.astro',
            language: 'astro',
            description: 'Astro pure CSS zero-JS masonry component.',
            code: `---
interface Props {
  columns?: number;
  gap?: number;
  class?: string;
}

const { columns = ${columns}, gap = ${gap}, class: className = '' } = Astro.props;
---

<div
  class:list={['w-full', className]}
  style={\`column-count: \${columns}; column-gap: \${gap}px;\`}
>
  <slot />
</div>

<style>
  div > :global(*) {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap, 16px);
  }
</style>`,
          },
        ];

      case 'blade':
        return [
          {
            filename: 'css-masonry.blade.php',
            language: 'php',
            description: 'Laravel Blade masonry component.',
            code: `@props([
    'columns' => ${columns},
    'gap' => ${gap},
])

<div 
    {{ $attributes->merge(['class' => 'w-full']) }}
    style="column-count: {{ $columns }}; column-gap: {{ $gap }}px;"
>
    {{ $slot }}
</div>`,
          },
        ];

      case 'vanilla':
        return [
          {
            filename: 'css-masonry.css',
            language: 'css',
            description: 'Pure CSS Masonry with responsive viewport breakpoints.',
            code: `@layer exhuma {
  .exhuma-masonry {
    column-count: 1;
    column-gap: ${gap}px;
    width: 100%;
  }

  @media (min-width: 640px) {
    .exhuma-masonry {
      column-count: 2;
    }
  }

  @media (min-width: 1024px) {
    .exhuma-masonry {
      column-count: ${columns};
    }
  }

  .exhuma-masonry-item {
    break-inside: avoid;
    margin-bottom: ${gap}px;
  }
}`,
          },
        ];

      case 'wordpress':
        return [
          {
            filename: 'block.json',
            language: 'json',
            description: 'WordPress Block API v3 for CSS Masonry.',
            code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/css-masonry",
  "version": "1.0.0",
  "title": "Exhuma CSS Masonry",
  "category": "layout",
  "icon": "grid-view",
  "attributes": {
    "columns": { "type": "number", "default": ${columns} },
    "gap": { "type": "number", "default": ${gap} }
  }
}`,
          },
        ];

      case 'webcomponent':
        return [
          {
            filename: 'exhuma-masonry.js',
            language: 'javascript',
            description: 'Web Component: <exhuma-masonry columns="3" gap="16">.',
            code: `class ExhumaMasonryElement extends HTMLElement {
  connectedCallback() {
    const cols = this.getAttribute('columns') || ${columns};
    const gap = this.getAttribute('gap') || ${gap};
    this.style.display = 'block';
    this.style.columnCount = cols;
    this.style.columnGap = \`\${gap}px\`;
  }
}
if (!customElements.get('exhuma-masonry')) {
  customElements.define('exhuma-masonry', ExhumaMasonryElement);
}`,
          },
        ];

      case 'svelte':
        return [
          {
            filename: 'CssMasonry.svelte',
            language: 'svelte',
            description: 'Svelte 5 Runes CSS Masonry layout component.',
            code: `<script lang="ts">
  let {
    columns = ${columns},
    gap = ${gap},
    class: className = '',
    children,
  }: {
    columns?: number;
    gap?: number;
    class?: string;
    children?: import('svelte').Snippet;
  } = $props();
</script>

<div
  class="w-full [column-fill:_balance] {className}"
  style="column-count: {columns}; column-gap: {gap}px;"
>
  {@render children?.()}
</div>`,
          },
        ];

      case 'angular':
        return [
          {
            filename: 'css-masonry.component.ts',
            language: 'typescript',
            description: 'Angular 18+ Standalone CSS Masonry component.',
            code: `import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-css-masonry',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      [class]="'w-full [column-fill:_balance] ' + customClass()"
      [style.columnCount]="columns()"
      [style.columnGap]="gap() + 'px'"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class ExhumaCssMasonryComponent {
  readonly columns = input<number>(${columns});
  readonly gap = input<number>(${gap});
  readonly customClass = input<string>('');
}`,
          },
        ];

      case 'solid':
        return [
          {
            filename: 'CssMasonry.tsx',
            language: 'tsx',
            description: 'SolidJS CSS Masonry component.',
            code: `import { Component, JSX, mergeProps } from 'solid-js';

export interface CssMasonryProps {
  columns?: number;
  gap?: number;
  class?: string;
  children?: JSX.Element;
}

export const CssMasonry: Component<CssMasonryProps> = (rawProps) => {
  const props = mergeProps(
    {
      columns: ${columns},
      gap: ${gap},
      class: '',
    },
    rawProps
  );

  return (
    <div
      class={\`w-full [column-fill:_balance] \${props.class}\`}
      style={{
        'column-count': props.columns,
        'column-gap': \`\${props.gap}px\`,
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
            filename: 'CssMasonry.native.tsx',
            language: 'tsx',
            description: 'React Native / Expo Masonry column layout for iOS and Android.',
            code: `import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface CssMasonryProps {
  columns?: number;
  gap?: number;
  children?: React.ReactNode[];
}

export const CssMasonry: React.FC<CssMasonryProps> = ({
  columns = ${columns},
  gap = ${gap},
  children = [],
}) => {
  const columnBuckets: React.ReactNode[][] = Array.from({ length: columns }, () => []);

  React.Children.forEach(children, (child, index) => {
    if (child) {
      columnBuckets[index % columns].push(child);
    }
  });

  return (
    <View style={[styles.container, { gap }]}>
      {columnBuckets.map((bucket, colIndex) => (
        <View key={colIndex} style={[styles.column, { gap }]}>
          {bucket.map((item, itemIndex) => (
            <View key={itemIndex}>{item}</View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  column: {
    flex: 1,
  },
});`,
          },
        ];

      case 'flutter':
        return [
          {
            filename: 'css_masonry.dart',
            language: 'dart',
            description: 'Flutter Masonry column layout widget for iOS, Android, and Desktop.',
            code: `import 'package:flutter/material.dart';

class ExhumaCssMasonry extends StatelessWidget {
  final List<Widget> children;
  final int columns;
  final double gap;

  const ExhumaCssMasonry({
    super.key,
    required this.children,
    this.columns = ${columns},
    this.gap = ${gap}.0,
  });

  @override
  Widget build(BuildContext context) {
    final List<List<Widget>> buckets = List.generate(columns, (_) => []);

    for (int i = 0; i < children.length; i++) {
      buckets[i % columns].add(
        Padding(
          padding: EdgeInsets.only(bottom: gap),
          child: children[i],
        ),
      );
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (int i = 0; i < columns; i++) ...[
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: buckets[i],
            ),
          ),
          if (i < columns - 1) SizedBox(width: gap),
        ],
      ],
    );
  }
}`,
          },
        ];
    }
  },
};
