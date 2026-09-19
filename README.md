# Exhuma

> High-performance React layout primitives, interactive stacking cards, and modular UI architecture.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Exhuma is a modern monorepo delivering reusable, zero-friction UI primitives and layout engines for React and Next.js applications.

---

## 📦 Packages

Exhuma is structured as a modular Turborepo workspace. You can consume packages all-in-one or via standalone scoped imports:

| Package               | Description                                                                             | Status  |
| :-------------------- | :-------------------------------------------------------------------------------------- | :-----: |
| **`@exhuma/core`**    | Complete suite: cards, layouts, and router skeletons in a single tree-shakeable bundle. | `Ready` |
| **`@exhuma/cards`**   | Interactive card micro-interactions, stacking cards, and scroll carousels.              | `Ready` |
| **`@exhuma/layouts`** | High-performance CSS masonry grids, responsive auto-grids, and containers.              | `Ready` |
| **`@exhuma/router`**  | Router skeletons, page layout guards, and transition containers.                        | `Ready` |

---

## 🚀 Quickstart

### 1. All-in-One (`@exhuma/core`)

Install the core package:

```bash
pnpm add @exhuma/core
# or
npm install @exhuma/core
```

Import components with full tree-shaking support:

```tsx
import { StackingCards, CssMasonry, LandingLayout } from '@exhuma/core';

export default function Page() {
  return (
    <LandingLayout>
      <CssMasonry columns={3} gap='1.5rem'>
        {/* Your masonry items */}
      </CssMasonry>
    </LandingLayout>
  );
}
```

### 2. Targeted Standalone Packages

For micro-frontends or strict bundle requirements, install only what you need:

```bash
pnpm add @exhuma/cards
pnpm add @exhuma/layouts
```

---

## ⚡ Framework Compatibility

| Environment                 | Support | Notes                                                                                  |
| :-------------------------- | :-----: | :------------------------------------------------------------------------------------- |
| **Next.js (App Router)**    | ✅ Full | Client-side micro-interactions include `'use client'`; SSR and Server Components safe. |
| **Next.js (Pages Router)**  | ✅ Full | Out-of-the-box hydration support.                                                      |
| **Vite / React 19**         | ✅ Full | Dual ESM & CJS builds with `.d.ts` declaration maps.                                   |
| **React Router v7 / Remix** | ✅ Full | Framework-agnostic styling and lifecycle handling.                                     |

---

## 🛠️ Development

This repository is powered by **Turborepo** and **pnpm**:

```bash
# Clone the repository
git clone https://github.com/SapanMozammel/exhuma.git
cd exhuma

# Install dependencies
pnpm install

# Run build across all workspaces
pnpm run build

# Start demo app
pnpm run dev
```

---

## 📄 License

MIT © [Sapan Mozammel](https://github.com/SapanMozammel)
