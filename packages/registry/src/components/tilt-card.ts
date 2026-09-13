import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';

export const tiltCardComponent: UniversalComponent = {
  id: 'tilt-card',
  name: 'Tilt Card',
  slug: 'tilt-card',
  category: 'cards',
  description: 'Interactive 3D mouse-tracking card tilt with dynamic glare effect and smooth spring reset.',
  version: '1.0.0',
  props: [
    {
      name: 'maxTilt',
      label: 'Max Tilt (deg)',
      type: 'number',
      defaultValue: 15,
      min: 5,
      max: 35,
      step: 1,
      description: 'Maximum tilt rotation in degrees.',
    },
    {
      name: 'perspective',
      label: 'Perspective (px)',
      type: 'number',
      defaultValue: 1000,
      min: 500,
      max: 2000,
      step: 100,
      description: '3D perspective depth in pixels.',
    },
    {
      name: 'glare',
      label: 'Enable Glare',
      type: 'boolean',
      defaultValue: true,
      description: 'Dynamic glare reflection tracking mouse position.',
    },
  ],
  defaultProps: {
    maxTilt: 15,
    perspective: 1000,
    glare: true,
  },
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload[] => {
    const maxTilt = Number(props.maxTilt ?? 15);
    const perspective = Number(props.perspective ?? 1000);
    const glare = Boolean(props.glare ?? true);

    switch (flavor) {
      case 'react':
      case 'nextjs':
        return [
          {
            filename: 'TiltCard.tsx',
            language: 'tsx',
            description: 'Interactive 3D Tilt Card with mouse tracking and spring return.',
            code: `'use client';

import React, { useRef, useState } from 'react';

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
  children: React.ReactNode;
}

export function TiltCard({
  maxTilt = ${maxTilt},
  perspective = ${perspective},
  glare = ${glare},
  className = '',
  children,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y / rect.height) - 0.5) * -maxTilt;
    const rotY = ((x / rect.width) - 0.5) * maxTilt;

    setTransform(\`perspective(\${perspective}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)\`);
    setGlareOpacity(0.3);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform(\`perspective(\${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)\`);
    setGlareOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={\`relative overflow-hidden rounded-2xl transition-transform duration-200 ease-out will-change-transform \${className}\`}
      style={{ transform }}
      {...props}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glareOpacity,
            background: \`radial-gradient(circle at \${glarePos.x}% \${glarePos.y}%, rgba(255,255,255,0.8), transparent 60%)\`,
          }}
        />
      )}
    </div>
  );
}`,
          },
        ];

      case 'vue':
        return [
          {
            filename: 'TiltCard.vue',
            language: 'vue',
            description: 'Vue 3 3D Tilt Card with reactive mouse tracking.',
            code: `<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    maxTilt?: number;
    perspective?: number;
  }>(),
  {
    maxTilt: ${maxTilt},
    perspective: ${perspective},
  }
);

const card = ref<HTMLElement | null>(null);
const transform = ref('');

const onMouseMove = (e: MouseEvent) => {
  if (!card.value) return;
  const rect = card.value.getBoundingClientRect();
  const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -props.maxTilt;
  const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * props.maxTilt;
  transform.value = \`perspective(\${props.perspective}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`;
};

const onMouseLeave = () => {
  transform.value = \`perspective(\${props.perspective}px) rotateX(0deg) rotateY(0deg)\`;
};
</script>

<template>
  <div
    ref="card"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    class="relative overflow-hidden rounded-2xl transition-transform duration-150 ease-out"
    :style="{ transform }"
  >
    <slot />
  </div>
</template>`,
          },
        ];

      case 'astro':
        return [
          {
            filename: 'TiltCard.astro',
            language: 'astro',
            description: 'Astro 3D Tilt Card with micro client script.',
            code: `---
interface Props {
  maxTilt?: number;
  perspective?: number;
  class?: string;
}

const { maxTilt = ${maxTilt}, perspective = ${perspective}, class: className = '' } = Astro.props;
---

<div
  data-exhuma-tilt
  data-max-tilt={maxTilt}
  data-perspective={perspective}
  class:list={['relative overflow-hidden rounded-2xl transition-transform duration-150 ease-out', className]}
>
  <slot />
</div>

<script>
  document.querySelectorAll('[data-exhuma-tilt]').forEach((card) => {
    const el = card as HTMLElement;
    const max = parseFloat(el.dataset.maxTilt || '${maxTilt}');
    const p = parseFloat(el.dataset.perspective || '${perspective}');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -max;
      const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * max;
      el.style.transform = \`perspective(\${p}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = \`perspective(\${p}px) rotateX(0deg) rotateY(0deg)\`;
    });
  });
</script>`,
          },
        ];

      case 'blade':
        return [
          {
            filename: 'tilt-card.blade.php',
            language: 'php',
            description: 'Laravel Blade 3D Tilt Card with Alpine.js.',
            code: `@props([
    'maxTilt' => ${maxTilt},
    'perspective' => ${perspective},
])

<div 
    x-data="{
        transform: '',
        onMove(e) {
            let rect = $el.getBoundingClientRect();
            let rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -{{ $maxTilt }};
            let rotY = ((e.clientX - rect.left) / rect.width - 0.5) * {{ $maxTilt }};
            this.transform = 'perspective({{ $perspective }}px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
        },
        onLeave() {
            this.transform = 'perspective({{ $perspective }}px) rotateX(0deg) rotateY(0deg)';
        }
    }"
    @mousemove="onMove($event)"
    @mouseleave="onLeave()"
    :style="'transform: ' + transform"
    {{ $attributes->merge(['class' => 'relative overflow-hidden rounded-2xl transition-transform duration-150 ease-out']) }}
>
    {{ $slot }}
</div>`,
          },
        ];

      case 'vanilla':
        return [
          {
            filename: 'exhuma-tilt.js',
            language: 'javascript',
            description: 'Autonomous Vanilla JS 3D Tilt with destroy() cleanup.',
            code: `export class ExhumaTiltCard {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) throw new Error('[Exhuma] Tilt card element not found');

    this.options = Object.assign({ maxTilt: ${maxTilt}, perspective: ${perspective} }, options);
    this._onMove = this.handleMove.bind(this);
    this._onLeave = this.handleLeave.bind(this);
    this.init();
  }

  init() {
    this.element.style.willChange = 'transform';
    this.element.addEventListener('mousemove', this._onMove);
    this.element.addEventListener('mouseleave', this._onLeave);
  }

  handleMove(e) {
    const rect = this.element.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -this.options.maxTilt;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * this.options.maxTilt;
    this.element.style.transform = \`perspective(\${this.options.perspective}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`;
  }

  handleLeave() {
    this.element.style.transform = \`perspective(\${this.options.perspective}px) rotateX(0deg) rotateY(0deg)\`;
  }

  destroy() {
    this.element.removeEventListener('mousemove', this._onMove);
    this.element.removeEventListener('mouseleave', this._onLeave);
    this.element.style.transform = '';
  }
}`,
          },
        ];

      case 'wordpress':
        return [
          {
            filename: 'block.json',
            language: 'json',
            description: 'WordPress Block API v3 for 3D Tilt Card.',
            code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/tilt-card",
  "version": "1.0.0",
  "title": "Exhuma Tilt Card",
  "category": "design",
  "icon": "image-flip-horizontal",
  "attributes": {
    "maxTilt": { "type": "number", "default": ${maxTilt} },
    "perspective": { "type": "number", "default": ${perspective} }
  }
}`,
          },
        ];

      case 'webcomponent':
        return [
          {
            filename: 'exhuma-tilt-card.js',
            language: 'javascript',
            description: 'Web Component: <exhuma-tilt-card max-tilt="15">.',
            code: `class ExhumaTiltCardElement extends HTMLElement {
  connectedCallback() {
    const max = parseFloat(this.getAttribute('max-tilt') || '${maxTilt}');
    const p = parseFloat(this.getAttribute('perspective') || '${perspective}');

    this.style.display = 'block';
    this.style.transition = 'transform 0.15s ease-out';

    this.addEventListener('mousemove', (e) => {
      const rect = this.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -max;
      const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * max;
      this.style.transform = \`perspective(\${p}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`;
    });

    this.addEventListener('mouseleave', () => {
      this.style.transform = \`perspective(\${p}px) rotateX(0deg) rotateY(0deg)\`;
    });
  }
}
if (!customElements.get('exhuma-tilt-card')) {
  customElements.define('exhuma-tilt-card', ExhumaTiltCardElement);
}`,
          },
        ];

      case 'svelte':
        return [
          {
            filename: 'TiltCard.svelte',
            language: 'svelte',
            description: 'Svelte 5 Runes 3D Tilt Card with pointer tracking.',
            code: `<script lang="ts">
  let {
    maxTilt = ${maxTilt},
    perspective = ${perspective},
    class: className = '',
    children,
  }: {
    maxTilt?: number;
    perspective?: number;
    class?: string;
    children?: import('svelte').Snippet;
  } = $props();

  let transformStyle = $state('');

  function handleMouseMove(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -maxTilt;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt;
    transformStyle = \`perspective(\${perspective}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`;
  }

  function handleMouseLeave() {
    transformStyle = \`perspective(\${perspective}px) rotateX(0deg) rotateY(0deg)\`;
  }
</script>

<div
  role="region"
  aria-label="Interactive 3D card"
  class="relative overflow-hidden rounded-2xl transition-transform duration-150 ease-out {className}"
  style="transform: {transformStyle};"
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
>
  {@render children?.()}
</div>`,
          },
        ];

      case 'angular':
        return [
          {
            filename: 'tilt-card.component.ts',
            language: 'typescript',
            description: 'Angular 18+ Standalone 3D Tilt Card component.',
            code: `import { Component, input, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-tilt-card',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      [class]="'relative overflow-hidden rounded-2xl transition-transform duration-150 ease-out ' + customClass()"
      [style.transform]="transformStyle()"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class ExhumaTiltCardComponent {
  readonly maxTilt = input<number>(${maxTilt});
  readonly perspective = input<number>(${perspective});
  readonly customClass = input<string>('');

  readonly transformStyle = signal<string>('');

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -this.maxTilt();
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * this.maxTilt();
    this.transformStyle.set(\`perspective(\${this.perspective()}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.transformStyle.set(\`perspective(\${this.perspective()}px) rotateX(0deg) rotateY(0deg)\`);
  }
}`,
          },
        ];

      case 'solid':
        return [
          {
            filename: 'TiltCard.tsx',
            language: 'tsx',
            description: 'SolidJS 3D Tilt Card component with fine-grained reactivity.',
            code: `import { Component, JSX, mergeProps, createSignal } from 'solid-js';

export interface TiltCardProps {
  maxTilt?: number;
  perspective?: number;
  class?: string;
  children?: JSX.Element;
}

export const TiltCard: Component<TiltCardProps> = (rawProps) => {
  const props = mergeProps(
    {
      maxTilt: ${maxTilt},
      perspective: ${perspective},
      class: '',
    },
    rawProps
  );

  const [transform, setTransform] = createSignal('');

  const handleMouseMove = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -props.maxTilt;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * props.maxTilt;
    setTransform(\`perspective(\${props.perspective}px) rotateX(\${rotX.toFixed(2)}deg) rotateY(\${rotY.toFixed(2)}deg)\`);
  };

  const handleMouseLeave = () => {
    setTransform(\`perspective(\${props.perspective}px) rotateX(0deg) rotateY(0deg)\`);
  };

  return (
    <div
      class={\`relative overflow-hidden rounded-2xl transition-transform duration-150 ease-out \${props.class}\`}
      style={{ transform: transform() }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
            filename: 'TiltCard.native.tsx',
            language: 'tsx',
            description: 'React Native / Expo 3D Tilt Card with touch interaction for iOS and Android.',
            code: `import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';

export interface TiltCardProps {
  maxTilt?: number;
  children?: React.ReactNode;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  maxTilt = ${maxTilt},
  children,
}) => {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const dx = Math.min(Math.max(gestureState.dx / 10, -maxTilt), maxTilt);
        const dy = Math.min(Math.max(gestureState.dy / 10, -maxTilt), maxTilt);
        setTiltX(-dy);
        setTiltY(dx);
      },
      onPanResponderRelease: () => {
        setTiltX(0);
        setTiltY(0);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [
            { perspective: ${perspective} },
            { rotateX: \`\${tiltX}deg\` },
            { rotateY: \`\${tiltY}deg\` },
          ],
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});`,
          },
        ];

      case 'flutter':
        return [
          {
            filename: 'tilt_card.dart',
            language: 'dart',
            description: 'Flutter 3D interactive Tilt Card widget for iOS, Android, and Desktop.',
            code: `import 'package:flutter/material.dart';

class ExhumaTiltCard extends StatefulWidget {
  final Widget child;
  final double maxTilt;
  final double perspective;

  const ExhumaTiltCard({
    super.key,
    required this.child,
    this.maxTilt = ${maxTilt}.0,
    this.perspective = 0.001,
  });

  @override
  State<ExhumaTiltCard> createState() => _ExhumaTiltCardState();
}

class _ExhumaTiltCardState extends State<ExhumaTiltCard> {
  double _rotX = 0.0;
  double _rotY = 0.0;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onHover: (event) {
        final size = context.size;
        if (size == null) return;

        final localPos = event.localPosition;
        final xNorm = (localPos.dx / size.width - 0.5);
        final yNorm = (localPos.dy / size.height - 0.5);

        setState(() {
          _rotX = -yNorm * (widget.maxTilt * 3.14159 / 180);
          _rotY = xNorm * (widget.maxTilt * 3.14159 / 180);
        });
      },
      onExit: (_) {
        setState(() {
          _rotX = 0.0;
          _rotY = 0.0;
        });
      },
      child: Transform(
        transform: Matrix4.identity()
          ..setEntry(3, 2, widget.perspective)
          ..rotateX(_rotX)
          ..rotateY(_rotY),
        alignment: FractionalOffset.center,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16.0),
          child: widget.child,
        ),
      ),
    );
  }
}`,
          },
        ];
    }
  },
};
