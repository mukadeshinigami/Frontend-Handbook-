# Блок 9 — useContext — Context API

Цель
---
Понять, как передавать глобальные значения (theme, auth, настройки) через дерево компонентов без prop drilling.

Ключевые идеи
---
- `React.createContext()` создаёт контекст с Provider и Consumer.
- Provider передаёт значение вниз по дереву, а любой ребёнок может получить его через `useContext`.
- Context удобно использовать для тем, языка, аутентификации и других глобальных данных.
- Не храните слишком многое в одном контексте — разбивайте по ответственности.

Пример — Theme Context
---

```jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { dark, toggle } = useContext(ThemeContext);
  return (
    <button onClick={toggle} style={{ background: dark ? '#333' : '#fff', color: dark ? '#fff' : '#000' }}>
      Toggle theme (current: {dark ? 'dark' : 'light'})
    </button>
  );
}
```

Пример — Auth Context (mock)
---

```jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (name) => setUser({ name });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function Profile() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return <div>Please login</div>;
  return (
    <div>
      <p>Hello, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

Практика: `09-usecontext-practice.md`.
