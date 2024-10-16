import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      semi: true,
      quotes: "double",
    },
    formatters: {
      markdown: "prettier",
    },
    rules: {
      "ts/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "perfectionist/sort-imports": ["error", { newlinesBetween: "always" }],
    },
  },
);
