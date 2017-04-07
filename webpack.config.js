const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dev-build'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devtool: "cheap-eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/, 
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  }
};



if (process.env.NODE_ENV === 'production') {
  config.output.path = path.resolve(__dirname, 'docs');
  config.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}


module.exports = config;