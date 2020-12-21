module.exports = {
  plugins: ['simple-import-sort'],
  extends: ['prettier', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
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
}
