import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['packages/*/src/**/*.{ts,tsx}', 'packages/*/tests/**/*.{ts,tsx}'],
		plugins: {
			prettier: prettierPlugin,
			'@typescript-eslint': typescriptPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		settings: {
			react: { version: 'detect' },
		},
		rules: {
			'prettier/prettier': 'error',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
	},
	prettierConfig,
];
