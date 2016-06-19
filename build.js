/*eslint-env node */
/*eslint no-console:0 */

var uglify = require('uglify-js')
var fs = require('fs')

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
