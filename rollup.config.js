import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      json(),
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
