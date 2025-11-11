# Создание и удаление элементов (Dynamic DOM)

## Введение

До этого момента мы работали с элементами, которые уже существовали на странице. Теперь научимся **создавать новые элементы программно**, добавлять их в DOM, перемещать и удалять.

Это основа для создания динамических интерфейсов: списков задач, галерей, таблиц с данными и любых компонентов, которые создаются «на лету».

---

## Создание элементов

### `document.createElement(tagName)`

Создаёт **новый HTML-элемент** в памяти (ещё не добавлен на страницу):

```javascript
const div = document.createElement('div');
const paragraph = document.createElement('p');
const button = document.createElement('button');

console.log(div); // <div></div>
```

**Важно:** элемент создан, но **не виден**, пока не добавлен в DOM-дерево.

---

### Настройка элемента

После создания можно установить свойства:

```javascript
const heading = document.createElement('h1');

// Текст
heading.textContent = 'Новый заголовок';

// Классы
heading.classList.add('title', 'main-title');

// ID
heading.id = 'main-heading';

// Атрибуты
heading.setAttribute('data-id', '123');

// Стили
heading.style.color = 'blue';
heading.style.fontSize = '2rem';
```

---

## Добавление элементов в DOM

### 1. `parent.appendChild(child)`

Добавляет элемент **в конец** родителя:

```javascript
const container = document.querySelector('.container');
const newParagraph = document.createElement('p');
newParagraph.textContent = 'Новый абзац';

container.appendChild(newParagraph);
// Абзац появится в конце .container
```

**Особенности:**
- Добавляет **один элемент** за раз
- Возвращает добавленный элемент
- Классический метод (работает везде)

---

### 2. `parent.append(...elements)`

Современный метод — может добавлять **несколько элементов** или **текст**:

```javascript
const container = document.querySelector('.container');

const p1 = document.createElement('p');
p1.textContent = 'Первый';

const p2 = document.createElement('p');
p2.textContent = 'Второй';

// Добавляем несколько элементов сразу
container.append(p1, p2, 'Просто текст');
```

**Разница между `appendChild` и `append`:**

| Метод | Что принимает | Возвращает |
|-------|---------------|------------|
| `appendChild()` | Только один элемент | Добавленный элемент |
| `append()` | Несколько элементов, текст | `undefined` |

---

### 3. `parent.prepend(...elements)`

Добавляет элемент **в начало** родителя:

```javascript
const list = document.querySelector('ul');
const firstItem = document.createElement('li');
firstItem.textContent = 'Первый элемент';

list.prepend(firstItem);
// <li> появится в начале списка
```

---

### 4. `element.insertBefore(newElement, referenceElement)`

Вставляет элемент **перед** указанным:

```javascript
const list = document.querySelector('ul');
const secondItem = list.children[1]; // Второй элемент

const newItem = document.createElement('li');
newItem.textContent = 'Вставлен перед вторым';

list.insertBefore(newItem, secondItem);
```

---

### 5. `element.insertAdjacentHTML(position, html)`

Вставляет **HTML-строку** в указанную позицию:

```javascript
const div = document.querySelector('.container');

// Позиции:
// 'beforebegin' — перед самим элементом
// 'afterbegin' — внутрь, в начало
// 'beforeend' — внутрь, в конец
// 'afterend' — после самого элемента

div.insertAdjacentHTML('beforeend', '<p>Новый абзац</p>');
```

**Визуализация позиций:**

```
<!-- beforebegin -->
<div class="container">
  <!-- afterbegin -->
  Контент
  <!-- beforeend -->
</div>
<!-- afterend -->
```

**Осторожно!** Используйте только с доверенными данными (риск XSS-атак).

---

## Удаление элементов

### 1. `element.remove()`

Удаляет элемент из DOM:

```javascript
const paragraph = document.querySelector('.remove-me');
paragraph.remove();
// Элемент удалён
```

**Простой и современный способ.**

---

### 2. `parent.removeChild(child)`

Удаляет **дочерний** элемент через родителя (старый способ):

