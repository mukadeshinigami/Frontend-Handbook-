// gallery.js — простая и понятная галерея с localStorage, валидацией и делегированием
(() => {
  const STORAGE_KEY = 'simpleGallery:v1';
  const FALLBACK_SRC = 'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#ddd" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-size="18">Нет изображения</text></svg>');

  const form = document.getElementById('addImageForm');
  const imageUrlInput = document.getElementById('imageUrl');
  const imageCaptionInput = document.getElementById('imageCaption');
  const gallery = document.getElementById('gallery');

  // Утилита генерации id
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,9);
  }

  // Простая валидация URL (проверяет протокол)
  function isValidImageUrl(url) {
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  // Состояние — массив объектов {id, url, caption}
  let state = { images: [] };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) state.images = data;
      }
    } catch (e) {
      console.warn('Не удалось загрузить состояние', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.images));
    } catch (e) {
      console.warn('Не удалось сохранить состояние', e);
    }
  }

  function createGalleryItem({ id, url, caption }) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.id = id;
    item.setAttribute('role', 'listitem');

    const img = document.createElement('img');
    img.src = url;
    img.alt = caption || 'Изображение';
    img.loading = 'lazy';
    img.addEventListener('error', () => { img.src = FALLBACK_SRC; });

    const captionEl = document.createElement('div');
    captionEl.className = 'caption';
    captionEl.textContent = caption || '';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.setAttribute('aria-label', `Удалить: ${caption || 'изображение'}`);
    deleteBtn.dataset.action = 'delete';

    item.append(img, captionEl, deleteBtn);
    return item;
  }

  function renderGallery() {
    gallery.innerHTML = '';
    if (state.images.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Галерея пуста. Добавьте изображение через форму выше.';
      gallery.appendChild(empty);
      return;
    }
    const frag = document.createDocumentFragment();
    state.images.forEach(img => frag.appendChild(createGalleryItem(img)));
    gallery.appendChild(frag);
  }

  function addImage(url, caption) {
    if (!url || !caption) {
      alert('Заполните оба поля');
      return;
    }
    if (!isValidImageUrl(url)) {
      alert('Введите корректный URL (http или https).');
      return;
    }
    const item = { id: genId(), url, caption };
    state.images.push(item);
    saveState();
    renderGallery();
    imageUrlInput.value = '';
    imageCaptionInput.value = '';
    imageUrlInput.focus();
  }

  function deleteById(id) {
    const idx = state.images.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (!confirm('Удалить изображение?')) return;
    state.images.splice(idx,1);
    saveState();
    renderGallery();
  }

  // Делегируем клики в галерее
  gallery.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete"]');
    if (!btn) return;
    const item = btn.closest('.gallery-item');
    if (!item) return;
    deleteById(item.dataset.id);
  });

  // Обработка отправки формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addImage(imageUrlInput.value.trim(), imageCaptionInput.value.trim());
  });

  // Инициализация
  const initialImages = [
    { id: genId(), url: 'https://picsum.photos/400/300?random=1', caption: 'Природа 1' },
    { id: genId(), url: 'https://picsum.photos/400/300?random=2', caption: 'Архитектура' },
    { id: genId(), url: 'https://picsum.photos/400/300?random=3', caption: 'Город' }
  ];

  loadState();
  if (state.images.length === 0) {
    state.images = initialImages.slice();
    saveState();
  }
  renderGallery();
})();