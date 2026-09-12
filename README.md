# Exhuma

**Tactile Cards. Fluid Layouts. Foundational Routing.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.base.json)
[![React Version](https://img.shields.io/badge/React-18%20%2F%2019-sky)](package.json)
[![Monorepo](https://img.shields.io/badge/pnpm-Workspaces-orange)](pnpm-workspace.yaml)
[![Stars](https://img.shields.io/github/stars/SapanMozammel/react-toolkit?style=social)](https://github.com/SapanMozammel/react-toolkit)

Exhuma is an autonomous, high-performance frontend engineering suite for React and Next.js. It unifies physics-driven tactile interactions (stacking cards, horizontal rail scrollers), zero-dependency layout engines (CSS column masonry, balanced Macy height calculations, dynamic AutoGrids), and production-grade routing skeletons into a cohesive, modular ecosystem.

> 📖 **[Explore the Documentation Hub (docs/)](docs/README.md)** | **[Quickstart Guide](docs/quickstart.md)** | **[Package Consumption (USAGE.md)](USAGE.md)**

---

## 📦 Packages

| Package | Version | Description |
| :--- | :--- | :--- |
| **[`@exhuma/core`](packages/core)** | `0.1.0` | **Unified Flagship SDK** — One install providing complete access to all cards, layouts, and routing tools. |
| **[`@exhuma/cards`](packages/cards)** | `0.1.0` | **Tactile Interactions** — Physics-driven 3D stacking cards, depth decay scaling, and horizontal rail scrollers. |
| **[`@exhuma/layouts`](packages/layouts)** | `0.1.0` | **Layout Engines** — Zero-dependency CSS column-count masonry, balanced Macy height calculations, and AutoGrids. |
| **[`@exhuma/router`](packages/router)** | `0.1.0` | **Routing Architecture** — Responsive landing, split-screen auth frames, dashboard skeletons, and route guards. |

---

## ⚡ 60-Second Quickstart

### Install the Unified Suite

```bash
pnpm add @exhuma/core
# or
npm install @exhuma/core
```

### Stacking Cards

```tsx
import { StackingCards } from '@exhuma/core';

export default function Features() {
  return (
    <StackingCards topStart={100} topIncrement={24} minScale={0.88}>
      <div className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
        Card Layer 01
      </div>
      <div className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
        Card Layer 02
      </div>
      <div className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
        Card Layer 03
      </div>
    </StackingCards>
  );
}
```

### Zero-Dependency CSS Masonry

```tsx
import { CssMasonry } from '@exhuma/core';

export default function Gallery() {
  return (
    <CssMasonry columns={{ sm: 1, md: 2, lg: 3 }} gap="1.5rem">
      <div className="h-48 rounded-xl bg-zinc-900 p-6">Card A</div>
      <div className="h-72 rounded-xl bg-zinc-900 p-6">Card B</div>
      <div className="h-56 rounded-xl bg-zinc-900 p-6">Card C</div>
    </CssMasonry>
  );
}
```

---

## 🛠️ Monorepo Development Commands

Following the engineering standards of `sapan.dev`, `aufnehmen`, and `auterix`:

```bash
# Everyday workflow
pnpm run dev          # Start showcase development server (apps/showcase)
pnpm run build:libs   # Build all workspace packages (@exhuma/*) via tsup
pnpm run build        # Build all packages + compile showcase app

# Code quality & verification
pnpm run type:check   # TypeScript validation (tsc --noEmit)
pnpm run lint         # ESLint across packages
pnpm run lint:fix     # Auto-fix linting issues
pnpm run format       # Prettier code formatting
pnpm run format:all   # Prettier + ESLint auto-fix
pnpm run test         # Run unit test suites
```

---

## 📄 License

MIT © [Sapan Mozammel](https://github.com/SapanMozammel)
