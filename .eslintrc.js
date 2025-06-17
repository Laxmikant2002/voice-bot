module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    webkitSpeechRecognition: 'readonly',
    SpeechSynthesisUtterance: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  overrides: [
    // TypeScript rules for .ts files
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        // Your TypeScript-specific rules
      }
    },
    // JavaScript rules for .js files
    {
      files: ['*.js'],
      extends: ['eslint:recommended'],
      rules: {
        'no-undef': 'warn',
        // Disable TypeScript-specific rules for .js files
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      }
    }
  ]
};
