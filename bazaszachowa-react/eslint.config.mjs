import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactHooksExtra from "eslint-plugin-react-hooks-extra";
import reactDom from "eslint-plugin-react-dom";
import reactNamingConvention from "eslint-plugin-react-naming-convention";
import reactWebApi from "eslint-plugin-react-web-api";
import reactPerf from "eslint-plugin-react-perf";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import sonarjs from "eslint-plugin-sonarjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import i18next from "eslint-plugin-i18next";
import * as regexpPlugin from "eslint-plugin-regexp";
import pluginLingui from "eslint-plugin-lingui";
import reactRefresh from "eslint-plugin-react-refresh";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const extendedRules = fixupConfigRules(
  compat.extends(
    "plugin:jsx-a11y/recommended",
    "plugin:jsx-a11y/strict",
    "plugin:no-unsanitized/recommended-legacy",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-perf/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:perfectionist/recommended-alphabetical-legacy",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:perfectionist/recommended-alphabetical-legacy",
    "plugin:sonarjs/recommended-legacy",
  ),
);

const plugins = {
  "jsx-a11y": fixupPluginRules(jsxA11Y),
  react: fixupPluginRules(reactPlugin),
  "react-hooks": fixupPluginRules(reactHooks),
  "react-hooks-extra": reactHooksExtra,
  "react-dom": reactDom,
  "react-naming-convention": reactNamingConvention,
  "react-web-api": reactWebApi,
  "react-perf": fixupPluginRules(reactPerf),
  perfectionist: fixupPluginRules(perfectionist),
  promise: fixupPluginRules(promise),
  sonarjs: fixupPluginRules(sonarjs),
  unicorn: eslintPluginUnicorn,
};

const languageOptions = {
  globals: globals.builtin,
  ecmaVersion: 2023,
  sourceType: "module",

  parserOptions: {
    project: "./tsconfig.app.json",
  },
};

