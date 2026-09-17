import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const infiniteMarqueeComponent: UniversalComponent = {
	id: 'infinite-marquee',
	name: 'Infinite Marquee',
	slug: 'infinite-marquee',
	category: 'layouts',
	description: 'High-performance rAF continuous translation loop with modulo wrap, exponential hover damping, and zero external animation libraries.',
	version: '1.0.0',
	props: [
		{
			name: 'speed',
			label: 'Scroll Speed (px/s)',
			type: 'number',
			defaultValue: 40,
			min: 10,
			max: 200,
			step: 5,
			description: 'Scroll speed in pixels per second.',
		},
		{
			name: 'direction',
			label: 'Direction',
			type: 'select',
			defaultValue: 'left',
			options: [
				{ label: 'Left', value: 'left' },
				{ label: 'Right', value: 'right' },
			],
			description: 'Direction of marquee translation.',
		},
		{
			name: 'pauseOnHover',
			label: 'Pause On Hover',
			type: 'boolean',
			defaultValue: true,
			description: 'Smoothly decelerate to zero when hovered.',
		},
		{
			name: 'gap',
			label: 'Item Gap',
			type: 'string',
			defaultValue: '1.5rem',
			description: 'Spacing between items and repeated tracks.',
		},
	],
	defaultProps: {
		speed: 40,
		direction: 'left',
		pauseOnHover: true,
		gap: '1.5rem',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'infinite-marquee',
				name: 'Infinite Marquee',
				slug: 'infinite-marquee',
				category: 'layouts',
				pascalName: 'InfiniteMarquee',
				snakeName: 'infinite_marquee',
				description: 'High-performance continuous translation loop with modulo wrap.',
				defaultTailwindClass: 'relative flex overflow-hidden select-none w-full py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
			},
			flavor,
			props
		);
	},
};
