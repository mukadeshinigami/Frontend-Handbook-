# Практика — Custom Hooks

## Задание 1: useOnClickOutside

Создайте хук для обработки клика вне элемента (полезно для закрытия модалов и dropdown).

**API:**

```jsx
useOnClickOutside(ref, handler)
```

**Требования:**
- Принимает ref на элемент и callback
- Callback вызывается при клике вне элемента
- Правильно очищает event listener

**Подсказка:**

```jsx
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Если клик внутри элемента - игнорируем
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    // Добавить listener
    // Вернуть cleanup функцию
  }, [ref, handler]);
}
```

**Использование:**

```jsx
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && <ul>...</ul>}
    </div>
  );
}
```

---

## Задание 2: useAsync

Создайте универсальный хук для асинхронных операций.

**API:**

```jsx
const { execute, value, loading, error } = useAsync(asyncFunction, immediate);
```

**Требования:**
- `asyncFunction` - async функция для выполнения
- `immediate` - если true, выполнить сразу при монтировании
- `execute()` - функция для ручного запуска
- Возвращает: `{ execute, value, loading, error }`

**Пример использования:**

```jsx
function UserProfile({ userId }) {
  const fetchUser = () => fetch(`/api/users/${userId}`).then(r => r.json());
  
  const { execute, value: user, loading, error } = useAsync(fetchUser, true);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={execute}>Refresh</button>
    </div>
  );
}
```

---

## Задание 3: usePrevious

Создайте хук для хранения предыдущего значения state.

**API:**

```jsx
const previousValue = usePrevious(value)
```

**Требования:**
- Возвращает предыдущее значение переданного value
- Используйте useRef для хранения

**Подсказка:**

```jsx
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    // Обновить ref после рендера
  }, [value]);
  
  return ref.current;
}
```

**Использование:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

## Задание 4: useKeyPress

Отслеживание нажатия клавиш.

**API:**

```jsx
const isPressed = useKeyPress(targetKey)
```

**Требования:**
- Возвращает true, когда клавиша нажата
- targetKey: 'Enter', 'Escape', 'ArrowUp', и т.д.
- Поддержка нескольких клавиш: `useKeyPress(['Escape', 'q'])`

**Использование:**

```jsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const enterPressed = useKeyPress('Enter');
  const escPressed = useKeyPress('Escape');
  
  useEffect(() => {
    if (enterPressed) {
      // Выполнить поиск
    }
  }, [enterPressed]);
  
  useEffect(() => {
    if (escPressed) {
      setQuery(''); // Очистить
    }
  }, [escPressed]);
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

## Задание 5: useMediaQuery

Responsive хук для media queries.

**API:**

```jsx
const matches = useMediaQuery(query)
```

**Требования:**
- Принимает CSS media query строку
- Возвращает boolean - соответствует ли текущее состояние
- Обновляется при изменении размера окна

**Использование:**

```jsx
function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {!isMobile && !isTablet && <DesktopLayout />}
    </div>
  );
}
```

---

## Критерии выполнения

- ✅ Имена всех хуков начинаются с "use"
- ✅ Правильно используются зависимости в useEffect
- ✅ Все event listeners правильно очищаются
- ✅ Хуки можно переиспользовать в разных компонентах
- ✅ Нет предупреждений от React Hooks ESLint
