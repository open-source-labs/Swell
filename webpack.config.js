const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const entryArr = [
  './src/client/index.js',
  './public/style/App.scss'
];


module.exports = {
  devServer: {
    port: 3000,
  },
  entry: entryArr,
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
  },
  devtool: "eval-source-map",
  module: {
    loaders: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:[ 'es2015', 'react', 'stage-2' ]
        }
      },
      {
        test: /\.json$/, 
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  },
  plugins : [
    new HtmlWebpackPlugin({
      template : './public/index.html'
    })
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};    
          