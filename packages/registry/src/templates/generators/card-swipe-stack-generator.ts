import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getCardSwipeStackOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const thresholdDistance = Number(props.thresholdDistance ?? 120);
	const maxRotation = Number(props.maxRotation ?? 20);
	const scaleStep = Number(props.scaleStep ?? 0.05);
	const offsetStep = Number(props.offsetStep ?? 14);
	const preventLastCardDismiss = Boolean(props.preventLastCardDismiss ?? true);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'CardSwipeStack.tsx',
					language: 'tsx',
					description: 'Card Swipe Stack — Standalone Ejected Engine (Zero Dependencies). Raw velocity ring buffer and Euler rotation physics inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface CardSwipeStackProps<T = unknown> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  onSwipe?: (item: T, direction: 'left' | 'right') => void;
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  className?: string;
}

/**
 * Pre-allocated Float64Array circular ring buffer for O(1) velocity estimation.
 */
class SwipeVelocityRingBuffer {
  private xs = new Float64Array(8);
  private ts = new Float64Array(8);
  private head = 0;
  private count = 0;

  push(x: number, timeMs: number) {
    this.xs[this.head] = x;
    this.ts[this.head] = timeMs;
    this.head = (this.head + 1) % 8;
    if (this.count < 8) this.count++;
  }

  computeVelocityX(): number {
    if (this.count < 2) return 0;
    const latest = (this.head - 1 + 8) % 8;
    const oldest = (this.head - this.count + 8) % 8;
    const dt = (this.ts[latest] - this.ts[oldest]) / 1000;
    if (dt <= 0.001) return 0;
    return (this.xs[latest] - this.xs[oldest]) / dt;
  }

  clear() {
    this.head = 0;
    this.count = 0;
  }
}

