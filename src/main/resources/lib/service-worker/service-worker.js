const cacheName = 'ixp-cache';
const dataCacheName = 'ixp-data-cache';
const swVersion = '{{appVersion}}';
const debugging = false;
const offlineUrl = '{{siteUrl}}/offline';
const offlineCompactUrl = offlineUrl +'?version=compact';
const filesToCache = [
    offlineUrl,
    offlineCompactUrl,
    '{{siteUrl}}',
    '{{siteUrl}}/',
    '{{assetUrl}}/js/main.js',
    '{{assetUrl}}/js/image.js',
    '{{assetUrl}}/js/material.js',
    '{{assetUrl}}/js/dialog-polyfill.js',
    '{{assetUrl}}/css/main.css',
    '{{assetUrl}}/css/image.css',
    '{{assetUrl}}/css/material.css',
    '{{assetUrl}}/css/dialog-polyfill.css',
    '{{assetUrl}}/img/cancel.svg',
    '{{assetUrl}}/img/download_image.svg',
    '{{assetUrl}}/img/info.svg',
    '{{assetUrl}}/img/pencil.svg',
    '{{assetUrl}}/img/spinner.svg',
    '{{assetUrl}}/img/placeholder.png',
    '{{assetUrl}}/img/noisy-texture.png',
    '//fonts.googleapis.com/icon?family=Material+Icons',
    '//fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en'
];

const searchUrl = '/search?';
const imageUrl = '/image?imageId=';

function consoleLog(message) {
    if (debugging) {
        console.log('[ServiceWorker]', message);
    }
}

self.addEventListener('install', function(e) {
  consoleLog('Install');

  e.waitUntil(self.skipWaiting());

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      consoleLog('Caching app shell');
      return cache.addAll(filesToCache);
    }).catch(function(err) {
        console.log(err);
    })
  );
});

self.addEventListener('activate', function(e) {
    consoleLog('Activate');

  e.waitUntil(self.clients.claim());

  e.waitUntil(

    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
            consoleLog('Removing old cache ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

function containsDataUrl(url) {
    return url.indexOf(searchUrl) > -1 || url.indexOf(imageUrl) > -1;
}

function getFallbackPage(url) {
    consoleLog('Serving fallback page');

    if (url.indexOf(searchUrl) > -1) {
        return caches.match(offlineCompactUrl);
    }
    return caches.match(offlineUrl);
}

self.addEventListener('fetch', function(e) {
    consoleLog('Fetch ' + e.request.url);
    let responseUpdate = e.request.url.endsWith("?update=true");
    if (containsDataUrl(e.request.url) || responseUpdate) {
        /*
         * When the request URL contains dataUrl, the app is asking for fresh
         * weather data. In this case, the service worker always goes to the
         * network and then caches the response. This is called the "Cache then
         * network" strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
         */
        let url = responseUpdate ? e.request.url.replace("?update=true", "") : e.request.url;

        e.respondWith(
          caches.open(responseUpdate ? cacheName : dataCacheName).then(function(cache) {
              consoleLog("Fetching data url " + url);
              return fetch(e.request)
                  .then(function (response) {
                      cache.put(url, response.clone());
                      return response;
                  })
                  .catch(function (ex) {
                      consoleLog('Network is down. Trying to serve from cache...');
                      return cache.match(e.request, {
                          ignoreVary: true
                      })
                      .then(function (response) {
                          consoleLog((response ? 'Serving from cache' : 'No cached response found') + ': ' + e.request.url);

                          return response || getFallbackPage(e.request.url);
                      });
                  });
          })
        );
      }
      else {
          e.respondWith(
              caches.match(e.request, {
                  ignoreVary: true
              })
              .then(function (response) {
                  consoleLog((response ? 'Serving from cache' : 'Requesting from the server') + ': ' + e.request.url);

                  return response || fetch(e.request);
              })
          );
      }
});
