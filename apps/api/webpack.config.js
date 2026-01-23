const { composePlugins, withNx } = require('@nx/webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = composePlugins(
  withNx(),
  (config) => {
    config.resolve = config.resolve || {};
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../tsconfig.base.json'),
      })
    );
    return config;
  }
);