export function CardSwipeStack<T>({
  items,
  renderCard,
  onSwipe,
  thresholdDistance = ${thresholdDistance},
  maxRotation = ${maxRotation},
  scaleStep = ${scaleStep},
  offsetStep = ${offsetStep},
  preventLastCardDismiss = ${preventLastCardDismiss},
  className = '',
}: CardSwipeStackProps<T>) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const startPosRef = React.useRef({ x: 0, y: 0 });
  const currentPosRef = React.useRef({ x: 0, y: 0 });
  const isDraggingRef = React.useRef(false);
  const isAnimatingRef = React.useRef(false);
  const ringBufferRef = React.useRef(new SwipeVelocityRingBuffer());

  const visibleItems = items.slice(currentIndex, currentIndex + 3);

  const applyRestingTransforms = () => {
    for (let i = 1; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const translateY = i * offsetStep;
      const scale = Math.max(0.7, 1 - i * scaleStep);
      const opacity = Math.max(0.4, 1 - i * 0.15);
      el.style.transform = \`translate3d(0, \${translateY.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  };

  React.useEffect(() => {
    applyRestingTransforms();
  }, [currentIndex, scaleStep, offsetStep]);

  const updateDOM = () => {
    const topEl = cardRefs.current[0];
    if (!topEl) return;
    const dx = currentPosRef.current.x - startPosRef.current.x;
    const isLast = preventLastCardDismiss && currentIndex >= items.length - 1;
    const effectiveDx = isLast ? dx * 0.4 : dx;
    const rot = Math.max(-maxRotation, Math.min(maxRotation, (effectiveDx / 180) * maxRotation));

    topEl.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

    const progress = Math.min(1, Math.abs(effectiveDx) / thresholdDistance);
    for (let i = 1; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const targetY = (i - 1) * offsetStep;
      const currentY = i * offsetStep;
      const y = currentY - progress * (currentY - targetY);

      const targetScale = 1 - (i - 1) * scaleStep;
      const curScale = 1 - i * scaleStep;
      const scale = curScale + progress * (targetScale - curScale);

      el.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current || e.button !== 0 || currentIndex >= items.length) return;
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    currentPosRef.current = { x: e.clientX, y: e.clientY };
    ringBufferRef.current.clear();
    ringBufferRef.current.push(e.clientX, performance.now());
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    currentPosRef.current = { x: e.clientX, y: e.clientY };
    ringBufferRef.current.push(e.clientX, performance.now());
    updateDOM();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const dx = currentPosRef.current.x - startPosRef.current.x;
    const vx = ringBufferRef.current.computeVelocityX();
    const isLast = preventLastCardDismiss && currentIndex >= items.length - 1;

    const shouldDismiss = !isLast && (Math.abs(dx) > thresholdDistance || Math.abs(vx) > 550);

    if (shouldDismiss) {
      isAnimatingRef.current = true;
      const dir = dx > 0 ? 'right' : 'left';
      const targetX = dir === 'right' ? 500 : -500;
      const topEl = cardRefs.current[0];

      if (topEl) {
        topEl.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
        topEl.style.transform = \`translate3d(\${targetX}px, 0, 0) rotate(\${dir === 'right' ? maxRotation : -maxRotation}deg)\`;
        topEl.style.opacity = '0';
      }

      setTimeout(() => {
        if (topEl) {
          topEl.style.transition = 'none';
          topEl.style.transform = 'none';
          topEl.style.opacity = '1';
        }
        onSwipe?.(items[currentIndex], dir);
        setCurrentIndex((prev) => prev + 1);
        isAnimatingRef.current = false;
      }, 260);
    } else {
      // Snap back
      const topEl = cardRefs.current[0];
      if (topEl) {
        topEl.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => {
          if (topEl) topEl.style.transition = 'none';
        }, 240);
      }
      applyRestingTransforms();
    }
  };

  return (
    <div className={clsx('relative flex items-center justify-center min-h-[14.5rem] w-full select-none', className)}>
      {visibleItems.map((item, idx) => (
        <div
          key={currentIndex + idx}
          ref={(el) => { cardRefs.current[idx] = el; }}
          className={clsx(
            'absolute w-full max-w-sm rounded-2xl will-change-transform',
            idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'
          )}
          onPointerDown={idx === 0 ? handlePointerDown : undefined}
          onPointerMove={idx === 0 ? handlePointerMove : undefined}
          onPointerUp={idx === 0 ? handlePointerUp : undefined}
          onPointerCancel={idx === 0 ? handlePointerUp : undefined}
        >
          {renderCard(item, currentIndex + idx)}
        </div>
      ))}
    </div>
  );
}
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'CardSwipeStack.vue',
					language: 'vue',
					description: 'Vue 3 Native Card Swipe Stack component with reactive kinetic gesture tracking.',
					code: `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Props {
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  thresholdDistance: ${thresholdDistance},
  maxRotation: ${maxRotation},
  scaleStep: ${scaleStep},
  offsetStep: ${offsetStep},
  preventLastCardDismiss: ${preventLastCardDismiss},
  class: '',
});

const emit = defineEmits<{
  (e: 'swipe', direction: 'left' | 'right'): void;
}>();

const currentIndex = ref(0);
const cardRefs = ref<HTMLDivElement[]>([]);
let isDragging = false;
let startX = 0;
let currentX = 0;

const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0) return;
  isDragging = true;
  startX = e.clientX;
  currentX = e.clientX;
  const target = e.currentTarget as HTMLElement;
  try { target.setPointerCapture(e.pointerId); } catch {}
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging) return;
  currentX = e.clientX;
  const topEl = cardRefs.value[0];
  if (!topEl) return;

  const dx = currentX - startX;
  const rot = Math.max(-props.maxRotation, Math.min(props.maxRotation, (dx / 180) * props.maxRotation));
  topEl.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
};

const onPointerUp = (e: PointerEvent) => {
  if (!isDragging) return;
  isDragging = false;
  const target = e.currentTarget as HTMLElement;
  try { if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId); } catch {}

  const dx = currentX - startX;
  const topEl = cardRefs.value[0];

  if (Math.abs(dx) > props.thresholdDistance) {
    const dir = dx > 0 ? 'right' : 'left';
    if (topEl) {
      topEl.style.transition = 'transform 260ms ease, opacity 260ms ease';
      topEl.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
      topEl.style.opacity = '0';
    }
    setTimeout(() => {
      if (topEl) {
        topEl.style.transition = 'none';
        topEl.style.transform = 'none';
        topEl.style.opacity = '1';
      }
      emit('swipe', dir);
      currentIndex.value++;
    }, 260);
  } else {
    if (topEl) {
      topEl.style.transition = 'transform 240ms ease';
      topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      setTimeout(() => { if (topEl) topEl.style.transition = 'none'; }, 240);
    }
  }
};
</script>

