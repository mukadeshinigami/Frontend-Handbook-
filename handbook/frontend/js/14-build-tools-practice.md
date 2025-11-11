# Блок 14: Инструменты сборки — Практика

## Проект 1: Multi-page App с Vite

Создаём многостраничное приложение с оптимизированной сборкой.

### Установка

```bash
npm create vite@latest vite-multipage -- --template vanilla
cd vite-multipage
npm install
```

### Структура

```
vite-multipage/
  ├── index.html
  ├── about.html
  ├── contact.html
  ├── vite.config.js
  ├── package.json
  └── src/
      ├── main.js
      ├── about.js
      ├── contact.js
      ├── styles/
      │   ├── main.css
      │   └── components.css
      ├── utils/
      │   ├── api.js
      │   └── helpers.js
      └── components/
          ├── navbar.js
          └── footer.js
```

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  
  server: {
    port: 3000,
    open: true
  }
});
```

### src/components/navbar.js

```javascript
export function createNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  
  nav.innerHTML = `
    <div class="container">
      <a href="/" class="logo">MyApp</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/contact.html">Contact</a></li>
      </ul>
    </div>
  `;
  
  // Подсветка активной страницы
  const currentPath = window.location.pathname;
  const links = nav.querySelectorAll('a');
  
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (currentPath === '/' && link.getAttribute('href') === '/')) {
      link.classList.add('active');
    }
  });
  
  return nav;
}
```

### src/components/footer.js

```javascript
export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  
  footer.innerHTML = `
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} MyApp. All rights reserved.</p>
      <div class="social-links">
        <a href="#" aria-label="GitHub">GitHub</a>
        <a href="#" aria-label="Twitter">Twitter</a>
      </div>
    </div>
  `;
  
  return footer;
}
```

### src/utils/api.js

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### src/utils/helpers.js

```javascript
export function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### src/main.js

```javascript
import './styles/main.css';
import './styles/components.css';
import { createNavbar } from '@components/navbar.js';
import { createFooter } from '@components/footer.js';

// Добавляем навигацию и футер
document.body.prepend(createNavbar());
document.body.appendChild(createFooter());

// Главная страница
const app = document.getElementById('app');

app.innerHTML = `
  <div class="hero">
    <h1>Welcome to MyApp</h1>
    <p>Build amazing things with Vite</p>
    <button id="ctaBtn" class="btn btn-primary">Get Started</button>
  </div>
  
  <div class="features">
    <div class="feature-card">
      <h3>⚡ Fast</h3>
      <p>Lightning-fast development with HMR</p>
    </div>
    <div class="feature-card">
      <h3>📦 Optimized</h3>
      <p>Production-ready builds</p>
    </div>
    <div class="feature-card">
      <h3>🔧 Flexible</h3>
      <p>Extensible via plugins</p>
    </div>
  </div>
`;

// Динамический импорт (lazy loading)
document.getElementById('ctaBtn').addEventListener('click', async () => {
  const { showModal } = await import('./utils/modal.js');
  showModal('Getting Started', 'Check out our documentation!');
});
```

### src/about.js

```javascript
import './styles/main.css';
import { createNavbar } from '@components/navbar.js';
import { createFooter } from '@components/footer.js';
import { formatDate } from '@utils/helpers.js';

document.body.prepend(createNavbar());
document.body.appendChild(createFooter());

const app = document.getElementById('app');

app.innerHTML = `
  <div class="container">
    <h1>About Us</h1>
    <p>Founded: ${formatDate(new Date('2024-01-01'))}</p>
    <p>We build amazing web applications with modern tools.</p>
  </div>
`;
```

### src/contact.js

