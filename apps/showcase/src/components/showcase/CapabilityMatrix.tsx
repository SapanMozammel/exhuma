import * as React from 'react';
import {
  IconCheck as Check,
  IconShieldCheck as ShieldCheck,
  IconFileCode as FileCode,
  IconStack2 as Layers,
  IconCpu as Cpu,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

interface EcosystemCapability {
	id: string;
	name: string;
	extension: string;
	reactivity: string;
	hydration: string;
	teardown: string;
	path: string;
}

const CAPABILITIES: EcosystemCapability[] = [
	{
		id: 'react',
		name: 'React 18 / 19',
		extension: '.tsx',
		reactivity: 'Hooks & Refs (useRef)',
		hydration: 'Standard Client Mount',
		teardown: 'useEffect cleanup return',
		path: 'src/components/ui',
	},
	{
		id: 'nextjs',
		name: 'Next.js 15 (App Router)',
		extension: '.tsx',
		reactivity: 'RSC + "use client" Directive',
		hydration: 'Server Hydrated Island',
		teardown: 'useEffect unmount',
		path: 'components/ui',
	},
	{
		id: 'vue',
		name: 'Vue 3 / Nuxt 3',
		extension: '.vue',
		reactivity: 'Composition API (ref, computed)',
		hydration: 'Client Island (<ClientOnly>)',
		teardown: 'onBeforeUnmount lifecycle',
		path: 'components',
	},
	{
		id: 'svelte',
		name: 'Svelte 5',
		extension: '.svelte',
		reactivity: 'Svelte 5 Runes ($state, $effect)',
		hydration: 'Micro-Island Hydration',
		teardown: '$effect destructor return',
		path: 'src/lib/components',
	},
	{
		id: 'angular',
		name: 'Angular 18+',
		extension: '.component.ts',
		reactivity: 'Signals (signal, computed)',
		hydration: 'Standalone Hydration',
		teardown: 'ngOnDestroy lifecycle',
		path: 'src/app/components',
	},
	{
		id: 'solid',
		name: 'SolidJS',
		extension: '.tsx',
		reactivity: 'Fine-grained Signals (createSignal)',
		hydration: 'Reactive Primitive Hydration',
		teardown: 'onCleanup handler',
		path: 'src/components',
	},
	{
		id: 'astro',
		name: 'Astro',
		extension: '.astro',
		reactivity: 'Zero-JS SSR or Client Script',
		hydration: 'Client Directives (client:load)',
		teardown: 'window/DOM event detachment',
		path: 'src/components',
	},
	{
		id: 'blade',
		name: 'Laravel Blade',
		extension: '.blade.php',
		reactivity: 'Alpine.js (x-data) / Vanilla',
		hydration: 'Server-Rendered PHP View',
		teardown: 'DOM observer teardown',
		path: 'resources/views/components',
	},
	{
		id: 'vanilla',
		name: 'Vanilla JS + CSS',
		extension: '.js + .css',
		reactivity: 'Direct DOM MutationObserver',
		hydration: 'Immediate DOM Attachment',
		teardown: 'Explicit instance.destroy()',
		path: 'src/components',
	},
	{
		id: 'wordpress',
		name: 'WordPress Gutenberg',
		extension: 'block.json / edit.tsx',
		reactivity: 'Block Attributes & State',
		hydration: 'Gutenberg Editor / PHP Save',
		teardown: 'Unmount block handler',
		path: 'src/blocks',
	},
	{
		id: 'webcomponent',
		name: 'Web Components',
		extension: '<exhuma-*>.js',
		reactivity: 'Custom Elements v1 + Shadow DOM',
		hydration: 'Custom Element Definition',
		teardown: 'disconnectedCallback()',
		path: 'src/components',
	},
	{
		id: 'react-native',
		name: 'React Native / Expo',
		extension: '.tsx',
		reactivity: 'Animated API / PanResponder',
		hydration: 'Native UI Thread Driver',
		teardown: 'useEffect unmount cleanup',
		path: 'components',
	},
	{
		id: 'flutter',
		name: 'Flutter',
		extension: '.dart',
		reactivity: 'StatefulWidget (setState)',
		hydration: 'Flutter Engine Render Tree',
		teardown: 'dispose() lifecycle method',
		path: 'lib/widgets',
	},
];

export function CapabilityMatrix() {
	return (
		<div className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-colors">
			<div className="border-b border-border bg-muted/30 p-6">
				<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
					<Cpu className="h-4 w-4" />
					<span>Universal Architecture Matrix</span>
				</div>
				<h3 className="text-xl font-bold tracking-tight text-foreground">
					The 13-Ecosystem Engineering Contract
				</h3>
				<p className="text-xs text-muted-foreground mt-1 max-w-2xl">
					Every Exhuma canonical component is re-authored from fundamental mathematical principles for each target framework. No polyfills, no cross-compilation overhead, no memory leaks.
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-border bg-muted/20 text-muted-foreground font-mono">
							<th className="py-3 px-4 font-semibold">Ecosystem</th>
							<th className="py-3 px-4 font-semibold">File Format</th>
							<th className="py-3 px-4 font-semibold">Reactivity Engine</th>
							<th className="py-3 px-4 font-semibold">Hydration Model</th>
							<th className="py-3 px-4 font-semibold">Memory Teardown</th>
							<th className="py-3 px-4 font-semibold">Default Destination</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{CAPABILITIES.map((cap) => (
							<tr
								key={cap.id}
								className="hover:bg-muted/40 transition-colors font-mono"
							>
								<td className="py-3 px-4 font-sans font-semibold text-foreground whitespace-nowrap">
									{cap.name}
								</td>
								<td className="py-3 px-4 whitespace-nowrap">
									<span className="kbd text-[10px] text-primary font-bold">
										{cap.extension}
									</span>
								</td>
								<td className="py-3 px-4 font-sans text-muted-foreground whitespace-nowrap">
									{cap.reactivity}
								</td>
								<td className="py-3 px-4 font-sans text-muted-foreground whitespace-nowrap">
									{cap.hydration}
								</td>
								<td className="py-3 px-4 whitespace-nowrap">
									<div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
										<ShieldCheck className="h-3.5 w-3.5 shrink-0" />
										<span>{cap.teardown}</span>
									</div>
								</td>
								<td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
									{cap.path}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default CapabilityMatrix;
