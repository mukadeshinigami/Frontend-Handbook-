# Блок 15 — Оптимизация производительности

## Когда оптимизировать?

### ⚠️ Правило: Сначала измерить, потом оптимизировать!

```jsx
// ❌ Плохо: преждевременная оптимизация
function MyComponent() {
  const value = useMemo(() => 2 + 2, []); // ❌ Бессмысленно
}

// ✅ Хорошо: оптимизация там, где нужна
function ExpensiveList({ items }) {
  const sorted = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  ); // ✅ Сортировка может быть дорогой
}
```

---

## React.memo - мемоизация компонентов

Предотвращает ре-рендер, если props не изменились.

### Базовое использование

```jsx
import { memo } from 'react';

// Без memo - ре-рендерится при каждом рендере родителя
function Child({ name }) {
  console.log('Child rendered');
  return <div>{name}</div>;
}

// С memo - ре-рендерится только при изменении name
const MemoizedChild = memo(Child);

function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoizedChild name="Alice" /> {/* Не ре-рендерится при клике */}
    </div>
  );
}
```

### Кастомное сравнение props

```jsx
const UserCard = memo(
  ({ user }) => {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Вернуть true, если НЕ нужно ре-рендерить
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### Когда использовать React.memo?

| Случай | Использовать memo? |
|--------|-------------------|
| Компонент часто рендерится с теми же props | ✅ |
| Компонент дорогой в рендере | ✅ |
| Родитель часто ре-рендерится | ✅ |
| Props - примитивы (string, number) | ✅ |
| Props - новые объекты/функции каждый раз | ❌ (нужен useMemo/useCallback) |
| Простой компонент | ❌ (overhead больше выгоды) |

---

## useMemo - мемоизация значений

Кеширует результат вычислений.

### Базовый пример

```jsx
function FilteredList({ items, searchTerm }) {
  // ❌ Плохо: фильтрация при каждом рендере
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ✅ Хорошо: фильтрация только при изменении items или searchTerm
  const filtered = useMemo(
    () => items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [items, searchTerm]
  );
  
  return <ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```

### Дорогие вычисления

```jsx
function DataTable({ data }) {
  // Дорогая операция - сортировка + группировка
  const processedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => a.date - b.date);
    const grouped = sorted.reduce((acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
    return grouped;
  }, [data]);
  
  return (
    <div>
      {Object.entries(processedData).map(([category, items]) => (
        <section key={category}>
          <h3>{category}</h3>
          {items.map(item => <div key={item.id}>{item.name}</div>)}
        </section>
      ))}
    </div>
  );
}
```

### ⚠️ Когда НЕ использовать useMemo

```jsx
// ❌ Простые вычисления
const sum = useMemo(() => a + b, [a, b]); // Бессмысленно

// ❌ Создание объектов, которые не передаются в props
const config = useMemo(() => ({ theme: 'dark' }), []); // Ненужно

// ✅ Используйте только для:
// 1. Дорогих вычислений
// 2. Объектов/массивов, передаваемых в memo-компоненты
// 3. Зависимостей других хуков
```

---

## useCallback - мемоизация функций

Возвращает мемоизированную версию callback.

### Проблема без useCallback

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ Новая функция при каждом рендере
  const handleClick = () => {
    console.log('Clicked');
  };
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoChild onClick={handleClick} /> {/* Всегда ре-рендерится! */}
    </div>
  );
}

const MemoChild = memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

### Решение с useCallback

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // ✅ Та же функция при каждом рендере
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Пустой массив - функция никогда не меняется
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoChild onClick={handleClick} /> {/* Не ре-рендерится */}
    </div>
  );
}
```

### useCallback с зависимостями

```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const handleSearch = useCallback(() => {
    // Функция пересоздаётся только при изменении query или filter
    api.search({ query, filter }).then(setResults);
  }, [query, filter]);
  
  return <SearchButton onSearch={handleSearch} />;
}
```

---

## Code Splitting - ленивая загрузка

### React.lazy + Suspense

```jsx
import { lazy, Suspense } from 'react';

// ❌ Плохо: всё загружается сразу
import Dashboard from './Dashboard';
import Settings from './Settings';

// ✅ Хорошо: загрузка по требованию
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Lazy loading по роутам

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## Виртуализация списков

Для длинных списков (1000+ элементов).

### react-window

```bash
npm install react-window
```

```jsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Рендерится только видимые элементы!
```

---

## Debounce и Throttle

### Debounce - задержка выполнения

```jsx
import { useState, useEffect } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  useEffect(() => {
    if (debouncedQuery) {
      // Поиск выполняется только через 500ms после остановки печати
      api.search(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

## Профилирование

### React DevTools Profiler

```jsx
// 1. Откройте React DevTools
// 2. Вкладка "Profiler"
// 3. Запись → Действие → Остановка
// 4. Анализ времени рендера компонентов
```

### Programmatic Profiler

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // строка - идентификатор профайлера
  phase, // "mount" или "update"
  actualDuration, // время рендера
  baseDuration, // без мемоизации
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} took ${actualDuration}ms to render`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

---

## Best Practices

### ✅ Хорошо

```jsx
// 1. memo для компонентов с примитивными props
const Button = memo(({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

// 2. useMemo для дорогих вычислений
const sorted = useMemo(() => items.sort(...), [items]);

// 3. useCallback для функций в props memo-компонентов
const handleClick = useCallback(() => { }, []);

// 4. Lazy loading для больших модулей
const Chart = lazy(() => import('./Chart'));
```

### ❌ Плохо

```jsx
// ❌ memo везде
const SimpleDiv = memo(({ text }) => <div>{text}</div>);

// ❌ useMemo для простых операций
const sum = useMemo(() => a + b, [a, b]);

// ❌ useCallback без memo
const fn = useCallback(() => {}, []); // Никто не использует

// ❌ Вложенные компоненты
function Parent() {
  function Child() { } // ❌ Пересоздаётся каждый раз
}
```

---

## Практика

Задания в `15-performance-practice.md`.
