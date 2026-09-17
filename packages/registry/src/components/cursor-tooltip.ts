import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const cursorTooltipComponent: UniversalComponent = {
	id: 'cursor-tooltip',
	name: 'Cursor Tooltip',
	slug: 'cursor-tooltip',
	category: 'primitives',
	description: 'Tactile cursor-following tooltip with continuous exponential lerp tracking, boundary viewport collision clamping, and zero Framer Motion dependencies.',
	version: '1.0.0',
	props: [
		{
			name: 'springDamping',
			label: 'Spring Damping',
			type: 'number',
			defaultValue: 22,
			min: 5,
			max: 40,
			step: 1,
			description: 'Exponential smoothing factor for trailing cursor physics.',
		},
	],
	defaultProps: {
		springDamping: 22,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, _options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'cursor-tooltip',
				name: 'Cursor Tooltip',
				slug: 'cursor-tooltip',
				category: 'primitives',
				pascalName: 'CursorTooltip',
				snakeName: 'cursor_tooltip',
				description: 'Tactile cursor-following tooltip with continuous exponential lerp tracking.',
				defaultTailwindClass: 'relative inline-block cursor-pointer',
			},
			flavor,
			props
		);
	},
};
