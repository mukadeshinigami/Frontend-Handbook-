// gallery.js — исправлена логика и опечатки (не дописаны дополнительные фичи)
(() => {
  const STORAGE_KEY = 'gallery:v1'; // Префикс для ключа в localStorage

  const FALLBACK_SRC = 'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#e9eef6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9aa5bf" font-size="18">Изображение недоступно</text></svg>');

  // state.images — массив объектов {id, url, caption}
  const state = { images: [] };

  // Унифицированный генератор id
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // Загрузка состояния из localStorage
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) state.images = parsed;
    } catch (err) {
      console.warn('loadState error', err);
    }
  }

  // Сохранение состояния в localStorage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.images));
    } catch (e) {
      console.error('Не удалось сохранить состояние в localStorage', e);
    }
  }

  // DOM references
  const form = document.getElementById('addImageForm');
  const imageUrlInput = document.getElementById('imageUrl');
  const imageCaptionInput = document.getElementById('imageCaption');
  const gallery = document.getElementById('gallery');

  if (!form || !imageUrlInput || !imageCaptionInput || !gallery) {
    console.error('Required DOM elements not found. Make sure your HTML has #addImageForm, #imageUrl, #imageCaption, #gallery');
    return;
  }

  function setText(node, text) {
    node.textContent = text == null ? '' : String(text);
  }

  /*
  ==================================================
       Chunk 3 — Render
  ==================================================
  */

  function createGalleryItem(item) {
    const { id, url, caption } = item;

    const wrap = document.createElement('div');
    wrap.className = 'gallery-item';
    wrap.dataset.id = id;
    wrap.setAttribute('role', 'listitem');

    const img = document.createElement('img');
    img.src = url;
    img.alt = caption || 'Gallery image';
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      if (img.src !== FALLBACK_SRC) img.src = FALLBACK_SRC;
    });

    const captionEl = document.createElement('div');
    captionEl.className = 'caption';
    setText(captionEl, caption);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.dataset.action = 'delete';
    setText(deleteBtn, 'Удалить');

    wrap.append(img, captionEl, deleteBtn);
    return wrap;
  }

  function renderGallery() {
    gallery.innerHTML = '';
    if (!state.images.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Галерея пуста. Добавьте изображения с помощью формы выше.';
      empty.setAttribute('aria-live', 'polite');
      gallery.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    state.images.forEach(img => {
      fragment.appendChild(createGalleryItem(img));
    });
    gallery.appendChild(fragment);
  }

  /* =========================
     Chunk 4 — Events & Actions
     ========================= */

  // Простая валидация URL (http/https)
  function isValidImageUrl(url) {
    if (!url) return false;
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  // Минимальный показ сообщения (stub), чтобы showMessage можно было вызывать
  function showMessage(text, type = 'info') {
    // проста заглушка — можно заменить на toast позже
    console.log(`[gallery:${type}] ${text}`);
  }

  // Добавление изображения (оставил реализацию, она корректна)
  function addImage(url, caption) {
    if (!url || !caption) {
      alert('Пожалуйста, заполните оба поля: URL изображения и подпись.');
      return;
    }
    if (!isValidImageUrl(url)) {
      alert('Пожалуйста, введите корректный URL изображения.');
      return;
    }

    const item = { id: genId(), url: url.trim(), caption: caption.trim() };
    state.images.push(item);
    saveState();
    renderGallery();
    form.reset();
    imageUrlInput.focus();
    showMessage('Изображение добавлено', 'success');
  }

  // Простая реализация удаления по id (чтобы ссылка deleteById в window.__gallery была валидна)
  function deleteById(id) {
    const idx = state.images.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (!confirm('Удалить изображение?')) return;
    state.images.splice(idx, 1);
    saveState();
    renderGallery();
    showMessage('Изображение удалено', 'info');
  }

  /* =========================
     Chunk 7 — Initialization
     ========================= */
  const initialImages = [
    { id: genId(), url: 'https://picsum.photos/400/300?random=1', caption: 'Природа 1' },
    { id: genId(), url: 'https://picsum.photos/400/300?random=2', caption: 'Архитектура' },
    { id: genId(), url: 'https://picsum.photos/400/300?random=3', caption: 'Город' }
  ];

  function init() {
    loadState();
    if (!state.images.length) {
      // начальные тестовые данные
      state.images = initialImages.slice();
      saveState();
    }
    renderGallery();
  }

  // expose small hook for tests/debugging (не глобально менять логику)
  window.__gallery = {
    state,
    addImage,
    deleteById,
    renderGallery
  };

  // запускаем инициализацию
  init();
})();