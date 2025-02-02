let CACHE_NAME = 'testpwa';
let CACHE_FILES = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/manifest.json',
    '/icon512_rounded.png',
    '/favicon.ico',
    '/assets/smiley.gif'
]
//install or setup service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll(CACHE_FILES);
            setupIndexedDB();
        })
    )
})

function setupIndexedDB() {
    const request = indexedDB.open('offlineDB', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('offlineStore')) {
            db.createObjectStore('offlineStore', { keyPath: 'id' });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('offlineStore', 'readwrite');
        const store = transaction.objectStore('offlineStore');
        store.put({ id: 'offlineData', data: [] });
    };

}
//fetch from cache
self.addEventListener('fetch', (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then((res) => {
                if (res) {
                    return res;
                }
            })
        )
    }
})
