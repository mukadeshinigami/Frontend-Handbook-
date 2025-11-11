# Блок 6: Асинхронность в JavaScript

## Введение

**Асинхронность** — это способность программы выполнять задачи параллельно, не блокируя основной поток выполнения. JavaScript — однопоточный язык, но благодаря асинхронным механизмам может эффективно работать с операциями, требующими времени (сетевые запросы, таймеры, чтение файлов).

---

## Event Loop и Call Stack

### Call Stack (Стек вызовов)

Место, где JavaScript хранит информацию о выполняемых функциях.

```javascript
function first() {
  console.log('First');
}

function second() {
  first();
  console.log('Second');
}

second();
// Call Stack: second() → first() → console.log() → ...
```

### Event Loop

Механизм, который проверяет Call Stack и Task Queue, выполняя задачи из очереди, когда стек пуст.

```
┌───────────────────────────┐
│     Call Stack            │
│  (синхронный код)         │
└───────────┬───────────────┘
            │
┌───────────▼───────────────┐
│     Event Loop            │
│  (проверяет очередь)      │
└───────────┬───────────────┘
            │
┌───────────▼───────────────┐
│     Task Queue            │
│  (асинхронные задачи)     │
└───────────────────────────┘
```

**Пример:**

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');

// Вывод:
// Start
// End
// Timeout
```

**Почему так?**
1. `console.log('Start')` — выполняется сразу
2. `setTimeout` — добавляется в Task Queue
3. `console.log('End')` — выполняется сразу
4. Call Stack пуст → Event Loop берет задачу из очереди

---

## setTimeout и setInterval

### setTimeout

Выполняет функцию **один раз** через указанное время.

**Синтаксис:**

```javascript
const timerId = setTimeout(callback, delay, arg1, arg2, ...);
```

- `callback` — функция для выполнения
- `delay` — задержка в миллисекундах
- `arg1, arg2` — аргументы для функции

**Примеры:**

```javascript
// Простой таймер
setTimeout(() => {
  console.log('Прошло 2 секунды');
}, 2000);

// С аргументами
setTimeout((name, age) => {
  console.log(`${name}, ${age} лет`);
}, 1000, 'Алексей', 25);

// Отмена таймера
const timerId = setTimeout(() => {
  console.log('Не выполнится');
}, 5000);

clearTimeout(timerId); // Отменяем
```

**Важно:** Минимальная задержка в браузере — **4 мс** для вложенных `setTimeout`.

### setInterval

Выполняет функцию **многократно** через указанный интервал.

**Синтаксис:**

```javascript
const intervalId = setInterval(callback, delay, arg1, arg2, ...);
```

**Примеры:**

```javascript
// Счётчик
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Прошло ${count} секунд`);
  
  if (count === 5) {
    clearInterval(intervalId); // Останавливаем
  }
}, 1000);

// Часы
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(time);
}

const clockId = setInterval(updateClock, 1000);

// Остановка через 10 секунд
setTimeout(() => {
  clearInterval(clockId);
  console.log('Часы остановлены');
}, 10000);
```

### Рекурсивный setTimeout vs setInterval

**setInterval** не гарантирует точные интервалы, если функция выполняется дольше задержки.

```javascript
// ❌ Проблема с setInterval
setInterval(() => {
  // Если эта операция займёт > 1000ms,
  // следующий вызов произойдёт сразу после
  heavyOperation();
}, 1000);

// ✅ Решение: рекурсивный setTimeout
function schedule() {
  setTimeout(() => {
    heavyOperation();
    schedule(); // Следующий вызов после завершения
  }, 1000);
}

schedule();
```

---

## Promise (Промисы)

`Promise` — объект, представляющий результат асинхронной операции (успешный или с ошибкой).

### Состояния Promise

1. **pending** (ожидание) — начальное состояние
2. **fulfilled** (выполнено) — операция завершена успешно
3. **rejected** (отклонено) — операция завершена с ошибкой

### Создание Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // Асинхронная операция
  const success = true;
  
  if (success) {
    resolve('Успех!'); // Переводим в fulfilled
  } else {
    reject('Ошибка!'); // Переводим в rejected
  }
});
```

**Параметры:**
- `resolve(value)` — вызываем при успехе
- `reject(error)` — вызываем при ошибке

### Обработка результата: .then(), .catch(), .finally()

```javascript
promise
  .then(result => {
    console.log('Успех:', result);
  })
  .catch(error => {
    console.error('Ошибка:', error);
  })
  .finally(() => {
    console.log('Выполнено в любом случае');
  });
```

**Пример с setTimeout:**

```javascript
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

