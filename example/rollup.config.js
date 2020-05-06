import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'example/src/app.js',
  output: {
    file: 'example/dist/app.js',
    format: 'iife',
  },
  plugins: [resolve()],
}
