var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var webpackConfig = webpack( config )
var DEV_PORT = webpackConfig.options.devPort

var server = new WebpackDevServer( webpackConfig, {
  hot: true,
  historyApiFallback: true,
  contentBase: 'src',
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false
  }
} );

server.listen( DEV_PORT, 'localhost', function( err, result ) {
  if( err ) { console.log(err); }
  console.log('Webpack Dev Server ready on port ' + DEV_PORT + '...');
} );
