/* eslint-disable */
const gulp = require('gulp')
const log = require('fancy-log')
const fs = require('fs')
const path = require('path')
const rename = require('gulp-rename')
const injectString = require('gulp-inject-string')
const exec = require('./tools/gulp-exec')
const { argv } = require('yargs')
  .alias('e', 'environment')
  .alias('t', 'target')
  .alias('p', 'platform')
  .default('t', 'development')
const packageJson = require('./package.json')

const releaseFlag = argv.target === 'production' ? '--release' : ''
const getPlatform = args => {
  const command = args.p || args._[0] || 'browser'
  const platforms = ['android', 'browser']
  return platforms.filter(platform => command.includes(platform))[0]
}
const platform = getPlatform(argv)

gulp.task('webpack-watch', () => webpackTask(true))
gulp.task('webpack-single', () => webpackTask(false))
gulp.task('webpack-dev-server', webpackDevServerTask)

gulp.task('default', ['webpack-single'])

gulp.task('build-android', ['webpack-single'], () =>
  exec(`cordova build android ${releaseFlag}`)
)

gulp.task('run-android', ['webpack-single'], () =>
  exec('cordova run android')
)

gulp.task('build-browser', ['webpack-single'], () =>
  exec(`cordova build browser`)
)

gulp.task('run-browser', ['webpack-single'], () =>
  exec('cordova run browser')
)

gulp.task('clean', () =>
  exec('rm -rf platforms/* plugins/* www/*')
)

gulp.task('prepare-cordova', [], async () => {
  await exec('([ -d www ] || mkdir www)')

//  for (const p of ['browser', 'android']) {
//    if (platform !== p) {
//      await exec(`cordova platform add ${p}`)
//    }
//  }

  await exec('cordova prepare')
})

function webpackTask(watch, wwwRoot = 'www') {
  const webpackStream = require('webpack-stream')
  const webpack = require('webpack')
  // need this to prevent the pipe from breaking on errors, and continue
  // watching files for changes.
  const plumber = require('gulp-plumber')
  const webpackConfig = require('./configs/webpack.config.js')(
    argv.environment || 'dev-shared',
    argv.target
  )

  const ENTRYPOINT = webpackConfig.entry
  const OUTPUT_DIR = path.join(__dirname, wwwRoot)
  console.log('-----> wwwRoot=' + wwwRoot)

  const config = Object.assign({}, webpackConfig, { watch })
  return gulp
    .src(ENTRYPOINT)
    .pipe(plumber())
    .pipe(
      webpackStream(config, webpack),
      null,
      (err, stats) => {
        if (err) {
          console.error(err)
        }
        console.log(stats)
      }
    )
    .pipe(gulp.dest(OUTPUT_DIR))
}

function webpackDevServerTask(callback) {
  gulp.start('add-csp')
  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')

  const webpackConfig = require('./configs/webpack.config.js')(
    argv.environment || 'dev',
    argv.target
  )

  webpackConfig.entry.unshift(
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8100/',
    'webpack/hot/dev-server'
  )
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const compiler = webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, {
    hot: true,
    stats: { colors: true },
  })
  server.listen(8100, 'localhost', () => {})
  log('[webpack-dev-server]', 'http://localhost:8100/')
  callback()
}
