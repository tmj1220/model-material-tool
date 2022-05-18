const path = require('path');
const fs = require('fs');
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const theme = require('./antTheme')

const baseConfig = require('./webpack.base.config')

const prodGzipList = ['js', 'css'];

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const publicPath = '/';

// 未开启 css module 的 loader
const cssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath,
    },
  },
  {
    loader: 'css-loader',
    options: {
      // importLoaders: 1,
      // esModule: true,
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

const config = {
  mode: 'production',
  bail: true,
  devtool: false,
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    path: resolveApp('dist'),
  },
  module: {
    strictExportPresence: true,
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
            name: 'static/images/[name].[contenthash:8].[ext]',
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
            name: 'static/fonts/[name].[contenthash:8].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new CompressionWebpackPlugin({
      // filename: "static/js/[name].js",
      algorithm: 'gzip', // 指定生成gzip格式
      test: new RegExp(`\\.(${prodGzipList.join('|')})$`), // 匹配哪些格式文件需要压缩
      threshold: 10240, // 对超过10k的数据进行压缩
      minRatio: 0.6, // 压缩比例，值为0 ~ 1
    }),
    ...(process.env.ANALYZ ? [new BundleAnalyzerPlugin()] : []),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[id].[contenthash:8].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'common',
          priority: 2,
          enforce: true,
          maxSize: 500000,
        },
      },
    },
  },
}

module.exports = merge(baseConfig, config);
