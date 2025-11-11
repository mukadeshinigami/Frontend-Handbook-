# Блок 14: Инструменты сборки (Build Tools)

## Введение

**Build tools** (инструменты сборки) — программы для автоматизации процесса подготовки кода к production:
- Сборка модулей в единый файл (bundling)
- Минификация и оптимизация
- Транспиляция (ES6+ → ES5, TypeScript → JS)
- Hot Module Replacement (HMR)
- Оптимизация изображений и ассетов

**Популярные инструменты:**
- **Vite** — быстрый современный bundler
- **Webpack** — мощный настраиваемый bundler
- **Rollup** — оптимизированный для библиотек
- **Parcel** — zero-config bundler

---

## Vite

**Vite** — современный build tool с мгновенным запуском сервера разработки.

### Преимущества

✅ Молниеносный запуск (использует ES modules)  
✅ Горячая перезагрузка (HMR)  
✅ Минимальная настройка  
✅ Поддержка TypeScript, JSX, CSS из коробки  

### Создание проекта

```bash
npm create vite@latest my-app
cd my-app
npm install
npm run dev
```

### Структура проекта

```
my-app/
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ├── public/
  │   └── favicon.ico
  └── src/
      ├── main.js
      ├── style.css
      └── components/
```

### vite.config.js

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  // Порт dev-сервера
  server: {
    port: 3000,
    open: true // Открывать браузер автоматически
  },
  
  // Базовый путь
  base: './',
  
  // Папка для сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Минификация
    minify: 'terser',
    
    // Source maps
    sourcemap: true,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lodash', 'axios']
        }
      }
    }
  },
  
  // Алиасы
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components'
    }
  }
});
```

### Использование

```javascript
// src/main.js
import './style.css';
import { createApp } from './app.js';

createApp();
```

```javascript
// src/app.js
export function createApp() {
  const app = document.getElementById('app');
  app.innerHTML = '<h1>Hello Vite!</h1>';
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Команды:**

```bash
npm run dev      # Запуск dev-сервера
npm run build    # Сборка для production
npm run preview  # Просмотр production-сборки
```

---

## Vite + TypeScript

```bash
npm create vite@latest my-ts-app -- --template vanilla-ts
cd my-ts-app
npm install
```

```typescript
// src/main.ts
import './style.css';
import { setupCounter } from './counter.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <button id="counter" type="button"></button>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
```

```typescript
// src/counter.ts
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  
  const setCounter = (count: number) => {
    counter = count;
    element.textContent = `count is ${counter}`;
  };
  
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
```

---

## Webpack

**Webpack** — мощный module bundler с гибкой настройкой.

### Установка

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin css-loader style-loader
```

### webpack.config.js

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Режим: development или production
  mode: 'development',
  
  // Входная точка
  entry: './src/index.js',
  
  // Выходной файл
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true // Очистка dist перед сборкой
  },
  
  // Dev-сервер
  devServer: {
    static: './dist',
    port: 3000,
    hot: true, // HMR
    open: true
  },
  
  // Source maps
  devtool: 'source-map',
  
  // Загрузчики (loaders)
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      
      // Изображения
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      
      // Шрифты
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  
  // Плагины
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Webpack App'
    })
  ]
};
```

### Babel (транспиляция ES6+)

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

### TypeScript в Webpack

```bash
npm install --save-dev typescript ts-loader
```

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
```

---

## Оптимизация сборки

### Code Splitting

```javascript
// Динамический импорт
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});
```

```javascript
// webpack.config.js
module.exports = {
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
    }
  }
};
```

### Tree Shaking

Удаление неиспользуемого кода (работает автоматически в production mode).

```javascript
// utils.js
export function usedFunction() { /* ... */ }
export function unusedFunction() { /* ... */ } // Будет удалена

// main.js
import { usedFunction } from './utils.js';
usedFunction();
```

### Минификация

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true // Удалить console.log
          }
        }
      })
    ]
  }
};
```

### Оптимизация изображений

```bash
npm install --save-dev image-webpack-loader
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { quality: 75 },
              pngquant: { quality: [0.65, 0.90] }
            }
          }
        ]
      }
    ]
  }
};
```

---

## Environment Variables

### Vite

```javascript
// .env.development
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=true
```

```javascript
// .env.production
VITE_API_URL=https://api.production.com
VITE_DEBUG=false
```

```javascript
// src/main.js
const apiUrl = import.meta.env.VITE_API_URL;
const debug = import.meta.env.VITE_DEBUG === 'true';

console.log('API URL:', apiUrl);
```

### Webpack

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
};
```

```javascript
// src/main.js
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode');
}
```

---

## CSS Preprocessors

### Sass в Vite

```bash
npm install --save-dev sass
```

```scss
// src/styles/main.scss
$primary-color: #3498db;

.button {
  background: $primary-color;
  
  &:hover {
    background: darken($primary-color, 10%);
  }
}
```

```javascript
// src/main.js
import './styles/main.scss';
```

### PostCSS (Autoprefixer)

```bash
npm install --save-dev postcss autoprefixer
```

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {}
  }
};
```

---

## Bundle Analysis

### Vite

```bash
npm install --save-dev rollup-plugin-visualizer
```

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: 'dist/stats.html'
    })
  ]
});
```

### Webpack

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

---

## Рекомендации

✅ Используйте **Vite** для новых проектов (быстрее, проще)  
✅ Используйте **Webpack** для сложных legacy-проектов  
✅ Включайте **source maps** в development  
✅ Используйте **code splitting** для больших приложений  
✅ Анализируйте размер bundle с помощью visualizer  

❌ Не компилируйте в development без необходимости  
❌ Не храните API ключи в переменных окружения клиента  
❌ Не игнорируйте предупреждения о размере chunk  

**Переходите к практике!** 🚀
