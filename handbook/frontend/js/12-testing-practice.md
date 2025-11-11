# Блок 12: Тестирование — Практика

## Проект 1: Shopping Cart с тестами

Создаём корзину покупок с полным тестовым покрытием.

### Установка

```bash
mkdir cart-testing
cd cart-testing
npm init -y
npm install --save-dev jest
```

```json
// package.json
{
  "type": "module",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {}
};
```

### cart.js

```javascript
export class ShoppingCart {
  constructor() {
    this.items = [];
  }
  
  addItem(product, quantity = 1) {
    if (!product || !product.id || !product.name || !product.price) {
      throw new Error('Invalid product');
    }
    
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }
  
  removeItem(productId) {
    const index = this.items.findIndex(item => item.product.id === productId);
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    this.items.splice(index, 1);
  }
  
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    
    const item = this.items.find(item => item.product.id === productId);
    
    if (!item) {
      throw new Error('Product not found');
    }
    
    item.quantity = quantity;
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }
  
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  clear() {
    this.items = [];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  getItems() {
    return [...this.items];
  }
}
```

### cart.test.js

```javascript
import { ShoppingCart } from './cart.js';

describe('ShoppingCart', () => {
  let cart;
  let product1, product2;
  
  beforeEach(() => {
    cart = new ShoppingCart();
    product1 = { id: 1, name: 'Laptop', price: 1000 };
    product2 = { id: 2, name: 'Mouse', price: 50 };
  });
  
  describe('addItem', () => {
    test('adds new item to cart', () => {
      cart.addItem(product1);
      
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0]).toEqual({
        product: product1,
        quantity: 1
      });
    });
    
    test('adds item with custom quantity', () => {
      cart.addItem(product1, 3);
      
      expect(cart.getItems()[0].quantity).toBe(3);
    });
    
    test('increases quantity for existing item', () => {
      cart.addItem(product1, 2);
      cart.addItem(product1, 3);
      
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].quantity).toBe(5);
    });
    
    test('throws error for invalid product', () => {
      expect(() => cart.addItem(null)).toThrow('Invalid product');
      expect(() => cart.addItem({})).toThrow('Invalid product');
      expect(() => cart.addItem({ id: 1 })).toThrow('Invalid product');
    });
    
    test('throws error for non-positive quantity', () => {
      expect(() => cart.addItem(product1, 0)).toThrow('Quantity must be positive');
      expect(() => cart.addItem(product1, -5)).toThrow('Quantity must be positive');
    });
  });
  
  describe('removeItem', () => {
    test('removes item from cart', () => {
      cart.addItem(product1);
      cart.addItem(product2);
      
      cart.removeItem(1);
      
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].product.id).toBe(2);
    });
    
    test('throws error when removing non-existent item', () => {
      expect(() => cart.removeItem(999)).toThrow('Product not found');
    });
  });
  
  describe('updateQuantity', () => {
    test('updates quantity for existing item', () => {
      cart.addItem(product1, 2);
      cart.updateQuantity(1, 5);
      
      expect(cart.getItems()[0].quantity).toBe(5);
    });
    
    test('throws error for non-existent product', () => {
      expect(() => cart.updateQuantity(999, 5)).toThrow('Product not found');
    });
    
    test('throws error for non-positive quantity', () => {
      cart.addItem(product1);
      expect(() => cart.updateQuantity(1, 0)).toThrow('Quantity must be positive');
    });
  });
  
  describe('getTotal', () => {
    test('returns 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });
    
    test('calculates total for single item', () => {
      cart.addItem(product1, 2);
      expect(cart.getTotal()).toBe(2000);
    });
    
    test('calculates total for multiple items', () => {
      cart.addItem(product1, 2); // 2000
      cart.addItem(product2, 3); // 150
      expect(cart.getTotal()).toBe(2150);
    });
  });
  
  describe('getItemCount', () => {
    test('returns 0 for empty cart', () => {
      expect(cart.getItemCount()).toBe(0);
    });
    
    test('returns total quantity', () => {
      cart.addItem(product1, 2);
      cart.addItem(product2, 3);
      expect(cart.getItemCount()).toBe(5);
    });
  });
  
  describe('clear', () => {
    test('removes all items', () => {
      cart.addItem(product1);
      cart.addItem(product2);
      
      cart.clear();
      
      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotal()).toBe(0);
    });
  });
  
  describe('isEmpty', () => {
    test('returns true for empty cart', () => {
      expect(cart.isEmpty()).toBe(true);
    });
    
    test('returns false when cart has items', () => {
      cart.addItem(product1);
      expect(cart.isEmpty()).toBe(false);
    });
  });
});
```

**Запуск:**

```bash
npm test
npm run test:coverage
```

---

## Проект 2: Todo App с моками

Тестируем приложение с API-запросами.

### todoService.js

