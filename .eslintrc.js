const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'import',
    '@typescript-eslint',
  ],
  rules: {
    semi: 'off',
    'no-console': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': 0,
    'import/extensions': 0,
    'react/jsx-props-no-spreading': 0,
    'no-param-reassign': 0,
    'react/require-default-props': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],

  },
  settings: {
    'import/resolver': {
      // alias: [['@', './src']],
      webpack: {
        config: path.join(__dirname, './config/webpack.base.config.js'),
      },
      //   // node: {

      //   // },
      // typescript: {
      //   alwaysTryTypes: true,
      //   // // use <root>/path/to/folder/tsconfig.json
      //   // project: './tsconfig.json',

      // },
    },

    // 'import/parsers': {
    //   '@typescript-eslint/parser': ['.ts', '.tsx'],
    // },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
