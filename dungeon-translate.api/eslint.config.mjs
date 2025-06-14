import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import stylistic from "@stylistic/eslint-plugin";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic/ts": stylisticTs,
      "@stylistic": stylistic
    },
    rules: {
      "arrow-body-style": ["warn", "always"],
      "indent": ["warn", 2],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-redeclare": "warn",
      "no-control-regex": "off",
      "no-cond-assign": "off",
      "no-fallthrough": "off",
      "no-prototype-builtins": "off",
      "no-empty": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@stylistic/ts/quotes": ["warn", "double", { "allowTemplateLiterals": true }],
      "@stylistic/ts/semi": ["warn", "always"],
      "no-trailing-spaces": ["warn", { "skipBlankLines": false }]
    }
  }
];