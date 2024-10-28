module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended", // Enable TypeScript linting rules
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-multi-spaces": ["error"],
    "prefer-const": "error",
    eqeqeq: "error",
    "no-var": "error",
    semi: ["error", "always"],
    quotes: ["error", "double"],
    indent: ["error", 2],
    "no-mixed-spaces-and-tabs": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error"],
  },
};
