'use strict';
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'production',
  // https://webpack.js.org/configuration/stats/
  stats: 'errors-only',
  externals: ['node-fetch'],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true,
        },
      }),
    ],
  },
};
