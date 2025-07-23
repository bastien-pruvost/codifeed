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
    "<TYPES>",
    "<TYPES>^@/",
    "<TYPES>^[.]",
    "",
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "^[./]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  // importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.8.3",
  importOrderCaseSensitive: false,
}

export default config
