/*var version = parseInt((Math.random() * 1000000) + 1);
var cacheName = 'ixp-cache-' + version;
var dataCacheName = 'ixp-data-cache-' + version;
*/

var cacheName = 'ixp-cache';
var dataCacheName = 'ixp-data-cache';

var filesToCache = [
    '/portal/master/image-xpert/',
    'js/app.js',
    'js/main.js',
    'css/inline.css',
    'css/main.css',
    'img/ic_add_white_24px.svg',
    'img/ic_refresh_white_24px.svg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');

  e.waitUntil(self.skipWaiting());

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');

  e.waitUntil(self.clients.claim());

  e.waitUntil(

    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  //var dataUrl = urlConfig.loadAlbumsUrl;
  var dataUrl = 'THIS IS NOT IMPLEMENTED YET';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */

    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
      e.respondWith(
          caches.match(e.request, {ignoreVary: true}).then(function (response) {
              // {ignoreVary: true} is extremely important - without it caching will not work!

              console.log('[ServiceWorker]', response ? "Serving from cache" : "Requesting from the server", ": ",
                  e.request.url);
              return response || fetch(e.request);
          })
      );
  }
});