const rules = {
  ...eslintPluginUnicorn.configs.recommended.rules,
  "jsx-a11y/no-aria-hidden-on-focusable": "error",
  "jsx-a11y/prefer-tag-over-role": "error",
  "sonarjs/cognitive-complexity": "off",
  "sonarjs/different-types-comparison": "off",
  "sonarjs/table-header": "off",
  "unicorn/number-literal-case": "off",
  "unicorn/string-content": "error",
  "unicorn/no-unused-properties": "error",
  "unicorn/custom-error-definition": "error",
  "unicorn/consistent-destructuring": "error",
  "unicorn/better-regex": "error",
  "unicorn/no-nested-ternary": "off",
  "unicorn/filename-case": "off",
  "unicorn/no-null": "off",
  "unicorn/prefer-json-parse-buffer": "error",
  "no-unsanitized/method": "error",
  "no-unsanitized/property": "error",
  "promise/always-return": "off",
  "promise/catch-or-return": "off",
  "promise/prefer-catch": "error",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-floating-promises": "off",
  "@typescript-eslint/prefer-optional-chain": "error",
  "@typescript-eslint/no-unnecessary-type-arguments": "error",
  "@typescript-eslint/prefer-nullish-coalescing": "off",
  "@typescript-eslint/dot-notation": "error",
  "@typescript-eslint/no-empty-function": "off",
  "@typescript-eslint/no-non-null-assertion": "off",

  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],

  "@typescript-eslint/array-type": "error",
  "@typescript-eslint/consistent-generic-constructors": [
    "error",
    "constructor",
  ],
  "@typescript-eslint/consistent-indexed-object-style": "error",
  "@typescript-eslint/consistent-type-definitions": "error",
  "@typescript-eslint/explicit-member-accessibility": "error",
  "@typescript-eslint/no-unnecessary-condition": "off",
  "@typescript-eslint/no-unnecessary-qualifier": "error",
  "@typescript-eslint/prefer-for-of": "error",
  "react-web-api/no-leaked-event-listener": "error",
  "react-web-api/no-leaked-interval": "error",
  "react-web-api/no-leaked-resize-observer": "error",
  "react-web-api/no-leaked-timeout": "error",
  "react-naming-convention/component-name": "error",

  "react-naming-convention/filename-extension": [
    "error",
    {
      extensions: ["ts", ".tsx", "js", ".jsx"],
    },
  ],

  "react-naming-convention/use-state": "error",
  "react-naming-convention/context-name": "error",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "error",
  "react-hooks-extra/no-direct-set-state-in-use-layout-effect": "error",
  "react-hooks-extra/no-unnecessary-use-callback": "error",
  "react-hooks-extra/no-unnecessary-use-memo": "error",
  "react-hooks-extra/no-unnecessary-use-prefix": "error",
  "react-hooks-extra/prefer-use-state-lazy-initialization": "error",
  "react-dom/no-dangerously-set-innerhtml": "error",
  "react-dom/no-find-dom-node": "error",
  "react-dom/no-flush-sync": "error",
  "react-dom/no-hydrate": "error",
  "react-dom/no-dangerously-set-innerhtml-with-children": "error",
  "react-dom/no-render": "error",
  "react-dom/no-render-return-value": "error",
  "react-dom/no-script-url": "error",
  "react-dom/no-unknown-property": "error",

  "react/jsx-filename-extension": [
    "error",
    {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  ],
  "react/no-unused-prop-types": "error",
  "react/jsx-no-duplicate-props": "error",
  "react/checked-requires-onchange-or-readonly": "error",
  "react/default-props-match-prop-types": "error",
  "react/forward-ref-uses-ref": "error",
  "react/hook-use-state": "error",
  "react/jsx-closing-bracket-location": "error",
  "react/jsx-curly-newline": "off",
  "react/jsx-curly-spacing": "error",
  "react/jsx-equals-spacing": "error",
  "react/jsx-curly-brace-presence": "error",
  "react/jsx-no-leaked-render": "error",
  "react/jsx-no-script-url": "error",
  "react/jsx-no-useless-fragment": "error",
  "react/jsx-uses-vars": "error",
  "react/no-adjacent-inline-elements": "error",
  "react/no-arrow-function-lifecycle": "error",
  "react/no-danger": "error",
  "react/no-invalid-html-attribute": "error",
  "react/no-multi-comp": "error",
  "react/jsx-wrap-multilines": "error",
  "react/no-this-in-sfc": "error",
  "react/no-typos": "error",
  "react/no-unstable-nested-components": "error",
  "react/no-unused-class-component-methods": "error",
  "react/no-unused-state": "error",
  "react/prefer-exact-props": "error",
  "react/prefer-read-only-props": "error",
  "react/prefer-stateless-function": "error",
  "react/void-dom-elements-no-children": "error",
  "react/react-in-jsx-scope": "off",
  "react/prop-types": "off",

  "import/no-unresolved": "error",

  "import/no-extraneous-dependencies": [
    "error",
    {
      devDependencies: true,
    },
  ],

  "import/no-cycle": "error",

  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",

      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    },
  ],

  "import/no-deprecated": "error",
  "import/no-empty-named-blocks": "error",
  "import/no-mutable-exports": "error",
  "import/no-unused-modules": "error",
  "import/no-absolute-path": "error",
  "import/no-dynamic-require": "error",
  "import/no-self-import": "error",
  "import/no-useless-path-segments": "error",
  "import/first": "error",

  "perfectionist/sort-imports": 0,

  "func-names": ["error", "always"],
  "no-eval": "error",
  "consistent-return": "error",
  "prefer-template": "error",
  "space-infix-ops": "error",
  "object-curly-spacing": ["error", "always"],

  "arrow-spacing": [
    "error",
    {
      before: true,
      after: true,
    },
  ],

  "multiline-comment-style": ["error", "starred-block"],
  "no-unneeded-ternary": "error",
  eqeqeq: "error",

  "func-style": [
    "error",
    "declaration",
    {
      allowArrowFunctions: true,
    },
  ],

  "no-caller": "error",
  "no-unused-expressions": "error",
  "no-shadow": "error",
  "no-unused-vars": "error",
  "no-redeclare": "error",
  "prefer-spread": "error",
  "prefer-rest-params": "error",
  "comma-dangle": ["error", "always-multiline"],

  "key-spacing": [
    "error",
    {
      beforeColon: false,
      afterColon: true,
    },
  ],

  "line-comment-position": [
    "error",
    {
      position: "above",
    },
  ],

  "no-empty-pattern": "error",
  "no-fallthrough": "error",
  "no-mixed-spaces-and-tabs": "error",
  "no-useless-rename": "error",
  "prefer-const": "error",
  quotes: ["error", "double"],
  semi: ["error", "always"],
  "linebreak-style": ["error", "unix"],
  "no-trailing-spaces": "error",
  "eol-last": ["error", "always"],
  "no-console": "warn",
  curly: ["error", "all"],
  "no-var": "error",
  "prefer-arrow-callback": "warn",
  "no-duplicate-imports": "error",

  "no-use-before-define": [
    "error",
    {
      functions: false,
      classes: true,
    },
  ],

  "no-empty": "warn",
  "no-extra-semi": "error",
  "no-extra-boolean-cast": "warn",
  "no-dupe-keys": "error",
  "no-implied-eval": "error",
  "no-new-wrappers": "error",
  "array-callback-return": "error",
  "for-direction": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": ["error", "always"],
  "no-debugger": "error",
  "no-dupe-else-if": "error",
  "no-duplicate-case": "error",
  "no-irregular-whitespace": "error",
  "no-self-compare": "error",
  "no-sparse-arrays": "error",
  "no-template-curly-in-string": "error",
  "no-unexpected-multiline": "error",
  "no-unmodified-loop-condition": "error",
  complexity: ["warn", 60],
  "max-nested-callbacks": ["error", 10],
  "no-lonely-if": "error",
  "no-negated-condition": "error",
  yoda: ["error", "never"],
  "no-unused-vars": "off",
};

const abbrevatedFiles = ["src/react-app-env.d.ts", "src/vite-env.d.ts"];
export default defineConfig([
  globalIgnores(["src/wasm/*"]),
  {
    extends: extendedRules,
    plugins,
    ignores: abbrevatedFiles,

    languageOptions,

    rules,
  },
  {
    files: abbrevatedFiles,
    extends: extendedRules,
    plugins,

    languageOptions,

    rules: {
      ...rules,
      "unicorn/prevent-abbreviations": "off",
    },
  },
  i18next.configs["flat/recommended"],
  regexpPlugin.configs["flat/recommended"],
  pluginLingui.configs["flat/recommended"],
  reactRefresh.configs.recommended,
]);
