# React — Роадмап для изучения

## Текущий прогресс (что пройдено)

_Пока не начато — это начальный роадмап_

---


Перед началом изучения React рекомендуется пройти:
- **HTML/CSS**: семантика, flexbox, grid, responsive design
- **JavaScript ES6+**: стрелочные функции, деструктуризация, spread/rest, модули, Promise, async/await
- **DOM и события**: манипуляции с DOM, обработка событий, делегирование
- **Node.js основы**: npm/npx, package.json, модули (см. `backend/nodejs` Блок 1)
## Предварительные требования

--- 

## Рекомендуемый роадмап (следующие блоки)

### Блок 1: Основы React и первый компонент
**Файлы:** `01-basics.md` + `01-basics-practice.md`

**Цель:** Понять что такое React, создать первое приложение и компонент.

**Темы:**
- Что такое React и почему он популярен
- Virtual DOM концепция
- Установка: Create React App (CRA) или Vite
- Структура React приложения
- JSX синтаксис
- Компоненты: функциональные vs классовые (фокус на функциональных)
- Props (свойства компонента)
- Рендеринг компонентов
- React Developer Tools

**Практика:**
- Hello World с Create React App
- Простой компонент с props
- Карточка продукта (Product Card)
- Список компонентов (List rendering)

---

### Блок 2: JSX и выражения
**Файлы:** `02-jsx.md` + `02-jsx-practice.md`

**Цель:** Освоить JSX синтаксис и понять его возможности.

**Темы:**
- JSX — что это и как работает
- Встраивание выражений: `{expression}`
- Условный рендеринг: `&&`, тернарный оператор
- Атрибуты в JSX: `className`, `htmlFor`, `style`
- Inline styles vs CSS classes
- Fragments: `<>...</>` или `<React.Fragment>`
- Комментарии в JSX
- JSX компилируется в `React.createElement()`

**Практика:**
- Условный рендеринг (show/hide контент)
- Динамические стили
- Список с условным отображением
- Card компонент с разными состояниями

---

### Блок 3: State (Состояние) и useState Hook
**Файлы:** `03-state-usestate.md` + `03-state-usestate-practice.md`

**Цель:** Научиться управлять состоянием компонентов с помощью useState.

**Темы:**
- Что такое state (состояние)
- `useState` hook
- Инициализация state
- Обновление state: `setState`
- State — immutable (неизменяемый)
- Множественные state переменные
- State с объектами и массивами
- Функциональные обновления: `setState(prev => ...)`
- Правила Hooks

**Практика:**
- Счётчик (Counter)
- Toggle button (show/hide)
- Форма с controlled inputs
- Todo List с добавлением/удалением задач

---

### Блок 4: События (Events)
**Файлы:** `04-events.md` + `04-events-practice.md`

**Цель:** Обрабатывать пользовательские взаимодействия.

**Темы:**
- Синтетические события (SyntheticEvent)
- `onClick`, `onChange`, `onSubmit`
- Event handlers
- Передача аргументов в handlers
- `event.preventDefault()`, `event.stopPropagation()`
- Controlled vs Uncontrolled компоненты
- Формы в React
- Input, textarea, select

**Практика:**
- Кнопки с разными действиями
- Форма регистрации с валидацией
- Controlled inputs
- Калькулятор

---

### Блок 5: Списки и ключи (Lists and Keys)
**Файлы:** `05-lists-keys.md` + `05-lists-keys-practice.md`

**Цель:** Научиться рендерить динамические списки и понять важность keys.

**Темы:**
- `.map()` для рендеринга списков
- Атрибут `key` и почему он важен
- Уникальные ключи: id vs index
- Вложенные списки
- Фильтрация и сортировка списков
- Динамическое добавление/удаление элементов

**Практика:**
- Список пользователей
- Фильтруемый список (поиск)
- Сортируемая таблица
- Todo List с фильтрами (все/активные/завершённые)

---

### Блок 6: Компоненты — композиция и переиспользование
**Файлы:** `06-component-composition.md` + `06-component-composition-practice.md`

**Цель:** Научиться разбивать UI на переиспользуемые компоненты.

**Темы:**
- Композиция vs наследование
- Props children
- Компоненты-обёртки (Layout components)
- Специализация компонентов
- Компонент высшего порядка (HOC) — введение
- Render props паттерн — введение
- Разделение ответственности (Single Responsibility)

**Практика:**
- Layout компонент (Header, Footer, Sidebar)
- Card с children
- Modal компонент
- Tabs / Accordion

---

### Блок 7: useEffect Hook — Side Effects
**Файлы:** `07-useeffect.md` + `07-useeffect-practice.md`

