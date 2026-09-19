import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const bentoGridComponent: UniversalComponent = {
	id: 'bento-grid',
	name: 'Bento Grid',
	slug: 'bento-grid',
	category: 'layouts',
	description: 'Fluid responsive layout engine with dense auto-flow, asymmetric card spans, and subtle kinetic hover glow.',
	version: '1.0.0',
	props: [
		{
			name: 'cols',
			label: 'Columns',
			type: 'number',
			defaultValue: 3,
			min: 1,
			max: 6,
			step: 1,
			description: 'Maximum column count for desktop screens.',
		},
		{
			name: 'gap',
			label: 'Grid Gap',
			type: 'string',
			defaultValue: '1.5rem',
			description: 'Spacing between bento tiles.',
		},
	],
	defaultProps: {
		cols: 3,
		gap: '1.5rem',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'bento-grid',
				name: 'Bento Grid',
				slug: 'bento-grid',
				category: 'layouts',
				pascalName: 'BentoGrid',
				snakeName: 'bento_grid',
				description: 'Fluid responsive layout engine with dense auto-flow and asymmetric spans.',
				defaultTailwindClass: 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[22rem] max-w-7xl mx-auto w-full',
			},
			flavor,
			props,
			options
		);
	},
};