<template>
  <div :class="['relative flex items-center justify-center min-h-[14.5rem] w-full select-none', props.class]">
    <div
      ref="cardRefs"
      class="absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <slot />
    </div>
  </div>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'CardSwipeStack.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Card Swipe Stack with Runes and gesture physics.',
					code: `<script lang="ts">
  interface Props {
    thresholdDistance?: number;
    maxRotation?: number;
    scaleStep?: number;
    offsetStep?: number;
    preventLastCardDismiss?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
    onSwipe?: (direction: 'left' | 'right') => void;
  }

  let {
    thresholdDistance = ${thresholdDistance},
    maxRotation = ${maxRotation},
    scaleStep = ${scaleStep},
    offsetStep = ${offsetStep},
    preventLastCardDismiss = ${preventLastCardDismiss},
    class: className = '',
    children,
    onSwipe,
  }: Props = $props();

  let topCard: HTMLDivElement | null = $state(null);
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    currentX = e.clientX;
    const target = e.currentTarget as HTMLElement;
    try { target.setPointerCapture(e.pointerId); } catch {}
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging || !topCard) return;
    currentX = e.clientX;
    const dx = currentX - startX;
    const rot = Math.max(-maxRotation, Math.min(maxRotation, (dx / 180) * maxRotation));
    topCard.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging || !topCard) return;
    isDragging = false;
    const target = e.currentTarget as HTMLElement;
    try { if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId); } catch {}

    const dx = currentX - startX;
    if (Math.abs(dx) > thresholdDistance) {
      const dir = dx > 0 ? 'right' : 'left';
      topCard.style.transition = 'transform 260ms ease, opacity 260ms ease';
      topCard.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
      topCard.style.opacity = '0';
      setTimeout(() => {
        if (topCard) {
          topCard.style.transition = 'none';
          topCard.style.transform = 'none';
          topCard.style.opacity = '1';
        }
        onSwipe?.(dir);
      }, 260);
    } else {
      topCard.style.transition = 'transform 240ms ease';
      topCard.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      setTimeout(() => { if (topCard) topCard.style.transition = 'none'; }, 240);
    }
  }
</script>

<div class="relative flex items-center justify-center min-h-[14.5rem] w-full select-none {className}">
  <div
    bind:this={topCard}
    class="absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
  >
    {@render children?.()}
  </div>
</div>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'CardSwipeStack.tsx',
					language: 'tsx',
					description: 'SolidJS Native Card Swipe Stack component.',
					code: `import { Component, JSX } from 'solid-js';

export interface CardSwipeStackProps {
  children?: JSX.Element;
  thresholdDistance?: number;
  maxRotation?: number;
  class?: string;
  onSwipe?: (direction: 'left' | 'right') => void;
}

