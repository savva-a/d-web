const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: ['./src/index.js'],
  entry: [
  // must be first entry to properly set public path
    './src/webpack-public-path',
    // 'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, './src/index.js') // Defining path seems necessary for this to work consistently on Windows machines.
  ],

  // output: {
  //   path: __dirname,
  //   filename: 'public/bundle.js',
  // },
  output: {
    // path: __dirname,
    path: path.resolve(__dirname, 'public'), // Note: Physical files are only output by the production build task `npm run build`.
    // publicPath: '/public',
    publicPath: '/public',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jpeg$|\.jpg$|\.gif$|\.png$|\.wav$|\.mp3$/,
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // include: [
        //   path.resolve(__dirname, '.src/'),
        //   path.resolve(__dirname, './node_modules/react-icons/fa/')
        // ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
     // test: /\.xxx$/, // may apply this only for some modules
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, './src')]
        }
      }
    })
  ]
  // sassLoader: {
  //   includePaths: [path.resolve(__dirname, "./src")]
  // }
};
