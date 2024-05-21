// backend/.eslintrc.js
module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  // extends: ['eslint:recommended','plugin:prettier/recommended',"prettier"],
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-unused-vars': 'warn',
    // Your backend-specific ESLint rules
  },
};
