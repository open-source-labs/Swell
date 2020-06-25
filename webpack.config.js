const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  target: "web",
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        include: [path.resolve(__dirname, "src")],
        use: {
          loader: "html-loader",
          options: {
            attributes: {
              list: [
                {
                  tag: "img",
                  attribute: "data-src",
                  type: "src",
                },
              ],
            },
          },
        },
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: /(node_modules)/,
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
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: ["css-loader", "sass-loader"],
          },
        ],
        resolve: {
          extensions: [".css", ".scss"],
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|)$/,
        use: "url-loader",
      },
    ],
  },
};
