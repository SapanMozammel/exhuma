import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateComponentUsage, getComponentBySlug, SUPPORTED_ECOSYSTEMS, type EcosystemFlavor } from '@exhuma/registry';
import { requiresCoreDependency } from '../../packages/cli/src/commands/add';

const expectedFiles: Record<EcosystemFlavor, { horizontal: string[]; stacking: string[] }> = {
	react: { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'] },
	nextjs: { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'] },
	vue: { horizontal: ['HorizontalScroller.vue'], stacking: ['StackingCards.vue'] },
	svelte: { horizontal: ['HorizontalScroller.svelte'], stacking: ['StackingCards.svelte'] },
	angular: { horizontal: ['horizontal-scroller.component.ts'], stacking: ['stacking-cards.component.ts'] },
	solid: { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'] },
	astro: { horizontal: ['HorizontalScroller.astro'], stacking: ['StackingCards.astro'] },
	blade: { horizontal: ['horizontal-scroller.blade.php'], stacking: ['stacking-cards.blade.php'] },
	vanilla: { horizontal: ['horizontal-scroller.vanilla.js'], stacking: ['stacking-cards.vanilla.js'] },
	wordpress: { horizontal: ['block.json', 'render.php'], stacking: ['block.json', 'render.php'] },
	webcomponent: { horizontal: ['exhuma-horizontal-scroller.js'], stacking: ['exhuma-stacking-cards.js'] },
	'react-native': { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'] },
	flutter: { horizontal: ['horizontal_scroller.dart'], stacking: ['stacking_cards.dart'] },
};

describe('kinetic cards ecosystem parity', () => {
	const horizontalScrollerComponent = getComponentBySlug('horizontal-scroller');
	const stackingCardsComponent = getComponentBySlug('stacking-cards');

	if (!horizontalScrollerComponent || !stackingCardsComponent) {
		throw new Error('Kinetic card components must be registered');
	}

	for (const flavor of SUPPORTED_ECOSYSTEMS) {
		it(`generates the expected source payloads for ${flavor}`, () => {
			const horizontal = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps, { eject: true });
			const stacking = stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps, { eject: true });

			expect(horizontal.map((file) => file.filename)).toEqual(expectedFiles[flavor].horizontal);
			expect(stacking.map((file) => file.filename)).toEqual(expectedFiles[flavor].stacking);
			for (const file of [...horizontal, ...stacking]) {
				expect(file.code.trim().length).toBeGreaterThan(100);
			}
		});
	}

	it('keeps the kinetic browser engines frame-coalesced and lifecycle-safe', () => {
		for (const flavor of ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'webcomponent'] as const) {
			const horizontal = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const stacking = stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps, { eject: true })[0]?.code ?? '';

			expect(horizontal).toMatch(/requestAnimationFrame/);
			expect(horizontal).toMatch(/IntersectionObserver/);
			expect(horizontal).toMatch(/cancelAnimationFrame/);
			expect(horizontal).toMatch(/translate3d/);
			expect(stacking).toMatch(/requestAnimationFrame/);
			expect(stacking).toMatch(/IntersectionObserver/);
			expect(stacking).toMatch(/cancelAnimationFrame/);
			expect(stacking).toMatch(/3\s*-\s*2\s*\*/);
		}
	});

	it('emits self-consistent quick starts for the repaired ecosystems', () => {
		const horizontalUsage = (flavor: EcosystemFlavor) => generateComponentUsage(horizontalScrollerComponent, flavor, horizontalScrollerComponent.defaultProps).code;
		const stackingFlutter = generateComponentUsage(stackingCardsComponent, 'flutter', stackingCardsComponent.defaultProps).code;

		expect(horizontalUsage('angular')).toContain('import { ExhumaHorizontalScrollerComponent }');
		expect(horizontalUsage('astro')).toContain("import HorizontalScroller from '@/components/ui/HorizontalScroller.astro';");
		expect(horizontalUsage('astro')).not.toContain('client:load');
		expect(horizontalUsage('webcomponent')).toContain('<script type="module" src="./exhuma-horizontal-scroller.js"></script>');
		expect(horizontalUsage('vanilla')).toContain("import { initHorizontalScroller } from './horizontal-scroller.vanilla.js';");
		expect(horizontalUsage('react-native')).toContain("import { HorizontalScroller } from './components/HorizontalScroller';");
		expect(horizontalUsage('flutter')).toContain("import 'horizontal_scroller.dart';");
		expect(stackingFlutter).toContain("import 'stacking_cards.dart';");
	});

	it('keeps non-React framework sources independent from @exhuma/core', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS.filter((candidate) => candidate !== 'react' && candidate !== 'nextjs')) {
			const files = [...horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps), ...stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps)];
			for (const file of files) expect(file.code).not.toContain('@exhuma/core');
			expect(horizontalScrollerComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(stackingCardsComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
		}
	});

	it('applies numeric card widths in generated browser framework sources', () => {
		for (const flavor of ['vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'webcomponent'] as const) {
			const source = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps)[0]?.code ?? '';
			expect(source).toContain('/^\\d+$/');
			expect(source).toMatch(/style\.width\s*=/);
		}
	});

	it('keeps published kinetic registry artifacts synchronized with source generation', () => {
		for (const component of [horizontalScrollerComponent, stackingCardsComponent]) {
			const artifactPath = resolve(process.cwd(), 'apps/showcase/public/registry', `${component.slug}.json`);
			const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as { flavors: Record<EcosystemFlavor, Array<{ filename: string; code: string }>> };
			for (const flavor of SUPPORTED_ECOSYSTEMS) {
				expect(artifact.flavors[flavor]).toEqual(component.generateCode(flavor, component.defaultProps));
			}
		}
	});

	it('installs @exhuma/core only for React-based web flavors', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			expect(requiresCoreDependency(flavor)).toBe(flavor === 'react' || flavor === 'nextjs');
		}
	});
});
