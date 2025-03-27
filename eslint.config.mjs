import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsEslint from 'typescript-eslint'
import onlyWarn from 'eslint-plugin-only-warn'
import pluginCypress from 'eslint-plugin-cypress/flat';

export default tsEslint.config(
    {
        ignores: [
            'dist',
            'node_modules',
            'coverage'
        ]
    },
    pluginCypress.configs.recommended,
    {
        extends: [
            js.configs.recommended,
            ...tsEslint.configs.recommended
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'only-warn': onlyWarn
        },
        rules: {
            // Common rules
            "no-console": ["warn", { allow: ["warn", "error"] }],
            'semi': "warn",
            'indent': ['warn', 4, { "SwitchCase": 1 }],
            'quotes': ['warn', 'single'],
            'jsx-quotes': ['warn', 'prefer-double'],
            'eol-last': ['warn', 'always'],
            // Typescript
            "@typescript-eslint/no-unused-vars": ['warn', { "argsIgnorePattern": "^_", }],
            '@typescript-eslint/no-empty-object-type': 'off',
            "@typescript-eslint/no-explicit-any": "off",
            // React
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            ...reactHooks.configs.recommended.rules,
        },
    },
)
