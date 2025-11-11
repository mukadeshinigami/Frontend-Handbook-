# Блок 15: PWA и Service Workers

## Введение

**PWA (Progressive Web App)** — веб-приложение, которое работает как нативное приложение:
- ✅ Устанавливается на устройство
- ✅ Работает офлайн
- ✅ Отправляет push-уведомления
- ✅ Быстрая загрузка
- ✅ Адаптивный дизайн

**Service Worker** — JavaScript-скрипт, работающий в фоне браузера:
- Перехватывает сетевые запросы
- Кеширует ресурсы
- Синхронизирует данные в фоне
- Отправляет push-уведомления

---

## Требования для PWA

### 1. HTTPS
PWA работает только по HTTPS (кроме localhost).

### 2. Manifest (манифест приложения)

```json
// manifest.json
{
  "name": "My PWA App",
  "short_name": "PWA",
  "description": "My awesome Progressive Web App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3498db",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

```html
<!-- index.html -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#3498db">
```

### 3. Service Worker

```javascript
// sw.js (в корне проекта)
const CACHE_NAME = 'my-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кеша или делаем запрос
        return response || fetch(event.request);
      })
  );
});
```

### Регистрация Service Worker

```javascript
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
```

---

## Стратегии кеширования

### 1. Cache First (кеш приоритетен)

Сначала ищем в кеше, если нет — запрос к сети.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
```

**Когда использовать:** Статичные ресурсы (CSS, JS, изображения).

### 2. Network First (сеть приоритетна)

Сначала запрос к сети, если не получилось — из кеша.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Сохраняем в кеш
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Если сеть недоступна — из кеша
        return caches.match(event.request);
      })
  );
});
```

**Когда использовать:** API-запросы, динамический контент.

### 3. Stale While Revalidate

Возвращаем из кеша, но параллельно обновляем кеш.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        
        return cachedResponse || fetchPromise;
      });
    })
  );
});
```

**Когда использовать:** Контент, где важна скорость, но нужны обновления.

### 4. Network Only

Всегда запрос к сети (без кеша).

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
```

### 5. Cache Only

Всегда из кеша (без сети).

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request));
});
```

---

## Workbox (библиотека для Service Workers)

**Workbox** упрощает работу с Service Workers.

```bash
npm install workbox-cli --global
```

### workbox-config.js

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,css,js,png,jpg,svg}'
  ],
  swDest: 'dist/sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 минут
        }
      }
    }
  ]
};
```

```bash
workbox generateSW workbox-config.js
```

### Использование Workbox напрямую

```javascript
// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
      })
    ]
  })
);

workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 минут
      })
    ]
  })
);
```

---

## Офлайн-страница

```javascript
// sw.js
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_PAGE))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_PAGE);
        })
    );
  }
});
```

```html
<!-- offline.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Offline</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <div>
    <h1>📡 You're offline</h1>
    <p>Please check your internet connection</p>
  </div>
</body>
</html>
```

---

## Push-уведомления

### Запрос разрешения

```javascript
// main.js
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted');
    await subscribeToPush();
  }
}

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
  });
  
  // Отправляем subscription на сервер
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

### Обработка push-уведомлений

```javascript
// sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

---

## Background Sync

Синхронизация данных в фоне.

```javascript
// main.js
async function sendMessage(message) {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify(message)
    });
  } catch (error) {
    // Сохраняем в IndexedDB и регистрируем sync
    await saveToIndexedDB(message);
    
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-messages');
  }
}
```

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  const messages = await getMessagesFromIndexedDB();
  
  for (const message of messages) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(message)
      });
      await deleteFromIndexedDB(message.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

---

## Установка PWA

### Кнопка установки

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Показываем кнопку установки
  const installButton = document.getElementById('installBtn');
  installButton.style.display = 'block';
  
  installButton.addEventListener('click', async () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    deferredPrompt = null;
  });
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
});
```

---

## Отладка PWA

### Chrome DevTools

1. **Application tab** → Service Workers
2. **Application tab** → Manifest
3. **Lighthouse** → PWA audit

### Проверка offline

В DevTools → Network → Offline.

---

## Рекомендации

✅ Используйте HTTPS (обязательно для SW)  
✅ Создайте manifest.json с иконками разных размеров  
✅ Реализуйте офлайн-страницу  
✅ Используйте Workbox для упрощения  
✅ Кешируйте статичные ресурсы с Cache First  
✅ API-запросы — Network First  

❌ Не кешируйте всё подряд (переполнение памяти)  
❌ Не забывайте обновлять CACHE_NAME при изменениях  
❌ Не блокируйте основной поток в Service Worker  

**Переходите к практике!** 🚀
