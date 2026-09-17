import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const cssMasonryComponent: UniversalComponent = {
	id: 'css-masonry',
	name: 'CSS Masonry',
	slug: 'css-masonry',
	category: 'layouts',
	description: 'Pure CSS multi-column responsive masonry layout with zero external JavaScript runtime overhead.',
	version: '1.0.0',
	props: [
		{
			name: 'columns',
			label: 'Desktop Columns',
			type: 'number',
			defaultValue: 3,
			min: 1,
			max: 6,
			step: 1,
			description: 'Number of columns on desktop viewports.',
		},
		{
			name: 'gap',
			label: 'Column Gap (px)',
			type: 'number',
			defaultValue: 16,
			min: 8,
			max: 48,
			step: 4,
			description: 'Gap between masonry columns and items.',
		},
	],
	defaultProps: {
		columns: 3,
		gap: 16,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'css-masonry',
				name: 'CSS Masonry',
				slug: 'css-masonry',
				category: 'layouts',
				pascalName: 'CssMasonry',
				snakeName: 'css_masonry',
				description: 'Pure CSS multi-column responsive masonry layout.',
				defaultTailwindClass: 'columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance] w-full space-y-4',
			},
			flavor,
			props
		);
	},
};
