import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from './.prettierrc.json' assert { type: 'json' };
import tseslint from 'typescript-eslint';

export default [
    ...tseslint.config({
        files: ['src/**/*.ts'],
        rules: {
            'prettier/prettier': ['error', prettierConfig],
        },
    }),
    {
        files: ['**/*.ts'],
        plugins: {
            prettier: eslintPluginPrettier,
        },
    }, {
        ignores: ['dist', 'node_modules'],
    }
];
