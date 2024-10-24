module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    indent: ["error", 2],
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", 2],
    "no-multi-spaces": ["error"],
    quotes: ["error", "double"],
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        tabWidth: 2,
        endOfLine: "auto",
      },
    ],
    "react/react-in-jsx-scope": "off",
    '@typescript-eslint/no-explicit-any': 'off',
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
