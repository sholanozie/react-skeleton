const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = ({ NODE_ENV }, { mode }) => {
  const env = require(`./src/config/${NODE_ENV}.json`);
  const rules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      resolve: {
        extensions: ['.js', '.jsx']
      },
      use: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: [
        mode === 'production'
          ? MiniCssExtractPlugin.loader
          : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            url: false,
            minimize: true,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer({
                browsers: ['ie >= 8', 'last 5 version']
              })
            ],
            sourceMap: true
          }
        },
      ]
    }
  ];

  const plugins = [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(NODE_ENV),
      __VERSION__: JSON.stringify(require('./package.json').version),
    }),
    new CleanWebpackPlugin([
      'public'
    ]),
    new CopyWebpackPlugin([{
      from: 'src/assets'
    }]),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'app.[contenthash].css'
    })
  ];

  if (mode === 'development') {
    rules.push({
      enforce: 'pre',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      resolve: {
        extensions: ['.js', '.jsx']
      },
      use: {
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          emitError: false
        },
      },
    });
    plugins.push(new CleanTerminalPlugin({
      message: 'Restarting dev server...'
    }));
  }

  const config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      publicPath: '/',
      filename: 'bundle.[hash].js'
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: true
    },
    module: {
      rules
    },
    plugins
  };

  return config;
};