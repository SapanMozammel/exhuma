import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const scrollTimelineComponent: UniversalComponent = {
	id: 'scroll-timeline',
	name: 'Scroll Timeline',
	slug: 'scroll-timeline',
	category: 'layouts',
	description: 'Organic serpentine cubic bezier SVG timeline with pure native rAF progress beam and zero external animation libraries.',
	version: '1.0.0',
	props: [
		{
			name: 'curveWidth',
			label: 'Curve Swing (px)',
			type: 'number',
			defaultValue: 24,
			min: 10,
			max: 60,
			step: 2,
			description: 'Horizontal amplitude of bezier swing.',
		},
		{
			name: 'curveHeight',
			label: 'Curve Height (px)',
			type: 'number',
			defaultValue: 40,
			min: 20,
			max: 80,
			step: 5,
			description: 'Vertical transition height of bezier curves.',
		},
		{
			name: 'accentColor',
			label: 'Accent Color',
			type: 'string',
			defaultValue: '#6366f1',
			description: 'Color of the active kinetic progress beam.',
		},
	],
	defaultProps: {
		curveWidth: 24,
		curveHeight: 40,
		accentColor: '#6366f1',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'scroll-timeline',
				name: 'Scroll Timeline',
				slug: 'scroll-timeline',
				category: 'layouts',
				pascalName: 'ScrollTimeline',
				snakeName: 'scroll_timeline',
				description: 'Organic serpentine cubic bezier SVG timeline with pure native rAF progress beam.',
				defaultTailwindClass: 'relative max-w-4xl mx-auto py-16 px-4',
			},
			flavor,
			props,
			options
		);
	},
};
