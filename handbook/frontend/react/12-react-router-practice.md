# Практика — React Router

## Задание 1: Multi-page Blog

Создайте блог с несколькими страницами.

**Структура роутов:**
- `/` - Главная (список всех постов)
- `/posts/:postId` - Детальная страница поста
- `/about` - О блоге
- `/404` - Страница ошибки

**Требования:**
1. Используйте `BrowserRouter`
2. Навигация через `Link` и `NavLink` (активная ссылка должна подсвечиваться)
3. В детальной странице используйте `useParams` для получения ID
4. Fetch данных из JSONPlaceholder: `https://jsonplaceholder.typicode.com/posts`
5. Реализуйте 404 страницу для несуществующих роутов

**Компоненты:**
- `Layout` - общий layout с навигацией
- `Home` - список постов
- `PostDetail` - детальная страница
- `About` - статичная страница
- `NotFound` - 404

---

## Задание 2: Protected Admin Panel

Создайте админ-панель с защищёнными роутами.

**Структура:**
```
/login - Страница входа
/dashboard - Защищённая главная админки
/dashboard/users - Список пользователей
/dashboard/settings - Настройки
```

**Требования:**
1. Реализуйте `AuthContext` с состоянием `{ user, login, logout }`
2. Создайте `ProtectedRoute` компонент
3. Перенаправление на `/login` если пользователь не авторизован
4. После успешного входа - редирект на `/dashboard`
5. Используйте nested routes для dashboard

**Подсказка для AuthContext:**

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (username, password) => {
    // Mock login
    if (username === 'admin' && password === 'admin') {
      setUser({ username });
      return true;
    }
    return false;
  };
  
  const logout = () => setUser(null);
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Задание 3: E-commerce с фильтрацией

Создайте каталог товаров с фильтрацией через URL.

**URL структура:**
```
/products - Все товары
/products?category=electronics - Фильтр по категории
/products?category=electronics&sort=price - + сортировка
/products/:productId - Детали товара
```

**Требования:**
1. Используйте `useSearchParams` для query parameters
2. Фильтры: category (electronics, clothing, books)
3. Сортировка: price (asc/desc), name (a-z/z-a)
4. При изменении фильтров - обновлять URL
5. При загрузке страницы - читать фильтры из URL

**Компоненты:**
- `ProductList` - список товаров с фильтрами
- `Filters` - UI для изменения фильтров
- `ProductCard` - карточка товара
- `ProductDetail` - детальная страница

**Данные (mock):**

```jsx
const products = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
  { id: 2, name: 'T-Shirt', category: 'clothing', price: 29 },
  { id: 3, name: 'Book', category: 'books', price: 15 },
  // ...
];
```

**Пример фильтрации:**

```jsx
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');
  
  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (category) {
      result = result.filter(p => p.category === category);
    }
    
    if (sort === 'price') {
      result = [...result].sort((a, b) => a.price - b.price);
    }
    
    return result;
  }, [category, sort]);
  
  // ...
}
```

---

## Задание 4: Breadcrumbs (хлебные крошки)

Добавьте breadcrumbs навигацию к приложению из Задания 1.

**Пример:**
```
Home > Posts > Post Title
```

**Требования:**
1. Используйте `useLocation` и `useParams`
2. Динамически генерировать breadcrumbs на основе текущего пути
3. Каждая часть breadcrumb должна быть кликабельной ссылкой (кроме последней)

**Подсказка:**

```jsx
function Breadcrumbs() {
  const location = useLocation();
  const { postId } = useParams();
  
  const paths = location.pathname.split('/').filter(Boolean);
  
  return (
    <nav>
      <Link to="/">Home</Link>
      {paths.map((path, index) => {
        const to = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        
        return isLast ? (
          <span key={to}> > {path}</span>
        ) : (
          <span key={to}> > <Link to={to}>{path}</Link></span>
        );
      })}
    </nav>
  );
}
```

---

## Критерии выполнения

- ✅ Все роуты настроены правильно
- ✅ Используются hooks: useParams, useNavigate, useLocation, useSearchParams
- ✅ Protected routes работают корректно
- ✅ Query parameters синхронизированы с UI
- ✅ NavLink показывает активную страницу
- ✅ Нет предупреждений в консоли
- ✅ 404 страница отображается для несуществующих роутов
