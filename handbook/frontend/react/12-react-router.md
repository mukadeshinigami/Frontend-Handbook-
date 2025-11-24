# Блок 12 — React Router

## Что такое React Router?

React Router — библиотека для навигации и роутинга в React SPA (Single Page Application).

**Установка:**

```bash
npm install react-router-dom
```

---

## Базовая настройка

### Современный подход (v6+)

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
```

---

## Типы Router

| Router | Использование |
|--------|---------------|
| `BrowserRouter` | ✅ Стандарт для веб-приложений (использует HTML5 History API) |
| `HashRouter` | Старые браузеры или GitHub Pages (использует URL hash) |
| `MemoryRouter` | Тестирование или React Native |

```jsx
// BrowserRouter (рекомендуется)
// URL: https://example.com/about

// HashRouter
// URL: https://example.com/#/about
```

---

## Динамические роуты и параметры

### URL Parameters

```jsx
import { useParams } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route path="/posts/:postId/comments/:commentId" element={<Comment />} />
    </Routes>
  );
}

function UserProfile() {
  const { userId } = useParams();
  
  return <h1>User Profile: {userId}</h1>;
}

// URL: /users/123 → userId = "123"
// URL: /posts/5/comments/42 → postId = "5", commentId = "42"
```

### Query Parameters

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q');
  const sort = searchParams.get('sort') || 'date';
  
  const updateSearch = (newQuery) => {
    setSearchParams({ q: newQuery, sort });
  };
  
  return (
    <div>
      <p>Search: {query}</p>
      <p>Sort: {sort}</p>
      <input onChange={(e) => updateSearch(e.target.value)} />
    </div>
  );
}

// URL: /search?q=react&sort=relevance
// query = "react", sort = "relevance"
```

---

## Навигация программно

### useNavigate

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (credentials) => {
    const success = await login(credentials);
    
    if (success) {
      navigate('/dashboard'); // Переход на /dashboard
      // navigate(-1); // Назад
      // navigate(-2); // На 2 страницы назад
      // navigate('/home', { replace: true }); // Заменить в истории
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## Nested Routes (Вложенные роуты)

```jsx
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users" element={<Users />}>
          <Route index element={<UserList />} />
          <Route path=":userId" element={<UserProfile />} />
          <Route path=":userId/settings" element={<UserSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <header>
        <nav>...</nav>
      </header>
      <main>
        <Outlet /> {/* Здесь рендерятся вложенные роуты */}
      </main>
      <footer>...</footer>
    </div>
  );
}

// /users → UserList
// /users/123 → UserProfile (userId = "123")
// /users/123/settings → UserSettings
```

---

## Protected Routes (Защищённые роуты)

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = useAuth(); // Custom hook для аутентификации
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

## NavLink - активная ссылка

```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Home
      </NavLink>
      
      <NavLink
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? 'red' : 'black',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        About
      </NavLink>
    </nav>
  );
}

// CSS
// .active { color: blue; font-weight: bold; }
```

---

## useLocation

Получение информации о текущем URL:

```jsx
import { useLocation } from 'react-router-dom';

function CurrentPath() {
  const location = useLocation();
  
  return (
    <div>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
    </div>
  );
}

// URL: /users/123?tab=posts#section-2
// pathname: "/users/123"
// search: "?tab=posts"
// hash: "#section-2"
```

---

## Loader и Action (v6.4+)

Загрузка данных для роута:

```jsx
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';

// Loader - загрузка данных перед рендером
async function userLoader({ params }) {
  const response = await fetch(`/api/users/${params.userId}`);
  return response.json();
}

const router = createBrowserRouter([
  {
    path: '/users/:userId',
    element: <UserProfile />,
    loader: userLoader
  }
]);

function UserProfile() {
  const user = useLoaderData(); // Данные из loader
  
  return <h1>{user.name}</h1>;
}

function App() {
  return <RouterProvider router={router} />;
}
```

---

## Best Practices

### ✅ Хорошо

```jsx
// 1. Централизованная конфигурация роутов
const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> }
];

// 2. Ленивая загрузка (code splitting)
const Dashboard = lazy(() => import('./Dashboard'));

<Route path="/dashboard" element={
  <Suspense fallback={<Loading />}>
    <Dashboard />
  </Suspense>
} />

// 3. Константы для путей
const ROUTES = {
  HOME: '/',
  USER_PROFILE: (id) => `/users/${id}`,
  DASHBOARD: '/dashboard'
};

navigate(ROUTES.USER_PROFILE(123));
```

### ❌ Плохо

```jsx
// ❌ Магические строки повсюду
navigate('/users/123');
navigate('/users/123'); // опечатка

// ❌ Забыли Suspense для lazy
<Route path="/dashboard" element={<Dashboard />} /> // ❌

// ❌ Дублирование логики защиты
function Dashboard() {
  if (!user) return <Navigate to="/login" />; // ❌ в каждом компоненте
}
```

---

## Практика

Задания в `12-react-router-practice.md`.
