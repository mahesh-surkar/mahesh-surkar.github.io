
ck = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var CSS_DIR = path.resolve(__dirname, 'src/client/css');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },

  module: {
    loaders: [

      // { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"

      },
      { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', /*'react-hmre'*/],
          plugins: [
            'transform-class-properties'
          ]
        },
      },

      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }

      //   { test: /\.woff|\.woff2|\.svg|.eot|\.ttf|\.png/, loader: 'url?prefix=font/&limit=10000&name=/assets/fonts/[name].[ext]' }


    ]

  },
  /*postcss: [
    require('autoprefixer'),
    require('postcss-color-rebeccapurple')
  ],*/

  plugins: [
    new ExtractTextPlugin('style.css'),
  ]

};

module.exports = config;

