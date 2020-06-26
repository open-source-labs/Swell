const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "electron-renderer",
  externals: [nodeExternals()],
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      // {
      //   test: /\.(html)$/,
      //   include: [path.resolve(__dirname, "src")],
      //   use: {
      //     loader: "html-loader",
      //     options: {
      //       attributes: {
      //         list: [
      //           {
      //             tag: "img",
      //             attribute: "data-src",
      //             type: "src",
      //           },
      //         ],
      //       },
      //     },
      //   },
      // },
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "src")],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        resolve: {
          extensions: [".js", ".jsx", ".json"],
        },
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader",
          "sass-loader",
        ],
        resolve: {
          extensions: [".scss"],
        },
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules", "react-json-petty", "themes"),
        ],
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        resolve: {
          extensions: [".css"],
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|)$/,
        use: "url-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    // new MiniCssExtractPlugin(),
    // new HtmlWebpackPlugin({
    //   cspPlugin: {
    //     enabled: true,
    //   },
    //   filename: "index.html",
    // }),
    // new CspHtmlWebpackPlugin({
    //   "base-uri": ["'self'"],
    //   "object-src": ["'none'"],
    //   // "script-src": ["'self'"],
    //   "style-src": ["'self'"],
    //   "frame-src": ["'none'"],
    //   "worker-src": ["'none'"],
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index-csp.html"),
      filename: "test-index.html",
      cspPlugin: {
        enabled: true,
        policy: {
          "base-uri": "'self'",
          "object-src": "'none'",
          "script-src": ["'self'"],
          "style-src": ["'self'"],
        },
        hashEnabled: {
          "script-src": true,
          "style-src": true,
        },
        nonceEnabled: {
          "script-src": true,
          "style-src": true,
        },
      },
    }),

    new CspHtmlWebpackPlugin({
      "base-uri": "'self'",
      "object-src": "'none'",
      "script-src": ["'self'"],
      "style-src": ["'self'"],
    }, {
      enabled: true,
      hashingMethod: "sha256",
      hashEnabled: {
        "script-src": true,
        "style-src": true,
      },
      nonceEnabled: {
        "script-src": true,
        "style-src": true,
      },
    }),
  ],
};
