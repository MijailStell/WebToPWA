const merge = require('concat');

const files = [
    './dist/web-to-pwa/runtime.js',
    './dist/web-to-pwa/polyfills.js',
    './dist/web-to-pwa/scripts.js',
    './dist/web-to-pwa/main.js'
]

merge(files, './dist/web-to-pwa/pwa.js');
console.info('file generated');