```javascript
export class TodoService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
  
  async fetchTodos() {
    const response = await this.apiClient.get('/todos');
    return response.data;
  }
  
  async addTodo(text) {
    if (!text || text.trim() === '') {
      throw new Error('Todo text is required');
    }
    
    const response = await this.apiClient.post('/todos', {
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    });
    
    return response.data;
  }
  
  async toggleTodo(id) {
    const todo = await this.apiClient.get(`/todos/${id}`);
    
    const response = await this.apiClient.put(`/todos/${id}`, {
      ...todo.data,
      completed: !todo.data.completed
    });
    
    return response.data;
  }
  
  async deleteTodo(id) {
    await this.apiClient.delete(`/todos/${id}`);
  }
}
```

### todoService.test.js

```javascript
import { TodoService } from './todoService.js';

describe('TodoService', () => {
  let service;
  let mockApiClient;
  
  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    
    service = new TodoService(mockApiClient);
  });
  
  describe('fetchTodos', () => {
    test('fetches todos from API', async () => {
      const mockTodos = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true }
      ];
      
      mockApiClient.get.mockResolvedValue({ data: mockTodos });
      
      const todos = await service.fetchTodos();
      
      expect(mockApiClient.get).toHaveBeenCalledWith('/todos');
      expect(todos).toEqual(mockTodos);
    });
    
    test('handles API errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));
      
      await expect(service.fetchTodos()).rejects.toThrow('Network error');
    });
  });
  
  describe('addTodo', () => {
    test('adds new todo', async () => {
      const newTodo = { id: 1, text: 'New task', completed: false };
      mockApiClient.post.mockResolvedValue({ data: newTodo });
      
      const result = await service.addTodo('New task');
      
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/todos',
        expect.objectContaining({
          text: 'New task',
          completed: false
        })
      );
      expect(result).toEqual(newTodo);
    });
    
    test('trims whitespace from text', async () => {
      mockApiClient.post.mockResolvedValue({ data: {} });
      
      await service.addTodo('  Task with spaces  ');
      
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/todos',
        expect.objectContaining({ text: 'Task with spaces' })
      );
    });
    
    test('throws error for empty text', async () => {
      await expect(service.addTodo('')).rejects.toThrow('Todo text is required');
      await expect(service.addTodo('   ')).rejects.toThrow('Todo text is required');
    });
  });
  
  describe('toggleTodo', () => {
    test('toggles todo completed status', async () => {
      const todo = { id: 1, text: 'Task', completed: false };
      mockApiClient.get.mockResolvedValue({ data: todo });
      mockApiClient.put.mockResolvedValue({ 
        data: { ...todo, completed: true } 
      });
      
      const result = await service.toggleTodo(1);
      
      expect(mockApiClient.get).toHaveBeenCalledWith('/todos/1');
      expect(mockApiClient.put).toHaveBeenCalledWith('/todos/1', {
        ...todo,
        completed: true
      });
      expect(result.completed).toBe(true);
    });
  });
  
  describe('deleteTodo', () => {
    test('deletes todo', async () => {
      mockApiClient.delete.mockResolvedValue({});
      
      await service.deleteTodo(1);
      
      expect(mockApiClient.delete).toHaveBeenCalledWith('/todos/1');
    });
  });
});
```

---

## Проект 3: User Manager с интеграционными тестами

### userManager.js

```javascript
export class UserManager {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }
  
  createUser(userData) {
    const { email, password, name, age } = userData;
    
    // Валидация
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email');
    }
    
    if (!this.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase and number');
    }
    
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    if (!Number.isInteger(age) || age < 18) {
      throw new Error('Age must be 18 or older');
    }
    
    // Проверка дублей
    if (this.findByEmail(email)) {
      throw new Error('Email already exists');
    }
    
    const user = {
      id: this.nextId++,
      email: email.toLowerCase(),
      password: this.hashPassword(password),
      name: name.trim(),
      age,
      createdAt: new Date()
    };
    
    this.users.push(user);
    return { ...user, password: undefined };
  }
  
  findByEmail(email) {
    return this.users.find(u => u.email === email.toLowerCase());
  }
  
  authenticate(email, password) {
    const user = this.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const hashedPassword = this.hashPassword(password);
    return user.password === hashedPassword ? { ...user, password: undefined } : null;
  }
  
  updateUser(id, updates) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (updates.email && updates.email !== user.email) {
      if (!this.validateEmail(updates.email)) {
        throw new Error('Invalid email');
      }
      if (this.findByEmail(updates.email)) {
        throw new Error('Email already exists');
      }
      user.email = updates.email.toLowerCase();
    }
    
    if (updates.name) {
      if (updates.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      user.name = updates.name.trim();
    }
    
    if (updates.age !== undefined) {
      if (!Number.isInteger(updates.age) || updates.age < 18) {
        throw new Error('Age must be 18 or older');
      }
      user.age = updates.age;
    }
    
    return { ...user, password: undefined };
  }
  
  deleteUser(id) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
  }
  
  getAllUsers() {
    return this.users.map(u => ({ ...u, password: undefined }));
  }
  
  // Вспомогательные методы
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  validatePassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  }
  
  hashPassword(password) {
    // Простой хеш для примера (в production используйте bcrypt)
    return password.split('').reverse().join('') + '_hashed';
  }
}
```

### userManager.test.js

