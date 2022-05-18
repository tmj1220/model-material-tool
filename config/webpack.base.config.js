const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const packageName = require('../package.json').name;

const rootID = `${packageName}-root`
const htmlCfg = {
  inject: true,
  favicon: resolveApp('public/favicon.ico'),
  template: resolveApp('public/index.ejs'),
  templateParameters: {
    title: `中后台通用业务模版-${packageName}`,
    rootId: rootID,
  },
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
}

const publicPath = '/';

module.exports = {
  entry: {
    index: resolveApp('./src/index.tsx'),
  },
  output: {
    pathinfo: true,
    publicPath,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      '@': resolveApp('./src/'),
      '~': resolveApp('./node_modules/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        // eslint-disable-next-line
        test: /[\\\/]icons[\\\/].*\.svg(\?v=\d+\.\d+\.\d+)?$/,
        include: resolveApp('src'),
        loader: 'svg-inline-loader',
      },
      {
        // eslint-disable-next-line
        test: /[\\\/]anticons[\\\/].*\.svg(\?v=\d+\.\d+\.\d+)?$/,
        include: resolveApp('src'),
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: '@svgr/webpack',
            options: {
              babel: false,
              icon: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
    }),
    new HtmlWebpackPlugin(htmlCfg),
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          ROOT_NAME: JSON.stringify(rootID),
        },
      },
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new CleanWebpackPlugin(),
  ],
  performance: {
    hints: false,
  },
};
