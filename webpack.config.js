const fs = require('fs')
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, "dist/")

module.exports = (_env,argv)=> {
  let entryPoints = {
    VideoComponent:{
      path:"./src/VideoComponent.js",
      outputHtml:"video_component.html",
      build:true
    },
    VideoOverlay:{
      path:"./src/VideoOverlay.js",
      outputHtml:"video_overlay.html",
      build:true
    },
    Panel:{
      path:"./src/Panel.js",
      outputHtml:"panel.html",
      build:true
    },
    Config:{
      path:"./src/Config.js",
      outputHtml:"config.html",
      build:true
    },
    LiveConfig:{
      path:"./src/LiveConfig.js",
      outputHtml:"live_config.html",
      build:true
    },
    Mobile:{
      path:"./src/Mobile.js",
      outputHtml:"mobile.html",
      build:true
    }
  }

  let entry = {}

  // edit webpack plugins here!
  let plugins = [
    new webpack.HotModuleReplacementPlugin()
  ]

  for(name in entryPoints){
    if(entryPoints[name].build){
      entry[name]=entryPoints[name].path
      if(argv.mode==='production'){
        plugins.push(new HtmlWebpackPlugin({
          inject:true,
          chunks:[name],
          template:'./template.html',
          filename:entryPoints[name].outputHtml
        }))
      }
    }    
  }

  let config={
    //entry points for webpack- remove if not used/needed
    entry,
    optimization: {
      minimize: false // neccessary to pass Twitch's review process
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { presets: ['env'] }
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i, 
          loader: "file-loader",
          options:{
            name:"img/[name].[ext]"
          }
        }
      ]
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
      filename: "[name].bundle.js",
      path:bundlePath
    },
    plugins
  }
  if(argv.mode==='development'){
    config.devServer = {
      contentBase: path.join(__dirname,'public'),
      host:argv.devrig ? 'localhost.rig.twitch.tv' : 'localhost',
      https:{
        key:fs.readFileSync(path.resolve(__dirname,'conf/server.key')),
        cert:fs.readFileSync(path.resolve(__dirname,'conf/server.crt'))
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      port: 8080
    }
  }

  return config;
}
