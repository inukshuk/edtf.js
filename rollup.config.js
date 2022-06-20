import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
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
