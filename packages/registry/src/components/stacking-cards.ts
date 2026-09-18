import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const stackingCardsComponent: UniversalComponent = {
	id: 'stacking-cards',
	name: 'Stacking Cards',
	slug: 'stacking-cards',
	category: 'cards',
	description: 'Layered 3D sticky stack cards with progressive scroll depth scale decay and reverse scaling exit mechanics.',
	version: '1.0.0',
	props: [
		{
			name: 'topStart',
			label: 'Top Start (px)',
			type: 'number',
			defaultValue: 90,
			min: 40,
			max: 200,
			step: 10,
			description: 'Offset in pixels from top of viewport for the first sticky card.',
		},
		{
			name: 'topIncrement',
			label: 'Top Increment (px)',
			type: 'number',
			defaultValue: 24,
			min: 8,
			max: 64,
			step: 4,
			description: 'Vertical stacking offset in pixels for each subsequent card.',
		},
		{
			name: 'scaleThreshold',
			label: 'Scale Threshold (px)',
			type: 'number',
			defaultValue: 120,
			min: 50,
			max: 400,
			step: 10,
			description: 'Scroll distance threshold over which progressive scaling activates.',
		},
		{
			name: 'minScale',
			label: 'Minimum Scale',
			type: 'number',
			defaultValue: 0.94,
			min: 0.8,
			max: 0.99,
			step: 0.01,
			description: 'Minimum scale applied to the base card in the stack.',
		},
	],
	defaultProps: {
		topStart: 90,
		topIncrement: 24,
		scaleThreshold: 120,
		minScale: 0.94,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'stacking-cards',
				name: 'Stacking Cards',
				slug: 'stacking-cards',
				category: 'cards',
				pascalName: 'StackingCards',
				snakeName: 'stacking_cards',
				description: 'Layered 3D sticky stack cards with progressive scroll depth scale decay.',
				defaultTailwindClass: 'relative flex flex-col gap-8 w-full max-w-2xl mx-auto',
			},
			flavor,
			props,
			options
		);
	},
};
