# Блок 13: TypeScript — Практика

## Проект 1: Todo App с TypeScript

Миграция Todo-приложения на TypeScript.

### Установка

```bash
mkdir todo-typescript
cd todo-typescript
npm init -y
npm install --save-dev typescript
npx tsc --init
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### src/types.ts

```typescript
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export type TodoInput = Omit<Todo, "id" | "createdAt">;

export type Filter = "all" | "active" | "completed";

export interface TodoState {
  todos: Todo[];
  filter: Filter;
}
```

### src/todoManager.ts

```typescript
import { Todo, TodoInput, Filter } from "./types.js";

export class TodoManager {
  private todos: Todo[] = [];
  private nextId: number = 1;
  
  addTodo(input: TodoInput): Todo {
    if (!input.text || input.text.trim().length === 0) {
      throw new Error("Todo text cannot be empty");
    }
    
    const todo: Todo = {
      id: this.nextId++,
      text: input.text.trim(),
      completed: input.completed,
      createdAt: new Date()
    };
    
    this.todos.push(todo);
    return todo;
  }
  
  getTodo(id: number): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }
  
  getAllTodos(): Todo[] {
    return [...this.todos];
  }
  
  getFilteredTodos(filter: Filter): Todo[] {
    switch (filter) {
      case "all":
        return this.getAllTodos();
      case "active":
        return this.todos.filter(todo => !todo.completed);
      case "completed":
        return this.todos.filter(todo => todo.completed);
      default:
        // TypeScript гарантирует, что мы покрыли все случаи
        const _exhaustive: never = filter;
        return _exhaustive;
    }
  }
  
  updateTodo(id: number, updates: Partial<TodoInput>): Todo {
    const todo = this.getTodo(id);
    
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    if (updates.text !== undefined) {
      if (updates.text.trim().length === 0) {
        throw new Error("Todo text cannot be empty");
      }
      todo.text = updates.text.trim();
    }
    
    if (updates.completed !== undefined) {
      todo.completed = updates.completed;
    }
    
    todo.updatedAt = new Date();
    
    return todo;
  }
  
  toggleTodo(id: number): Todo {
    const todo = this.getTodo(id);
    
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    todo.completed = !todo.completed;
    todo.updatedAt = new Date();
    
    return todo;
  }
  
  deleteTodo(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    this.todos.splice(index, 1);
  }
  
  clearCompleted(): number {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => !todo.completed);
    return initialLength - this.todos.length;
  }
  
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;
    
    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }
}
```

### src/main.ts

```typescript
import { TodoManager } from "./todoManager.js";
import { Filter } from "./types.js";

const manager = new TodoManager();

// Добавление todos
manager.addTodo({ text: "Learn TypeScript", completed: false });
manager.addTodo({ text: "Build a project", completed: false });
manager.addTodo({ text: "Deploy to production", completed: false });

console.log("All todos:", manager.getAllTodos());

// Переключение статуса
manager.toggleTodo(1);
console.log("After toggle:", manager.getTodo(1));

// Фильтрация
const filters: Filter[] = ["all", "active", "completed"];
filters.forEach(filter => {
  console.log(`${filter}:`, manager.getFilteredTodos(filter));
});

// Статистика
console.log("Stats:", manager.getStats());

// Обновление
manager.updateTodo(2, { text: "Build an awesome project" });

// Удаление завершённых
const cleared = manager.clearCompleted();
console.log(`Cleared ${cleared} completed todos`);
```

**Компиляция и запуск:**

```bash
npx tsc
node dist/main.js
```

---

## Проект 2: API Client с Generics

### src/apiClient.ts

```typescript
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiClient {
  constructor(private baseUrl: string) {}
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || "Request failed",
          errors: data.errors
        } as ApiError;
      }
      
      return {
        data,
        status: response.status
      };
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw {
        status: 0,
        message: error instanceof Error ? error.message : "Unknown error"
      } as ApiError;
    }
  }
  
  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "message" in error
    );
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }
  
  async post<T, D = unknown>(
    endpoint: string,
    data: D
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  
  async put<T, D = unknown>(
    endpoint: string,
    data: D
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}
```

### src/userService.ts

```typescript
import { ApiClient, ApiResponse } from "./apiClient.js";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export class UserService {
  private client: ApiClient;
  
  constructor(baseUrl: string) {
    this.client = new ApiClient(baseUrl);
  }
  
  async getUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>("/users");
    return response.data;
  }
  
  async getUser(id: number): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`);
    return response.data;
  }
  
  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await this.client.post<User, CreateUserDto>(
      "/users",
      userData
    );
    return response.data;
  }
  
  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const response = await this.client.put<User, UpdateUserDto>(
      `/users/${id}`,
      userData
    );
    return response.data;
  }
  
  async deleteUser(id: number): Promise<void> {
    await this.client.delete<void>(`/users/${id}`);
  }
}
```

### src/example.ts

```typescript
import { UserService } from "./userService.js";
import { ApiError } from "./apiClient.js";

const userService = new UserService("https://api.example.com");

async function main() {
  try {
    // Получение пользователей
    const users = await userService.getUsers();
    console.log("Users:", users);
    
    // Создание пользователя
    const newUser = await userService.createUser({
      name: "Alex Johnson",
      email: "alex@example.com",
      password: "SecurePass123"
    });
    console.log("Created:", newUser);
    
    // Обновление
    const updated = await userService.updateUser(newUser.id, {
      name: "Alexander Johnson"
    });
    console.log("Updated:", updated);
    
  } catch (error) {
    if (isApiError(error)) {
      console.error(`API Error ${error.status}: ${error.message}`);
      if (error.errors) {
        console.error("Validation errors:", error.errors);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

main();
```

---

## Проект 3: E-commerce Cart с Advanced Types

### src/product.types.ts

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  stock: number;
  images: string[];
  description: string;
}

