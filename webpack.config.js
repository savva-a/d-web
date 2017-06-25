const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  context: __dirname,
  entry: [
    './src/webpack-public-path',
    path.resolve(__dirname, './src/index.js')
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.jpeg$|\.jpg$|\.gif$|\.png$|\.wav$|\.mp3$/,
        loader: 'file-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader?paths=node_modules'
      },
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        // query: {
        //   presets: ['es2015', 'es2017', 'stage-2', 'stage-3', 'react'],
        //   plugins: ['react-hot-loader/babel', 'transform-runtime', 'transform-decorators-legacy', 'transform-class-properties']
        // },
        // exclude: path.join(__dirname, 'node_modules')
        exclude: s => /(node_modules|bower_components)/.test(s) && !/react-polymer/.test(s)
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, './src')]
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      filename: 'index.html'
    })
    // new webpack.NamedModulesPlugin()
    // new webpack.HotModuleReplacementPlugin()
  ]
};
