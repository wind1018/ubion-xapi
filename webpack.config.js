const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');

const config = {
  entry: {
    "BUILDER" :'./src/xapiBuilder.ts',
    "BUILDER.min" :'./src/xapiBuilder.ts'
  },
    mode : "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: "var",
    library: 'XAPI'
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'awesome-typescript-loader' },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { enforce: 'pre', test: /\.ts$/, loader: 'tslint-loader' }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({
      include: /\.min\.js$/
    })]
  }
};
module.exports = config;

//BUILDE