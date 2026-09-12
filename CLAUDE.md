# CLAUDE.md

Guidance for Claude Code and AI assistants working in the **Exhuma** monorepo.

---

## Commands

```bash
# Everyday development workflow
pnpm run dev          # Start showcase development server (apps/showcase)
pnpm run build:libs   # Build all workspace packages (@exhuma/*) via tsup
pnpm run build        # Build all packages + compile showcase app

# Code quality & verification
pnpm run type:check   # TypeScript check (tsc --noEmit)
pnpm run lint         # ESLint across packages
pnpm run lint:fix     # Auto-fix ESLint issues
pnpm run format       # Prettier format check & write
pnpm run format:all   # Prettier + ESLint auto-fix
pnpm run test         # Run unit tests across packages

# Formatting sync
pnpm run sync         # Synchronize formatting configs via .formatter/sync.js
```

---

## Monorepo Architecture

```
exhuma/
├── packages/
│   ├── cards/        # @exhuma/cards (StackingCards, HorizontalScroller)
│   ├── layouts/      # @exhuma/layouts (CssMasonry, MacyMasonry, AutoGrid, useMacy)
│   ├── router/       # @exhuma/router (LandingLayout, AuthLayout, DashboardLayout, guards)
│   └── core/         # @exhuma/core (Meta package re-exporting all tools)
├── apps/
│   └── showcase/     # Next.js App Router interactive documentation and demo site
└── docs/             # Universal documentation hub
```

---

## Coding Invariants & Conventions

1. **Strict TypeScript**: Every component and hook must export fully documented TypeScript types and interfaces.
2. **Clean Packaging**: Packages build with `tsup` targeting dual ESM (`.mjs`) and CJS (`.cjs`) with auto-generated declaration files (`.d.ts`).
3. **No Legacy Dependencies**: Clean modular React without jQuery, outdated bundling tools, or unused CSS frameworks.
4. **App Router Alignment**: The showcase app follows route group conventions: `(landing)/` for marketing/docs, `access/` for auth previews, `dashboard/` for management/studio previews.
