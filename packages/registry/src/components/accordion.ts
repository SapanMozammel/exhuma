import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const accordionComponent: UniversalComponent = {
	id: 'accordion',
	name: 'Accordion',
	slug: 'accordion',
	category: 'primitives',
	description: 'Zero-jank dynamic height disclosure using CSS Grid 0fr to 1fr interpolation with morphing plus/minus icon and animated gradient border glow.',
	version: '1.0.0',
	props: [
		{
			name: 'mode',
			label: 'Expansion Mode',
			type: 'select',
			defaultValue: 'single',
			options: [
				{ label: 'Single Expand', value: 'single' },
				{ label: 'Multiple Expand', value: 'multiple' },
			],
			description: 'Single auto-collapses other items; multiple allows independent toggles.',
		},
		{
			name: 'duration',
			label: 'Transition Duration (ms)',
			type: 'number',
			defaultValue: 300,
			min: 150,
			max: 600,
			step: 50,
			description: 'CSS Grid height transition speed.',
		},
	],
	defaultProps: {
		mode: 'single',
		duration: 300,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'accordion',
				name: 'Accordion',
				slug: 'accordion',
				category: 'primitives',
				pascalName: 'Accordion',
				snakeName: 'accordion',
				description: 'Zero-jank dynamic height disclosure using CSS Grid 0fr to 1fr interpolation.',
				defaultTailwindClass: 'w-full space-y-3',
			},
			flavor,
			props
		);
	},
};
