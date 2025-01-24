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
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|avif)$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Potentially adding ?%%NONCE%% for replacement
      filename: 'main.css',
    }),
    new HtmlWebpackPlugin({
      template: './index-csp.html',
      filename: 'index.html',
      title: title,
      cspPlugin: {
        enabled: true,
        policy: {
          'base-uri': "'self'",
          'object-src': "'none'",
          'script-src': ["'self'"],
          'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
        },
        hashEnabled: {
          'script-src': false,
          'style-src': false,
        },
        nonceEnabled: {
          'script-src': true,
          'style-src': false, // * Disabled for dynamic styling from Material UI
        },
      },
      /** templateParameters:
       *Using templateParameters
       * https://webpack.js.org/guides/csp/#enabling-csp
       * https://github.com/jantimon/html-webpack-plugin?tab=readme-ov-file#options
       */

      // Injects nonce value into template parameter, which can be accessed in HTML template
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options,
          },
          nonce: CspHtmlWebpackPlugin.nonce,
        };
      },
    }),
    new CspHtmlWebpackPlugin({
      'base-uri': ["'self'"],
      'default-src': [
        "'self'",
        'http://localhost:3001',
        'ws://localhost:3001',
        'https://api.github.com',
        "'unsafe-inline'",
        "'unsafe-eval'",
        '*',
        'blob:',
        'data:',
        'gap:',
      ],
      'img-src': ["'self'", 'data:', 'https://avatars.githubusercontent.com/'],
      'child-src': ["'none'"],
      'object-src': ["'none'"],
      'script-src': [
        "'self'",
        "'unsafe-eval'",
        (_, nonce) => `'nonce-${nonce}'`,
      ],
      'style-src': [
        "'unsafe-inline'",
        "'self'",
        "'unsafe-eval'",
        (_, nonce) => `'nonce-${nonce}'`,
      ],
    }),
    // options here: https://github.com/webpack-contrib/webpack-bundle-analyzer
    // set to true to display bundle breakdown
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
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
