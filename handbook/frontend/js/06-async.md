schedule();
# Блок 6: Асинхронность в JavaScript (async/await-first)

## Коротко о цели урока

Этот урок ставит в центр async/await — современный, читаемый и практичный способ работы с асинхронностью в JavaScript. Промисы остаются базой (они под капотом), но мы показываем их как инструмент, а не как основной стиль написания кода.

Короткий контракт (что вы получите):
- Вход: асинхронные операции (fetch, таймеры, I/O) в современных браузерах/Node.js
- Выход: понятные примеры с async/await, варианты параллельного и последовательного выполнения, обработка ошибок, timeout и отмена (AbortController)
- Ошибки: асинхронные исключения через try/catch, особенности Promise combinators

---

## Почему async/await?

- async/await делает асинхронный код похожим на синхронный — легче читать и отлаживать.
- Он основан на промисах, поэтому все возможности Promise (all, race, allSettled и т.д.) остаются применимыми.
- Рекомендуем: писать основную логику через async/await, использовать промисы для низкоуровневых API и combinators.

---

## Основы: async и await

```javascript
// Функция, объявленная как async, всегда возвращает Promise
async function getValue() {
  return 42; // => Promise.resolve(42)
}

// await можно использовать только внутри async-функций
async function main() {
  const value = await getValue();
  console.log(value); // 42
}

main();
```

- await приостанавливает выполнение текущей async-функции до завершения промиса.
- Если await получает не-промис — он немедленно вернёт значение.

### Обработка ошибок

```javascript
async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Можно логировать, пробрасывать или возвращать значение по умолчанию
    console.error('Ошибка fetchJson:', err);
    throw err; // или return null
  }
}
```

---

## Практические примеры: Fetch + async/await

```javascript
async function loadUser(userId) {
  const user = await fetchJson(`/api/user/${userId}`);
  const posts = await fetchJson(`/api/user/${userId}/posts`);
  return { user, posts };
}

loadUser(123).then(data => console.log(data)).catch(err => console.error(err));
```

Этот код последовательно дождётся пользователя, затем постов. Если операции можно выполнить параллельно — используйте Promise combinators (см. ниже).

---

## Последовательное vs параллельное выполнение

Последовательное (иногда нужно):

```javascript
// Последовательно
async function seq(userId) {
  const user = await fetchJson(`/api/user/${userId}`);
  const posts = await fetchJson(`/api/user/${userId}/posts`);
  return { user, posts };
}
```

Параллельно (быстрее, когда зависимости отсутствуют):

```javascript
// Параллельно
async function parallel(userId) {
  const userPromise = fetchJson(`/api/user/${userId}`);
  const postsPromise = fetchJson(`/api/user/${userId}/posts`);

  const [user, posts] = await Promise.all([userPromise, postsPromise]);
  return { user, posts };
}
```

Используйте await Promise.all([...]) для параллельных задач — это быстрее, но помните, что если один промис упадёт, весь Promise.all отклонится.

---

## Promise combinators (когда нужны промисы)

Несколько полезных combinators и их эквиваленты с async/await:

- Promise.all(array) — ждать всех (ошибка при первом reject)
- Promise.allSettled(array) — ждать всех результатов независимо от ошибок
- Promise.race(array) — результат первого завершившегося (включая ошибку)
- Promise.any(array) — первый успешный, отклоняется если все упали

Примеры:

```javascript
// await + Promise.all
const [a, b] = await Promise.all([fetchJson('/a'), fetchJson('/b')]);

// allSettled — полезно для частично удачных операций
const results = await Promise.allSettled([fetchJson('/a'), fetchJson('/b')]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('OK', r.value);
  else console.warn('Fail', r.reason);
});

// race для таймаута (старый способ)
const first = await Promise.race([fetchJson('/a'), timeout(5000)]);
```

Где timeout — вспомогательная функция:

```javascript
function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
}
```

---

## Таймаут и отмена: AbortController (современный способ)

Promise.race с setTimeout работает, но не отменяет сам fetch. Современный и корректный способ — AbortController:

```javascript
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

// Использование
fetchWithTimeout('/api/data', 5000)
  .then(data => console.log(data))
  .catch(err => console.error('Ошибка/отмена:', err));
```

AbortController позволяет корректно отменять fetch и освобождать ресурсы.

---

## Retry (повторы) с async/await

```javascript
async function fetchWithRetry(url, retries = 3, delayMs = 1000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout(url, 5000); // пример: с таймаутом
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

// Использование
fetchWithRetry('/api/unstable-endpoint')
  .then(res => console.log('OK', res))
  .catch(err => console.error('Не удалось после попыток', err));
```

---

## Прогресс и потоковые ответы

Если API отдает порциями или вы хотите показывать прогресс, используйте потоковый парсинг (Streams) или оборачивайте промисы и увеличивайте счётчик при завершении каждого.

Простой прогресс при Promise.all:

```javascript
async function trackProgress(urls) {
  let completed = 0;
  const wrapped = urls.map(url =>
    fetch(url)
      .then(r => r.json())
      .then(result => {
        completed++;
        console.log(`Прогресс: ${completed}/${urls.length}`);
        return result;
      })
  );

  return await Promise.all(wrapped);
}
```

Для больших потоков предпочтительнее Streams и async iterators — это тема отдельного занятия.

---

## Microtasks vs Macrotasks (коротко)

- Microtasks: .then callbacks (Promise), queueMicrotask — выполняются после текущего стека, до следующей макрозадачи.
- Macrotasks: setTimeout, setInterval, I/O — выполняются позже.

Пример порядка:

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');

// Вывод: A D C B
```

---

## Миграция: from .then() to async/await

- В большинстве случаев цепочки `.then()` можно переписать на async/await для читаемости:

```javascript
// .then()
fetch('/api/user')
  .then(r => r.json())
  .then(user => fetch(`/api/user/${user.id}/posts`))
  .then(r => r.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// async/await
async function getUserPosts() {
  try {
    const r1 = await fetch('/api/user');
    const user = await r1.json();
    const r2 = await fetch(`/api/user/${user.id}/posts`);
    const posts = await r2.json();
    console.log(posts);
  } catch (err) {
    console.error(err);
  }
}
```

---

## Рекомендации и хорошие практики

- Пишите основную логику через async/await — это более читабельно.
- Всегда обрабатывайте ошибки (try/catch) и думайте, где лучше вернуть значение по умолчанию, а где пробросить ошибку дальше.
- Для параллельных задач используйте Promise.all с await: await Promise.all([...])
- Для таймаутов и отмены используйте AbortController.
- Промисы — знать обязательно: они остаются основой и нужны для low-level API, combinators и совместимости.

---

## Краткое резюме

✅ async/await — основной инструмент современного кода
✅ Промисы — база и combinators для параллельных/координационных задач
✅ Обработка ошибок через try/catch; таймауты/отмена через AbortController

**В следующем уроке:** подробнее о конкурентных паттернах, Streams и продвинутых техниках отмены/резервирования.

---

## Тест (проверьте себя)

1. Что выведет код?

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

Ответ: A D C B

2. Как отменить fetch-запрос с таймаутом, не полагаясь на Promise.race?

Ответ: Использовать AbortController и сигнал controller.signal, а затем вызвать controller.abort() по таймауту.

3. Как сделать два запроса параллельно и ждать их оба с async/await?

Ответ: Создать промисы и await Promise.all([p1, p2]).

---

Переходите к практике! 🚀
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