export const CardSwipeStack: Component<CardSwipeStackProps> = (props) => {
  let cardRef: HTMLDivElement | undefined;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  const threshold = props.thresholdDistance ?? ${thresholdDistance};
  const maxRot = props.maxRotation ?? ${maxRotation};

  return (
    <div class={\`relative flex items-center justify-center min-h-[14.5rem] w-full select-none \${props.class ?? ''}\`}>
      <div
        ref={cardRef}
        class="absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          isDragging = true;
          startX = e.clientX;
          currentX = e.clientX;
          try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
        }}
        onPointerMove={(e) => {
          if (!isDragging || !cardRef) return;
          currentX = e.clientX;
          const dx = currentX - startX;
          const rot = Math.max(-maxRot, Math.min(maxRot, (dx / 180) * maxRot));
          cardRef.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
        }}
        onPointerUp={(e) => {
          if (!isDragging || !cardRef) return;
          isDragging = false;
          try {
            if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            }
          } catch {}

          const dx = currentX - startX;
          if (Math.abs(dx) > threshold) {
            const dir = dx > 0 ? 'right' : 'left';
            cardRef.style.transition = 'transform 260ms ease, opacity 260ms ease';
            cardRef.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
            cardRef.style.opacity = '0';
            setTimeout(() => {
              if (cardRef) {
                cardRef.style.transition = 'none';
                cardRef.style.transform = 'none';
                cardRef.style.opacity = '1';
              }
              props.onSwipe?.(dir);
            }, 260);
          } else {
            cardRef.style.transition = 'transform 240ms ease';
            cardRef.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            setTimeout(() => { if (cardRef) cardRef.style.transition = 'none'; }, 240);
          }
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'card-swipe-stack.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Card Swipe Stack component.',
					code: `import { Component, input, output, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-card-swipe-stack',
  standalone: true,
  template: \`
    <div class="relative flex items-center justify-center min-h-[14.5rem] w-full select-none {{ customClass() }}">
      <div
        #card
        class="absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
      >
        <ng-content></ng-content>
      </div>
    </div>
  \`,
})
export class ExhumaCardSwipeStackComponent {
  readonly thresholdDistance = input<number>(${thresholdDistance});
  readonly maxRotation = input<number>(${maxRotation});
  readonly customClass = input<string>('');
  readonly swipe = output<'left' | 'right'>();

  readonly card = viewChild<ElementRef<HTMLDivElement>>('card');
  private isDragging = false;
  private startX = 0;
  private currentX = 0;

  onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.currentX = e.clientX;
    const el = this.card()?.nativeElement;
    if (el) try { el.setPointerCapture(e.pointerId); } catch {}
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
    const el = this.card()?.nativeElement;
    if (!el) return;
    const dx = this.currentX - this.startX;
    const maxRot = this.maxRotation();
    const rot = Math.max(-maxRot, Math.min(maxRot, (dx / 180) * maxRot));
    el.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
  }

  onPointerUp(e: PointerEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const el = this.card()?.nativeElement;
    if (el) {
      try { if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); } catch {}
    }

    const dx = this.currentX - this.startX;
    if (Math.abs(dx) > this.thresholdDistance()) {
      const dir = dx > 0 ? 'right' : 'left';
      if (el) {
        el.style.transition = 'transform 260ms ease, opacity 260ms ease';
        el.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
        el.style.opacity = '0';
        setTimeout(() => {
          el.style.transition = 'none';
          el.style.transform = 'none';
          el.style.opacity = '1';
          this.swipe.emit(dir);
        }, 260);
      }
    } else {
      if (el) {
        el.style.transition = 'transform 240ms ease';
        el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => { el.style.transition = 'none'; }, 240);
      }
    }
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'CardSwipeStack.astro',
					language: 'astro',
					description: 'Pure Native Astro Card Swipe Stack component.',
					code: `---
interface Props {
  thresholdDistance?: number;
  maxRotation?: number;
  class?: string;
}

const {
  thresholdDistance = ${thresholdDistance},
  maxRotation = ${maxRotation},
  class: className = '',
} = Astro.props;
---

<div
  class={\`exhuma-swipe-stack relative flex items-center justify-center min-h-[14.5rem] w-full select-none \${className}\`}
  data-threshold={thresholdDistance}
  data-rotation={maxRotation}
>
  <div class="exhuma-swipe-card absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform">
    <slot />
  </div>
</div>

<script>
  function initSwipeStacks() {
    document.querySelectorAll<HTMLElement>('.exhuma-swipe-stack').forEach((stack) => {
      if (stack.dataset.initialized) return;
      stack.dataset.initialized = 'true';

      const threshold = parseFloat(stack.dataset.threshold || '${thresholdDistance}');
      const maxRot = parseFloat(stack.dataset.rotation || '${maxRotation}');
      const card = stack.querySelector<HTMLElement>('.exhuma-swipe-card');
      if (!card) return;

      let isDragging = false;
      let startX = 0;
      let currentX = 0;

      card.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        currentX = e.clientX;
        try { card.setPointerCapture(e.pointerId); } catch {}
      });

      card.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const dx = currentX - startX;
        const rot = Math.max(-maxRot, Math.min(maxRot, (dx / 180) * maxRot));
        card.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
      });

      const onEnd = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        try { if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId); } catch {}

        const dx = currentX - startX;
        if (Math.abs(dx) > threshold) {
          const dir = dx > 0 ? 'right' : 'left';
          card.style.transition = 'transform 260ms ease, opacity 260ms ease';
          card.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'none';
            card.style.transform = 'none';
            card.style.opacity = '1';
          }, 260);
        } else {
          card.style.transition = 'transform 240ms ease';
          card.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
          setTimeout(() => { card.style.transition = 'none'; }, 240);
        }
      };

      card.addEventListener('pointerup', onEnd);
      card.addEventListener('pointercancel', onEnd);
    });
  }

  document.addEventListener('DOMContentLoaded', initSwipeStacks);
  initSwipeStacks();
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-card-swipe-stack.js',
					language: 'javascript',
					description: 'Universal Custom Web Component <exhuma-card-swipe-stack>.',
					code: `/**
 * Exhuma Card Swipe Stack Web Component
 * <exhuma-card-swipe-stack threshold="120" max-rotation="20">
 */
class ExhumaCardSwipeStack extends HTMLElement {
  connectedCallback() {
    this.style.position = 'relative';
    this.style.display = 'flex';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';
    this.style.minHeight = '14.5rem';
    this.style.width = '100%';
    this.style.userSelect = 'none';

    const threshold = parseFloat(this.getAttribute('threshold') || '${thresholdDistance}');
    const maxRot = parseFloat(this.getAttribute('max-rotation') || '${maxRotation}');
    const card = this.firstElementChild;
    if (!card) return;

    card.style.position = 'absolute';
    card.style.width = '100%';
    card.style.maxWidth = '24rem';
    card.style.cursor = 'grab';
    card.style.willChange = 'transform';

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    card.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      currentX = e.clientX;
      try { card.setPointerCapture(e.pointerId); } catch {}
    });

    card.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const dx = currentX - startX;
      const rot = Math.max(-maxRot, Math.min(maxRot, (dx / 180) * maxRot));
      card.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
    });

    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId); } catch {}

      const dx = currentX - startX;
      if (Math.abs(dx) > threshold) {
        const dir = dx > 0 ? 'right' : 'left';
        card.style.transition = 'transform 260ms ease, opacity 260ms ease';
        card.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'none';
          card.style.transform = 'none';
          card.style.opacity = '1';
          this.dispatchEvent(new CustomEvent('swipe', { detail: { direction: dir } }));
        }, 260);
      } else {
        card.style.transition = 'transform 240ms ease';
        card.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => { card.style.transition = 'none'; }, 240);
      }
    };

    card.addEventListener('pointerup', onEnd);
    card.addEventListener('pointercancel', onEnd);
  }
}

