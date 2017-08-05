var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  devServer: {
    contentBase: debug ? './dist' : './build'
  },
  entry: {
    home: "./src/client_home", 
    room: "./src/client_room", 
  },
  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /(node_modules)/, 
        include: path.join(__dirname, '/'),
        loaders: ['babel-loader'] 
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader?limit=30000&name=[name].[ext]'
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: "[name].min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
