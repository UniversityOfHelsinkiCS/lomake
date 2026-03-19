// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslintPluginCypress from 'eslint-plugin-cypress'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginImportX from 'eslint-plugin-import-x'
import { createNodeResolver } from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

export default tseslint.config(
  {
    // Global ignores
    ignores: [
      'eslint.config.mjs',
      '**/build/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/instrumented/**',
      '**/coverage/**',
      'nyc-config.cjs',
      '.lintstagedrc.mjs',
      'cypress.config.js',
      'vite.config.ts',
    ]
  },

  // Global options (excl. e2e)
  {
    ignores: ['cypress/**/*.js'],
    extends: [
      eslint.configs.recommended,
      eslintPluginImportX.flatConfigs.recommended,
      eslintPluginImportX.flatConfigs.typescript,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.{js,cjs}']
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'import-x': eslintPluginImportX
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'camelcase': 'off', // TODO: Enable. old db/backend logic is still using snake_case every now and then and needs a big refactor
      'class-methods-use-this': 'off', // Disabled in favor of @typescript-eslint
      'consistent-return': 'off', // Disabled in favor of @typescript-eslint
      'id-denylist': ['error', 'err'],
      'no-alert': 'error',
      'no-await-in-loop': 'error',
      'no-console': 'error',
      'no-implied-eval': 'off', // Disabled in favor of @typescript-eslint
      'no-param-reassign': 'error',
      'no-promise-executor-return': 'error',
      'no-return-assign': 'error',
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint
      'object-shorthand': ['error', 'always'],
      'prefer-const': 'error',
      'prefer-destructuring': 'off', // Disabled in favor of @typescript-eslint
      'dot-notation': 'off', // Disabled in favor of @typescript-eslint
      'no-restricted-imports': ['off', { 'patterns': [{ 'regex': '^@mui/[^/]+$' }] }], //TODO Fix these at some point and change it to error
      'quotes': ['error', 'single',
        { avoidEscape: true, allowTemplateLiterals: false }
      ],

      'import-x/no-commonjs': 'error',
      'import-x/no-default-export': 'off', //TODO When brave enough, enable this
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: false }],
      'import-x/order': ['off', {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [['builtin', 'external'], ['internal'], ['parent'], ['sibling', 'index']],
      }],

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true, varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/class-methods-use-this': 'error',
      // '@typescript-eslint/consistent-indexed-object-style': 'off', // TODO: keep as error/record (default)
      '@typescript-eslint/consistent-return': 'error', // NOTE: This is weaker than tsconfig.json noImplicitReturns, and should be replaced once ts migration complete
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/prefer-destructuring': ['error',
        { VariableDeclarator: { object: true } }
      ],
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      '@typescript-eslint/no-explicit-any': 'off', // TODO: enable when feeling brave
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-shadow': 'off', // TODO: enable?
      '@typescript-eslint/no-unsafe-argument': 'off', // TODO: enable
      '@typescript-eslint/no-unsafe-assignment': 'off', // TODO: enable
      '@typescript-eslint/no-unsafe-call': 'off', // TODO: enable
      '@typescript-eslint/no-unsafe-member-access': 'off', // TODO: enable
      '@typescript-eslint/no-unsafe-return': 'off', // TODO: enable
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
    settings: {
      'import-x/internal-regex': '^@lomake/shared/',
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: [
            './tsconfig.json',
            './tsconfig.node.json',
          ],
        }),
        createNodeResolver({
          extensions: ['.js', '.jsx', 'cjs', 'mjs', '.ts', '.tsx'],
        })
      ],
    },
  },

  {
    files: ['server/util/routes/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-misused-promises': 'off', // Errors come mainly from Express route handlers that are handled correctly by express-async-errors      
      '@typescript-eslint/consistent-return': 'off',
    }
  },

  // Frontend camelCase and react
  {
    files: ['client/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      'react': eslintPluginReact,
    },
    extends: [
      eslintPluginReact.configs.flat.recommended,
      eslintPluginReact.configs.flat['jsx-runtime'],
      eslintPluginReactHooks.configs['recommended-latest'],
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        }
      }
    },
    rules: {
      'camelcase': 'warn',
      'react/prop-types': 'off', // Typescript but worse
      'react/no-unescaped-entities': 'off',
      'react/function-component-definition': ['error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      "react/display-name": 'off', // FIX??
      'react/no-array-index-key': 'error',
      'react/no-unstable-nested-components': 'warn', // TODO: turn into error, reduces re-renders
      'react/no-this-in-sfc': 'error',
      'react/prefer-stateless-function': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-filename-extension': ['error',
        { allow: 'as-needed', extensions: ['.jsx', '.tsx'] }
      ],
      'react/jsx-no-leaked-render': 'warn', // TODO: enable, tho not that useful after full ts migration
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-props-no-spreading': 'warn', // TODO: enable, improves readability
      'react/jsx-sort-props': ['error', { reservedFirst: false }],
      'react/jsx-tag-spacing': 'warn',
    },
    settings: {
      'react': {
        'version': 'detect'
      }
    }
  },

  // Cypress should only use rules provided by the plugin below
  {
    files: ['cypress/**/*.js'],
    extends: [
      eslintPluginCypress.configs.recommended
    ]
  },

  // Overrides for CommonJS
  {
    files: [
      'server/**/*.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      'import-x/no-commonjs': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Migration files
  {
    files: [
      'server/database/**/*.js'
    ],
    rules: {
      'import-x/no-unused-modules': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },

  // TODO: See if these can be disabled and or fix
  {
    files: ['server/**/*.{js,ts}'],
    rules: {
      'import-x/no-default-export': 'off',
      'import-x/no-unused-modules': 'off',
      'no-await-in-loop': 'off',
      'no-promise-executor-return': 'off',
    },
  },
  eslintPluginPrettierRecommended, // This must be the last plugin so it can override other configs
)
