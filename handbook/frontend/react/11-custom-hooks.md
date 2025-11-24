# Блок 11 — Custom Hooks

## Что такое Custom Hooks?

Custom Hook — это JavaScript функция, имя которой начинается с `use` и которая может вызывать другие хуки.

**Зачем нужны:**
- Переиспользование логики между компонентами
- Извлечение сложной логики из компонентов
- Разделение concerns (separation of concerns)

---

## Правила Custom Hooks

### ✅ Правильно

```jsx
// 1. Имя начинается с "use"
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}

// 2. Можно вызывать другие хуки
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

### ❌ Неправильно

```jsx
// ❌ Имя не начинается с "use"
function counter() {
  return useState(0); // Нарушение правил хуков
}

// ❌ Условный вызов хука
function useData(shouldFetch) {
  if (shouldFetch) {
    const [data] = useState(null); // ❌
  }
}
```

---

## Пример 1: useFetch

Универсальный хук для API запросов:

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let mounted = true;
    
    setLoading(true);
    setError(null);
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (mounted) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Использование
function UserList() {
  const { data: users, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Пример 2: useLocalStorage

Синхронизация state с localStorage:

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Ленивая инициализация - читаем localStorage только раз
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('useLocalStorage error:', error);
      return initialValue;
    }
  });
  
  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('useLocalStorage error:', error);
    }
  }, [key, value]);
  
  return [value, setValue];
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme ({theme})
      </button>
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
}
```

---

## Пример 3: useToggle

Простой хук для boolean состояний:

```jsx
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return [value, { toggle, setTrue, setFalse }];
}

// Использование
function Modal() {
  const [isOpen, { toggle, setFalse }] = useToggle(false);
  
  return (
    <>
      <button onClick={toggle}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modal Title</h2>
            <button onClick={setFalse}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## Пример 4: useDebounce

Задержка обновления значения:

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Использование - поиск с debounce
function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data, loading } = useFetch(
    `https://api.github.com/search/users?q=${debouncedSearchTerm}`
  );
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search GitHub users..."
      />
      {loading && <div>Searching...</div>}
      {data && (
        <ul>
          {data.items.map(user => (
            <li key={user.id}>{user.login}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Пример 5: useWindowSize

Отслеживание размера окна:

```jsx
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}

// Использование
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </div>
  );
}
```

---

## Композиция Custom Hooks

Custom hooks можно комбинировать:

```jsx
// Комбинация useLocalStorage + useToggle
function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
  }, [isDark]);
  
  return [isDark, setIsDark];
}

// Использование нескольких хуков
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  const [isEditing, { toggle }] = useToggle(false);
  const [formData, setFormData] = useLocalStorage('userFormDraft', {});
  
  // ...
}
```

---

## Best Practices

### ✅ Хорошо

```jsx
// 1. Префикс "use"
function useCustomHook() { }

// 2. Возвращаем массив или объект
function useCounter() {
  return [count, increment]; // или { count, increment }
}

// 3. Документация
/**
 * Fetches data from URL
 * @param {string} url - API endpoint
 * @returns {{ data, loading, error }}
 */
function useFetch(url) { }

// 4. Очистка ресурсов
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id); // ✅ cleanup
  }, [callback, delay]);
}
```

### ❌ Плохо

```jsx
// ❌ Без префикса "use"
function fetchData() { 
  const [data] = useState(null); // Нарушение
}

// ❌ Условный вызов хуков
function useData(shouldLoad) {
  if (shouldLoad) {
    useState(null); // ❌
  }
}

// ❌ Забыли cleanup
function useBadInterval(callback, delay) {
  useEffect(() => {
    setInterval(callback, delay); // ❌ утечка памяти
  }, [callback, delay]);
}
```

---

## Практика

Задания в `11-custom-hooks-practice.md`.
