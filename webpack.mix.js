
// not actually laravel mix...
let mix = require('laravel-mix');

mix
    //.copyDirectory('src/images','dist/images')
    .js('src/js/main.js', 'js').sourceMaps()
    .sass('src/scss/screen.scss', 'css')
    .setPublicPath('dist')
    .setResourceRoot('../');
    
