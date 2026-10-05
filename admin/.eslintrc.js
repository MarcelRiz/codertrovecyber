module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
      modules: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx', '.ts'] },
    ],
    'react/jsx-props-no-spreading': [0],
    'react/jsx-no-target-blank': [0],
    'react/no-unescaped-entities': [0],
    // disabled those rules to be able for build now, need to fix all issue and enable again
    'react/react-in-jsx-scope': [0],
    'react/prop-types': [0],
    'import/extensions': 'off',
    'react/self-closing-comp': [
      'error',
      {
        component: false,
        html: false,
      },
    ],
    'react-hooks/exhaustive-deps': 0,
    'import/prefer-default-export': 'warn',
    'no-use-before-define': 'warn',
    'no-param-reassign': 'warn',
    'no-unused-expressions': 'off',
    'import/no-cycle': 'warn',
    'no-sequences': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  // overrides: [
  //   {
  //     files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
  //     rules: {
  //       '@typescript-eslint/explicit-function-return-type': 'off',
  //     },
  //   },
  // ],
}
