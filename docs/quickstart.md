# Quickstart Guide

Get started with **Exhuma** in your React or Next.js project in under 60 seconds.

---

## 1. Installation

```bash
# Using pnpm
pnpm add @exhuma/core

# Using npm
npm install @exhuma/core

# Using yarn
yarn add @exhuma/core
```

---

## 2. Using Stacking Cards

Import `StackingCards` from `@exhuma/core` and pass any set of card elements as children:

```tsx
import { StackingCards } from '@exhuma/core';

export default function ExperienceSection() {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-12">Projects</h2>
      <StackingCards topStart={90} topIncrement={20} minScale={0.9}>
        <div className="h-72 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white">Project Alpha</h3>
          <p className="text-sm text-zinc-400 mt-2">Scalable monorepo tooling.</p>
        </div>
        <div className="h-72 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white">Project Beta</h3>
          <p className="text-sm text-zinc-400 mt-2">Zero-dependency masonry layout.</p>
        </div>
      </StackingCards>
    </div>
  );
}
```

---

## 3. Using CSS Masonry

```tsx
import { CssMasonry } from '@exhuma/core';

export default function MasonryFeed({ items }: { items: string[] }) {
  return (
    <CssMasonry columns={{ sm: 1, md: 2, lg: 3 }} gap="1.5rem">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          {item}
        </div>
      ))}
    </CssMasonry>
  );
}
```
