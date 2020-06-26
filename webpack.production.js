const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.config");

module.exports = merge(base, {
  mode: "production",
  devtool: "nosources-source-map",
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: "index-production.html",
    }),
    // new CspHtmlWebpackPlugin(
    //   {
    //     "base-uri": ["'self'"],
    //     "object-src": ["'none'"],
    //     "script-src-elem": ["'unsafe-eval'"],
    //     "style-src-elem": ["'unsafe-eval'"],
    //     "frame-src": ["'none'"],
    //     "worker-src": ["'none'"],
    //   },
    //   {
    //     hashEnabled: {
    //       "style-src": false,
    //     },
    //     nonceEnabled: {
    //       "script-src": false,
    //       "style-src": false,
    //     },
    //   }
    // ),
  ],
});
