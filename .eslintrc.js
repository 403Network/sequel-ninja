// {
  // "plugins": ["@typescript-eslint"],
//   "rules": {
//     "@typescript-eslint/rule-name": "error"
//   },
// }

module.exports = {
  // extends: [
    // "plugin:vue/recommended",
    // "plugin:@typescript-eslint/recommended"
  // ]
  // parserOptions: {
  //   parser: "@typescript-eslint/parser"
  // },
  plugins: ["@typescript-eslint"],
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
}