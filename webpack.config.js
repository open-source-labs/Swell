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
    publicPath: "./",
  },
  module: {
    rules: [
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        resolve: {
          extensions: [".scss"],
        },
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, "src")],
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
    new MiniCssExtractPlugin({}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index-csp.html"),
      filename: "test-index.html",
      title: "Swell",
      cspPlugin: {
        enabled: true,
        policy: {
          "base-uri": "'self'",
          "object-src": "'none'",
          // unsafe-eval allowed because dependency (protobufjs) of @grpc/grpc-js uses eval();
          // hopefully, grpc will update their version of protobufjs, and that version will not use eval
          // related to this issue: https://github.com/protobufjs/protobuf.js/issues/997
          "script-src": ["'self'", "'unsafe-eval'"],
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
    new CspHtmlWebpackPlugin(),
  ],
};
