# Практика: ООП в JavaScript

## Система управления задачами

Создайте полноценную систему управления проектами с задачами.

---

## task-manager.html

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Task Manager (ООП)</title>
  <style>
    body { font-family: Arial; max-width: 1000px; margin: 50px auto; }
    .project { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 10px; }
    .task { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
    .task.completed { opacity: 0.6; text-decoration: line-through; border-color: #28a745; }
    .task.high-priority { border-color: #dc3545; }
    button { padding: 8px 15px; margin: 5px; cursor: pointer; }
    .stats { background: #667eea; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="stats" id="stats"></div>
  
  <div>
    <input type="text" id="projectName" placeholder="Название проекта">
    <button onclick="manager.createProject()">Создать проект</button>
  </div>
  
  <div id="projects"></div>

  <script>
    // Базовый класс
    class Entity {
      static #idCounter = 0;
      
      constructor() {
        this.id = ++Entity.#idCounter;
        this.createdAt = new Date();
      }
    }
    
    // Класс задачи
    class Task extends Entity {
      constructor(title, priority = 'normal') {
        super();
        this.title = title;
        this.priority = priority; // low, normal, high
        this.completed = false;
        this.completedAt = null;
      }
      
      toggle() {
        this.completed = !this.completed;
        this.completedAt = this.completed ? new Date() : null;
      }
      
      get priorityColor() {
        const colors = {
          low: '#28a745',
          normal: '#667eea',
          high: '#dc3545'
        };
        return colors[this.priority];
      }
    }
    
    // Класс проекта
    class Project extends Entity {
      #tasks = [];
      
      constructor(name) {
        super();
        this.name = name;
      }
      
      addTask(title, priority) {
        const task = new Task(title, priority);
        this.#tasks.push(task);
        return task;
      }
      
      removeTask(taskId) {
        this.#tasks = this.#tasks.filter(t => t.id !== taskId);
      }
      
      get tasks() {
        return [...this.#tasks]; // Копия
      }
      
      get completedTasks() {
        return this.#tasks.filter(t => t.completed);
      }
      
      get progress() {
        if (this.#tasks.length === 0) return 0;
        return Math.round((this.completedTasks.length / this.#tasks.length) * 100);
      }
      
      get highPriorityTasks() {
        return this.#tasks.filter(t => t.priority === 'high' && !t.completed);
      }
    }
    
    // Менеджер проектов
    class ProjectManager {
      #projects = [];
      
      constructor() {
        this.load();
        this.render();
      }
      
      createProject() {
        const name = document.getElementById('projectName').value.trim();
        if (!name) return alert('Введите название');
        
        const project = new Project(name);
        this.#projects.push(project);
        document.getElementById('projectName').value = '';
        this.save();
        this.render();
      }
      
      deleteProject(id) {
        if (!confirm('Удалить проект?')) return;
        this.#projects = this.#projects.filter(p => p.id !== id);
        this.save();
        this.render();
      }
      
      addTask(projectId) {
        const title = prompt('Название задачи:');
        if (!title) return;
        
        const priority = prompt('Приоритет (low/normal/high):', 'normal');
        
        const project = this.#projects.find(p => p.id === projectId);
        if (project) {
          project.addTask(title, priority);
          this.save();
          this.render();
        }
      }
      
      toggleTask(projectId, taskId) {
        const project = this.#projects.find(p => p.id === projectId);
        if (!project) return;
        
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
          task.toggle();
          this.save();
          this.render();
        }
      }
      
      deleteTask(projectId, taskId) {
        const project = this.#projects.find(p => p.id === projectId);
        if (project) {
          project.removeTask(taskId);
          this.save();
          this.render();
        }
      }
      
      save() {
        localStorage.setItem('task_manager', JSON.stringify(this.#projects));
      }
      
      load() {
        const data = localStorage.getItem('task_manager');
        if (!data) return;
        
        try {
          const parsed = JSON.parse(data);
          this.#projects = parsed.map(p => {
            const project = Object.assign(new Project(), p);
            project._Entity__idCounter = p.id;
            return project;
          });
        } catch (e) {
          console.error('Ошибка загрузки:', e);
        }
      }
      
      get statistics() {
        const totalProjects = this.#projects.length;
        const totalTasks = this.#projects.reduce((sum, p) => sum + p.tasks.length, 0);
        const completedTasks = this.#projects.reduce((sum, p) => sum + p.completedTasks.length, 0);
        const highPriority = this.#projects.reduce((sum, p) => sum + p.highPriorityTasks.length, 0);
        
        return { totalProjects, totalTasks, completedTasks, highPriority };
      }
      
      render() {
        this.renderStats();
        this.renderProjects();
      }
      
      renderStats() {
        const stats = this.statistics;
        document.getElementById('stats').innerHTML = `
          <h2>📊 Статистика</h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 15px;">
            <div><strong>${stats.totalProjects}</strong><br>Проектов</div>
            <div><strong>${stats.totalTasks}</strong><br>Задач</div>
            <div><strong>${stats.completedTasks}</strong><br>Выполнено</div>
            <div><strong>${stats.highPriority}</strong><br>Важных</div>
          </div>
        `;
      }
      
      renderProjects() {
        const container = document.getElementById('projects');
        
        if (this.#projects.length === 0) {
          container.innerHTML = '<p>Нет проектов. Создайте первый!</p>';
          return;
        }
        
        container.innerHTML = this.#projects.map(project => `
          <div class="project">
            <h2>${project.name}</h2>
            <div>Прогресс: ${project.progress}%</div>
            <div style="background: #ddd; height: 10px; border-radius: 5px; margin: 10px 0;">
              <div style="background: #28a745; height: 100%; width: ${project.progress}%; border-radius: 5px;"></div>
            </div>
            
            <button onclick="manager.addTask(${project.id})">+ Добавить задачу</button>
            <button onclick="manager.deleteProject(${project.id})" style="background: #dc3545; color: white;">Удалить проект</button>
            
            <div>
              ${project.tasks.map(task => `
                <div class="task ${task.completed ? 'completed' : ''} ${task.priority === 'high' ? 'high-priority' : ''}"
                     style="border-color: ${task.priorityColor};">
                  <input type="checkbox" ${task.completed ? 'checked' : ''}
                         onchange="manager.toggleTask(${project.id}, ${task.id})">
                  <strong>${task.title}</strong>
                  <span style="background: ${task.priorityColor}; color: white; padding: 3px 10px; border-radius: 3px; font-size: 0.8rem;">
                    ${task.priority}
                  </span>
                  <button onclick="manager.deleteTask(${project.id}, ${task.id})" style="background: #dc3545; color: white;">✖</button>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('');
      }
    }
    
    const manager = new ProjectManager();
  </script>
</body>
</html>
```

---

## Что вы изучили

✅ Классы и наследование  
✅ Приватные поля (#)  
✅ Геттеры и статические методы  
✅ Инкапсуляция данных  
✅ Работа с коллекциями объектов  

---

## Задания

1. Добавьте класс `User` с авторизацией
2. Реализуйте класс `Tag` для тегирования задач
3. Добавьте класс `Comment` для комментариев к задачам
4. Создайте класс `Analytics` для отчётов
5. Реализуйте экспорт/импорт данных через класс `DataManager`

**Отличная работа! Вы завершили курс JavaScript!** 🎉
