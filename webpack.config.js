var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  //context: __dirname, //path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  devServer: {
    contentBase: debug ? './dist' : './build'
  },
  entry: "./src/client",
  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /(node_modules)/, 
        include: path.join(__dirname, '/'),
        loaders: ['babel-loader'] }
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: "client.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
