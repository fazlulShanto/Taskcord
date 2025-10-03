/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ["@repo/eslint-config"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    rules: {},
};
