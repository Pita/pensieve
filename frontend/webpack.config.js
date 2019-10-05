const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [{
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.twig$/,
        loader: "twig-loader",
        options: {
          // See options section below
        },
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src') + '/index.twig',
    }),
    new CopyPlugin([{
      from: 'src/images',
      to: 'images'
    }, ]),
  ]
}

module.exports = config;