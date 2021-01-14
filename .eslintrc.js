module.exports = {
  plugins: ['eslint-plugin-tsdoc', 'simple-import-sort'],
  extends: ['prettier', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
      },
    ],
    'simple-import-sort/imports': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        'tsdoc/syntax': 'error',
      },
    },
  ],
}
