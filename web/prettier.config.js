/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: false,
  trailingComma: "all",
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  tailwindStylesheet: "./src/styles/global.css",
  importOrder: [
    // Node built-ins (types and runtime together)
    "<TYPES>^(node:)",
    "<BUILTIN_MODULES>",
    "",
    // Third-party packages (types and runtime together)
    "<TYPES>",
    "<THIRD_PARTY_MODULES>",
    "",
    // Internal absolute imports (types and runtime together)
    "<TYPES>^@/types/",
    "<TYPES>^@/",
    "^@/",
    "",
    // Internal relative imports (types and runtime together)
    "<TYPES>^[.]",
    "^[.]",
    "",
    // Side effects (CSS, etc.) - always last
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  // importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.8.3",
  importOrderCaseSensitive: false,
}

export default config
