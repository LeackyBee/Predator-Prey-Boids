module.exports = {
  extends: [
    // extend plugins to get a good set of baseline rules
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // disable the rules that conflict with prettier
    "eslint-config-prettier",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    indent: ["error", 4],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
