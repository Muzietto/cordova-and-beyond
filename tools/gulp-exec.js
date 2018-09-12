/* eslint-disable import/no-extraneous-dependencies,no-console */
const path = require('path')
const gutil = require('gulp-util')
const cp = require('child_process')

const opt = {
  env: process.env,
}

// add npm bin directory to the environment variable PATH
try {
  const npmbin = cp
    .execSync('npm bin')
    .toString()
    .trim()
  if (npmbin) {
    opt.env.PATH = npmbin + path.delimiter + opt.env.PATH
  }
} catch (err) {
  console.error(err)
}

function exec(cmdstr, { followStdout = true, label = cmdstr } = {}) {
  return new Promise((resolve, reject) => {
    if (followStdout) {
      const p = cp.exec(cmdstr, opt)
      // p.stdout.pipe(process.stdout)
      p.stderr.pipe(process.stderr)
      p.stdout.on('data', data => gutil.log(`${label}\n${data}`))
      p.on('exit', code => {
        if (code === 0) resolve()
        else reject(code)
      })
    } else {
      cp.exec(cmdstr, opt, (error, stdout, stderr) => {
        if (stdout) {
          gutil.log(`command "${cmdstr}" output:`)
          process.stdout.write(stdout)
        }
        if (stderr) {
          gutil.log(`command "${cmdstr}" errors:`)
          process.stderr.write(stderr)
        }
        if (error) reject(error)
        else resolve()
      })
    }
  })
}

module.exports = exec
