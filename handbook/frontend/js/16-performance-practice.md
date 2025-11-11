# Блок 16: Производительность — Практика

## Проект 1: Infinite Scroll с виртуализацией

Создаём список с 100,000 элементов, загружающийся плавно.

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Virtual Scroll</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Virtual Scroll Demo</h1>
    <div class="stats">
      <span>Total items: <strong id="totalItems">0</strong></span>
      <span>Rendered: <strong id="renderedItems">0</strong></span>
      <span>FPS: <strong id="fps">0</strong></span>
    </div>
    
    <div id="scrollContainer" class="scroll-container">
      <div id="content"></div>
    </div>
  </div>
  
  <script src="app.js"></script>
</body>
</html>
```

### style.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats span {
  color: #666;
}

.stats strong {
  color: #3498db;
}

.scroll-container {
  height: 600px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.item:hover {
  background: #f8f9fa;
}

.item-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.item-desc {
  color: #666;
  font-size: 14px;
}
```

### app.js

```javascript
class VirtualScroll {
  constructor(container, options = {}) {
    this.container = container;
    this.itemHeight = options.itemHeight || 80;
    this.buffer = options.buffer || 5;
    this.totalItems = options.totalItems || 0;
    
    this.content = document.getElementById('content');
    this.scrollTop = 0;
    this.viewportHeight = container.clientHeight;
    this.visibleCount = Math.ceil(this.viewportHeight / this.itemHeight);
    
    this.setupContainer();
    this.attachEvents();
    this.render();
  }
  
  setupContainer() {
    this.content.style.height = `${this.totalItems * this.itemHeight}px`;
    this.content.style.position = 'relative';
  }
  
  attachEvents() {
    let ticking = false;
    
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.render();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  render() {
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer);
    const endIndex = Math.min(
      this.totalItems,
      startIndex + this.visibleCount + this.buffer * 2
    );
    
    const fragment = document.createDocumentFragment();
    
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.createItem(i);
      fragment.appendChild(item);
    }
    
    // Очищаем и вставляем новые элементы
    this.content.innerHTML = '';
    this.content.appendChild(fragment);
    
    // Обновляем статистику
    document.getElementById('renderedItems').textContent = endIndex - startIndex;
  }
  
  createItem(index) {
    const item = document.createElement('div');
    item.className = 'item';
    item.style.position = 'absolute';
    item.style.top = `${index * this.itemHeight}px`;
    item.style.width = '100%';
    item.style.height = `${this.itemHeight}px`;
    
    item.innerHTML = `
      <div class="item-title">Item #${index + 1}</div>
      <div class="item-desc">This is item number ${index + 1} in the list</div>
    `;
    
    return item;
  }
}

// FPS Counter
class FPSCounter {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    
    this.update();
  }
  
  update() {
    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
      
      document.getElementById('fps').textContent = this.fps;
    }
    
    requestAnimationFrame(() => this.update());
  }
}

// Инициализация
const TOTAL_ITEMS = 100000;

document.getElementById('totalItems').textContent = TOTAL_ITEMS.toLocaleString();

const container = document.getElementById('scrollContainer');
const virtualScroll = new VirtualScroll(container, {
  totalItems: TOTAL_ITEMS,
  itemHeight: 80,
  buffer: 5
});

new FPSCounter();
```

---

## Проект 2: Image Lazy Loading с Intersection Observer

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lazy Loading Gallery</title>
  <link rel="stylesheet" href="gallery.css">
</head>
<body>
  <div class="container">
    <h1>🖼️ Lazy Loading Gallery</h1>
    
    <div class="stats">
      <span>Total: <strong id="total">0</strong></span>
      <span>Loaded: <strong id="loaded">0</strong></span>
      <span>Data saved: <strong id="saved">0</strong> KB</span>
    </div>
    
    <div id="gallery" class="gallery"></div>
  </div>
  
  <script src="gallery.js"></script>
</body>
</html>
```

### gallery.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f0f0f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.gallery-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 66.67%; /* 3:2 aspect ratio */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s;
}

.image-wrapper img.loaded {
  opacity: 1;
}

.image-wrapper.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.item-info {
  padding: 15px;
}

.item-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.item-size {
  font-size: 14px;
  color: #666;
}
```

### gallery.js

