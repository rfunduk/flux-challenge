var path = require('path')
var webpack = require('webpack')

var ETPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var outputDir = path.join( __dirname, './dist' )
var PRODUCTION = process.env.NODE_ENV == 'production'

var DEV_PORT = 5301
var DEV_BASE = 'http://localhost:' + DEV_PORT
var API_BASE = 'http://localhost:3000'
var WEBSOCKET = 'ws://localhost:4000'

var plugins = [
  new webpack.DefinePlugin( {
    API_BASE: JSON.stringify( API_BASE ),
    WEBSOCKET: JSON.stringify( WEBSOCKET )
  } ),
  new webpack.EnvironmentPlugin('NODE_ENV'),
  new webpack.optimize.DedupePlugin(),
  new webpack.PrefetchPlugin('react'),
  new webpack.ProvidePlugin( { React: 'react' } ),
  new ETPlugin( PRODUCTION ? 'bundle.[hash].css' : 'bundle.css' )
]

var entry = [ './src/index.jsx', './src/index.css' ]

if( PRODUCTION ) {
  plugins.push( new HtmlWebpackPlugin( {
    title: 'Flux Challenge by Ryan Funduk',
    template: 'src/index.template.html',

    // put index in project root instead of dist
    // to meet flux-challenge reqs
    filename: '../index.html'
  } ) )
  plugins.push( new webpack.optimize.OccurenceOrderPlugin() )
  plugins.push( new webpack.optimize.UglifyJsPlugin( {
    sourceMap: false,
    compress: {
      dead_code: true,
      unused: false,
      warnings: false,
      unsafe: true,
      comparisons: true,
      booleans: true,
      loops: true,
      drop_console: true
    },
    screw_ie8: true,
    comments: false,
    exclude: new RegExp(/min\.js$/),
  } ) )
}
else {
  // hot module replacement in dev only
  entry.unshift(
    'webpack-dev-server/client?'+DEV_BASE,
    'webpack/hot/only-dev-server'
  )
  plugins.unshift( new webpack.HotModuleReplacementPlugin() )
  plugins.unshift( new webpack.NoErrorsPlugin() )
}

module.exports = {
  devPort: DEV_PORT,
  plugins: plugins,
  stats: {
    chunks: false,
    assets: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false,
    cached: false,
    cachedAssets: false,
    children: false,
    source: false
  },
  devtool: PRODUCTION ? null : 'source-map',
  entry: entry,
  output: {
    path: outputDir,
    publicPath: PRODUCTION ? '' : DEV_BASE,
    filename: PRODUCTION ? 'bundle.[hash].js' : 'bundle.js'
  },
  resolve: {
    root: path.resolve('./src'),
    unsafeCache: true,
    modulesDirectories: [ 'node_modules' ],
    extensions: [ '', '.js', '.jsx', '.css' ]
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: __dirname,
        loaders: [ 'babel' ]
      },
      {
        test: /\.css$/,
        loader: ETPlugin.extract('style', 'css')
      }
    ]
  }
}