```javascript
import { UserManager } from './userManager.js';

describe('UserManager', () => {
  let manager;
  
  beforeEach(() => {
    manager = new UserManager();
  });
  
  describe('createUser', () => {
    test('creates valid user', () => {
      const user = manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: 'Alex Johnson',
        age: 25
      });
      
      expect(user).toMatchObject({
        id: 1,
        email: 'test@example.com',
        name: 'Alex Johnson',
        age: 25
      });
      expect(user.password).toBeUndefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });
    
    test('normalizes email to lowercase', () => {
      const user = manager.createUser({
        email: 'TeSt@ExAmPlE.cOm',
        password: 'Abcd1234',
        name: 'Alex',
        age: 25
      });
      
      expect(user.email).toBe('test@example.com');
    });
    
    test('trims name whitespace', () => {
      const user = manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: '  Alex Johnson  ',
        age: 25
      });
      
      expect(user.name).toBe('Alex Johnson');
    });
    
    test('validates email format', () => {
      expect(() => manager.createUser({
        email: 'invalid',
        password: 'Abcd1234',
        name: 'Alex',
        age: 25
      })).toThrow('Invalid email');
    });
    
    test('validates password strength', () => {
      expect(() => manager.createUser({
        email: 'test@example.com',
        password: 'weak',
        name: 'Alex',
        age: 25
      })).toThrow('Password must be at least 8 characters');
    });
    
    test('validates name length', () => {
      expect(() => manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: 'A',
        age: 25
      })).toThrow('Name must be at least 2 characters');
    });
    
    test('validates age requirement', () => {
      expect(() => manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: 'Alex',
        age: 17
      })).toThrow('Age must be 18 or older');
    });
    
    test('prevents duplicate emails', () => {
      manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: 'Alex',
        age: 25
      });
      
      expect(() => manager.createUser({
        email: 'test@example.com',
        password: 'Pass1234',
        name: 'Bob',
        age: 30
      })).toThrow('Email already exists');
    });
  });
  
  describe('authenticate', () => {
    beforeEach(() => {
      manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: 'Alex',
        age: 25
      });
    });
    
    test('authenticates with correct credentials', () => {
      const user = manager.authenticate('test@example.com', 'Abcd1234');
      
      expect(user).not.toBeNull();
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBeUndefined();
    });
    
    test('returns null for wrong password', () => {
      const user = manager.authenticate('test@example.com', 'WrongPass1');
      expect(user).toBeNull();
    });
    
    test('returns null for non-existent email', () => {
      const user = manager.authenticate('notfound@example.com', 'Abcd1234');
      expect(user).toBeNull();
    });
  });
  
  describe('updateUser', () => {
    let userId;
    
    beforeEach(() => {
      const user = manager.createUser({
        email: 'test@example.com',
        password: 'Abcd1234',
        name: 'Alex',
        age: 25
      });
      userId = user.id;
    });
    
    test('updates user name', () => {
      const updated = manager.updateUser(userId, { name: 'Alexander' });
      expect(updated.name).toBe('Alexander');
    });
    
    test('updates user age', () => {
      const updated = manager.updateUser(userId, { age: 30 });
      expect(updated.age).toBe(30);
    });
    
    test('validates updated email', () => {
      expect(() => manager.updateUser(userId, { 
        email: 'invalid' 
      })).toThrow('Invalid email');
    });
    
    test('throws error for non-existent user', () => {
      expect(() => manager.updateUser(999, { 
        name: 'Bob' 
      })).toThrow('User not found');
    });
  });
  
  // Интеграционные тесты
  describe('Integration: Full user lifecycle', () => {
    test('complete user workflow', () => {
      // 1. Создание пользователя
      const user1 = manager.createUser({
        email: 'alice@example.com',
        password: 'Alice123',
        name: 'Alice',
        age: 28
      });
      
      expect(user1.id).toBe(1);
      
      // 2. Создание второго пользователя
      const user2 = manager.createUser({
        email: 'bob@example.com',
        password: 'Bob12345',
        name: 'Bob',
        age: 32
      });
      
      expect(user2.id).toBe(2);
      
      // 3. Получение всех пользователей
      const allUsers = manager.getAllUsers();
      expect(allUsers).toHaveLength(2);
      
      // 4. Аутентификация
      const authenticated = manager.authenticate('alice@example.com', 'Alice123');
      expect(authenticated).not.toBeNull();
      expect(authenticated.name).toBe('Alice');
      
      // 5. Обновление
      manager.updateUser(user1.id, { age: 29 });
      const updated = manager.findByEmail('alice@example.com');
      expect(updated.age).toBe(29);
      
      // 6. Удаление
      manager.deleteUser(user2.id);
      expect(manager.getAllUsers()).toHaveLength(1);
    });
  });
});
```

**Запуск:**

```bash
npm test
npm run test:coverage
```

---

## Итог

✅ **Unit-тесты** — проверяют отдельные функции  
✅ **Интеграционные тесты** — проверяют взаимодействие  
✅ **Моки** — заменяют внешние зависимости  
✅ **Coverage** — показывает покрытие кода  
✅ **TDD** — сначала тест, потом код  

**Вы освоили тестирование в JavaScript!** 🎯
