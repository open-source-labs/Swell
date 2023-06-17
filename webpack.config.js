const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Page title is set in HtmlWebpackPlugin(), and `name` in `package.json`
// requires all letters to be lower case
// For consistency with an app that has the first letter of the name
// as upper case, we will normalize the name here
const { name } = require('./package.json');
const title = name.charAt(0).toUpperCase() + name.slice(1);

module.exports = {
  target: 'web',
  resolve: {
    fallback: {
      buffer: require.resolve('buffer'),
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
    },
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
        test: /\.(ts|js|mjs)x?$/,
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
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
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
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: title,

      /**
       * @todo Update CSP (Content Security Policy) with "nonce" inline styling.
       * Refactor code to be more secure (do not use 'unsafe-inline')
       */
      cspPlugin: {
        enabled: true,
        policy: {
          'base-uri': "'self'",
          'object-src': "'none'",
          'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
          'style-src': "'self' 'unsafe-inline'",
        },
        hashEnabled: {
          'script-src': false,
          'style-src': false,
        },
        nonceEnabled: {
          'script-src': false,
          'style-src': false,
        },
      },
    }),
    new CspHtmlWebpackPlugin(),
    // options here: https://github.com/webpack-contrib/webpack-bundle-analyzer
    // set to true to display bundle breakdown
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerMode: 'static',
    }),
    new webpack.ProvidePlugin({
      process: 'node:buffer',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '');
      switch (mod) {
        case 'buffer':
          resource.request = 'buffer';
          break;
        case 'stream':
          resource.request = 'readable-stream';
          break;
        default:
          throw new Error(`Not found ${mod}`);
      }
    }),
  ],
};
