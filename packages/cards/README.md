# @exhuma/cards

Tactile, physics-driven interactive cards and horizontal rail scrollers for modern React applications. Part of the **Exhuma** developer suite.

---

## Installation

```bash
pnpm add @exhuma/cards
# or
npm install @exhuma/cards
```

---

## Features

- **`HorizontalScroller`**: Converts natural window vertical scroll into seamless horizontal rail translation. Handles dynamic content sizing, ResizeObservers, and touch gestures.
- **`StackingCards`**: 3D layered stacking cards effect with depth decay scaling, sticky threshold positioning, and smooth scroll interpolation.
- **Full TypeScript**: Strong typing and SSR-safe (`'use client'`).

---

## Quick Usage

### Horizontal Rail Scroller

```tsx
import { HorizontalScroller } from '@exhuma/cards';

export default function Showcase() {
  return (
    <HorizontalScroller speed={0.8}>
      <div className="w-80 h-96 bg-zinc-900 rounded-xl p-6">Card 1</div>
      <div className="w-80 h-96 bg-zinc-900 rounded-xl p-6">Card 2</div>
      <div className="w-80 h-96 bg-zinc-900 rounded-xl p-6">Card 3</div>
    </HorizontalScroller>
  );
}
```

### Stacking Cards

```tsx
import { StackingCards } from '@exhuma/cards';

export default function Features() {
  return (
    <StackingCards topStart={100} topIncrement={24} minScale={0.88}>
      <div className="h-80 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        Feature 1: Autonomous Layouts
      </div>
      <div className="h-80 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        Feature 2: Subterranean Physics
      </div>
      <div className="h-80 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        Feature 3: Unified Developer Flow
      </div>
    </StackingCards>
  );
}
```