```javascript
class LazyGallery {
  constructor(container, images) {
    this.container = container;
    this.images = images;
    this.loaded = 0;
    this.totalSize = 0;
    this.savedSize = 0;
    
    this.setupObserver();
    this.render();
  }
  
  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
      }
    );
  }
  
  render() {
    const fragment = document.createDocumentFragment();
    
    this.images.forEach((image, index) => {
      const item = this.createItem(image, index);
      fragment.appendChild(item);
    });
    
    this.container.appendChild(fragment);
    
    // Наблюдаем за всеми изображениями
    this.container.querySelectorAll('.lazy-image').forEach(img => {
      this.observer.observe(img);
    });
    
    document.getElementById('total').textContent = this.images.length;
    this.updateStats();
  }
  
  createItem(imageData, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    item.innerHTML = `
      <div class="image-wrapper loading">
        <img 
          class="lazy-image" 
          data-src="${imageData.url}" 
          data-size="${imageData.size}"
          alt="${imageData.title}"
        >
      </div>
      <div class="item-info">
        <div class="item-title">${imageData.title}</div>
        <div class="item-size">${(imageData.size / 1024).toFixed(1)} KB</div>
      </div>
    `;
    
    return item;
  }
  
  loadImage(img) {
    const wrapper = img.parentElement;
    const src = img.dataset.src;
    const size = parseInt(img.dataset.size);
    
    // Симулируем загрузку
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      wrapper.classList.remove('loading');
      
      this.loaded++;
      this.totalSize += size;
      this.updateStats();
    };
    
    tempImg.onerror = () => {
      wrapper.classList.remove('loading');
      console.error('Failed to load:', src);
    };
    
    // Задержка для демонстрации
    setTimeout(() => {
      tempImg.src = src;
    }, 100);
  }
  
  updateStats() {
    document.getElementById('loaded').textContent = this.loaded;
    
    const totalPossible = this.images.reduce((sum, img) => sum + img.size, 0);
    this.savedSize = totalPossible - this.totalSize;
    
    document.getElementById('saved').textContent = 
      (this.savedSize / 1024).toFixed(1);
  }
}

// Генерация фейковых изображений
function generateImages(count) {
  const images = [];
  
  for (let i = 0; i < count; i++) {
    images.push({
      url: `https://picsum.photos/400/300?random=${i}`,
      title: `Image ${i + 1}`,
      size: Math.floor(Math.random() * 200000) + 50000 // 50-250 KB
    });
  }
  
  return images;
}

// Инициализация
const gallery = document.getElementById('gallery');
const images = generateImages(50);
new LazyGallery(gallery, images);
```

---

## Проект 3: Performance Monitoring Dashboard

### performance-monitor.js

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      memory: 0,
      dom: 0,
      network: []
    };
    
    this.init();
  }
  
  init() {
    this.measureFPS();
    this.measureMemory();
    this.measureDOM();
    this.measureNetwork();
    this.measureWebVitals();
    
    this.render();
    setInterval(() => this.render(), 1000);
  }
  
  measureFPS() {
    let lastTime = performance.now();
    let frames = 0;
    
    const countFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFPS);
    };
    
    countFPS();
  }
  
  measureMemory() {
    if (performance.memory) {
      setInterval(() => {
        this.metrics.memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
      }, 1000);
    }
  }
  
  measureDOM() {
    setInterval(() => {
      this.metrics.dom = document.querySelectorAll('*').length;
    }, 1000);
  }
  
  measureNetwork() {
    const resources = performance.getEntriesByType('resource');
    
    this.metrics.network = resources.map(resource => ({
      name: resource.name.split('/').pop(),
      duration: Math.round(resource.duration),
      size: resource.transferSize || 0,
      type: resource.initiatorType
    }));
  }
  
  async measureWebVitals() {
    if ('web-vitals' in window) {
      const { getCLS, getFID, getLCP } = window.webVitals;
      
      getCLS((metric) => {
        this.metrics.cls = metric.value.toFixed(3);
      });
      
      getFID((metric) => {
        this.metrics.fid = Math.round(metric.value);
      });
      
      getLCP((metric) => {
        this.metrics.lcp = Math.round(metric.value);
      });
    }
  }
  
  render() {
    const dashboard = document.getElementById('performance-dashboard');
    
    dashboard.innerHTML = `
      <div class="metric-card">
        <div class="metric-title">FPS</div>
        <div class="metric-value ${this.getFPSClass()}">${this.metrics.fps}</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-title">Memory</div>
        <div class="metric-value">${this.metrics.memory} MB</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-title">DOM Nodes</div>
        <div class="metric-value">${this.metrics.dom}</div>
      </div>
      
      ${this.metrics.lcp ? `
        <div class="metric-card">
          <div class="metric-title">LCP</div>
          <div class="metric-value ${this.getLCPClass()}">${this.metrics.lcp}ms</div>
        </div>
      ` : ''}
      
      <div class="resources">
        <h3>Network Resources</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${this.metrics.network.slice(0, 10).map(resource => `
              <tr>
                <td>${resource.name}</td>
                <td>${resource.type}</td>
                <td>${resource.duration}ms</td>
                <td>${(resource.size / 1024).toFixed(1)} KB</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  getFPSClass() {
    if (this.metrics.fps >= 55) return 'good';
    if (this.metrics.fps >= 30) return 'ok';
    return 'bad';
  }
  
  getLCPClass() {
    if (this.metrics.lcp <= 2500) return 'good';
    if (this.metrics.lcp <= 4000) return 'ok';
    return 'bad';
  }
}

// Инициализация
new PerformanceMonitor();
```

---

## Проект 4: Debounce/Throttle Search

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Search с debounce
const searchInput = document.getElementById('search');
let callCount = 0;

const search = debounce(async (query) => {
  callCount++;
  document.getElementById('callCount').textContent = callCount;
  
  if (!query) return;
  
  const results = await fetch(`/api/search?q=${query}`)
    .then(res => res.json());
  
  renderResults(results);
}, 300);

searchInput.addEventListener('input', (e) => {
  search(e.target.value);
});

// Scroll с throttle
const handleScroll = throttle(() => {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  
  document.getElementById('scrollProgress').style.width = `${scrollPercent}%`;
}, 100);

window.addEventListener('scroll', handleScroll);
```

---

## Итог

✅ **Virtual Scroll** — рендер только видимых элементов  
✅ **Lazy Loading** — загрузка по требованию  
✅ **Debounce/Throttle** — оптимизация частых событий  
✅ **Performance API** — измерение производительности  
✅ **Memory profiling** — поиск утечек памяти  

**Вы освоили оптимизацию производительности!** 🎯
