import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vdom.js',
      format: 'esm'
    },
    {
      file: 'dist/vdom.js',
      format: 'umd',
      name: 'vdom'
    }
  ],
  plugins: [terser()]
}
