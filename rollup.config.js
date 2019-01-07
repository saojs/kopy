export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    require('rollup-plugin-alias')({
      chalk: require.resolve('colorette')
    }),
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-json')()
  ],
  external: require('builtin-modules')
}
