import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const animatedSphereComponent: UniversalComponent = {
	id: 'animated-sphere',
	name: 'Animated Sphere',
	slug: 'animated-sphere',
	category: 'primitives',
	description: 'Handcrafted 3D spherical trigonometry on HTML5 2D Canvas with depth sorting and zero Three.js.',
	version: '1.0.0',
	props: [
		{
			name: 'color',
			label: 'Sphere Color',
			type: 'string',
			defaultValue: '#6366f1',
			description: 'Foreground raster color (hex or CSS color string).',
		},
		{
			name: 'speed',
			label: 'Rotation Speed',
			type: 'number',
			defaultValue: 1.0,
			min: 0.2,
			max: 3.0,
			step: 0.1,
			description: 'Multiplier for 3D rotation speed.',
		},
		{
			name: 'radiusScale',
			label: 'Radius Scale',
			type: 'number',
			defaultValue: 0.475,
			min: 0.2,
			max: 0.5,
			step: 0.025,
			description: 'Radius relative to canvas dimension.',
		},
	],
	defaultProps: {
		color: '#6366f1',
		speed: 1.0,
		radiusScale: 0.475,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'animated-sphere',
				name: 'Animated Sphere',
				slug: 'animated-sphere',
				category: 'primitives',
				pascalName: 'AnimatedSphere',
				snakeName: 'animated_sphere',
				description: 'Handcrafted 3D spherical trigonometry on HTML5 2D Canvas.',
				defaultTailwindClass: 'relative flex items-center justify-center overflow-hidden rounded-2xl bg-card border border-border p-4 shadow-sm',
			},
			flavor,
			props
		);
	},
};
