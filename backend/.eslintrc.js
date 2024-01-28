// backend/.eslintrc.js
module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended','plugin:prettier/recommended',"prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // Your backend-specific ESLint rules
  },
};
