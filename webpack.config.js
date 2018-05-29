const webpack = require('webpack')
const path = require("path")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');

let libraryName = 'stimulus-mapbox-gl';

let plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin());
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
  mode: 'development',
  entry: {
    bundle: "./src/mapbox-controller.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: outputFile,
    library: 'StimulusMapboxGl',
    libraryTarget: 'umd'
  },


  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          /node_modules/
        ],
        use: [
          { loader: "babel-loader" }
        ]
      }
    ]
  },

   plugins: plugins
}