customElements.define('exhuma-card-swipe-stack', ExhumaCardSwipeStack);
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'card-swipe-stack.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JS Card Swipe Stack controller.',
					code: `/**
 * Vanilla JS Card Swipe Stack Controller
 */
export function initCardSwipeStack(containerSelector = '[data-swipe-stack]') {
  const containers = document.querySelectorAll(containerSelector);

  containers.forEach((container) => {
    if (container.__exhuma_swipe) return;
    container.__exhuma_swipe = true;

    const threshold = parseFloat(container.dataset.threshold || '${thresholdDistance}');
    const maxRot = parseFloat(container.dataset.maxRotation || '${maxRotation}');
    const card = container.querySelector('[data-swipe-card]');
    if (!card) return;

    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    card.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      currentX = e.clientX;
      try { card.setPointerCapture(e.pointerId); } catch {}
    });

    card.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const dx = currentX - startX;
      const rot = Math.max(-maxRot, Math.min(maxRot, (dx / 180) * maxRot));
      card.style.transform = \`translate3d(\${dx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;
    });

    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId); } catch {}

      const dx = currentX - startX;
      if (Math.abs(dx) > threshold) {
        const dir = dx > 0 ? 'right' : 'left';
        card.style.transition = 'transform 260ms ease, opacity 260ms ease';
        card.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0)\`;
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'none';
          card.style.transform = 'none';
          card.style.opacity = '1';
        }, 260);
      } else {
        card.style.transition = 'transform 240ms ease';
        card.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => { card.style.transition = 'none'; }, 240);
      }
    };

    card.addEventListener('pointerup', onEnd);
    card.addEventListener('pointercancel', onEnd);
  });
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'card-swipe-stack.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Card Swipe Stack with Alpine.js.',
					code: `@props([
    'thresholdDistance' => ${thresholdDistance},
    'maxRotation' => ${maxRotation},
])

<div
    x-data="{
        isDragging: false,
        startX: 0,
        currentX: 0,
        threshold: {{ $thresholdDistance }},
        maxRot: {{ $maxRotation }},
        get dx() { return this.currentX - this.startX; },
        get rotation() {
            return Math.max(-this.maxRot, Math.min(this.maxRot, (this.dx / 180) * this.maxRot));
        }
    }"
    {{ $attributes->merge([
        'class' => 'relative flex items-center justify-center min-h-[14.5rem] w-full select-none',
    ]) }}
