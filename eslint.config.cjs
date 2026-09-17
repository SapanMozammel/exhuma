const nextConfig = require('eslint-config-next/core-web-vitals');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const typescriptParser = require('@typescript-eslint/parser');
const unicornPlugin = require('eslint-plugin-unicorn').default ?? require('eslint-plugin-unicorn');

// Prettier options from .formatter/.prettierrc.cjs (strip Prettier-only keys not valid in ESLint rule)
const { plugins: _p, overrides: _o, ...prettierOptions } = require('./.formatter/.prettierrc.cjs');

// Tailwind class options for eslint-plugin-better-tailwindcss — mirror VS Code's tailwindCSS.classFunctions
// and tailwindCSS.experimental.configFile, so CLI lint surfaces the exact diagnostics the IDE shows.
const tailwindClassOptions = {
	callees: ['cn', 'cva', 'tv', 'clsx'],
	attributes: ['className', 'class'],
	entryPoint: 'src/styles/global.scss',
};

// Async IIFE: eslint-plugin-better-tailwindcss ships ESM-only, and Node 20 cannot `require()` ESM.
module.exports = (async () => {
	const betterTailwindcss = (await import('eslint-plugin-better-tailwindcss')).default;

	return [
	// Next.js core-web-vitals flat config (includes React, React Hooks, import, a11y, @next rules)
	...Object.values(nextConfig),

	// TypeScript + Prettier layer
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			prettier: prettierPlugin,
			unicorn: unicornPlugin,
			'better-tailwindcss': betterTailwindcss,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: 2022,
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		rules: {
			// Prettier — reads options from .formatter/.prettierrc.cjs
			'prettier/prettier': ['error', prettierOptions],

			// Code quality
			'max-len': ['error', {
				code: 220,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreComments: true,
			}],
			'no-console': 'warn',
			'no-debugger': 'error',
			'prefer-const': 'error',
			'no-var': 'error',
			'eqeqeq': ['error', 'always'],
			'curly': ['error', 'all'],

			// React
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react/jsx-key': 'error',
			'react/jsx-no-duplicate-props': 'error',
			'react/jsx-no-undef': 'error',
			'react/jsx-no-target-blank': 'error',
			'react/no-unused-state': 'warn',
			'react/self-closing-comp': 'error',
			'react/no-unescaped-entities': 'off',

			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// React Compiler rules (react-hooks v7) — project does not use React Compiler
			'react-hooks/immutability': 'off',
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/refs': 'off',
			'react-hooks/preserve-manual-memoization': 'off',

			// Import
			'no-duplicate-imports': 'error',
			'import/no-unresolved': 'off',

			// Next.js
			'@next/next/no-html-link-for-pages': 'error',
			'@next/next/no-img-element': 'warn',

			// Best practices
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
			'no-script-url': 'error',
			'no-alert': 'warn',
			'object-shorthand': 'error',
			'prefer-template': 'error',

			// Filename casing (sapan H2-B convention): kebab-case for utility/helper files,
			// but also allow PascalCase (component files matching their component name,
			// e.g. StackingCards/StackingCards.tsx) and camelCase (hook files, e.g. useMacy.ts)
			// — both are standard React conventions already used consistently across this codebase.
			'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true, camelCase: true } }],

			// Tailwind diagnostics — parity with bradlc.vscode-tailwindcss IDE flags
			// suggestCanonicalClasses (autofixable): three sub-cases
			//   1a — !utility → utility! position fix
			'better-tailwindcss/enforce-consistent-important-position': ['error', tailwindClassOptions],
			//   1b — v3 aliases (flex-shrink, bg-gradient-to-*, *-opacity-N, etc.)
			'better-tailwindcss/no-deprecated-classes': ['error', tailwindClassOptions],
			//   1c — arbitrary-property hints + shorthand merges (h-full w-full → size-full, bg-[size:..] → bg-size-[..], etc.)
			'better-tailwindcss/enforce-canonical-classes': ['error', tailwindClassOptions],
			// cssConflict (report-only — intent inference required): duplicate-property utilities in one className
			'better-tailwindcss/no-conflicting-classes': ['warn', tailwindClassOptions],

			// Disable conflicting prettier rules
			...prettierConfig.rules,
		},
	},

	// JS files — no typed linting
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		plugins: { prettier: prettierPlugin },
		rules: {
			'prettier/prettier': ['error'],
			'no-console': 'warn',
			'prefer-const': 'error',
			'no-var': 'error',
		},
	},

	{
		files: ['e2e/**/*.ts', 'playwright.config.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: './tsconfig.e2e.json',
			},
			globals: {
				console: 'readonly',
				process: 'readonly',
			},
		},
		rules: {
			'no-console': 'off',
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
			'react-hooks/rules-of-hooks': 'off',
			'@next/next/no-html-link-for-pages': 'off',
		},
	},

	// Ignores
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'dist/**',
			'**/*.min.js',
			'**/*.min.css',
			'coverage/**',
			'.cache/**',
			'public/**',
			'src/types/graphql/**',
		],
	},
];
})();