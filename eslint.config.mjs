import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import eslintCommentsPlugin from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    {
        plugins: {
            "eslint-comments": eslintCommentsPlugin,
            import: importPlugin,
            jsdoc: jsdocPlugin,
            "simple-import-sort": simpleImportSortPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
        rules: {
            ...eslintCommentsPlugin.configs.recommended.rules,
            "eslint-comments/disable-enable-pair": "off",
            "@typescript-eslint/consistent-type-exports": [
                "error",
                {
                    fixMixedExportsWithInlineTypeSpecifier: true,
                },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    fixStyle: "inline-type-imports",
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unnecessary-type-parameters": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/restrict-template-expressions": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    {
        files: ["**/*.js", "**/*.mjs"],
        extends: [tseslint.configs.disableTypeChecked],
        languageOptions: {
            parserOptions: {
                project: false,
            },
            globals: globals.nodeBuiltin,
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react: reactPlugin,
            "react-hooks": fixupPluginRules(reactHooksPlugin),
        },
        rules: {
            ...reactPlugin.configs["recommended"].rules,
            ...reactPlugin.configs["jsx-runtime"].rules,
            ...reactHooksPlugin.configs.recommended.rules,
            "@typescript-eslint/no-deprecated": "warn",
            // HACKHACK: until we can get Sass CSS modules type-checked
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/lines-between-class-members": "off",
            // unnecessary with TypeScript
            "react/prop-types": "off",
            "react/display-name": "off",
            "react/no-unescaped-entities": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["gatsby-*.js", "server/**/*"],
        languageOptions: {
            parserOptions: {
                project: false,
            },
            globals: globals.nodeBuiltin,
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "no-undef": "off",
            "prefer-object-spread": "off",
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: true,
                },
            ],
        },
    },
    {
        ignores: [
            "**/node_modules",
            "**/dist",
            "**/lib",
            "**/fixtures",
            "**/coverage",
            "**/__snapshots__",
            "**/generated",
            "**/public",
            "**/custom-typings",
            "**/.yarn",
            "**/*.pnp.*",
            "**/.cache",
        ],
    },
);
