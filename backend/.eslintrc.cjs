module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script'
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-multi-spaces': ['error'],
    'prefer-const': 'error',
    'eqeqeq': 'error',
    'no-var': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'no-mixed-spaces-and-tabs': 'error'
  }
};
