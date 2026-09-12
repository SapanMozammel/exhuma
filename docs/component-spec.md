# Exhuma Component Specification & Authoring Guide

This specification defines the universal contract required for every component in the Exhuma registry.

## The 13 Ecosystem Contracts

### 1. React (`.tsx`)
- Standard React 18/19 component with `forwardRef`.
- Typed props interface extending `React.HTMLAttributes<HTMLElement>`.
- Class merging using `cn()` utility (`clsx` + `tailwind-merge`).

### 2. Next.js App Router (`.tsx`)
- Ready for Next.js 14/15 App Router.
- Strict server component separation; marked with `'use client'` when browser APIs (`window`, observers) are accessed.
- Hydration mismatch safe.

### 3. Vue.js 3 & Nuxt (`.vue`)
- Single-File Component using `<script setup lang="ts">`.
- Typed props with reactive defaults.
- Scoped or utility-first Tailwind classes.

### 4. Svelte 5 & SvelteKit (`.svelte`)
- Native Svelte 5 component leveraging Runes (`$props()`, `$state()`, `$derived()`).
- Zero-runtime overhead and SvelteKit SSR-ready.

### 5. Angular 18+ (`.ts`)
- Standalone component (`@Component({ standalone: true })`).
- Modern Signals API (`input()`, `computed()`, `signal()`).
- CommonModule imports and template control flow (`@for`, `@if`).

### 6. SolidJS (`.tsx`)
- Fine-grained reactivity primitives (`createSignal`, `mergeProps`, `<For>`).
- JSX syntax matching web standard semantics.

### 7. Astro (`.astro`)
- Native Astro component with TypeScript frontmatter (`---`).
- Zero-JavaScript by default; pure HTML/CSS rendering where possible.
- Accessible slots for customizable card content.

### 8. Laravel Blade (`.blade.php`)
- Anonymous Blade component using `@props([...])`.
- Merges `$attributes` onto root container.
- Clean Blade loops (`@foreach`) and Alpine.js interaction hooks.

### 9. Pure Vanilla JS & Scoped CSS (`.js` + `.css`)
- Autonomous ES6 class: `new ExhumaComponent(element, options)`.
- Explicit lifecycle methods: `mount()`, `update(options)`, `destroy()`.
- Scoped CSS under `@layer exhuma` and `--exhuma-*` CSS custom properties with zero memory leaks.

### 10. WordPress Gutenberg (Block API v3) & Theme PHP
- `block.json`: Conforms to WordPress 6.5+ Block API v3 schema.
- `edit.tsx`: Visual sidebar `InspectorControls` (`PanelBody`, `RangeControl`, `ToggleControl`).
- `save.tsx`: Semantic HTML output with `data-exhuma-*` hooks.
- `functions.php`: Clean PHP enqueue helper snippet.

### 11. Universal Web Component (`<exhuma-*>`)
- Autonomous custom element registered via `customElements.define(...)`.
- Reactive observed attributes (`observedAttributes`, `attributeChangedCallback`).
- Shadow DOM isolation or light DOM mode for Tailwind support.

### 12. React Native / Expo (`.tsx`)
- Native mobile components for iOS & Android (`View`, `Text`, `ScrollView`, `StyleSheet`).
- Compatible with NativeWind (Tailwind CSS for React Native).

### 13. Flutter (`.dart`)
- Idiomatic Dart widgets (`StatelessWidget` / `StatefulWidget`).
- Multiplatform targeting iOS, Android, macOS, Windows, Linux, and Web.
