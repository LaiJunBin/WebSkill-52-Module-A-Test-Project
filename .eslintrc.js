module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ["standard", "prettier"],
  overrides: [{
    env: {
      node: true
    },
    files: ['.eslintrc.{js,cjs}'],
    parserOptions: {
      sourceType: 'script'
    }
  }],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "prettier/prettier": "error"
  },
  "plugins": ["prettier"]
};
