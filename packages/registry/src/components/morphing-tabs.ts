import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const morphingTabsComponent: UniversalComponent = {
	id: 'morphing-tabs',
	name: 'Morphing Tabs',
	slug: 'morphing-tabs',
	category: 'navigation',
	description: 'Dynamic active rect geometry tracking with a floating spring indicator and roving focus keyboard navigation.',
	version: '1.0.0',
	props: [
		{
			name: 'springStiffness',
			label: 'Spring Stiffness (omega)',
			type: 'number',
			defaultValue: 26,
			min: 10,
			max: 50,
			step: 2,
			description: 'Stiffness of the critically damped spring pill.',
		},
	],
	defaultProps: {
		springStiffness: 26,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'morphing-tabs',
				name: 'Morphing Tabs',
				slug: 'morphing-tabs',
				category: 'navigation',
				pascalName: 'MorphingTabs',
				snakeName: 'morphing_tabs',
				description: 'Dynamic active rect geometry tracking with a floating spring indicator and roving focus.',
				defaultTailwindClass: 'relative flex items-center gap-1 rounded-2xl border border-border bg-muted/40 p-1.5 shadow-sm',
			},
			flavor,
			props,
			options
		);
	},
};
