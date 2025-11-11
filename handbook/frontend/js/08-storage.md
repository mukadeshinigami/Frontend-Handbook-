# Блок 8: Web Storage (localStorage и sessionStorage)

## Введение

**Web Storage API** позволяет сохранять данные в браузере пользователя. Есть два типа хранилища:
- **localStorage** — данные сохраняются навсегда (пока не удалят вручную)
- **sessionStorage** — данные живут только в рамках вкладки/сессии

**Преимущества:**
- ✅ Простой API
- ✅ Больше места, чем cookies (5-10 МБ)
- ✅ Данные не отправляются на сервер
- ✅ Синхронный доступ

**Ограничения:**
- ❌ Только строки (нужна сериализация JSON)
- ❌ Синхронный API (может замедлить UI)
- ❌ Нет встроенного шифрования
- ❌ Доступ только из JavaScript (не из Web Workers)

---

## localStorage

### Базовые операции

```javascript
// Сохранение
localStorage.setItem('username', 'Алексей');
localStorage.setItem('age', '25');

// Получение
const username = localStorage.getItem('username'); // 'Алексей'
const age = localStorage.getItem('age'); // '25'

// Удаление
localStorage.removeItem('age');

// Очистка всего хранилища
localStorage.clear();

// Проверка наличия ключа
if (localStorage.getItem('username')) {
  console.log('Пользователь найден');
}
```

### Альтернативный синтаксис

```javascript
// Можно использовать как объект (не рекомендуется)
localStorage.username = 'Алексей';
console.log(localStorage.username); // 'Алексей'
delete localStorage.username;

// Лучше использовать методы:
localStorage.setItem('username', 'Алексей');
localStorage.getItem('username');
localStorage.removeItem('username');
```

### Количество элементов

```javascript
console.log(localStorage.length); // Количество ключей

// Перебор всех ключей
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}
```

---

## Работа с объектами (JSON)

localStorage хранит **только строки**. Для объектов нужна сериализация.

```javascript
// Сохранение объекта
const user = {
  name: 'Алексей',
  age: 25,
  email: 'alex@example.com',
  preferences: {
    theme: 'dark',
    language: 'ru'
  }
};

localStorage.setItem('user', JSON.stringify(user));

// Получение объекта
const savedUser = JSON.parse(localStorage.getItem('user'));
console.log(savedUser.name); // 'Алексей'
console.log(savedUser.preferences.theme); // 'dark'

// Обновление объекта
savedUser.age = 26;
localStorage.setItem('user', JSON.stringify(savedUser));
```

### Обёртка для удобства

```javascript
const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  
  remove(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  }
};

// Использование
storage.set('user', { name: 'Алексей', age: 25 });
const user = storage.get('user');
console.log(user.name); // 'Алексей'
```

---

## sessionStorage

Работает **идентично** localStorage, но данные удаляются при закрытии вкладки.

```javascript
// Сохранение
sessionStorage.setItem('temp_data', 'Временные данные');

// Получение
const tempData = sessionStorage.getItem('temp_data');

// Удаление
sessionStorage.removeItem('temp_data');

// Очистка
sessionStorage.clear();
```

### Когда использовать sessionStorage

```javascript
// Временные данные формы
sessionStorage.setItem('form_draft', JSON.stringify(formData));

// Состояние фильтров на странице
sessionStorage.setItem('filters', JSON.stringify({ category: 'tech', sort: 'date' }));

// Прогресс многошаговой формы
sessionStorage.setItem('step', '2');

// Выбранные элементы в списке
sessionStorage.setItem('selected_ids', JSON.stringify([1, 5, 9]));
```

---

## Размер хранилища

### Проверка доступного места

```javascript
function getStorageSize() {
  let total = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  
  return (total / 1024).toFixed(2) + ' KB';
}

console.log('Занято:', getStorageSize());
```

### Проверка лимита

```javascript
function checkStorageLimit() {
  try {
    const testKey = '__storage_test__';
    const testData = new Array(1024 * 1024).join('a'); // 1 MB
    
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Хранилище переполнено');
      return false;
    }
    throw e;
  }
}
```

---

## Обработка ошибок

```javascript
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Хранилище переполнено');
      // Можно очистить старые данные
      clearOldData();
    } else if (e.name === 'SecurityError') {
      console.error('Доступ к localStorage запрещён (приватный режим?)');
    } else {
      console.error('Ошибка записи:', e);
    }
    return false;
  }
}

function safeGetItem(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Ошибка чтения:', e);
    return null;
  }
}
```

