    // ============================================
    // Getting the elements
    // ============================================
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');
    const activeCount = document.getElementById('activeCount');
    const completedCount = document.getElementById('completedCount');

    // ============================================
    // Status 
    // ============================================
    let tasks = []; // Mas
    let nextId = 1; // Уникальный ID для задач

    addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Preventing page reloads
      const taskText = taskInput.value.trim();
      if (taskText === '') return;
      
      const newTask = {
        id: nextId++,
        text: taskText,
        category: categorySelect.value,
        completed: false
      };

      tasks.push(newTask);
      renderTasks();
      updateStats();
      
      taskInput.value = '';
      
      console.log('➕ Задача добавлена:', newTask);

    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        // Удаление задачи
        if (target.classList.contains('delete-btn')) {
          const taskItem = target.closest('.task-item');
          const taskId = parseInt(taskItem.dataset.id, 10);
          tasks = tasks.filter(t => t.id !== taskId);
          renderTasks();
          updateStats();
          console.log('🗑️ Задача удалена, ID:', taskId);
          return;
        }

        // Редактирование — показать инпут
        if (target.classList.contains('edit-btn')) {
          const taskItem = target.closest('.task-item');
          taskItem.classList.add('editing');
          const editInput = taskItem.querySelector('.edit-input');
          if (editInput) editInput.focus();
          console.log('✏️ Режим редактирования');
          return;
        }

        // Сохранение редактирования
        if (target.classList.contains('save-btn')) {
          const taskItem = target.closest('.task-item');
          const taskId = parseInt(taskItem.dataset.id, 10);
          const editInput = taskItem.querySelector('.edit-input');
          const newText = editInput ? editInput.value.trim() : '';
          if (newText !== '') {
            const task = tasks.find(t => t.id === taskId);
            if (task) task.text = newText;
            renderTasks();
            updateStats();
            console.log('💾 Задача сохранена:', taskId);
          }
          return;
        }

        // Отмена редактирования
        if (target.classList.contains('cancel-btn')) {
          const taskItem = target.closest('.task-item');
          taskItem.classList.remove('editing');
          console.log('❌ Отмена редактирования');
          return;
        }
    });

    // Обработчик для чекбоксов — делегирование через change
    taskList.addEventListener('change', (e) => {
      const target = e.target;
      if (target.classList.contains('task-checkbox')) {
        const taskItem = target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id, 10);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = !!target.checked;
          renderTasks();
          updateStats();
          console.log(task.completed ? '✅ Задача выполнена' : '⏳ Задача активна', taskId);
        }
      }
    });

    // ============================================
    // Рендеринг задач
    // ============================================

    function renderTasks() {

      taskList.innerHTML = '';
      
      if (tasks.length === 0) {
        emptyState.style.display = 'block';
      } 
      
      else {

        emptyState.style.display = 'none';

        tasks.forEach(task => {
          const li = document.createElement('li');
          li.className = 'task-item';
          if (task.completed) {
            li.classList.add('completed');
          }
          li.dataset.id = task.id;
          
          li.innerHTML = `
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
          >
          <span class="task-category ${task.category}">${(task.category)}</span>
          <div class="task-text">${task.text}</div>
          <div class="task-actions">
            <button class="task-btn edit-btn">Редактировать</button>
            <button class="task-btn delete-btn">Удалить</button>
          </div>
          <div class="edit-form">
            <input type="text" class="edit-input" value="${task.text}">
            <button class="save-btn">Сохранить</button>
            <button class="cancel-btn">Отмена</button>
          </div>
        `;
          taskList.appendChild(li);
        });
      }
    }

    // ============================================
    // Обновление статистики
    // ============================================
    function updateStats() {
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const active = tasks.filter(t => !t.completed).length;
      
      totalCount.textContent = total;
      activeCount.textContent = active;
      completedCount.textContent = completed;
    }
    
    // Initial render
    renderTasks();
    updateStats();