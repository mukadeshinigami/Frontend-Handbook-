# Блок 15: PWA и Service Workers — Практика

## Проект 1: Offline-First Todo App

Создаём Todo-приложение, работающее офлайн.

### Структура

```
pwa-todo/
  ├── index.html
  ├── manifest.json
  ├── sw.js
  ├── css/
  │   └── style.css
  ├── js/
  │   ├── app.js
  │   ├── db.js
  │   └── sync.js
  └── icons/
      ├── icon-72x72.png
      ├── icon-192x192.png
      └── icon-512x512.png
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo PWA</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#3498db">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>📝 Todo App</h1>
      <div class="status">
        <span id="onlineStatus" class="online">● Online</span>
      </div>
    </header>
    
    <button id="installBtn" class="install-btn" style="display: none;">
      Install App
    </button>
    
    <form id="todoForm">
      <input 
        type="text" 
        id="todoInput" 
        placeholder="Add new todo..." 
        required
      >
      <button type="submit">Add</button>
    </form>
    
    <div id="todoList"></div>
  </div>
  
  <script src="/js/db.js"></script>
  <script src="/js/sync.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
```

### manifest.json

```json
{
  "name": "Todo PWA",
  "short_name": "Todo",
  "description": "Offline-first todo application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3498db",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### sw.js

```javascript
const CACHE_NAME = 'todo-pwa-v1';
const RUNTIME_CACHE = 'runtime-cache';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js',
  '/js/sync.js',
  '/icons/icon-192x192.png'
];

// Установка
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Static assets - Cache First
  event.respondWith(cacheFirst(request));
});

// Cache First Strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Background Sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  const db = await openDB();
  const tx = db.transaction('pending', 'readonly');
  const store = tx.objectStore('pending');
  const todos = await store.getAll();
  
  for (const todo of todos) {
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
      
      // Удаляем из pending после успешной отправки
      const deleteTx = db.transaction('pending', 'readwrite');
      await deleteTx.objectStore('pending').delete(todo.id);
    } catch (error) {
      console.error('[SW] Sync failed:', error);
    }
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'close', title: 'Close' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper: Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TodoDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

### js/db.js

```javascript
class TodoDB {
  constructor() {
    this.dbName = 'TodoDB';
    this.version = 1;
    this.db = null;
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Основное хранилище todos
        if (!db.objectStoreNames.contains('todos')) {
          const todosStore = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
          todosStore.createIndex('completed', 'completed', { unique: false });
        }
        
        // Хранилище для pending sync
        if (!db.objectStoreNames.contains('pending')) {
          db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }
  
  async addTodo(todo) {
    const tx = this.db.transaction('todos', 'readwrite');
    const store = tx.objectStore('todos');
    const id = await store.add(todo);
    return { ...todo, id };
  }
  
  async getAllTodos() {
    const tx = this.db.transaction('todos', 'readonly');
    const store = tx.objectStore('todos');
    return await store.getAll();
  }
  
  async updateTodo(id, updates) {
    const tx = this.db.transaction('todos', 'readwrite');
    const store = tx.objectStore('todos');
    const todo = await store.get(id);
    
    if (todo) {
      const updated = { ...todo, ...updates };
      await store.put(updated);
      return updated;
    }
    
    return null;
  }
  
  async deleteTodo(id) {
    const tx = this.db.transaction('todos', 'readwrite');
    const store = tx.objectStore('todos');
    await store.delete(id);
  }
  
  async addPending(data) {
    const tx = this.db.transaction('pending', 'readwrite');
    const store = tx.objectStore('pending');
    await store.add(data);
  }
}

const db = new TodoDB();
```

### js/sync.js

```javascript
class SyncManager {
  static async registerSync(tag) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      try {
        await registration.sync.register(tag);
        console.log('Sync registered:', tag);
      } catch (error) {
        console.error('Sync registration failed:', error);
      }
    }
  }
  
  static async syncTodos() {
    await this.registerSync('sync-todos');
  }
}
```

### js/app.js

```javascript
let installPrompt;

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
      
      // Проверяем обновления SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New SW available, please refresh');
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
  await db.init();
  await renderTodos();
  setupEventListeners();
  updateOnlineStatus();
});

// Online/Offline status
function updateOnlineStatus() {
  const statusEl = document.getElementById('onlineStatus');
  
  if (navigator.onLine) {
    statusEl.textContent = '● Online';
    statusEl.className = 'online';
  } else {
    statusEl.textContent = '● Offline';
    statusEl.className = 'offline';
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Рендер todos
async function renderTodos() {
  const todos = await db.getAllTodos();
  const todoList = document.getElementById('todoList');
  
  if (todos.length === 0) {
    todoList.innerHTML = '<p class="empty">No todos yet</p>';
    return;
  }
  
  todoList.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.completed ? 'completed' : ''}">
      <input 
        type="checkbox" 
        ${todo.completed ? 'checked' : ''} 
        onchange="toggleTodo(${todo.id})"
      >
      <span>${todo.text}</span>
      <button onclick="deleteTodo(${todo.id})" class="delete-btn">×</button>
    </div>
  `).join('');
}

// Event listeners
function setupEventListeners() {
  document.getElementById('todoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const todo = {
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    await db.addTodo(todo);
    
    // Если офлайн — добавляем в pending sync
    if (!navigator.onLine) {
      await db.addPending(todo);
      await SyncManager.syncTodos();
    } else {
      // Отправляем на сервер
      try {
        await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo)
        });
      } catch (error) {
        console.error('Failed to sync:', error);
        await db.addPending(todo);
        await SyncManager.syncTodos();
      }
    }
    
    input.value = '';
    await renderTodos();
  });
}

// Toggle todo
async function toggleTodo(id) {
  const todo = await db.getAllTodos().then(todos => todos.find(t => t.id === id));
  
  if (todo) {
    await db.updateTodo(id, { completed: !todo.completed });
    await renderTodos();
  }
}

// Delete todo
async function deleteTodo(id) {
  await db.deleteTodo(id);
  await renderTodos();
}

// Install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  
  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'block';
  
  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    installPrompt.prompt();
    
    const { outcome } = await installPrompt.userChoice;
    console.log(`Install prompt outcome: ${outcome}`);
    installPrompt = null;
  });
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  installPrompt = null;
});

// Update notification
function showUpdateNotification() {
  if (confirm('New version available! Reload to update?')) {
    window.location.reload();
  }
}
```

### css/style.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 28px;
  color: #333;
}

.status {
  font-size: 14px;
  font-weight: 600;
}

.online {
  color: #27ae60;
}

.offline {
  color: #e74c3c;
}

.install-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.install-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

input[type="text"] {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #3498db;
}

button[type="submit"] {
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

button[type="submit"]:hover {
  background: #2980b9;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.todo-item:hover {
  transform: translateX(5px);
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}

.todo-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-item span {
  flex: 1;
  font-size: 16px;
}

.delete-btn {
  width: 32px;
  height: 32px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: #c0392b;
  transform: scale(1.1);
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
```

---

## Проект 2: News Reader с Push Notifications

### Запрос разрешения на уведомления

```javascript
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted');
    await subscribeToPush();
  } else if (permission === 'denied') {
    console.log('Notification permission denied');
  }
}

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
```

---

## Итог

✅ **Service Workers** — офлайн-функциональность  
✅ **IndexedDB** — локальное хранилище данных  
✅ **Background Sync** — синхронизация в фоне  
✅ **Push Notifications** — уведомления  
✅ **Install prompt** — установка PWA  

**Вы освоили PWA!** 🎯
