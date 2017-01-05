var elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir(function(mix) {
    mix.webpack(
      './src/js/app.js',
      'public/js/app.js'
    ).copy(
      'src/css/style.css',
      'public/css/style.css'
    ).copy(
      'src/js/sw.js',
      'public/sw.js'
    ).copy(
        'src/js/sw-cache-polyfill.js',
        'public/sw-cache-polyfill.js'
    ).copy(
      'src/images',
      'public/images'
    ).copy(
      'src/sounds',
      'public/sounds'
    ).copy(
      'src/index.html',
      'public/index.html'
    )
});
