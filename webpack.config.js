const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const outputDirectory = path.join(__dirname, "dist");

module.exports = [
  {
    name: "host",
    mode: "development",
    context: __dirname,
    target: "node",
    entry: ["./src/index.js"],
    output: {
      path: outputDirectory,
      filename: "index.js"
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        },
        {
          test: /\.js/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    plugins: [new CleanWebpackPlugin(outputDirectory)]
  }
];
