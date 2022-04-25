const path = require('path');
const merge = require('webpack-merge');
const { spawn } = require('child_process');
const base = require('./webpack.config');

module.exports = merge.merge(base, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '127.0.0.1',

    port: '8080',
    hot: true,
    proxy: {
      '/webhookServer': {
        target: 'http://localhost:3000',
      },
      '/webhook': {
        target: 'http://localhost:3000',
      },
      '/server/**': {
        target: 'http://localhost:3000/',
        secure: false,
      },
    },
    compress: true,
    setupMiddlewares: function (middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      middlewares.push({ // unshift does not work, ends in infinite calls to this function
        name: 'run-in-electron',
        middleware: () => {
          spawn('electron', ['.', 'dev'], {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          })
            .on('close', (code) => process.exit(0))
            .on('error', (spawnError) => console.error(spawnError));
        },
      });


      return middlewares;
    },
  },
});