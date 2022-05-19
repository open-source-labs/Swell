module.exports = {
  // Global ESLint Settings
  // =================================
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  ignorePatterns: ['cypress/*'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        // "alwaysTryTypes": true, //->new
      },
      'babel-module': {
        root: ['.'],
        alias: {
          '~/static': './public/static/',
          '~': './',
        },
      },
    },
  },

  // ===========================================
  // Set up ESLint for .js / .jsx files
  // ===========================================
  // .js / .jsx uses @babel/eslint-parser
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // Plugins
  // =================================
  plugins: ['react', 'jsx-a11y', 'import', 'jest', 'react-hooks', 'prettier'],

  // Extend Other Configs
  // =================================
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    // Disable rules that conflict with Prettier
    // Prettier must be last to override other configs
    'prettier',
  ],
  rules: {
    'react/function-component-definition': 0,
    'react/boolean-prop-naming': 0,
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 1,
    'react/react-in-jsx-scope': 0,
    'react/display-name': [0],
    // from old
    'arrow-body-style': 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'comma-dangle': 0,
    'dot-notation': 0,
    'func-names': 0,
    'guard-for-in': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0, // <-- was 0 
    'import/prefer-default-export': 0,
    'max-len': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-restricted-globals': 1,
    'no-restricted-syntax': 0,
    'no-shadow': 0,
    'no-undef': 0,
    'no-unused-vars': 0,
    'no-use-before-define': 0,
    'no-useless-constructor': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-return-assign': 0,
    'prefer-const': 1,
    'prefer-destructuring': 0,
    'prefer-template': 0,
    'react/button-has-type': 0,
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-no-duplicate-props': 0,
    'react/no-access-state-in-setstate': 0,
    'react/no-array-index-key': 0,
    'react/no-did-update-set-state': 0,
    'react/no-unused-state': 0,
    'react/prefer-stateless-function': 0,
    'react/sort-comp': [
      2,
      {
        order: ['lifecycle', 'everything-else', 'rendering'],
      },
    ],
    'spaced-comment': 0,
    strict: 0,
  },

  // =================================
  // Overrides for Specific Files
  // =================================
  overrides: [
    // Match TypeScript Files
    // =================================
    {
      files: ['**/*.{ts,tsx}'],

      // Global ESLint Settings
      // =================================
      env: {
        jest: true,
      },
      globals: {
        React: 'writable',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            // alwaysTryTypes: true, //<--- just added this
            project: './tsconfig.json',
          },
        },
      },

      // Parser Settings
      // =================================
      // allow ESLint to understand TypeScript syntax
      // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L10
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // Lint with Type Information
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },

      // Plugins
      // =================================
      plugins: ['jsx-a11y'],

      // Extend Other Configs
      // =================================
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': [0],
        // temp allowing during TS migration
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
            minimumDescriptionLength: 4,
          },
        ],
      },
    },
  ],
};