**Цель:** Управлять побочными эффектами (side effects) в компонентах.

**Темы:**
- Что такое side effects
- `useEffect` hook
- Зависимости (dependency array)
- Cleanup функция
- useEffect при mount/unmount/update
- Fetch данных в useEffect
- Работа с таймерами
- Подписки и отписки

**Практика:**
- Fetch данных с API
- Таймер / Clock компонент
- Подписка на события (resize, scroll)
- Debounce в поисковой строке

---

### Блок 8: Работа с формами
**Файлы:** `08-forms.md` + `08-forms-practice.md`

**Цель:** Создавать и валидировать формы в React.

**Темы:**
- Controlled компоненты
- Множественные inputs
- Обработка различных типов input (text, checkbox, radio, select)
- Валидация форм
- Сообщения об ошибках
- Submit форм
- Библиотеки для форм: Formik, React Hook Form (введение)

**Практика:**
- Форма регистрации с валидацией
- Форма с множественными полями
- Динамическая форма (добавление полей)
- Форма с file upload

---

### Блок 9: useContext — Context API
**Файлы:** `09-usecontext.md` + `09-usecontext-practice.md`

**Цель:** Передавать данные через дерево компонентов без prop drilling.

**Темы:**
- Проблема prop drilling
- `React.createContext()`
- `Context.Provider`
- `useContext` hook
- Когда использовать Context
- Множественные контексты
- Context для темизации (Theme)
- Context для аутентификации (Auth)

**Практика:**
- Theme Context (светлая/тёмная тема)
- Language Context (i18n)
- Auth Context (user state)
- Global state с Context

---

### Блок 10: useReducer Hook
**Файлы:** `10-usereducer.md` + `10-usereducer-practice.md`

**Цель:** Управлять сложным state с помощью reducer.

**Темы:**
- Что такое reducer
- `useReducer` hook
- State, action, reducer function
- Dispatch actions
- useReducer vs useState
- Комбинирование useReducer + useContext
- Имитация Redux паттерна

**Практика:**
- Counter с useReducer
- Todo List с useReducer
- Форма с useReducer
- Shopping Cart с useReducer

---

### Блок 11: Custom Hooks
**Файлы:** `11-custom-hooks.md` + `11-custom-hooks-practice.md`

**Цель:** Создавать переиспользуемую логику через кастомные хуки.

**Темы:**
- Зачем нужны кастомные хуки
- Правила создания хуков
- Префикс `use`
- Извлечение логики в хуки
- Параметризация хуков
- Возврат значений из хуков
- Популярные паттерны кастомных хуков

**Практика:**
- `useFetch` — для API запросов
- `useLocalStorage` — синхронизация с localStorage
- `useToggle` — boolean state toggle
- `useDebounce` — debounce значений

---

### Блок 12: React Router — навигация и маршрутизация
**Файлы:** `12-react-router.md` + `12-react-router-practice.md`

**Цель:** Реализовать навигацию между страницами в SPA.

**Темы:**
- Установка: `react-router-dom`
- `BrowserRouter`, `Routes`, `Route`
- `Link` и `NavLink`
- Динамические маршруты: `/users/:id`
- `useParams`, `useNavigate`, `useLocation`
- Nested routes (вложенные маршруты)
- Protected routes (приватные маршруты)
- 404 страница

**Практика:**
- Многостраничное приложение (Home, About, Contact)
- Динамические маршруты (User Profile)
- Nested routes (Dashboard с подразделами)
- Protected routes с аутентификацией

---

### Блок 13: HTTP запросы — fetch и axios
**Файлы:** `13-http-requests.md` + `13-http-requests-practice.md`

**Цель:** Взаимодействовать с API и обрабатывать данные.

**Темы:**
- fetch API
- axios библиотека
- GET, POST, PUT, DELETE запросы
- Обработка ошибок
- Loading состояния
- Abort запросов
- Interceptors (axios)
- Работа с query параметрами

**Практика:**
- Загрузка списка постов с API
- CRUD приложение с API
- Поиск с API (debounce)
- Pagination с API

---

### Блок 14: State Management — Redux Toolkit
**Файлы:** `14-redux-toolkit.md` + `14-redux-toolkit-practice.md`

**Цель:** Управлять глобальным состоянием приложения с Redux.

**Темы:**
- Зачем нужен Redux
- Установка: `@reduxjs/toolkit`, `react-redux`
- Store, Slice, Reducer, Action
- `configureStore`
- `createSlice`
- `useSelector`, `useDispatch`
- Async actions: `createAsyncThunk`
- Redux DevTools

**Практика:**
- Counter с Redux
- Todo List с Redux
- Shopping Cart с Redux
- Async data fetching с Redux Thunk

