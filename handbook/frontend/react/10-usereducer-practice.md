# Практика — useReducer

## Задание 1: Shopping Cart

Создайте корзину покупок с useReducer.

**Требования:**
1. Действия: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`
2. State: `{ items: [], total: 0 }`
3. Каждый item: `{ id, name, price, quantity }`
4. Автоматически пересчитывать total при изменениях

**Пример структуры:**

```jsx
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Если item уже есть, увеличить quantity
      // Иначе добавить новый
      break;
    case 'REMOVE_ITEM':
      // Удалить item по id
      break;
    case 'UPDATE_QUANTITY':
      // Обновить quantity для item
      break;
    case 'CLEAR_CART':
      // Очистить корзину
      break;
    default:
      return state;
  }
};
```

**Интерфейс:**
- Список доступных товаров (кнопка "Add to Cart")
- Корзина с quantity controls (+/-)
- Кнопка "Remove" для каждого товара
- Отображение total price
- Кнопка "Clear Cart"

---

## Задание 2: Form с валидацией

Создайте сложную форму регистрации с useReducer для управления state и ошибками.

**Поля:**
- Username (обязательно, минимум 3 символа)
- Email (обязательно, валидный email)
- Password (обязательно, минимум 8 символов)
- Confirm Password (должен совпадать с password)

**State структура:**

```jsx
{
  values: { username: '', email: '', password: '', confirmPassword: '' },
  errors: { username: '', email: '', password: '', confirmPassword: '' },
  touched: { username: false, email: false, password: false, confirmPassword: false },
  isSubmitting: false
}
```

**Actions:**
- `CHANGE_FIELD` - изменение поля
- `BLUR_FIELD` - поле потеряло фокус (для touched)
- `VALIDATE_FORM` - запуск валидации
- `SUBMIT_START` / `SUBMIT_SUCCESS` / `SUBMIT_ERROR`

**Требования:**
- Показывать ошибки только для touched полей
- Блокировать submit, если есть ошибки
- Показывать loading при отправке

---

## Задание 3: useReducer + useContext (Mini Redux)

Создайте приложение управления задачами с глобальным state.

**Структура:**

```
App
├── TaskProvider (Context + Reducer)
├── TaskInput
├── TaskList
│   └── TaskItem
└── TaskFilters
```

**State:**

```jsx
{
  tasks: [{ id, text, completed, priority }],
  filter: 'all', // 'all' | 'active' | 'completed'
  sort: 'date' // 'date' | 'priority'
}
```

**Actions:**
- `ADD_TASK`
- `TOGGLE_TASK`
- `DELETE_TASK`
- `SET_FILTER`
- `SET_SORT`

**Требования:**
1. Создать TaskContext с reducer
2. Создать custom hook `useTasks()` для доступа к context
3. Фильтрация и сортировка в selector функции
4. Priority: low, medium, high

**Подсказка для selector:**

```jsx
function useTasks() {
  const { state, dispatch } = useContext(TaskContext);
  
  const filteredTasks = useMemo(() => {
    let result = state.tasks;
    
    // Фильтрация
    if (state.filter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (state.filter === 'completed') {
      result = result.filter(t => t.completed);
    }
    
    // Сортировка
    if (state.sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      result = [...result].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    
    return result;
  }, [state.tasks, state.filter, state.sort]);
  
  return { tasks: filteredTasks, dispatch, filter: state.filter, sort: state.sort };
}
```

---

## Критерии выполнения

- ✅ Reducer функции чистые (нет мутаций, нет side effects)
- ✅ Используются константы для action types
- ✅ State обновляется иммутабельно
- ✅ В задании 3: context правильно разделён на Provider и Consumer
- ✅ Все действия обрабатываются в reducer
- ✅ Default case в reducer возвращает state
