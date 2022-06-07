import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      replace({
        preventAssignment: false,
        delimiters: ['`', '`'],
        values: {
          '${locale}.json': '`../locale-data/${locale}.json`'
        }
      }),
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
