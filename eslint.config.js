import js from "@eslint/js"
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    ignores: [
      'src/grammar.js'
    ]
  },
  {
    rules: {
      'array-bracket-spacing': 2,
      'block-spacing': 2,
      'brace-style': [2, '1tbs', { allowSingleLine: true }],
      'comma-spacing': 2,
      'comma-style': 2,
      'complexity': [1, 10],
      'dot-location': [2, 'property'],
      'eqeqeq': [2, 'smart'],
      'indent': [2, 2],
      'key-spacing': [1, { beforeColon: false, afterColon: true }],
      'keyword-spacing': 2,
      'linebreak-style': [2, 'unix'],
      'max-depth': [1, 6],
      'max-len': [1, 80, 2, { ignoreComments: true, ignoreUrls: true }],
      'max-nested-callbacks': [1, 4],
      'no-caller': 2,
      'no-debugger': 1,
      'no-eval': 2,
      'no-implied-eval': 2,
      'no-loop-func': 2,
      'no-mixed-spaces-and-tabs': 2,
      'no-multi-str': 2,
      'no-setter-return': 0,
      'no-spaced-func': 2,
      'no-trailing-spaces': 2,
      'no-unexpected-multiline': 2,
      'no-unneeded-ternary': 2,
      'no-unreachable': 2,
      'no-useless-concat': 2,
      'object-curly-spacing': [2, 'always'],
      'operator-linebreak': [2, 'after'],
      'quote-props': [2, 'consistent-as-needed'],
      'quotes': [2, 'single', 'avoid-escape'],
      'radix': 2,
      'semi': [2, 'never'],
      'semi-spacing': 0,
      'space-before-blocks': 2,
      'space-before-function-paren': [2, { anonymous: 'always', named: 'never' }],
      'space-infix-ops': 2,
      'space-unary-ops': 2,
      'wrap-regex': 2,
    }
  },
  {
    files: [
      'test/**/*.js'
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        expect: 'readonly'
      }
    },
    rules: {
      'max-nested-callbacks': 0
    }
  }
]