---

## Storage Event

Событие срабатывает, когда **другая вкладка/окно** изменяет localStorage.

```javascript
window.addEventListener('storage', (event) => {
  console.log('Ключ:', event.key);
  console.log('Старое значение:', event.oldValue);
  console.log('Новое значение:', event.newValue);
  console.log('URL:', event.url);
  console.log('Storage:', event.storageArea);
  
  // Пример: синхронизация темы между вкладками
  if (event.key === 'theme') {
    document.body.className = event.newValue;
  }
});
```

**Важно:** Событие **не срабатывает** в той же вкладке, где произошло изменение.

---

## Практические примеры

### Пример 1: Сохранение настроек

```javascript
const settings = {
  theme: 'dark',
  language: 'ru',
  notifications: true,
  fontSize: 16
};

// Сохранение
function saveSettings(newSettings) {
  const current = JSON.parse(localStorage.getItem('settings')) || {};
  const updated = { ...current, ...newSettings };
  localStorage.setItem('settings', JSON.stringify(updated));
}

// Загрузка
function loadSettings() {
  const saved = localStorage.getItem('settings');
  return saved ? JSON.parse(saved) : settings; // Дефолтные значения
}

// Применение
function applySettings() {
  const settings = loadSettings();
  document.body.className = settings.theme;
  document.documentElement.style.fontSize = settings.fontSize + 'px';
}

// При загрузке страницы
applySettings();

// При изменении настроек
document.getElementById('themeSelect').addEventListener('change', (e) => {
  saveSettings({ theme: e.target.value });
  applySettings();
});
```

### Пример 2: Автосохранение формы

```javascript
const form = document.getElementById('myForm');
const inputs = form.querySelectorAll('input, textarea, select');

// Автосохранение при вводе
inputs.forEach(input => {
  input.addEventListener('input', () => {
    saveFormData();
  });
});

function saveFormData() {
  const data = {};
  
  inputs.forEach(input => {
    if (input.type === 'checkbox') {
      data[input.name] = input.checked;
    } else if (input.type === 'radio') {
      if (input.checked) {
        data[input.name] = input.value;
      }
    } else {
      data[input.name] = input.value;
    }
  });
  
  localStorage.setItem('form_draft', JSON.stringify(data));
  console.log('Форма сохранена');
}

function loadFormData() {
  const saved = localStorage.getItem('form_draft');
  if (!saved) return;
  
  const data = JSON.parse(saved);
  
  inputs.forEach(input => {
    if (data[input.name] !== undefined) {
      if (input.type === 'checkbox') {
        input.checked = data[input.name];
      } else if (input.type === 'radio') {
        input.checked = input.value === data[input.name];
      } else {
        input.value = data[input.name];
      }
    }
  });
  
  console.log('Форма восстановлена');
}

// При загрузке страницы
loadFormData();

// Очистка после отправки
form.addEventListener('submit', () => {
  localStorage.removeItem('form_draft');
});
```

### Пример 3: Кэширование API запросов

```javascript
async function fetchWithCache(url, cacheTime = 60000) {
  const cacheKey = `cache_${url}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    
    // Проверка срока действия
    if (Date.now() - timestamp < cacheTime) {
      console.log('Возвращаем из кэша');
      return data;
    }
  }
  
  // Загрузка данных
  const response = await fetch(url);
  const data = await response.json();
  
  // Сохранение в кэш
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
}

// Использование
const users = await fetchWithCache('/api/users', 5 * 60 * 1000); // 5 минут
```

### Пример 4: История просмотров

```javascript
function addToHistory(item) {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  
  // Удаляем дубликаты
  const filtered = history.filter(h => h.id !== item.id);
  
  // Добавляем в начало
  filtered.unshift({
    ...item,
    viewedAt: Date.now()
  });
  
  // Ограничиваем размер (последние 50)
  const limited = filtered.slice(0, 50);
  
  localStorage.setItem('history', JSON.stringify(limited));
}

function getHistory() {
  return JSON.parse(localStorage.getItem('history')) || [];
}

function clearHistory() {
  localStorage.removeItem('history');
}

// Использование
addToHistory({ id: 123, title: 'Статья 1' });
const history = getHistory();
```

### Пример 5: Корзина покупок

```javascript
class ShoppingCart {
  constructor() {
    this.key = 'shopping_cart';
  }
  
