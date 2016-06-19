/*eslint-env node */
/*eslint no-console:0 */

var uglify = require('uglify-js')
var fs = require('fs')

var readmeFilename = 'README.md'
var readme = fs.readFileSync(readmeFilename).toString()

var min = uglify.minify('source.js', {
	compress: true,
	mangle: true
})

var bookmarklet = 'javascript:(' +
	// Javascript bookmarklets must be encoded in Sarafi.
	encodeURIComponent(min.code.replace(/^!/, '').replace(/;$/, '')) +
	')'

fs.writeFileSync('bookmarklet.js', bookmarklet)

console.log('bookmarklet.js written, ' + bookmarklet.length + ' characters.')

fs.writeFileSync(readmeFilename,
	readme.replace(
		/^\[bookmarklet-url\]:.+$/m,
		'[bookmarklet-url]: ' + bookmarklet
	)
)

console.log('Updated bookmarklet URL in ' + readmeFilename)
