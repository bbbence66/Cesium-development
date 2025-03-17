// The path to the CesiumJS source code
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Determine if we're in production mode based on environment variables
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js',
    path: path.resolve(__dirname, "dist"),
    sourcePrefix: "",
    clean: true, // Clean the dist folder before each build
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, cesiumSource),
    },
    mainFiles: ["module", "main", "Cesium"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: isProduction ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      } : false,
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
        { from: path.join(cesiumSource, "Assets"), to: "Assets" },
        { from: path.join(cesiumSource, "Widgets"), to: "Widgets" },
        // Copy static assets to the dist folder
        { from: "public", to: "" },
        // Copy service worker to root
        { from: "src/serviceWorker.js", to: "serviceWorker.js" }
      ],
    }),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
    }),
  ],
  mode: isProduction ? "production" : "development",
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    hot: true
  },
  optimization: {
    minimize: isProduction,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: isProduction ? "warning" : false,
    maxEntrypointSize: 5 * 1024 * 1024, // Increase allowed entry point size for Cesium
    maxAssetSize: 5 * 1024 * 1024 // Increase allowed asset size for Cesium
  }
};