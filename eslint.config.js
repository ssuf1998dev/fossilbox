import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      semi: true,
      quotes: "double",
    },
    formatters: true,
    react: true,
    rules: {
      "ts/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "perfectionist/sort-imports": ["error", { newlinesBetween: "always" }],
    },
  },
);
