export default {
  trailingComma: "all",
  semi: false,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/constants/(.*)$",
    "^~/lib/(.*)$",
    "^~/components/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindAttributes: ["tw"],
  tailwindFunctions: ["cva"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-organize-imports",
  ],
}