```javascript
const parent = document.querySelector('.container');
const child = document.querySelector('.remove-me');

parent.removeChild(child);
```

**Используйте `remove()` — проще!**

---

## Замена элементов

### `element.replaceWith(newElement)`

Заменяет элемент на новый:

```javascript
const oldParagraph = document.querySelector('.old');
const newParagraph = document.createElement('p');
newParagraph.textContent = 'Новый текст';
newParagraph.className = 'new';

oldParagraph.replaceWith(newParagraph);
```

---

## Клонирование элементов

### `element.cloneNode(deep)`

Создаёт **копию** элемента:

```javascript
const original = document.querySelector('.card');

// Поверхностная копия (без детей)
const shallowCopy = original.cloneNode(false);

// Глубокая копия (со всеми детьми)
const deepCopy = original.cloneNode(true);

document.body.append(deepCopy);
```

**Параметр `deep`:**
- `true` — копирует элемент **со всеми вложенными**
- `false` — копирует только сам элемент

**Важно:** ID элементов дублируются — измените их вручную!

---

## Создание HTML из template literals

Можно создавать HTML через строки (осторожно с данными пользователя!):

```javascript
function createCard(title, text) {
  const card = document.createElement('div');
  card.className = 'card';
  
  card.innerHTML = `
    <h3>${title}</h3>
    <p>${text}</p>
    <button>Подробнее</button>
  `;
  
  return card;
}

const myCard = createCard('Заголовок', 'Описание');
document.body.append(myCard);
```

**⚠️ Риск XSS:** Если `title` или `text` приходят от пользователя, **санируйте данные**!

---

## Практический пример: Динамический список

```javascript
// Данные
const tasks = ['Купить молоко', 'Прочитать книгу', 'Сделать зарядку'];

// Контейнер
const list = document.querySelector('#task-list');

// Создание элементов
tasks.forEach(task => {
  const li = document.createElement('li');
  li.textContent = task;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.onclick = () => li.remove();
  
  li.appendChild(deleteBtn);
  list.appendChild(li);
});
```

**Результат:**
```
• Купить молоко [Удалить]
• Прочитать книгу [Удалить]
• Сделать зарядку [Удалить]
```

---

## Пример: Генератор карточек из массива

```javascript
const users = [
  { name: 'Анна', age: 25, city: 'Москва' },
  { name: 'Иван', age: 30, city: 'Санкт-Петербург' },
  { name: 'Мария', age: 22, city: 'Казань' }
];

const container = document.querySelector('.cards-container');

users.forEach(user => {
  const card = document.createElement('div');
  card.className = 'user-card';
  
  card.innerHTML = `
    <h3>${user.name}</h3>
    <p>Возраст: ${user.age}</p>
    <p>Город: ${user.city}</p>
  `;
  
  container.appendChild(card);
});
```

---

## DocumentFragment — оптимизация

Если добавляете **много элементов**, используйте `DocumentFragment` — это виртуальный контейнер, который не вызывает reflow при каждом добавлении:

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Элемент ${i}`;
  fragment.appendChild(li);
}

// Добавляем все элементы ОДНИМ действием
document.querySelector('ul').appendChild(fragment);
```

**Почему это быстрее?**  
Браузер не перерисовывает DOM после каждого `appendChild`, а делает это один раз.

---

## Рекомендации

✅ **Используйте:**
- `append()`, `prepend()` — современные и удобные
- `remove()` — простое удаление
- `createElement()` + настройка свойств — безопасно

❌ **Избегайте:**
- `innerHTML` с пользовательскими данными без санации (XSS)
- Многократное добавление в DOM без `DocumentFragment` (медленно)

---

## Заключение

Теперь вы умеете:
- ✅ Создавать элементы программно
- ✅ Добавлять их в разные позиции
- ✅ Удалять и заменять элементы
- ✅ Клонировать элементы
- ✅ Генерировать интерфейсы из данных

**Следующий шаг:** Попрактикуйтесь в создании динамических списков, галерей и форм!
