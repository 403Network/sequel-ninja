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
    'semi': ["error", "never"],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'require-await': 'error',
    'quotes': [2, 'single', { 'avoidEscape': true }],
    "vue/no-multi-spaces": ["error", {
      "ignoreProperties": false
    }],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "never",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],
    "vue/no-boolean-default": ["error", "no-default"],
    "vue/no-spaces-around-equal-signs-in-attribute": ["error"],
    "vue/prop-name-casing": ["error", "camelCase"],
    "vue/array-bracket-spacing": ["error"],
    "block-spacing": "error",
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always", {
      "arraysInObjects": false,
      "objectsInObjects": false,
    }],
    "key-spacing": ["error", {
      "multiLine": {
        "beforeColon": false,
        "afterColon": true,
      },
      "singleLine": {
        "beforeColon": false,
        "afterColon": true
      },
      "align": {
        "beforeColon": false,
        "afterColon": true,
        "on": "value"
      }
    }],
  }
}