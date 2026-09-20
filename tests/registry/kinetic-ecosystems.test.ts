import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateComponentUsage, getComponentBySlug, SUPPORTED_ECOSYSTEMS, type EcosystemFlavor } from '@exhuma/registry';
import { requiresCoreDependency } from '../../packages/cli/src/commands/add';

const expectedFiles: Record<EcosystemFlavor, { horizontal: string[]; stacking: string[]; tilt: string[] }> = {
	react: { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'], tilt: ['TiltCard.tsx'] },
	nextjs: { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'], tilt: ['TiltCard.tsx'] },
	vue: { horizontal: ['HorizontalScroller.vue'], stacking: ['StackingCards.vue'], tilt: ['TiltCard.vue'] },
	svelte: { horizontal: ['HorizontalScroller.svelte'], stacking: ['StackingCards.svelte'], tilt: ['TiltCard.svelte'] },
	angular: { horizontal: ['horizontal-scroller.component.ts'], stacking: ['stacking-cards.component.ts'], tilt: ['tilt-card.component.ts'] },
	solid: { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'], tilt: ['TiltCard.tsx'] },
	astro: { horizontal: ['HorizontalScroller.astro'], stacking: ['StackingCards.astro'], tilt: ['TiltCard.astro'] },
	blade: { horizontal: ['horizontal-scroller.blade.php'], stacking: ['stacking-cards.blade.php'], tilt: ['tilt-card.blade.php'] },
	vanilla: { horizontal: ['horizontal-scroller.vanilla.js'], stacking: ['stacking-cards.vanilla.js'], tilt: ['tilt-card.vanilla.js'] },
	wordpress: { horizontal: ['block.json', 'render.php'], stacking: ['block.json', 'render.php'], tilt: ['block.json', 'render.php'] },
	webcomponent: { horizontal: ['exhuma-horizontal-scroller.js'], stacking: ['exhuma-stacking-cards.js'], tilt: ['exhuma-tilt-card.js'] },
	'react-native': { horizontal: ['HorizontalScroller.tsx'], stacking: ['StackingCards.tsx'], tilt: ['TiltCard.tsx'] },
	flutter: { horizontal: ['horizontal_scroller.dart'], stacking: ['stacking_cards.dart'], tilt: ['tilt_card.dart'] },
};

describe('kinetic cards ecosystem parity', () => {
	const horizontalScrollerComponent = getComponentBySlug('horizontal-scroller');
	const stackingCardsComponent = getComponentBySlug('stacking-cards');
	const tiltCardComponent = getComponentBySlug('tilt-card');

	if (!horizontalScrollerComponent || !stackingCardsComponent || !tiltCardComponent) {
		throw new Error('Kinetic card components must be registered');
	}

	for (const flavor of SUPPORTED_ECOSYSTEMS) {
		it(`generates the expected source payloads for ${flavor}`, () => {
			const horizontal = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps, { eject: true });
			const stacking = stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps, { eject: true });
			const tilt = tiltCardComponent.generateCode(flavor, tiltCardComponent.defaultProps, { eject: true });

			expect(horizontal.map((file) => file.filename)).toEqual(expectedFiles[flavor].horizontal);
			expect(stacking.map((file) => file.filename)).toEqual(expectedFiles[flavor].stacking);
			expect(tilt.map((file) => file.filename)).toEqual(expectedFiles[flavor].tilt);
			for (const file of [...horizontal, ...stacking, ...tilt]) {
				expect(file.code.trim().length).toBeGreaterThan(100);
			}
		});
	}

	it('keeps the kinetic browser engines frame-coalesced and lifecycle-safe', () => {
		for (const flavor of ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'webcomponent'] as const) {
			const horizontal = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const stacking = stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const tilt = tiltCardComponent.generateCode(flavor, tiltCardComponent.defaultProps, { eject: true })[0]?.code ?? '';

			expect(horizontal).toMatch(/requestAnimationFrame/);
			expect(horizontal).toMatch(/IntersectionObserver/);
			expect(horizontal).toMatch(/cancelAnimationFrame/);
			expect(horizontal).toMatch(/translate3d/);
			expect(stacking).toMatch(/requestAnimationFrame/);
			expect(stacking).toMatch(/IntersectionObserver/);
			expect(stacking).toMatch(/cancelAnimationFrame/);
			expect(stacking).toMatch(/3\s*-\s*2\s*\*/);
			expect(tilt).toMatch(/requestAnimationFrame/);
			expect(tilt).toMatch(/cancelAnimationFrame/);
		}
	});

	it('emits self-consistent quick starts for the repaired ecosystems', () => {
		const horizontalUsage = (flavor: EcosystemFlavor) => generateComponentUsage(horizontalScrollerComponent, flavor, horizontalScrollerComponent.defaultProps).code;
		const stackingFlutter = generateComponentUsage(stackingCardsComponent, 'flutter', stackingCardsComponent.defaultProps).code;
		const tiltUsage = (flavor: EcosystemFlavor) => generateComponentUsage(tiltCardComponent, flavor, tiltCardComponent.defaultProps).code;

		expect(horizontalUsage('angular')).toContain('import { ExhumaHorizontalScrollerComponent }');
		expect(horizontalUsage('astro')).toContain("import HorizontalScroller from '@/components/ui/HorizontalScroller.astro';");
		expect(horizontalUsage('astro')).not.toContain('client:load');
		expect(horizontalUsage('webcomponent')).toContain('<script type="module" src="./exhuma-horizontal-scroller.js"></script>');
		expect(horizontalUsage('vanilla')).toContain("import { initHorizontalScroller } from './horizontal-scroller.vanilla.js';");
		expect(horizontalUsage('react-native')).toContain("import { HorizontalScroller } from './components/HorizontalScroller';");
		expect(horizontalUsage('flutter')).toContain("import 'horizontal_scroller.dart';");
		expect(stackingFlutter).toContain("import 'stacking_cards.dart';");

		expect(tiltUsage('angular')).toContain('import { ExhumaTiltCardComponent }');
		expect(tiltUsage('astro')).toContain("import TiltCard from '@/components/ui/TiltCard.astro';");
		expect(tiltUsage('astro')).not.toContain('client:load');
		expect(tiltUsage('webcomponent')).toContain('<script type="module" src="./exhuma-tilt-card.js"></script>');
		expect(tiltUsage('vanilla')).toContain("import { initTiltCard } from './tilt-card.vanilla.js';");
		expect(tiltUsage('react-native')).toContain("import { TiltCard } from './components/TiltCard';");
		expect(tiltUsage('flutter')).toContain("import 'tilt_card.dart';");
	});

	it('keeps non-React framework sources independent from @exhuma/core', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS.filter((candidate) => candidate !== 'react' && candidate !== 'nextjs')) {
			const files = [
				...horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps),
				...stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps),
				...tiltCardComponent.generateCode(flavor, tiltCardComponent.defaultProps),
			];
			for (const file of files) expect(file.code).not.toContain('@exhuma/core');
			expect(horizontalScrollerComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(stackingCardsComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(tiltCardComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
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
		for (const component of [horizontalScrollerComponent, stackingCardsComponent, tiltCardComponent]) {
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
