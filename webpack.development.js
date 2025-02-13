const merge = require('webpack-merge').merge;
const base = require('./webpack.config');
const { spawn } = require('child_process');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '127.0.0.1',
    port: '8080',
    open: '/dev',
    hot: true,
    compress: true,
    proxy: {
      '/webhookServer': {
        target: 'http://localhost:3001',
      },
      '/webhook': {
        target: 'http://localhost:3001',
      },
      '/api': {
        target: 'http://localhost:3001',
        /**
         * @todo Change secure option to true, and refactor code to account for
         * change  // https://github.com/electron/electron/issues/19775 ??? maybe this is the solution
         */
        secure: false,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      // console.log('Setting up middlewares...:', middlewares);
      middlewares.unshift({
        // unshift does not work, ends in infinite calls to this function
        name: 'run-in-electron',
        path: '/dev',
        middleware: (req, res) => {
          spawn('npx electron --dev .', {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          })
            .on('close', () => process.exit(130))
            .on('error', (spawnError) => console.error(spawnError));
          return res
            .status(200)
            .send('Opened the Electron app in development mode.');
        },
      });
      return middlewares;
    },
  },
});
