# Блок 16 — TypeScript + React

## Настройка проекта

### Создание нового проекта с TypeScript

```bash
# Vite
npm create vite@latest my-app -- --template react-ts

# Create React App
npx create-react-app my-app --template typescript
```

### Добавление TypeScript в существующий проект

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

Создайте `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---

## Типизация компонентов

### Функциональные компоненты

```tsx
// Способ 1: Inline типизация props
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Способ 2: Interface для props
interface GreetingProps {
  name: string;
  age?: number; // Optional prop
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// Способ 3: Type alias
type GreetingProps = {
  name: string;
  age?: number;
};

// Способ 4: React.FC (не рекомендуется в новых проектах)
const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return <h1>Hello, {name}!</h1>;
};
```

### Props с children

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode; // Любой JSX
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

// Использование
<Card title="My Card">
  <p>Content here</p>
</Card>
```

---

## События

### Типизация обработчиков событий

```tsx
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Submit</button>
    </form>
  );
}
```

### Общие типы событий

| Событие | Тип |
|---------|-----|
| onClick | `React.MouseEvent<HTMLButtonElement>` |
| onChange (input) | `React.ChangeEvent<HTMLInputElement>` |
| onChange (select) | `React.ChangeEvent<HTMLSelectElement>` |
| onSubmit | `React.FormEvent<HTMLFormElement>` |
| onKeyDown | `React.KeyboardEvent<HTMLInputElement>` |
| onFocus | `React.FocusEvent<HTMLInputElement>` |

---

## Hooks с TypeScript

### useState

```tsx
// Тип выводится автоматически
const [count, setCount] = useState(0); // number

// Явная типизация
const [name, setName] = useState<string>('');

// Union type
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

// Объект
interface User {
  id: number;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
```

### useRef

```tsx
// DOM элемент
const inputRef = useRef<HTMLInputElement>(null);

// Использование
useEffect(() => {
  inputRef.current?.focus(); // Optional chaining
}, []);

<input ref={inputRef} />

// Хранение значения
const countRef = useRef<number>(0);
countRef.current = 10;
```

### useReducer

```tsx
type State = {
  count: number;
};

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
    </div>
  );
}
```

### useContext

```tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Generic компоненты

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Использование
interface User {
  id: number;
  name: string;
}

const users: User[] = [{ id: 1, name: 'Alice' }];

<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

---

## Utility Types для React

```tsx
// Partial - все поля опциональны
type PartialUser = Partial<User>;

// Pick - выбрать поля
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - исключить поля
type UserWithoutPassword = Omit<User, 'password'>;

// ComponentProps - извлечь props типы
type ButtonProps = React.ComponentProps<'button'>;
type CustomButtonProps = React.ComponentProps<typeof CustomButton>;

// ReturnType - тип возвращаемого значения
const getUser = () => ({ id: 1, name: 'Alice' });
type User = ReturnType<typeof getUser>;
```

---

## Best Practices

### ✅ Хорошо

```tsx
// 1. Interface для props
interface Props {
  name: string;
}

// 2. Избегайте React.FC в новых проектах
function Component({ name }: Props) { }

// 3. Типизируйте useState явно при сложных типах
const [user, setUser] = useState<User | null>(null);

// 4. Используйте discriminated unions для actions
type Action =
  | { type: 'ADD'; payload: string }
  | { type: 'REMOVE'; payload: number };
```

### ❌ Плохо

```tsx
// ❌ any
const [data, setData] = useState<any>(null);

// ❌ Избыточная типизация
const count: number = useState<number>(0); // Автоматический вывод лучше

// ❌ Необязательные поля везде
interface Props {
  name?: string; // Если name всегда нужен, не делайте optional
}
```

---

## Практика

Задания в `16-typescript-react-practice.md`.