  getCart() {
    const cart = localStorage.getItem(this.key);
    return cart ? JSON.parse(cart) : [];
  }
  
  addItem(product) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem(this.key, JSON.stringify(cart));
    this.notifyUpdate();
  }
  
  removeItem(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(this.key, JSON.stringify(cart));
    this.notifyUpdate();
  }
  
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(this.key, JSON.stringify(cart));
      this.notifyUpdate();
    }
  }
  
  clear() {
    localStorage.removeItem(this.key);
    this.notifyUpdate();
  }
  
  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  notifyUpdate() {
    window.dispatchEvent(new Event('cartUpdated'));
  }
}

// Использование
const cart = new ShoppingCart();

cart.addItem({ id: 1, name: 'Товар 1', price: 1000 });
cart.addItem({ id: 2, name: 'Товар 2', price: 2000 });

console.log('Корзина:', cart.getCart());
console.log('Итого:', cart.getTotal());

// Слушаем обновления
window.addEventListener('cartUpdated', () => {
  console.log('Корзина обновлена');
  updateCartBadge(cart.getItemCount());
});
```

---

## Безопасность

### ⚠️ Важно

```javascript
// ❌ НЕ храните конфиденциальные данные:
localStorage.setItem('password', '12345'); // Очень плохо!
localStorage.setItem('credit_card', '1234-5678-9012-3456'); // Опасно!
localStorage.setItem('api_secret', 'secret_key'); // Небезопасно!

// ✅ Можно хранить:
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'ru');
localStorage.setItem('user_id', '123');
localStorage.setItem('cart', JSON.stringify(cartItems));
```

### Базовое шифрование (простое)

```javascript
// Очень простое шифрование (НЕ безопасно для критичных данных!)
function simpleEncrypt(text, key) {
  return btoa(text + key); // Base64
}

function simpleDecrypt(encrypted, key) {
  const decoded = atob(encrypted);
  return decoded.slice(0, -key.length);
}

// Использование
const data = 'Мои данные';
const key = 'my_secret_key';

localStorage.setItem('data', simpleEncrypt(data, key));
const decrypted = simpleDecrypt(localStorage.getItem('data'), key);
```

**Для реальной безопасности используйте библиотеки шифрования (crypto-js).**

---

## localStorage vs sessionStorage vs Cookies

| Параметр | localStorage | sessionStorage | Cookies |
|----------|-------------|----------------|---------|
| **Время жизни** | Бесконечно | До закрытия вкладки | Устанавливается (max 1 год) |
| **Размер** | 5-10 МБ | 5-10 МБ | 4 КБ |
| **Отправка на сервер** | Нет | Нет | Да (каждый запрос) |
| **API** | Простой | Простой | Сложный |
| **Доступ** | JavaScript | JavaScript | JavaScript + HTTP |

---

## Рекомендации

### ✅ Хорошие практики

```javascript
// 1. Всегда используйте try/catch
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Ошибка записи:', e);
  }
}

// 2. Проверяйте наличие данных
const user = localStorage.getItem('user');
if (user) {
  const userData = JSON.parse(user);
}

// 3. Используйте префиксы для ключей
localStorage.setItem('app_settings', '...');
localStorage.setItem('app_user', '...');

// 4. Создавайте обёртки для типизации
const userStorage = {
  save: (user) => localStorage.setItem('user', JSON.stringify(user)),
  load: () => JSON.parse(localStorage.getItem('user') || '{}')
};
```

### ❌ Плохие практики

```javascript
// 1. Не храните сложные объекты без сериализации
localStorage.user = { name: 'Test' }; // ❌ Будет '[object Object]'

// 2. Не забывайте про ошибки парсинга
const data = JSON.parse(localStorage.getItem('data')); // ❌ Может упасть

// 3. Не храните слишком много данных
for (let i = 0; i < 10000; i++) {
  localStorage.setItem(`item_${i}`, 'data'); // ❌ Переполнение
}
```

---

## Резюме

**Изучено:**

✅ localStorage и sessionStorage API  
✅ Сохранение и получение данных  
✅ Работа с JSON  
✅ Storage Event  
✅ Обработка ошибок  
✅ Практические паттерны: настройки, автосохранение, кэширование, корзина  
✅ Безопасность и ограничения

**В следующем уроке:** Date API — работа с датами и временем

---

**Переходите к практике!** 🚀
