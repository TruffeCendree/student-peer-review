const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',

  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({ hash: true, template: 'react/index.html' })
  ],

  entry: {
    index: './react/index.tsx'
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./dist/react'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      // Ensure react is never duplicated (possible if npm create multiple instance of react in node_modules subdirectories)
      react: path.resolve(path.join(__dirname, 'node_modules', 'react'))
    },
    modules: [path.resolve('./react'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
