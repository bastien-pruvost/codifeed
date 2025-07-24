import eslint from "@eslint/js"
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
  {
    ignores: ["**/*.gen.ts", "node_modules", "dist"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // tseslint.configs.strictTypeChecked,
  // pluginReact.configs.flat.recommended,
)
