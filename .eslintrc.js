// {
  // "plugins": ["@typescript-eslint"],
//   "rules": {
//     "@typescript-eslint/rule-name": "error"
//   },
// }

module.exports = {
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/typescript'
  ],
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
  }
}