const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .sass('resources/scss/app.scss', 'public/css')
   .copyDirectory('resources/assets/images', 'public/images')
   .react()
   .version();
   // .browserSync();