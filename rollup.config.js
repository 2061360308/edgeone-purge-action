const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'auto' // 添加这行确保正确导出
  },
  plugins: [
    nodeResolve(),
    commonjs({
      requireReturnsDefault: 'auto'
    })
  ],
  external: ['@actions/core', 'node-fetch']
};