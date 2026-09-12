# Universal Agent Instruction Protocol

This repository is **Exhuma**, a modern multi-package React monorepo unifying tactile cards, layout engines, and routing architecture.

---

## Core Invariants

1. **Deterministic Build Pipeline**: Package builds must be runnable via `pnpm run build:libs` without side effects or uncommitted artifacts.
2. **Framework Compatibility**: Packages are built for React 18 and React 19. All DOM access must handle SSR gracefully (`typeof window !== 'undefined'`) and clean up observers and event listeners on unmount.
3. **Multi-tier Context Loading**:
   - Package-level tasks modify files exclusively within `packages/<name>/`.
   - Showcase tasks modify files within `apps/showcase/`.
   - Never run global install commands (`npm -g` or `pip -g`). Always use `pnpm` workspaces.
4. **Verification Gate**: Before marking any refactoring or feature complete:
   - `pnpm run type:check` must pass with zero diagnostic errors.
   - `pnpm run build:libs` must successfully compile ESM and CJS bundles into `dist/`.