```javascript
import './styles/main.css';
import { createNavbar } from '@components/navbar.js';
import { createFooter } from '@components/footer.js';
import { validateEmail, debounce } from '@utils/helpers.js';
import { postData } from '@utils/api.js';

document.body.prepend(createNavbar());
document.body.appendChild(createFooter());

const app = document.getElementById('app');

app.innerHTML = `
  <div class="container">
    <h1>Contact Us</h1>
    <form id="contactForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
        <span class="error" id="emailError"></span>
      </div>
      
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" rows="5" required></textarea>
      </div>
      
      <button type="submit" class="btn btn-primary">Send</button>
    </form>
    <div id="status"></div>
  </div>
`;

// Валидация email с debounce
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

const validateEmailInput = debounce(() => {
  const email = emailInput.value;
  
  if (email && !validateEmail(email)) {
    emailError.textContent = 'Invalid email format';
    emailInput.classList.add('invalid');
  } else {
    emailError.textContent = '';
    emailInput.classList.remove('invalid');
  }
}, 300);

emailInput.addEventListener('input', validateEmailInput);

// Отправка формы
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const status = document.getElementById('status');
  status.textContent = 'Sending...';
  
  try {
    const data = {
      email: emailInput.value,
      message: document.getElementById('message').value
    };
    
    await postData('/contact', data);
    
    status.textContent = 'Message sent successfully!';
    status.className = 'success';
    e.target.reset();
  } catch (error) {
    status.textContent = 'Error sending message. Please try again.';
    status.className = 'error';
  }
});
```

### src/styles/main.css

```css
:root {
  --primary-color: #3498db;
  --text-color: #333;
  --bg-color: #f5f5f5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--text-color);
  background: var(--bg-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MyApp - Home</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

### .env.development

```
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG=true
```

### .env.production

```
VITE_API_URL=https://api.myapp.com
VITE_DEBUG=false
```

**Команды:**

```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Проект 2: TypeScript + Webpack

### Установка

```bash
mkdir webpack-ts-app
cd webpack-ts-app
npm init -y
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev typescript ts-loader
npm install --save-dev html-webpack-plugin css-loader style-loader
npm install --save-dev mini-css-extract-plugin
```

### package.json

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "watch": "webpack --watch --mode development"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### webpack.config.js

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.ts',
    
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    
    devServer: {
      static: './dist',
      port: 3000,
      hot: true,
      open: true
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    module: {
      rules: [
        // TypeScript
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        
        // CSS
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        
        // Images
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        }
      ]
    },
    
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components')
      }
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: isProduction
      }),
      
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css'
        })
      ] : [])
    ],
    
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      },
      runtimeChunk: 'single'
    }
  };
};
```

### src/index.ts

```typescript
import './styles/main.css';
import { TodoManager } from '@/todo/TodoManager';
import { renderTodoList } from '@components/TodoList';

const manager = new TodoManager();

// Добавление todos
manager.addTodo({ text: 'Learn Webpack', completed: false });
manager.addTodo({ text: 'Master TypeScript', completed: false });

// Рендер
renderTodoList(manager);

// Горячая перезагрузка модулей (HMR)
if (module.hot) {
  module.hot.accept();
}
```

**Команды:**

```bash
npm start   # Development
npm run build  # Production
```

---

## Проект 3: Bundle Optimization

### Анализ bundle

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

### Lazy Loading

```typescript
// До (все импортируется сразу)
import { heavyModule } from './heavy-module';

// После (загружается по требованию)
button.addEventListener('click', async () => {
  const { heavyModule } = await import('./heavy-module');
  heavyModule.doSomething();
});
```

### Code Splitting

```typescript
// vendors.ts - Выносим библиотеки отдельно
import 'lodash';
import 'axios';
import 'dayjs';

// main.ts - Основной код
import { app } from './app';
app.init();
```

---

## Итог

✅ **Vite** — быстрый modern bundler  
✅ **Webpack** — мощный настраиваемый bundler  
✅ **Code splitting** — разделение кода на части  
✅ **Lazy loading** — загрузка по требованию  
✅ **Bundle analysis** — анализ размера сборки  

**Вы освоили инструменты сборки!** 🎯