export enum ProductCategory {
  Electronics = "electronics",
  Clothing = "clothing",
  Books = "books",
  Food = "food"
}

export type ProductPreview = Pick<Product, "id" | "name" | "price" | "images">;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type PaymentMethod = "card" | "paypal" | "cash";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

### src/cartManager.ts

```typescript
import { Product, CartItem, Cart, ProductCategory } from "./product.types.js";

export class CartManager {
  private items: CartItem[] = [];
  
  addItem(product: Product, quantity: number = 1): void {
    this.validateProduct(product);
    this.validateQuantity(quantity);
    
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} items available`);
    }
    
    const existingItem = this.findItem(product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new Error(`Cannot add ${quantity} more items. Only ${product.stock - existingItem.quantity} available`);
      }
      existingItem.quantity = newQuantity;
    } else {
      this.items.push({ product, quantity });
    }
  }
  
  removeItem(productId: number): void {
    const index = this.items.findIndex(item => item.product.id === productId);
    if (index === -1) {
      throw new Error("Item not found in cart");
    }
    this.items.splice(index, 1);
  }
  
  updateQuantity(productId: number, quantity: number): void {
    this.validateQuantity(quantity);
    
    const item = this.findItem(productId);
    if (!item) {
      throw new Error("Item not found in cart");
    }
    
    if (quantity > item.product.stock) {
      throw new Error(`Only ${item.product.stock} items available`);
    }
    
    item.quantity = quantity;
  }
  
  getCart(): Cart {
    return {
      items: [...this.items],
      total: this.calculateTotal(),
      itemCount: this.getItemCount()
    };
  }
  
  private calculateTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }
  
  private getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  private findItem(productId: number): CartItem | undefined {
    return this.items.find(item => item.product.id === productId);
  }
  
  getItemsByCategory(category: ProductCategory): CartItem[] {
    return this.items.filter(item => item.product.category === category);
  }
  
  applyDiscount(percentage: number): number {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Discount must be between 0 and 100");
    }
    
    const total = this.calculateTotal();
    return total * (1 - percentage / 100);
  }
  
  clear(): void {
    this.items = [];
  }
  
  private validateProduct(product: Product): void {
    if (!product || !product.id || !product.name || product.price < 0) {
      throw new Error("Invalid product");
    }
  }
  
  private validateQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }
  }
}
```

### src/orderManager.ts

```typescript
import { Order, OrderStatus, PaymentMethod, CartItem, Address } from "./product.types.js";
import { CartManager } from "./cartManager.js";

export class OrderManager {
  private orders: Order[] = [];
  
  createOrder(
    cart: CartManager,
    paymentMethod: PaymentMethod,
    shippingAddress: Address
  ): Order {
    const cartData = cart.getCart();
    
    if (cartData.items.length === 0) {
      throw new Error("Cannot create order with empty cart");
    }
    
    const order: Order = {
      id: this.generateOrderId(),
      items: cartData.items,
      total: cartData.total,
      status: "pending",
      paymentMethod,
      shippingAddress,
      createdAt: new Date()
    };
    
    this.orders.push(order);
    cart.clear();
    
    return order;
  }
  
  getOrder(orderId: string): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }
  
  updateOrderStatus(orderId: string, status: OrderStatus): Order {
    const order = this.getOrder(orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    order.status = status;
    return order;
  }
  
  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders.filter(order => order.status === status);
  }
  
  cancelOrder(orderId: string): Order {
    const order = this.getOrder(orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    if (order.status === "shipped" || order.status === "delivered") {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }
    
    order.status = "cancelled";
    return order;
  }
  
  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### src/main-shop.ts

```typescript
import { CartManager } from "./cartManager.js";
import { OrderManager } from "./orderManager.js";
import { Product, ProductCategory } from "./product.types.js";

// Создаём продукты
const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
    category: ProductCategory.Electronics,
    stock: 10,
    images: ["laptop1.jpg"],
    description: "Powerful laptop"
  },
  {
    id: 2,
    name: "T-Shirt",
    price: 25,
    category: ProductCategory.Clothing,
    stock: 50,
    images: ["tshirt1.jpg"],
    description: "Cotton T-shirt"
  }
];

// Создаём корзину
const cart = new CartManager();
cart.addItem(products[0], 2);
cart.addItem(products[1], 3);

console.log("Cart:", cart.getCart());

// Применяем скидку
const discountedTotal = cart.applyDiscount(10);
console.log("Total with 10% discount:", discountedTotal);

// Создаём заказ
const orderManager = new OrderManager();
const order = orderManager.createOrder(
  cart,
  "card",
  {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  }
);

console.log("Order created:", order);

// Обновляем статус
orderManager.updateOrderStatus(order.id, "processing");
console.log("Order status:", orderManager.getOrder(order.id)?.status);
```

**Компиляция:**

```bash
npx tsc
node dist/main-shop.js
```

---

## Итог

✅ **Типы** — находят ошибки на этапе разработки  
✅ **Интерфейсы** — описывают структуру объектов  
✅ **Generics** — переиспользуемый типизированный код  
✅ **Utility Types** — трансформация типов  
✅ **Type Guards** — безопасное сужение типов  

**Вы освоили TypeScript!** 🎯
