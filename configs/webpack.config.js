const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, '..')
const SOURCES_PATH = path.resolve(ROOT_PATH, 'src')
const MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules')
const CONFIGS_PATH = path.resolve(ROOT_PATH, 'configs')

module.exports = function getWebpackConfig(
  environment,
  target = 'development'
) {
  const isProduction = target === 'production'
  const isDevelopment = target === 'development'
  const enableSourceMap = !isProduction
  const config = {
    watch: false,
    entry: ['./src/js/app.js'],
    output: {
      path: path.resolve(ROOT_PATH, 'www'),
      filename: 'index.js',
    },

    // use inline source maps.
    devtool: '#inline-source-map',

    module: {
      rules: [
        {
          test: /\.js$|\.jsx$/,
          include: [
            SOURCES_PATH,
            CONFIGS_PATH,
//            path.resolve(MODULES_PATH, 'isemail'),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['env'/*, 'flow', 'react'*/],
              plugins: [
                //'react-hot-loader/babel',
                'transform-object-rest-spread',
                'transform-class-properties',
                'transform-export-default',
                [
                  'transform-runtime',
                  {
                    polyfill: false,
                    regenerator: true,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.(jpg|png|ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: "[name].[ext]", //https://survivejs.com/webpack/loading/images/
            outputPath: 'assets/pics/'
          },
        },
      ],
    },
    resolve: {
      modules: [path.join(ROOT_PATH), 'node_modules'],
      alias: {
        handlebars: 'handlebars/dist/handlebars.min.js', // https://github.com/wycats/handlebars.js/issues/1174#issuecomment-229918935
        assets: path.resolve(ROOT_PATH, 'src/assets'),
        app: path.resolve(ROOT_PATH, 'src'),
        environment: path.resolve(
          ROOT_PATH,
          'configs',
          `environment.${environment}.js`
        ),
      },
    },
    node: {
      dns: 'mock',
      net: 'mock',
    },
    plugins: [
//      new webpack.LoaderOptionsPlugin({
//        eslint: {
//          configFile: '.eslintrc',
//        },
//      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(ROOT_PATH, './src/index.html'),
        filename: 'index.html',
        inject: false,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(target),
      }),
    ],
  }

  if (isProduction) {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        compress: false,
        sourceMap: enableSourceMap,
        mangle: false,
      }),
    ])
  }

  if (isDevelopment) {
    config.plugins = [...config.plugins, new webpack.NamedModulesPlugin()]
  }

  return config
}
