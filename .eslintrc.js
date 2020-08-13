module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'linebreak-style': 0,
    'no-continue': 0,
    'no-console': 0,
    'prefer-destructuring': ['error', { object: true, array: false }],
  },
};
