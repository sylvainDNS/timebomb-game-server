module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-trailing-spaces': 'error',
    'spaced-comment': ['error', 'always'],
  },
}
