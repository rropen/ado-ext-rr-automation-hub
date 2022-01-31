const path = require("path");
const webpack = require('webpack');
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const entries = {};
const srcDir = path.join(__dirname, "src");
// this is setting up the sync during building, the path.join("src", dir, dir) reflects src/hub/hub (.js)
fs.readdirSync(srcDir)
  .filter(dir => fs.statSync(path.join(srcDir, dir)).isDirectory())
  .forEach(dir => (entries[dir] = "./" + path.join("src", dir, dir)));

module.exports = {
  target: "web",
  entry: entries,
  output: {
    filename: "[name]/[name].js",
    publicPath: "/dist/"
  },
  devtool: "inline-source-map",
  devServer: {
    https: true,
    port: 3000,
    hot: true,
    static: {
      directory: path.join(__dirname,''),
      publicPath: ''
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "azure-devops-extension-sdk": path.resolve(
        "node_modules/azure-devops-extension-sdk"
      ),
      process: "process/browser"
    },
    fallback: {
      util: require.resolve('util'),
      https: require.resolve('https-browserify'),
      http: require.resolve("stream-http"),
      process: require.resolve('process/browser'),
      buffer: require.resolve('buffer')
    }
  },
  stats: {
    warnings: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "azure-devops-ui/buildScripts/css-variables-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        use: "file-loader"
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({patterns: [{ from: "**/*.html", context: "src" }]}),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  ]
};
