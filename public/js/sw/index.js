require('serviceworker-cache-polyfill');

var version  = 'v15';
var staticCacheName = "dbCache";

	//Install event to prepare service worker
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache){
			return cache.addAll([
				'./',
				'css/bootstrap.min.css',
				'css/style.css',
				'js/bootstrap.min.js',
				'js/jquery.min.js',
				"https://free.currencyconverterapi.com/api/v5/currencies"
			]);
		})
	);
});

//Data to be stored
var expectedCaches = [
	staticCacheName,
	'currency-names',	//Names of the various currencies_list
	'currency-rate'		//Rates between the different currencies
];

// on activate state
self.addEventListener('activate', function(event){
	var cacheWhitelist = ['staticCacheName'];
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cacheName){
					IF(cacheWhitelist.indexOf(cacheName) == -1)
					{
							return caches.delete(cacheName);
					}
				})
			);
		})
	);
});


self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request).then(function(response){
			if(response){
				return response;
			}
			return fetch(event.request);
		})
	);
});

// on message
self.addEventListener('message', function(event){
	if(event.data.action == 'skipWaiting'){
		self.skipWaiting();
	}
});
