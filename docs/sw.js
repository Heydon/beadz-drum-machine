importScripts('sw-cache-polyfill.js');

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('beadz').then(function(cache) {
      return cache.addAll([
        './',
        './css/style.css',
        './js/app.js',
        './sounds/crash.mp3',
        './sounds/hat.mp3',
        './sounds/kick.mp3',
        './sounds/ride.mp3',
        './sounds/snare_light.mp3',
        './sounds/snare.mp3',
        './images/grip.svg',
        './images/line.svg',
        './images/tick.svg',
        'https://fonts.googleapis.com/css?family=Fredoka+One'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
// J5L2aA58Zc