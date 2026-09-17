import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const stickyParallaxComponent: UniversalComponent = {
	id: 'sticky-parallax',
	name: 'Sticky Parallax Scroll',
	slug: 'sticky-parallax',
	category: 'layouts',
	description: 'Sticky viewport rail with multi-speed differential layer transformations driven by scroll delta.',
	version: '1.0.0',
	props: [
		{
			name: 'trackHeight',
			label: 'Track Height',
			type: 'string',
			defaultValue: '250vh',
			description: 'Total scroll track height controlling scroll duration.',
		},
	],
	defaultProps: {
		trackHeight: '250vh',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'sticky-parallax',
				name: 'Sticky Parallax Scroll',
				slug: 'sticky-parallax',
				category: 'layouts',
				pascalName: 'StickyParallaxScroll',
				snakeName: 'sticky_parallax_scroll',
				description: 'Sticky viewport rail with multi-speed differential layer transformations.',
				defaultTailwindClass: 'relative w-full overflow-hidden',
			},
			flavor,
			props
		);
	},
};
