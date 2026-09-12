import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/cards.ts',
		'src/layouts.ts',
		'src/router.ts',
	],
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	sourcemap: true,
	treeshake: true,
	banner: {
		js: "'use client';",
	},
	outExtension({ format }) {
		return { js: format === 'cjs' ? '.cjs' : '.mjs' };
	},
});
