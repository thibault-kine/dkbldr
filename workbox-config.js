module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,css,json,ttf,png,jpg,svg,html}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};