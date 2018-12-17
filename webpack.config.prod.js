import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpackMd5Hash from 'webpack-md5-hash';
import WebpackExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: {
    vendor: path.resolve(__dirname, 'src/vendor'),
    main: path.resolve(__dirname, 'src/index')
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins: [

    // Extract CSS from loader
    new WebpackExtractTextPlugin('[name].[contenthash].css'),

    // Hash the files using MD5 so their names change when the content changes.
    new webpackMd5Hash(),

    // Use commonsChunkPlugin to create a separate bundle
    // of vendor libraries so they're cache separately.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    //Create HTML file that reference to bundle JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    //Eliminate duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin(),

    //Minify javascript
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /mode_modules/, loaders: ['babel']},
      {test: /\.css$/, loader: WebpackExtractTextPlugin.extract('css?sourceMap')}
    ]
  }
}
