# Практика: Web Storage

## Введение

В этом уроке вы создадите **приложение для заметок** с автосохранением, тегами и экспортом данных.

**Функции:**
- Создание/редактирование/удаление заметок
- Автосохранение в localStorage
- Теги для организации
- Поиск и фильтрация
- Экспорт/импорт данных
- Статистика использования

**Время выполнения:** 50-60 минут  
**Сложность:** Продвинутый

---

## HTML

Создайте файл `notes-app.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Заметки с localStorage</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
    }

    .sidebar {
      background: white;
      border-radius: 15px;
      padding: 20px;
      height: fit-content;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar h2 {
      color: #667eea;
      margin-bottom: 20px;
    }

    .sidebar button {
      width: 100%;
      padding: 15px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 20px;
      transition: all 0.3s;
    }

    .sidebar button:hover {
      background: #764ba2;
    }

    .search-box {
      margin-bottom: 20px;
    }

    .search-box input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
    }

    .tags {
      margin-bottom: 20px;
    }

    .tag {
      display: inline-block;
      padding: 5px 12px;
      background: #f0f0f0;
      border-radius: 15px;
      margin: 5px 5px 5px 0;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .tag.active {
      background: #667eea;
      color: white;
    }

    .stats {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #666;
    }

    .stats div {
      margin-bottom: 5px;
    }

    .main {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .editor {
      display: none;
    }

    .editor.active {
      display: block;
    }

    .editor input {
      width: 100%;
      padding: 15px;
      font-size: 1.5rem;
      border: none;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 15px;
    }

    .editor input:focus {
      outline: none;
      border-color: #667eea;
    }

    .editor textarea {
      width: 100%;
      min-height: 400px;
      padding: 15px;
      font-size: 1.1rem;
      border: none;
      resize: vertical;
      font-family: inherit;
    }

    .editor textarea:focus {
      outline: none;
    }

    .editor-toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }

    .editor-toolbar input {
      flex: 1;
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .editor-toolbar button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }

    .btn-save {
      background: #28a745;
      color: white;
    }

    .btn-save:hover {
      background: #218838;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background: #c82333;
    }

    .btn-cancel {
      background: #6c757d;
      color: white;
    }

    .btn-cancel:hover {
      background: #5a6268;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }

    .note-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
    }

    .note-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .note-card h3 {
      color: #333;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .note-card p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      max-height: 60px;
      overflow: hidden;
    }

    .note-card .note-meta {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: #999;
    }

    .note-card .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .note-card .note-tag {
      padding: 2px 8px;
      background: #667eea;
      color: white;
      border-radius: 10px;
      font-size: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 100px 20px;
      color: #999;
    }

    .empty-state h2 {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .autosave-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      background: #28a745;
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .autosave-indicator.show {
      opacity: 1;
    }

    .export-buttons {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }

    .export-buttons button {
      flex: 1;
      padding: 10px;
      background: #17a2b8;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .export-buttons button:hover {
      background: #138496;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>📝 Заметки</h2>
      
      <button id="newNoteBtn">+ Новая заметка</button>
      
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="🔍 Поиск...">
      </div>
      
      <div class="tags">
        <strong>Теги:</strong>
        <div id="tagsList"></div>
      </div>
      
      <div class="stats" id="stats">
        <div><strong>Всего заметок:</strong> <span id="totalNotes">0</span></div>
        <div><strong>Использовано:</strong> <span id="storageUsed">0 KB</span></div>
      </div>
      
      <div class="export-buttons">
        <button id="exportBtn">📤 Экспорт</button>
        <button id="importBtn">📥 Импорт</button>
      </div>
      <input type="file" id="importFile" accept=".json" style="display: none;">
    </aside>
    
    <!-- Main Content -->
    <main class="main">
      <!-- Editor -->
      <div class="editor" id="editor">
        <input type="text" id="noteTitle" placeholder="Заголовок заметки">
        
        <div class="editor-toolbar">
          <input type="text" id="noteTags" placeholder="Теги через запятую (работа, личное)">
          <button class="btn-save" id="saveBtn">💾 Сохранить</button>
          <button class="btn-delete" id="deleteBtn">🗑️ Удалить</button>
          <button class="btn-cancel" id="cancelBtn">✖️ Отмена</button>
        </div>
        
        <textarea id="noteContent" placeholder="Начните писать..."></textarea>
      </div>
      
      <!-- Notes Grid -->
      <div class="notes-grid" id="notesGrid"></div>
    </main>
  </div>
  
  <div class="autosave-indicator" id="autosaveIndicator">
    ✓ Сохранено
  </div>

  <script src="notes-app.js"></script>
</body>
</html>
```