>
    <div
        class="absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform"
        :style="isDragging ? 'transform: translate3d(' + dx + 'px, 0, 0) rotate(' + rotation + 'deg)' : ''"
        @pointerdown="
            if ($event.button !== 0) return;
            isDragging = true;
            startX = $event.clientX;
            currentX = $event.clientX;
            try { $el.setPointerCapture($event.pointerId); } catch(e) {}
        "
        @pointermove="if (isDragging) currentX = $event.clientX"
        @pointerup="
            if (!isDragging) return;
            isDragging = false;
            try { if ($el.hasPointerCapture($event.pointerId)) $el.releasePointerCapture($event.pointerId); } catch(e) {}
            if (Math.abs(dx) > threshold) {
                const dir = dx > 0 ? 500 : -500;
                $el.style.transition = 'transform 260ms ease, opacity 260ms ease';
                $el.style.transform = 'translate3d(' + dir + 'px, 0, 0)';
                $el.style.opacity = '0';
                setTimeout(() => {
                    $el.style.transition = 'none';
                    $el.style.transform = 'none';
                    $el.style.opacity = '1';
                }, 260);
            }
        "
        @pointercancel="isDragging = false"
    >
        {{ $slot }}
    </div>
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
					description: 'WordPress Gutenberg block definition for Card Swipe Stack.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/card-swipe-stack",
  "version": "1.0.0",
  "title": "Exhuma Card Swipe Stack",
  "category": "layout",
  "icon": "slides",
  "description": "Velocity-sensitive multi-card swipe stack with Euler angular rotation.",
  "attributes": {
    "thresholdDistance": { "type": "number", "default": ${thresholdDistance} },
    "maxRotation": { "type": "number", "default": ${maxRotation} }
  },
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg block dynamic render template.',
					code: `<?php
/**
 * Card Swipe Stack Block Template
 */
$threshold = isset($attributes['thresholdDistance']) ? (int)$attributes['thresholdDistance'] : ${thresholdDistance};
$max_rot = isset($attributes['maxRotation']) ? (int)$attributes['maxRotation'] : ${maxRotation};
?>
<div
    class="wp-block-exhuma-card-swipe-stack relative flex items-center justify-center min-h-[14.5rem] w-full select-none"
    data-threshold="<?php echo esc_attr($threshold); ?>"
    data-max-rotation="<?php echo esc_attr($max_rot); ?>"
>
    <div class="exhuma-swipe-card absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform">
        <?php echo $content; ?>
    </div>
</div>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'CardSwipeStack.tsx',
					language: 'tsx',
					description: 'React Native Card Swipe Stack with PanResponder and Animated rotation.',
					code: `import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';

export interface CardSwipeStackProps {
  children?: React.ReactNode;
  thresholdDistance?: number;
  maxRotation?: number;
  onSwipe?: (direction: 'left' | 'right') => void;
}

export const CardSwipeStack: React.FC<CardSwipeStackProps> = ({
  children,
  thresholdDistance = ${thresholdDistance},
  maxRotation = ${maxRotation},
  onSwipe,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > thresholdDistance) {
          const dir = gesture.dx > 0 ? 'right' : 'left';
          Animated.timing(pan, {
            toValue: { x: dir === 'right' ? 500 : -500, y: gesture.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipe?.(dir);
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [\`-\${maxRotation}deg\`, '0deg', \`\${maxRotation}deg\`],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 232,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 24,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'card_swipe_stack.dart',
					language: 'dart',
					description: 'Flutter StatefulWidget Card Swipe Stack with GestureDetector and Matrix4 rotation.',
					code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class CardSwipeStack extends StatefulWidget {
  final Widget child;
  final double thresholdDistance;
  final double maxRotation;
  final Function(String direction)? onSwipe;

  const CardSwipeStack({
    Key? key,
    required this.child,
    this.thresholdDistance = ${thresholdDistance},
    this.maxRotation = ${maxRotation},
    this.onSwipe,
  }) : super(key: key);

  @override
  State<CardSwipeStack> createState() => _CardSwipeStackState();
}

class _CardSwipeStackState extends State<CardSwipeStack> {
  Offset _offset = Offset.zero;

  @override
  Widget build(BuildContext context) {
    final maxRad = widget.maxRotation * (math.pi / 180);
    final angle = (_offset.dx / 200).clamp(-1.0, 1.0) * maxRad;

    return Center(
      child: GestureDetector(
        onPanUpdate: (details) {
          setState(() {
            _offset += details.delta;
          });
        },
        onPanEnd: (details) {
          if (_offset.dx.abs() > widget.thresholdDistance) {
            final dir = _offset.dx > 0 ? 'right' : 'left';
            widget.onSwipe?.call(dir);
          }
          setState(() {
            _offset = Offset.zero;
          });
        },
        child: Transform.translate(
          offset: _offset,
          child: Transform.rotate(
            angle: angle,
            child: Container(
              width: 320,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF27272A)),
                color: const Color(0xFF18181B),
              ),
              padding: const EdgeInsets.all(24),
              child: widget.child,
            ),
          ),
        ),
      ),
    );
  }
}
`,
				},
			];
		}

		default:
			return null;
	}
}
