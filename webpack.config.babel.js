import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';

module.exports = (env) => {
  const devMode = env.NODE_ENV;
  const isProduction = devMode === 'production';
  const optimization = {};

  const entrypoints = {
    app: path.resolve('source/scripts/app'),
    home: path.resolve('source/scripts/home'),
  };

  const modules = {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
      },
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  };

  const plugins = [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'images/**/*', to: '', context: 'source/assets/' },
        { from: 'files/**/*', to: '', context: 'source/assets/' },
        { from: '*', to: '', context: 'source/assets/html' },
      ],
    }),

    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ];

  if (isProduction) {
    optimization.minimize = true;
    optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        extractComments: 'false',
      }),
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ];
  }

  const stats = {
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    errors: true,
    errorDetails: true,
    source: true,
    timings: true,
    warnings: true,
  };

  return {
    entry: entrypoints,
    mode: devMode,
    optimization: optimization,
    stats: stats,
    module: modules,
    plugins: plugins,
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve('source'), path.resolve('node_modules')],
    },
    output: {
      path: path.resolve('build'),
      filename: '[name].js',
    },
  };
};
