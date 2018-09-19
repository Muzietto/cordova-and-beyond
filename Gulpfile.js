const gulp = require('gulp');
const log = require('fancy-log');
const fs = require('fs');
const path = require('path');
const rename = require('gulp-rename');
const injectString = require('gulp-inject-string');
const exec = require('./tools/gulp-exec');
const { argv } = require('yargs')
  .alias('e', 'environment')
  .alias('t', 'target')
  .alias('p', 'platform')
  .default('t', 'development');
const packageJson = require('./package.json');

const releaseFlag = argv.target === 'production' ? '--release' : '';
const getPlatform = args => {
  const command = args.p || args._[0] || 'browser'
  const platforms = ['android', 'browser']
  return platforms.filter(platform => command.includes(platform))[0]
};
const platform = getPlatform(argv);

gulp.task('watch', () => {
  gulp.watch('src/**/**.js', ['build-browser']);
})

gulp.task('webpack-watch', ['clean-www'], () => webpackTask(true));
gulp.task('webpack-single', ['clean-www'], () => webpackTask(false));
gulp.task('webpack-dev-server', ['clean-www'], webpackDevServerTask);

gulp.task('default', ['webpack-single']);

gulp.task('build-android', ['webpack-single'], () =>
  exec(`cordova build android ${releaseFlag}`)
);

gulp.task('run-android', ['webpack-single'], () =>
  exec('cordova run android')
);

gulp.task('build-browser', ['webpack-single'], () =>
  exec(`cordova build browser`)
);

gulp.task('run-browser', ['webpack-single'], () =>
  exec('cordova run browser')
);

gulp.task('clean-www', () =>
  exec('rm -rf www/*')
);

gulp.task('clean-all', ['clean-www'], () =>
  exec('rm -rf platforms/* plugins/*')
);

gulp.task('prepare-cordova', ['clean-all'], async () => {
  await exec('([ -d www ] || mkdir www)');

  for (const p of ['browser', 'android']) {
    if (platform !== p) {
      await exec(`cordova platform add ${p}`);
    }
  }

  await exec('cordova prepare');
})

function webpackTask(watch, wwwRoot = 'www') {
  const webpackStream = require('webpack-stream');
  const webpack = require('webpack');
  const plumber = require('gulp-plumber');
  const webpackConfig = require('./config/webpack.config.js')(
    argv.environment || 'development',
    argv.target
  );

  const ENTRY_POINT = webpackConfig.entry;
  const OUTPUT_DIR = path.join(__dirname, wwwRoot);

  const config = Object.assign({}, webpackConfig, { watch });

  return gulp
    .src(ENTRY_POINT)
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
    .pipe(gulp.dest(OUTPUT_DIR));
}

function webpackDevServerTask(callback) {
  // https://medium.com/@minozhenko/content-security-policy-for-webpack-b4d1dd305feb
  // gulp.start('add-csp')
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');

  const webpackConfig = require('./config/webpack.config.js')(
    argv.environment || 'dev',
    argv.target
  );

  webpackConfig.entry.unshift(
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8100/',
    'webpack/hot/dev-server'
  );
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    stats: { colors: true },
  });

  server.listen(8100, 'localhost', () => {});
  log('[webpack-dev-server]', 'http://localhost:8100/');
  callback();
}
