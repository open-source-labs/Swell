const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const entry = [
  './src/client/index.js',
  './public/styles.css'
];


module.exports = {
  devServer: {
    port: 3000,
  },
  entry,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/')
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
          