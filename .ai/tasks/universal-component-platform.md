# Universal Component Platform & Registry

Task schema: 1
Status: in_progress
Owner: Sapan Mozammel
Risk: medium
Workflow: .ai/core/workflows/implementation.md
Dependencies: none
Owned files: apps/, packages/, docs/, tooling/, tests/, .ai/, .agents/, .cursor/, .github/, .husky/, package.json, tsconfig.json

## Objective

Build Exhuma as an elite, production-grade universal component library and registry platform supporting 8 ecosystems (React, Next.js 15, Vue 3, Astro, Laravel Blade, Vanilla JS, WordPress Gutenberg API v3 + PHP, Universal Web Components), featuring an interactive Studio Workbench and shadcn-compatible CLI registry API.

## Scope

Establish Auterix WI workflow context and Auterix Pro guardrails; configure root monorepo tooling and quality gate checkers following aufnehmen and sapan.dev; implement the Universal Component Model (UCM) registry with 5 canonical components; build the multi-flavor ComponentViewer, DocsSidebar, and /studio workbench; verify all code snippets compile cleanly.

## Acceptance

- Auterix context validator (node .ai/tools/check.mjs) passes without errors or warnings.
- Architecture, configuration, and link checkers pass.
- Monorepo TypeScript type checking passes across node and web workspaces (pnpm typecheck).
- Component registry provides 8 distinct, zero-leak implementations for all canonical components.
- Studio Workbench provides responsive viewports (375px, 768px, 100%), visual prop sliders, and live 8-flavor code synthesis.
- Snippet compiler CI test passes with zero compilation errors.
- Next.js production build (pnpm build) succeeds.

## Evidence

Foundation setup initialized. Auterix core workflows, adapters, pre-commit guardrail hook, and CI verification action installed. Task actively tracked under Auterix WI protocol.

## Handoff

Next step: Author the foundational docs/ files (architecture.md, engineering.md, component-spec.md, provenance.md) and establish root agent entry points (AGENTS.md, CLAUDE.md, .agents/, .cursor/, .github/).
