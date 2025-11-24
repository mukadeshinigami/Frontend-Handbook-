# Блок 17 — Тестирование React компонентов

## Зачем тестировать?

- ✅ Уверенность при рефакторинге
- ✅ Документация поведения
- ✅ Поиск багов до production
- ✅ Лучший дизайн кода

---

## Инструменты

### Testing Stack

| Инструмент | Назначение |
|------------|------------|
| **Jest** | Test runner, assertions, mocking |
| **React Testing Library (RTL)** | Тестирование React компонентов |
| **Vitest** | Альтернатива Jest (быстрее, из коробки с Vite) |
| **@testing-library/user-event** | Симуляция пользовательских действий |

### Установка

```bash
# Jest + RTL
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom

# Vitest + RTL (для Vite проектов)
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Первый тест

### Простой компонент

```jsx
// Button.jsx
export function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Тест

```jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', async () => {
    const handleClick = jest.fn(); // Mock функция
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Queries - поиск элементов

### Типы queries

| Query | Возвращает | Ошибка если не найден |
|-------|------------|----------------------|
| `getBy...` | Элемент | ✅ Да |
| `queryBy...` | Элемент или null | ❌ Нет |
| `findBy...` | Promise<Элемент> | ✅ Да (async) |
| `getAllBy...` | Массив | ✅ Да |
| `queryAllBy...` | Массив (может быть пустой) | ❌ Нет |
| `findAllBy...` | Promise<Массив> | ✅ Да (async) |

### Варианты queries

```jsx
// По роли (рекомендуется)
screen.getByRole('button', { name: 'Submit' });
screen.getByRole('textbox', { name: 'Username' });

// По тексту
screen.getByText('Hello World');
screen.getByText(/hello/i); // Регулярное выражение

// По label
screen.getByLabelText('Email');

// По placeholder
screen.getByPlaceholderText('Enter email...');

// По test id (крайний случай)
screen.getByTestId('custom-element');
```

---

## Пример: Counter тест

```jsx
// Counter.jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

```jsx
// Counter.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  test('starts at 0', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
  
  test('increments count', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const incrementBtn = screen.getByRole('button', { name: 'Increment' });
    await user.click(incrementBtn);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
  
  test('resets count', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    // Инкремент несколько раз
    const incrementBtn = screen.getByRole('button', { name: 'Increment' });
    await user.click(incrementBtn);
    await user.click(incrementBtn);
    
    // Сброс
    const resetBtn = screen.getByRole('button', { name: 'Reset' });
    await user.click(resetBtn);
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});
```

---

## Тестирование форм

```jsx
// LoginForm.jsx
export function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

```jsx
// LoginForm.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  test('submits form with email and password', async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // Ввод данных
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    
    // Отправка
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    // Проверка
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

---

## Асинхронное тестирование

```jsx
// UserProfile.jsx
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>User: {user.name}</div>;
}
```

```jsx
// UserProfile.test.jsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

// Mock fetch
global.fetch = jest.fn();

describe('UserProfile', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  test('shows loading then user data', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ name: 'Alice' })
    });
    
    render(<UserProfile userId={1} />);
    
    // Проверка loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Ждём появления данных
    const userName = await screen.findByText('User: Alice');
    expect(userName).toBeInTheDocument();
    
    // Проверка вызова API
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });
});
```

---

## Mocking

### Mock функции

```jsx
const mockFn = jest.fn();

// Вызов
mockFn('hello');

// Проверки
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('hello');
```

### Mock модулей

```jsx
// Mock целого модуля
jest.mock('./api', () => ({
  fetchUsers: jest.fn()
}));

// В тесте
import { fetchUsers } from './api';

test('...', () => {
  fetchUsers.mockResolvedValue([{ id: 1, name: 'Alice' }]);
  // ...
});
```

---

## Best Practices

### ✅ Хорошо

```jsx
// 1. Тестируйте поведение, а не реализацию
test('increments counter', async () => {
  render(<Counter />);
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});

// 2. Используйте queries по приоритету
screen.getByRole('button'); // ✅ Лучше
screen.getByTestId('btn'); // ❌ Худше

// 3. userEvent вместо fireEvent
await user.click(button); // ✅ Симулирует реальные действия
fireEvent.click(button); // ❌ Низкоуровневый
```

### ❌ Плохо

```jsx
// ❌ Тестирование implementation details
expect(wrapper.state().count).toBe(1);

// ❌ Snapshot тесты для всего
expect(wrapper).toMatchSnapshot(); // Хрупкие, неинформативные

// ❌ Проверка классов/стилей вместо поведения
expect(element).toHaveClass('active');
```

---

## Практика

Задания в `17-testing-practice.md`.
