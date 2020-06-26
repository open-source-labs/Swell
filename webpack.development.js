// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("csp-html-webpack-plugin");
const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.config");

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    host: "localhost",
    port: "8080",
    hot: true,
    compress: true,
    contentBase: path.resolve(__dirname, "dist"),
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
});
