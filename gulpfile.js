var elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir(function(mix) {
    mix.webpack(
      './src/js/app.js',
      './public/js'
    ).copy(
      './src/css/style.css',
      './public/css'
    ).copy(
      './src/index.html',
      './public'
    )
});
