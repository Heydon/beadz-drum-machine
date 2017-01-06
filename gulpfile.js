var elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir(function(mix) {
    mix.webpack(
      './src/js/app.js',
      'docs/js/app.js'
    ).copy(
      'src/css/style.css',
      'docs/css/style.css'
    ).copy(
      'src/js/sw.js',
      'docs/sw.js'
    ).copy(
      'src/manifest.json',
      'docs/manifest.json'
    ).copy(
      'src/js/sw-cache-polyfill.js',
      'docs/sw-cache-polyfill.js'
    ).copy(
      'src/images',
      'docs/images'
    ).copy(
      'src/sounds',
      'docs/sounds'
    ).copy(
      'src/index.html',
      'docs/index.html'
    )
});
