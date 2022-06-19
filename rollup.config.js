import commonjs from '@rollup/plugin-commonjs'
import { importAssertionsPlugin } from 'rollup-plugin-import-assert'
import { importAssertions } from 'acorn-import-assertions'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    acornInjectPlugins: [
      importAssertions
    ],
    plugins: [
      importAssertionsPlugin(),
      commonjs()
    ],
    external: [
      'assert',
      'fs',
      'nearley',
      'randexp'
    ]
  }
]
