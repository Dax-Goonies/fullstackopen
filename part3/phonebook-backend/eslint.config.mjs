import globals from 'globals'
import js from "@eslint/js";


export default [
    {
      ignores: ['dist/', 'node_modules/']
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
          sourceType: 'commonjs',
          globals: { ...globals.node },
          ecmaVersion: 'latest',
        },
        rules: {
            'eqeqeq': 'error',
            'no-console': 'off',
            'no-unused-vars': 'warn',
        },
    }
]
