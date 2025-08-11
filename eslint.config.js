const { FlatESLintConfigItem } = require('eslint')
const tsParser = require('@typescript-eslint/parser')

/** @type {FlatESLintConfigItem[]} */
const config = [
  {
    ignores: [
      '.eslintrc.js',
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          singleQuote: true,
          semi: false,
          useTabs: false,
          bracketSpacing: true,
          bracketSameLine: false,
          printWidth: 80,
          tabWidth: 2,
          endOfLine: 'auto',
          arrowParens: 'always',
          quoteProps: 'as-needed',
        },
      ],
    },
  },
]

module.exports = config
