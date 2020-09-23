const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
  const isProd = env === "prod" ? true : false;
  const config = {
    mode: isProd ? "production" : "development",
    entry: "./index.js",
    output: {
      path: resolve(__dirname, "dist"),
      filename: "[name].bundle.js"
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new OptimizeCssAssetsPlugin(),
        new HtmlWebpackPlugin({
          template: "./src/index.html",
          minify: {}
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { importLoaders: 1 },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["autoprefixer"]],
                }
              }
            }
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.png$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "img",
              },
            },
          ]
        },
      ]
    },
  };

  if (!isProd) {
    config.devtool = "inline-source-map";
    config.devServer = { contentBase: "./dist" };
    config.plugins = [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ];
  };
  if (isProd) {
    config.plugins = [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/styles.css"
      }),
    ];
  }
  return config;
}