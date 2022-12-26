const blueprintConfig = require("@blueprintjs/eslint-config");

const xtends = ["@blueprintjs/eslint-config"];
const rules = {
    "@blueprintjs/html-components": "off",
    "header/header": "off",
    "import/no-default-export": "off",
    "import/order": [
        "error",
        {
            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
            groups: [
                ["builtin", "external", "internal"],
                ["parent", "sibling", "index"],
                ["unknown", "object"],
            ],
            "newlines-between": "always",
        },
    ],
    "react/display-name": "off",
};

// env variable set by `es-lint` script from @blueprintjs/node-build-scripts
if (process.env.LINT_SCRIPT) {
    // in CI, we don't wan to run eslint-plugin-prettier because it has a ~50% performance penalty.
    // instead, run yarn format-check at the root to ensure prettier formatting.
    // also, run import/no-cycle only in CI because it is slow.
    rules["import/no-cycle"] = "error";
} else {
    xtends.push("plugin:prettier/recommended");
}

module.exports = {
    ...blueprintConfig,
    root: true,
    extends: xtends,
    rules,
    overrides: [
        {
            files: ["gatsby-*.js", "server/**/*"],
            env: {
                browser: false,
                node: true,
            },
            rules: {
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
            files: ["**/*.{ts,tsx}"],
            rules: {
                "@typescript-eslint/lines-between-class-members": "off",
                "@typescript-eslint/tslint/config": "off",
                "deprecation/deprecation": "warn",
            },
        },
    ],
    ignorePatterns: [
        "node_modules",
        "dist",
        "lib",
        "fixtures",
        "coverage",
        "__snapshots__",
        "generated",
        "public",
        ".netlify",
        "custom-typings",
    ],
};
