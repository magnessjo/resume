import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin-next';
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
    resume: path.resolve('source/scripts/resume'),
    dogs: path.resolve('source/scripts/dogs'),
    contact: path.resolve('source/scripts/contact'),
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
        { from: 'videos/**/*', to: '', context: 'source/assets/' },
        { from: 'files/**/*', to: '', context: 'source/assets/' },
        { from: 'pwa/*', to: '[name][ext]', context: 'source/assets/' },
        { from: 'source/assets/templates', to: '../templates' },
        { from: 'source/craft/*', to: '[name][ext]' },
      ],
    }),

    new WebpackShellPlugin({
      onBuildEnd: {
        scripts: [
          'cp -R source/assets/uploads craft/web',
          'rm -rf craft/web/cpresources',
          'mkdir craft/web/cpresources',
          'chmod -R 777 craft/web/cpresources',
        ],
      },
    }),

    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/templates/, '.htaccess', 'web.config'],
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
      path: path.resolve('craft/web'),
      filename: '[name].js',
    },
  };
};
