const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, "dist/");

module.exports = (_env, argv) => {
  let entryPoints = {
    VideoComponent: {
      path: "./src/VideoComponent.js",
      outputHtml: "video_component.html",
      build: true,
    },
    VideoOverlay: {
      path: "./src/VideoOverlay.js",
      outputHtml: "video_overlay.html",
      build: true,
    },
    Panel: {
      path: "./src/Panel.js",
      outputHtml: "panel.html",
      build: true,
    },
    Config: {
      path: "./src/Config.js",
      outputHtml: "config.html",
      build: true,
    },
    LiveConfig: {
      path: "./src/LiveConfig.js",
      outputHtml: "live_config.html",
      build: true,
    },
    Mobile: {
      path: "./src/Mobile.js",
      outputHtml: "mobile.html",
      build: true,
    },
  };

  let entry = {};

  // edit webpack plugins here!
  let plugins = [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv(),
    new ZipPlugin({ filename: "bundle.zip" }),
  ];

  for (e in entryPoints) {
    if (entryPoints[e].build) {
      entry[e] = entryPoints[e].path;
      if (argv.mode === "production") {
        plugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            chunks: [e],
            template: "./template.html",
            filename: entryPoints[e].outputHtml,
          })
        );
      }
    }
  }

  let config = {
    //entry points for webpack- remove if not used/needed
    entry,
    optimization: {
      minimize: false, // this setting is default to false to pass review more easily. you can opt to set this to true to compress the bundles, but also expect an email from the review team to get the full source otherwise.
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader", // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "img/[name].[ext]",
          },
        },
      ],
    },
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        util: require.resolve("util/"),
      },
      extensions: ["*", ".js", ".jsx"],
    },
    output: {
      filename: "[name].bundle.js",
      path: bundlePath,
    },
    plugins,
  };

  if (argv.mode === "development") {
    config.devServer = {
      static: {
        directory: path.join(__dirname, "public"),
      },
      host: argv.devrig ? "localhost.rig.twitch.tv" : "localhost",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      port: 8080,
    };
    config.devServer.server = "https";
  }
  if (argv.mode === "production") {
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: "all",
          test: /node_modules/,
          name: false,
        },
      },
      name: false,
    };
  }

  return config;
};
