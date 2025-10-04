const { defineConfig } = require('@rspack/cli');
const { HtmlRspackPlugin } = require('@rspack/core');

module.exports = defineConfig({
  entry: {
    main: './src/renderer/index.tsx',
  },
  output: {
    path: __dirname + '/dist/renderer',
    filename: '[name].[contenthash].js',
    clean: true,
  },
  target: 'electron-renderer',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    fallback: {
      global: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    static: {
      directory: __dirname + '/dist/renderer',
    },
  },
});