delay(2000)
  .then(() => console.log('Прошло 2 секунды'))
  .then(() => delay(1000))
  .then(() => console.log('Прошла ещё 1 секунда'));
```

### Цепочки Promise (chaining)

```javascript
fetch('https://api.example.com/user')
  .then(response => response.json())
  .then(user => {
    console.log('Пользователь:', user.name);
    return fetch(`https://api.example.com/user/${user.id}/posts`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log('Посты:', posts);
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
```

**Правила:**
- Каждый `.then()` возвращает новый Promise
- Возвращаемое значение передаётся в следующий `.then()`
- Ошибка в любом месте цепочки ловится одним `.catch()`

### Обработка ошибок

```javascript
// ❌ Плохо: ошибка не обработана
const promise = new Promise((resolve, reject) => {
  reject('Ошибка!');
});

// ✅ Хорошо
promise.catch(error => {
  console.error('Обработано:', error);
});

// ✅ Обработка в цепочке
promise
  .then(result => {
    throw new Error('Что-то пошло не так');
  })
  .catch(error => {
    console.error('Ошибка:', error.message);
    return 'Значение по умолчанию';
  })
  .then(result => {
    console.log('Продолжаем:', result);
  });
```

---

## Promise.all(), Promise.race(), Promise.allSettled()

### Promise.all()

Ждёт выполнения **всех** промисов. Если хоть один отклонён — весь `Promise.all()` отклоняется.

```javascript
const promise1 = delay(1000).then(() => 'Первый');
const promise2 = delay(2000).then(() => 'Второй');
const promise3 = delay(1500).then(() => 'Третий');

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // ['Первый', 'Второй', 'Третий']
  })
  .catch(error => {
    console.error('Один из промисов отклонён:', error);
  });
```

**Когда использовать:**
- Загрузка нескольких ресурсов параллельно
- Все операции должны завершиться успешно

```javascript
// Загрузка данных из нескольких API
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(([users, posts, comments]) => {
    console.log('Пользователи:', users);
    console.log('Посты:', posts);
    console.log('Комментарии:', comments);
  });
```

### Promise.race()

Возвращает результат **первого** завершившегося промиса (успешного или с ошибкой).

```javascript
const slow = delay(3000).then(() => 'Медленный');
const fast = delay(1000).then(() => 'Быстрый');

Promise.race([slow, fast])
  .then(result => {
    console.log('Победитель:', result); // 'Быстрый'
  });
```

**Когда использовать:**
- Таймауты для запросов
- Выбор самого быстрого источника данных

```javascript
// Таймаут для запроса
function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

fetchWithTimeout('/api/data', 5000)
  .then(response => response.json())
  .catch(error => console.error('Ошибка или таймаут:', error));
```

### Promise.allSettled()

Ждёт завершения **всех** промисов независимо от результата (успех или ошибка).

```javascript
const promises = [
  Promise.resolve('Успех 1'),
  Promise.reject('Ошибка'),
  Promise.resolve('Успех 2')
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Выполнен:', result.value);
      } else {
        console.error('Отклонён:', result.reason);
      }
    });
  });

// Вывод:
// Выполнен: Успех 1
// Отклонён: Ошибка
// Выполнен: Успех 2
```

**Когда использовать:**
- Нужен результат всех операций, даже если некоторые упали

### Promise.any()

Возвращает **первый успешный** промис. Отклоняется, только если все промисы отклонены.

```javascript
Promise.any([
  Promise.reject('Ошибка 1'),
  delay(1000).then(() => 'Успех'),
  Promise.reject('Ошибка 2')
])
  .then(result => {
    console.log('Первый успешный:', result); // 'Успех'
  })
  .catch(error => {
    console.error('Все отклонены:', error);
  });
```

---

## Практические примеры

### Пример 1: Последовательная загрузка

```javascript
function loadUserData(userId) {
  return fetch(`/api/user/${userId}`)
    .then(response => response.json())
    .then(user => {
      console.log('Пользователь:', user.name);
      return fetch(`/api/user/${userId}/friends`);
    })
    .then(response => response.json())
    .then(friends => {
      console.log('Друзья:', friends);
    });
}

loadUserData(123);
```

### Пример 2: Параллельная загрузка

```javascript
function loadAllData(userId) {
  const userPromise = fetch(`/api/user/${userId}`).then(r => r.json());
  const postsPromise = fetch(`/api/user/${userId}/posts`).then(r => r.json());
  const friendsPromise = fetch(`/api/user/${userId}/friends`).then(r => r.json());
  
  return Promise.all([userPromise, postsPromise, friendsPromise])
    .then(([user, posts, friends]) => {
      return { user, posts, friends };
    });
}

