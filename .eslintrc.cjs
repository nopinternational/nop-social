/** @type {import("eslint").Linter.Config} */
const config = {
    overrides: [
        {
            extends: [
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
            ],
            files: ["*.ts", "*.tsx"],
            parserOptions: {
                project: "tsconfig.json",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    rules: {
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            {
                prefer: "type-imports",
                fixStyle: "inline-type-imports",
            }
        ],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "args": "all",
                "argsIgnorePattern": "^_",
            }
        ],
        "no-console": ["error", { allow: ["warn", "error"] }],
        "indent": ["error", 4],
        "object-curly-spacing": ["warn", "always"],
        "semi": ["error", "always"],
    },
};

module.exports = config;
