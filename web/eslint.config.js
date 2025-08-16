import eslint from "@eslint/js"
import pluginQuery from "@tanstack/eslint-plugin-query"
import pluginRouter from "@tanstack/eslint-plugin-router"
import tseslint from "typescript-eslint"

// export default tseslint.config(
//   {
//     ignores: ["**/*.gen.ts"],
//   },
//   eslint.configs.recommended,
//   tseslint.configs.eslintRecommended,
//   tseslint.configs.strictTypeChecked,

// )

export default tseslint.config(
  [
    {
      ignores: ["**/*.gen.ts", "node_modules", "dist"],
    },
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    pluginQuery.configs["flat/recommended"],
    pluginRouter.configs["flat/recommended"],
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
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
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/only-throw-error": [
          "error",
          {
            allow: ["Redirect"],
            allowThrowingAny: false,
            allowThrowingUnknown: false,
          },
        ],
      },
    },
  ],
  // tseslint.configs.strictTypeChecked,
  // pluginReact.configs.flat.recommended,
)