---

## JavaScript

Создайте файл `notes-app.js`:

```javascript
// Storage Manager
class NotesStorage {
  constructor() {
    this.key = 'notes_app_data';
  }
  
  getNotes() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Ошибка чтения:', e);
      return [];
    }
  }
  
  saveNotes(notes) {
    try {
      localStorage.setItem(this.key, JSON.stringify(notes));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('Хранилище переполнено. Удалите старые заметки.');
      }
      console.error('Ошибка записи:', e);
      return false;
    }
  }
  
  getStorageSize() {
    const data = localStorage.getItem(this.key) || '';
    return (data.length / 1024).toFixed(2);
  }
  
  exportNotes() {
    const notes = this.getNotes();
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_backup_${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  importNotes(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const notes = JSON.parse(e.target.result);
          if (Array.isArray(notes)) {
            resolve(notes);
          } else {
            reject(new Error('Неверный формат файла'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  }
}

// App
class NotesApp {
  constructor() {
    this.storage = new NotesStorage();
    this.notes = this.storage.getNotes();
    this.currentNoteId = null;
    this.selectedTag = null;
    this.searchQuery = '';
    this.autosaveTimer = null;
    
    this.initElements();
    this.attachEvents();
    this.render();
  }
  
  initElements() {
    this.newNoteBtn = document.getElementById('newNoteBtn');
    this.searchInput = document.getElementById('searchInput');
    this.tagsList = document.getElementById('tagsList');
    this.notesGrid = document.getElementById('notesGrid');
    this.editor = document.getElementById('editor');
    this.noteTitle = document.getElementById('noteTitle');
    this.noteContent = document.getElementById('noteContent');
    this.noteTags = document.getElementById('noteTags');
    this.saveBtn = document.getElementById('saveBtn');
    this.deleteBtn = document.getElementById('deleteBtn');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.importBtn = document.getElementById('importBtn');
    this.importFile = document.getElementById('importFile');
    this.autosaveIndicator = document.getElementById('autosaveIndicator');
    this.totalNotes = document.getElementById('totalNotes');
    this.storageUsed = document.getElementById('storageUsed');
  }
  
  attachEvents() {
    this.newNoteBtn.addEventListener('click', () => this.createNote());
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    this.saveBtn.addEventListener('click', () => this.saveCurrentNote());
    this.deleteBtn.addEventListener('click', () => this.deleteCurrentNote());
    this.cancelBtn.addEventListener('click', () => this.closeEditor());
    this.exportBtn.addEventListener('click', () => this.storage.exportNotes());
    this.importBtn.addEventListener('click', () => this.importFile.click());
    this.importFile.addEventListener('change', (e) => this.handleImport(e.target.files[0]));
    
    // Автосохранение
    [this.noteTitle, this.noteContent, this.noteTags].forEach(input => {
      input.addEventListener('input', () => this.scheduleAutosave());
    });
  }
  
  render() {
    this.renderNotes();
    this.renderTags();
    this.renderStats();
  }
  
  renderNotes() {
    let filtered = this.notes;
    
    // Фильтр по тегу
    if (this.selectedTag) {
      filtered = filtered.filter(note => 
        note.tags.includes(this.selectedTag)
      );
    }
    
    // Поиск
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
    
    // Сортировка по дате (новые первые)
    filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    
    if (filtered.length === 0) {
      this.notesGrid.innerHTML = `
        <div class="empty-state">
          <h2>📝</h2>
          <p>Нет заметок. Создайте первую!</p>
        </div>
      `;
    } else {
      this.notesGrid.innerHTML = filtered.map(note => `
        <div class="note-card" onclick="app.openNote('${note.id}')">
          <h3>${this.escapeHtml(note.title || 'Без названия')}</h3>
          <p>${this.escapeHtml(note.content.substring(0, 100))}</p>
          <div class="note-meta">
            <div class="note-tags">
              ${note.tags.map(tag => `<span class="note-tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
            <span>${this.formatDate(note.updatedAt)}</span>
          </div>
        </div>
      `).join('');
    }
  }
  
  renderTags() {
    const allTags = new Set();
    this.notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });
    
    const tagsArray = Array.from(allTags).sort();
    
    this.tagsList.innerHTML = `
      <span class="tag ${!this.selectedTag ? 'active' : ''}" onclick="app.selectTag(null)">
        Все
      </span>
      ${tagsArray.map(tag => `
        <span class="tag ${this.selectedTag === tag ? 'active' : ''}" onclick="app.selectTag('${tag}')">
          ${this.escapeHtml(tag)}
        </span>
      `).join('')}
    `;
  }
  
  renderStats() {
    this.totalNotes.textContent = this.notes.length;
    this.storageUsed.textContent = this.storage.getStorageSize() + ' KB';
  }
  
  createNote() {
    this.currentNoteId = this.generateId();
    this.noteTitle.value = '';
    this.noteContent.value = '';
    this.noteTags.value = '';
    this.openEditor();
  }
  
  openNote(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;
    
    this.currentNoteId = id;
    this.noteTitle.value = note.title;
    this.noteContent.value = note.content;
    this.noteTags.value = note.tags.join(', ');
    this.openEditor();
  }
  
  openEditor() {
    this.editor.classList.add('active');
    this.notesGrid.style.display = 'none';
    this.noteTitle.focus();
  }
  
  closeEditor() {
    this.editor.classList.remove('active');
    this.notesGrid.style.display = 'grid';
    this.currentNoteId = null;
    this.clearAutosave();
  }
  
  saveCurrentNote() {
    const title = this.noteTitle.value.trim();
    const content = this.noteContent.value.trim();
    const tags = this.noteTags.value.split(',').map(t => t.trim()).filter(t => t);
    
    if (!title && !content) {
      alert('Заметка пуста');
      return;
    }
    
    const existingIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
    
    const note = {
      id: this.currentNoteId,
      title: title || 'Без названия',
      content,
      tags,
      createdAt: existingIndex >= 0 ? this.notes[existingIndex].createdAt : Date.now(),
      updatedAt: Date.now()
    };
    
    if (existingIndex >= 0) {
      this.notes[existingIndex] = note;
    } else {
      this.notes.push(note);
    }
    
    this.storage.saveNotes(this.notes);
    this.showAutosaveIndicator();
    this.closeEditor();
    this.render();
  }
  
  deleteCurrentNote() {
    if (!confirm('Удалить эту заметку?')) return;
    
    this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
    this.storage.saveNotes(this.notes);
    this.closeEditor();
    this.render();
  }
  
  scheduleAutosave() {
    clearTimeout(this.autosaveTimer);
    this.autosaveTimer = setTimeout(() => {
      this.saveCurrentNote();
    }, 2000);
  }
  
  clearAutosave() {
    clearTimeout(this.autosaveTimer);
  }
  
  showAutosaveIndicator() {
    this.autosaveIndicator.classList.add('show');
    setTimeout(() => {
      this.autosaveIndicator.classList.remove('show');
    }, 2000);
  }
  
  selectTag(tag) {
    this.selectedTag = tag;
    this.render();
  }
  
  handleSearch(query) {
    this.searchQuery = query;
    this.renderNotes();
  }
  
  async handleImport(file) {
    if (!file) return;
    
    try {
      const imported = await this.storage.importNotes(file);
      
      if (confirm(`Импортировать ${imported.length} заметок? Текущие данные будут заменены.`)) {
        this.notes = imported;
        this.storage.saveNotes(this.notes);
        this.render();
        alert('Импорт успешен!');
      }
    } catch (error) {
      alert('Ошибка импорта: ' + error.message);
    }
    
    this.importFile.value = '';
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'только что';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
    
    return date.toLocaleDateString('ru-RU');
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Init
const app = new NotesApp();
```

---

## Что вы изучили

✅ **localStorage:**
- Сохранение/чтение данных
- Работа с JSON
- Обработка ошибок (QuotaExceeded)

✅ **Практические паттерны:**
- Автосохранение с debounce
- Экспорт/импорт данных
- Статистика использования
- Фильтрация и поиск

✅ **FileReader API:**
- Импорт JSON файлов

---

## Задания для улучшения

1. Добавьте поддержку Markdown в заметках
2. Реализуйте корзину (удалённые заметки сохраняются 30 дней)
3. Добавьте категории для заметок
4. Реализуйте синхронизацию между вкладками (storage event)
5. Добавьте темную тему с сохранением в localStorage

**Отличная работа! Переходите к следующему уроку.** 🚀
