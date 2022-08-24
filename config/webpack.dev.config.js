const { merge } = require('webpack-merge')

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

// const smp = new SpeedMeasurePlugin();
const path = require('path');
const fs = require('fs')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const theme = require('./antTheme')
const baseConfig = require('./webpack.base.config')

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// 未开启 css module 的 loader
const cssLoader = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      // importLoaders: 1,
      esModule: false,
      // url: true,
      // import: true,
    },
  },
  'postcss-loader',
  {
    loader: 'less-loader',
    options: {
      lessOptions: {
        modifyVars: theme,
        javascriptEnabled: true,
      },
    },
  },

];
// 开启 css module 的 loader
const cssModulesLoader = JSON.parse(JSON.stringify(cssLoader));
cssModulesLoader[1].options.modules = {
  localIdentName: '[local]_[hash:base64:5]',
};
const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js',
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        // include: resolveApp('src'),
        oneOf: [
          {
            resourceQuery: /modules/, // 只要匹配到了这个，就是用css modules，
            use: cssModulesLoader.filter(Boolean),
          },
          {
            use: cssLoader.filter(Boolean),
          },
        ],
      },
      {
        test: /\.(png|jpeg|jpg|gif|bmp)/,
        include: resolveApp('src'),
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8196,
            name: 'static/images/[name].[ext]',
            esModule: false,
          },
        }],
      },
      {
        test: /\.(eot|woff|woff2|ttf)/,
        include: resolveApp('src'),
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8196,
            name: 'static/fonts/[name].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin({}),
  ],
  devServer: {
    static: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
    },
    port: 3000,
    host: '10.90.0.76',
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://10.90.0.75:8080', // 开发环境
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
})

// module.exports = smp.wrap();
module.exports = config;
