module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue']
  },
  rules: {
    'max-len': ['error', { code: 300 }]
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@tencent/eslint-config-tencent',
    '@tencent/eslint-config-tencent/ts',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    'vite.config.ts',
    'components.d.ts',
  ]
}