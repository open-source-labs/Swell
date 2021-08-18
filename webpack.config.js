const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  target: 'web',
  node: {
    fs: 'empty',
  },
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/typescript',
            ],
          },
        },
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src')],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        resolve: {
          extensions: ['.scss'],
        },
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        resolve: {
          extensions: ['.css'],
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|)$/,
        use: 'url-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({}),
    new HtmlWebpackPlugin({
      // if using template, add <title>Swell</title> and delete line 59.
      // template: path.resolve(__dirname, "index-csp.html"),
      filename: 'index.html',
      title: 'Swell',
      cspPlugin: {
        enabled: true,
        policy: {
          'base-uri': "'self'",
          'object-src': "'none'",
          'script-src': ["'self'"],
          'style-src': ["'self'"],
        },
        hashEnabled: {
          'script-src': true,
          'style-src': true,
        },
        nonceEnabled: {
          'script-src': true,
          'style-src': true,
        },
      },
    }),
    new CspHtmlWebpackPlugin(),
    // options here: https://github.com/webpack-contrib/webpack-bundle-analyzer
    // set to true to display bundle breakdown
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
    }),
  ],
};