loadAllData(123)
  .then(data => console.log('Все данные:', data));
```

### Пример 3: Retry механизм

```javascript
function fetchWithRetry(url, retries = 3) {
  return fetch(url)
    .catch(error => {
      if (retries > 0) {
        console.log(`Повтор... Осталось попыток: ${retries}`);
        return delay(1000).then(() => fetchWithRetry(url, retries - 1));
      }
      throw error;
    });
}

fetchWithRetry('/api/unstable-endpoint')
  .then(response => response.json())
  .then(data => console.log('Данные:', data))
  .catch(error => console.error('Не удалось загрузить после всех попыток'));
```

### Пример 4: Прогресс-бар для Promise.all

```javascript
function trackProgress(promises) {
  let completed = 0;
  const total = promises.length;
  
  const wrappedPromises = promises.map(promise => {
    return promise.then(result => {
      completed++;
      console.log(`Прогресс: ${completed}/${total}`);
      return result;
    });
  });
  
  return Promise.all(wrappedPromises);
}

const tasks = [
  delay(1000).then(() => 'Задача 1'),
  delay(2000).then(() => 'Задача 2'),
  delay(1500).then(() => 'Задача 3')
];

trackProgress(tasks).then(results => {
  console.log('Все задачи выполнены:', results);
});
```

---

## Microtasks vs Macrotasks

JavaScript различает два типа задач в очереди:

### Macrotasks (Макрозадачи)

- `setTimeout`, `setInterval`
- I/O операции
- UI rendering

### Microtasks (Микрозадачи)

- `Promise` callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- `MutationObserver`

**Порядок выполнения:**

```javascript
console.log('1. Синхронный код');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise)');
});

console.log('2. Синхронный код');

// Вывод:
// 1. Синхронный код
// 2. Синхронный код
// 3. Microtask (Promise)
// 4. Macrotask (setTimeout)
```

**Правило:** Все микрозадачи выполняются перед следующей макрозадачей.

```javascript
setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

setTimeout(() => console.log('Timeout 2'), 0);

// Вывод:
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2
```

---

## Рекомендации

### ✅ Хорошие практики

```javascript
// 1. Всегда обрабатывайте ошибки
promise
  .then(result => {})
  .catch(error => console.error(error));

// 2. Используйте Promise.all для параллельных операций
Promise.all([task1(), task2(), task3()]);

// 3. Возвращайте промисы в цепочках
function getData() {
  return fetch('/api/data') // Возвращаем Promise
    .then(r => r.json());
}

// 4. Используйте .finally() для очистки
showLoader();
fetchData()
  .then(data => displayData(data))
  .catch(error => showError(error))
  .finally(() => hideLoader());
```

### ❌ Плохие практики

```javascript
// 1. Не игнорируйте ошибки
promise.then(result => {}); // ❌ Нет .catch()

// 2. Не создавайте вложенные промисы
promise.then(result => {
  return promise2.then(result2 => { // ❌ Callback hell
    return promise3.then(result3 => {});
  });
});

// Лучше:
promise
  .then(result => promise2)
  .then(result2 => promise3)
  .then(result3 => {});

// 3. Не забывайте return
promise
  .then(result => {
    fetch('/api/data'); // ❌ Забыли return
  })
  .then(data => {
    // data будет undefined
  });
```

---

## Резюме

**Изучено:**

✅ Event Loop и Call Stack  
✅ `setTimeout` и `setInterval`  
✅ `Promise`: создание, обработка, цепочки  
✅ `Promise.all()`, `Promise.race()`, `Promise.allSettled()`, `Promise.any()`  
✅ Microtasks vs Macrotasks  
✅ Обработка ошибок  
✅ Практические паттерны (retry, progress tracking)

**В следующем уроке:** `async/await` и Fetch API

---

## Тест

1. Что выведет этот код?
```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

<details>
<summary>Ответ</summary>

```
A
D
C
B
```

Порядок: синхронный код (A, D) → microtasks (C) → macrotasks (B)
</details>

2. Как дождаться выполнения всех промисов, даже если некоторые отклонены?

<details>
<summary>Ответ</summary>

`Promise.allSettled()`
</details>

3. В чём разница между `setInterval` и рекурсивным `setTimeout`?

<details>
<summary>Ответ</summary>

`setInterval` не учитывает время выполнения функции, `setTimeout` запускает следующий вызов только после завершения предыдущего.
</details>

**Переходите к практике!** 🚀