---

### Блок 15: Оптимизация производительности
**Файлы:** `15-performance.md` + `15-performance-practice.md`

**Цель:** Оптимизировать React приложения для лучшей производительности.

**Темы:**
- React.memo — мемоизация компонентов
- `useMemo` hook — мемоизация значений
- `useCallback` hook — мемоизация функций
- Lazy loading: `React.lazy()`, `Suspense`
- Code splitting
- Virtualization (react-window, react-virtualized)
- Профилирование с React DevTools
- Избегание лишних рендеров

**Практика:**
- Оптимизация списка с React.memo
- Lazy loading страниц
- Виртуализация большого списка
- Профилирование и оптимизация медленных компонентов

---

### Блок 16: TypeScript с React
**Файлы:** `16-typescript.md` + `16-typescript-practice.md`

**Цель:** Использовать TypeScript для type-safe React приложений.

**Темы:**
- Установка TypeScript в React проект
- Типизация props: `interface` vs `type`
- Типизация state и events
- Generics в компонентах
- `React.FC` vs обычные функции
- Типизация хуков: useState, useRef, useContext
- Типизация кастомных хуков
- Type inference

**Практика:**
- Компонент с типизированными props
- Форма с TypeScript
- Custom hook с TypeScript
- Redux с TypeScript

---

### Блок 17: Тестирование React приложений
**Файлы:** `17-testing.md` + `17-testing-practice.md`

**Цель:** Писать unit и integration тесты для компонентов.

**Темы:**
- Jest — тестовый фреймворк
- React Testing Library
- Рендеринг компонентов: `render()`
- Queries: `getBy`, `queryBy`, `findBy`
- User events: `fireEvent`, `userEvent`
- Тестирование хуков: `@testing-library/react-hooks`
- Мокирование API запросов
- Snapshot тесты
- Coverage

**Практика:**
- Unit тесты для компонентов
- Тестирование форм
- Тестирование async операций
- Тестирование кастомных хуков

---

### Блок 18: Advanced Patterns
**Файлы:** `18-advanced-patterns.md` + `18-advanced-patterns-practice.md`

**Цель:** Изучить продвинутые паттерны разработки на React.

**Темы:**
- Higher-Order Components (HOC)
- Render Props
- Compound Components
- Controlled vs Uncontrolled components
- Portal: `ReactDOM.createPortal()`
- Error Boundaries
- Refs: `useRef`, `forwardRef`, `useImperativeHandle`
- Controlled re-rendering

**Практика:**
- HOC для аутентификации
- Modal с Portal
- Error Boundary компонент
- Compound component (Tabs)

---

### Блок 19: Styling в React
**Файлы:** `19-styling.md` + `19-styling-practice.md`

**Цель:** Освоить различные подходы к стилизации.

**Темы:**
- CSS Modules
- Styled Components
- Emotion
- Tailwind CSS с React
- CSS-in-JS vs CSS файлы
- Theme providers
- Responsive design в React
- UI библиотеки: Material-UI, Chakra UI, Ant Design

**Практика:**
- Styled Components приложение
- Tailwind CSS приложение
- Темизация с styled-components
- Использование UI библиотеки (MUI)

---

### Блок 20: Next.js — React framework
**Файлы:** `20-nextjs.md` + `20-nextjs-practice.md`

**Цель:** Освоить Next.js для серверного рендеринга и оптимизации.

**Темы:**
- Что такое Next.js и его преимущества
- Установка и структура проекта
- File-based routing
- Pages и API routes
- Server-Side Rendering (SSR): `getServerSideProps`
- Static Site Generation (SSG): `getStaticProps`, `getStaticPaths`
- Incremental Static Regeneration (ISR)
- Image optimization: `next/image`
- Deployment на Vercel

**Практика:**
- Простое Next.js приложение
- Блог с SSG
- Динамические маршруты
- API routes для backend
- Деплой на Vercel

---

## Рекомендуемый порядок изучения

**Базовый уровень (Блоки 1-8):**
Основы React, компоненты, state, события, списки, композиция, useEffect, формы.

**Средний уровень (Блоки 9-13):**
Context API, useReducer, кастомные хуки, React Router, HTTP запросы.

**Продвинутый уровень (Блоки 14-20):**
Redux, оптимизация, TypeScript, тестирование, продвинутые паттерны, стилизация, Next.js.

---

## Полезные ресурсы

- [React Official Documentation](https://react.dev/)
- [React Tutorial for Beginners](https://react.dev/learn)
- [freeCodeCamp React Course](https://www.freecodecamp.org/)
- [React Patterns](https://reactpatterns.com/)
- [Awesome React](https://github.com/enaqx/awesome-react)
