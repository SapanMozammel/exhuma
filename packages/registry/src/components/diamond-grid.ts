import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const diamondGridComponent: UniversalComponent = {
	id: 'diamond-grid',
	name: 'Diamond Grid',
	slug: 'diamond-grid',
	category: 'layouts',
	description: 'Rhombic symmetrical diamond column distribution [1, 2, 3, 4, 3, 2, 1] with responsive mobile collapse.',
	version: '1.0.0',
	props: [
		{
			name: 'gap',
			label: 'Column Gap',
			type: 'string',
			defaultValue: '0.75vw',
			description: 'Spacing between diamond columns and elements.',
		},
	],
	defaultProps: {
		gap: '0.75vw',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'diamond-grid',
				name: 'Diamond Grid',
				slug: 'diamond-grid',
				category: 'layouts',
				pascalName: 'DiamondGrid',
				snakeName: 'diamond_grid',
				description: 'Rhombic symmetrical diamond column distribution with responsive collapse.',
				defaultTailwindClass: 'flex items-center justify-center w-full max-w-6xl mx-auto py-12 overflow-hidden',
			},
			flavor,
			props
		);
	},
};
