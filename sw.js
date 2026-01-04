const CACHE_NAME = 'bp-record-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// サービスワーカーのインストール時：必要なファイルをキャッシュに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and caching assets');
      return cache.addAll(ASSETS);
    })
  );
});

// サービスワーカーの有効化時：古いキャッシュを削除（バージョン管理用）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// ネットワークリクエスト時：キャッシュがあればそれを返し、なければ通信する
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返す（オフライン対応）
      return response || fetch(event.request);
    })
  );
});
