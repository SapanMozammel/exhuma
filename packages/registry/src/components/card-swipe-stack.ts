import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const cardSwipeStackComponent: UniversalComponent = {
	id: 'card-swipe-stack',
	name: 'Card Swipe Stack',
	slug: 'card-swipe-stack',
	category: 'cards',
	description: 'Velocity-sensitive multi-card swipe stack with Euler angular rotation, circular velocity ring buffer, and zero external animation libraries.',
	version: '1.0.0',
	props: [
		{
			name: 'thresholdDistance',
			label: 'Swipe Threshold (px)',
			type: 'number',
			defaultValue: 120,
			min: 60,
			max: 240,
			step: 10,
			description: 'Minimum drag distance to trigger a card dismiss.',
		},
		{
			name: 'maxRotation',
			label: 'Max Rotation (deg)',
			type: 'number',
			defaultValue: 20,
			min: 5,
			max: 45,
			step: 1,
			description: 'Maximum angular rotation coupled to horizontal translation.',
		},
		{
			name: 'scaleStep',
			label: 'Scale Step',
			type: 'number',
			defaultValue: 0.05,
			min: 0.02,
			max: 0.1,
			step: 0.01,
			description: 'Scale reduction step between consecutive cards in the stack.',
		},
	],
	defaultProps: {
		thresholdDistance: 120,
		maxRotation: 20,
		scaleStep: 0.05,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'card-swipe-stack',
				name: 'Card Swipe Stack',
				slug: 'card-swipe-stack',
				category: 'cards',
				pascalName: 'CardSwipeStack',
				snakeName: 'card_swipe_stack',
				description: 'Velocity-sensitive multi-card swipe stack with Euler angular rotation.',
				defaultTailwindClass: 'relative flex items-center justify-center min-h-[420px] w-full',
			},
			flavor,
			props
		);
	},
};
