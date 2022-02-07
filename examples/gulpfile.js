const gulp = require('gulp')
const gulpIf = require('gulp-if')
const path = require('path')
const pug = require('gulp-pug')
const pugAlias = require('pug-alias')

const through2 = require('through2')
const emitty = require('@emitty/core').configure()

const aliases = {
  '@components': path.resolve(__dirname, 'src/components'),
  '@partials': path.resolve(__dirname, 'src/partials')
}

emitty.language({
  extensions: ['.pug'],
  parser: require('pug-language-alias').parse.bind(this, aliases)
})

global.watch = false
global.changedFile = {
  markup: undefined
}

const getFilter = () => (
	through2.obj(function(file, _, callback) {
    emitty
      .filter(file.path, global.changedFile['markup'])
      .then((result) => {
				if (result) {
					this.push(file)
				}

				callback() 
      })
	})
)

const markup = () => (
  gulp.src('src/*.pug')
    .pipe(gulpIf(global.watch, getFilter()))
    .pipe(pug({
      plugins: [pugAlias(aliases)]
    }))
    .pipe(gulp.dest('dist'))
)

const markupWatch = () => {
  gulp.watch('src/**/*.pug', markup)
    .on('all', (_, filePath) => {
      global.changedFile.markup = filePath
    })
}

const emittyInit = (callback) => {
  global.watch = true

  callback()
}

exports.watch = gulp.series(
  emittyInit,
  markup,
  markupWatch
)
