/*
Чанк A — Базовый класс Entity

    Задача: дать каждому объекту уникальный id и createdAt.
    Примечание: нужно уметь восстановить счётчик id при загрузке.
*/

class Entity {
    static #isCounter = 0;
    constructor() {
        this.id = ++Entity.#isCounter;
        this.createdAt = new Date();        
    }

    static setIdCounter(value) {
        Entity.#isCounter = value;
    }
    static getIdCounter() {
        return Entity.#isCounter;
    }
}

/*
  Чанк B — Класс Task (модель задачи)

    Задача: свойства title, priority, completed, completedAt; методы toggle; геттер priorityColor.
  Сделать метод сериализации/десериализации (toJSON / static fromJSON) чтобы безопасно сохранять и восстанавливать объекты.
*/

class Task extends Entity {
    constructor(title, priority = 'Normal') {
        super();

        this.title = title;
        this.priority = priority;
        this.completed = false;
        this.completedAt = null;
    }

    toggle() { //
        this.completed = !this.completed;
        this.completedAt = this.completed ? new Date() : null;
    }

/* 
    Чанк C — Класс Project (контейнер задач)

    Задача: хранить список задач, интерфейс add/remove/get, вычисляемые свойства.
    Использовать приватное поле для задач, но при сериализации/десериализации использовать toJSON/fromJSON, чтобы восстановить задачи как Task.
*/

    get priorityColor() {
        const colors = {
            'Low': 'green',
            'Normal': 'blue',
            'High': 'red'
        };

        return colors[this.priority];
    }

    toJSON() {
        return {
            __type: 'Task',
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            title: this.title,
            priority: this.priority,
            completed: this.completed,
            completedAt: this.completedAt ? this.completedAt.toISOString() : null
        };
    }

    static fromJSON(json) {
        const task = new Task(json.title, json.priority);
        task.id = json.id;
        task.createdAt = new Date(json.createdAt);
        task.completed = json.completed;
        task.completedAt = json.completedAt ? new Date(json.completedAt) : null;
        return task;
    }
}

/*
    Чанк D — Слой Persistence (сериализация/восстановление)

    Задача: централизовать save/load, корректно восстанавливать типы и статический id счётчик.
    Идея: при сохранении записывать последний idCounter, при загрузке восстанавливать Entity.#idCounter.
*/

const STORAGE_KEY = 'task_manager_data';
/**
 * Storage class for managing persistence of projects in localStorage.
 * Provides static methods to save and load project data with ID counter state.
 *
 */
class Storage {
    static save(projects) {
        const data = {
            idCounter: Entity.getIdCounter(),
            projects: projects.map(p => p.toJSON())
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); 
    }

    static load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            console.error('Storage: failed to parse stored data', err);
            return [];
        }

        // Determine max id to safely restore counter (prefer stored counter if present)
        const storedCounter = parsed.idCounter || 0;
        let maxId = storedCounter;
        if (Array.isArray(parsed.projects)) {
            for (const p of parsed.projects) {
                if (p && typeof p.id === 'number') maxId = Math.max(maxId, p.id);
                if (p && Array.isArray(p.tasks)) {
                    for (const t of p.tasks) {
                        if (t && typeof t.id === 'number') maxId = Math.max(maxId, t.id);
                    }
                }
            }
        }

        Entity.setIdCounter(maxId || 0);

        // Rehydrate projects using Project.fromJSON when available
        if (!Array.isArray(parsed.projects)) return [];
        return parsed.projects.map(p => {
            try {
                if (p && p.__type === 'Project' && typeof Project === 'function' && typeof Project.fromJSON === 'function') {
                    return Project.fromJSON(p);
                }
            } catch (err) {
                console.warn('Storage: failed to restore project', err);
            }
            // Fallback: return raw object
            return p;
        });
    }


}

/*
Чанк E — ProjectManager (логика приложения, без DOM)

    Задачи: держит состояние (массив проектов), предоставляет API для создания/удаления/изменения, вызывает Storage.save после изменений.
    Не должен напрямую обращаться к DOM — это улучшает тестируемость. UI слой будет подписываться/запрашивать состояние.
*/

/*
  Minimal Project class used by ProjectManager and Storage.
  Stores tasks privately and supports JSON roundtrip via toJSON/fromJSON.
*/
class Project extends Entity {
    #tasks = [];
    constructor(name) {
        super();
        this.name = name || '';
        this.#tasks = [];
    }

    addTask(title, priority = 'Normal') {
        const t = new Task(title, priority);
        this.#tasks.push(t);
        return t;
    }

    removeTask(taskId) {
        this.#tasks = this.#tasks.filter(t => t.id !== taskId);
    }

    getTasks() { return [...this.#tasks]; }

    // helper for statistic when inspecting raw object
    get tasksPublic() { return this.getTasks(); }

    toJSON() {
        return {
            __type: 'Project',
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            name: this.name,
            tasks: this.#tasks.map(t => t.toJSON())
        };
    }

    static fromJSON(json) {
        const p = new Project(json.name);
        p.id = json.id;
        p.createdAt = new Date(json.createdAt);
        p.#tasks = (json.tasks || []).map(t => {
            try { return Task.fromJSON(t); } catch (e) { return t; }
        });
        return p;
    }
}

class ProjectManager {
    #projects = [];

    constructor() {
        const loaded = Storage.load();
        this.#projects = loaded || [];
    }
    
    createProject(name) {
        const project = new Project(name);
        this.#projects.push(project);
        Storage.save(this.#projects);
        return project;
    }

    deleteProject(projectId) {
        this.#projects = this.#projects.filter(p => p.id !== projectId);
        Storage.save(this.#projects);
    }

    addTaskToProject(projectId, taskTitle, taskPriority) {
        const project = this.#projects.find(p => p.id === projectId);
        if (!project) return null;
        const task = project.addTask(taskTitle, taskPriority);
        Storage.save(this.#projects);
        return task;
    }

    get projects() { return [...this.#projects];}
    get statistic() {
        const totalProjects = this.#projects.length;
        const totalTasks = this.#projects.reduce((sum, p) => {
            // p may be raw object or Project instance; try to read tasks length
            if (Array.isArray(p.tasks)) return sum + p.tasks.length;
            if (p && typeof p.getTasks === 'function') return sum + p.getTasks().length;
            if (p && p._tasks && Array.isArray(p._tasks)) return sum + p._tasks.length;
            // try private field via known accessor name
            if (p && Array.isArray(p.tasksPublic)) return sum + p.tasksPublic.length;
            return sum;
        }, 0);
        return { totalProjects, totalTasks };
    }
}

function renderStats(container, stats) { 
    container.innerHTML = `
        <div class="stats-card" style="
            background: var(--bg-tertiary, #f1f5f9);
            border-radius: var(--border-radius-xl, 16px);
            box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1));
            padding: var(--spacing-lg, 1.5rem) var(--spacing-xl, 2rem);
            margin-bottom: var(--spacing-lg, 1.5rem);
            display: flex;
            align-items: center;
            gap: var(--spacing-2xl, 3rem);
            flex-wrap: wrap;
            ">
            <div style="
                display: flex;
                align-items: center;
                gap: var(--spacing-sm, 0.75rem);
                ">
                <span style="font-size: 2rem;">📊</span>
                <span style="font-size: var(--font-size-2xl, 1.5rem); font-weight: var(--font-weight-semibold, 600); color: var(--primary, #667eea);">Статистика</span>
            </div>
            <div style="
                display: flex;
                gap: var(--spacing-xl, 2rem);
                margin-left: auto;
                ">
                <div style="
                    background: var(--primary-light, #818cf8);
                    color: #fff;
                    padding: var(--spacing-sm, 0.75rem) var(--spacing-lg, 1.5rem);
                    border-radius: var(--border-radius, 12px);
                    font-size: var(--font-size-lg, 1.125rem);
                    min-width: 110px;
                    text-align: center;
                    font-weight: var(--font-weight-semibold, 600);
                    box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0,0,0,0.05));
                ">
                    <div style="font-size: 2rem; margin-bottom: 0.25rem;">📁</div>
                    <div>${stats.totalProjects}</div>
                    <div style="font-size: var(--font-size-xs, 0.75rem); color: var(--text-secondary, #64748b);">Проектов</div>
                </div>
                <div style="
                    background: var(--success-dark, #059669);
                    color: #fff;
                    padding: var(--spacing-sm, 0.75rem) var(--spacing-lg, 1.5rem);
                    border-radius: var(--border-radius, 12px);
                    font-size: var(--font-size-lg, 1.125rem);
                    min-width: 110px;
                    text-align: center;
                    font-weight: var(--font-weight-semibold, 600);
                    box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0,0,0,0.05));
                ">
                    <div style="font-size: 2rem; margin-bottom: 0.25rem;">✅</div>
                    <div>${stats.totalTasks}</div>
                    <div style="font-size: var(--font-size-xs, 0.75rem); color: var(--text-secondary, #64748b);">Задач</div>
                </div>
            </div>
        </div>
    `;
}

// Initialize manager and UI (UIController is optional)
const manager = new ProjectManager();
let ui = null;
if (typeof UIController === 'function') {
        try {
                ui = new UIController(manager);
                if (typeof ui.renderAll === 'function') ui.renderAll();
        } catch (err) {
                console.warn('UIController init failed:', err);
                ui = null;
        }
}

const addBtn = document.getElementById('createProjectBtn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const input = document.getElementById('projectNameInput');
        const name = input ? input.value.trim() : '';
        if (name) {
            manager.createProject(name);
            if (ui && typeof ui.renderAll === 'function') ui.renderAll();
            else if (typeof renderAll === 'function') renderAll();
        }
    });
}

// Minimal renderAll implementation so the example works without UIController.
function getTasksFromProject(p) {
    if (!p) return [];
    if (typeof p.getTasks === 'function') return p.getTasks();
    if (Array.isArray(p.tasks)) return p.tasks.map(t => {
        if (t && t.__type === 'Task') return Task.fromJSON(t);
        return t;
    });
    if (Array.isArray(p.tasksPublic)) return p.tasksPublic;
    return [];
}

function renderAll() {
    const container = document.getElementById('projects');
    const statsContainer = document.getElementById('stats');
    if (!container) return;
    container.innerHTML = '';

    const projects = manager.projects || [];
    projects.forEach(proj => {
        const projEl = document.createElement('div');
        projEl.className = 'project';
        const title = document.createElement('h3');
        title.textContent = proj.name || `Project ${proj.id}`;
        projEl.appendChild(title);

        // Tasks list
        const tasks = getTasksFromProject(proj);
        const list = document.createElement('div');
        tasks.forEach(t => {
            const tEl = document.createElement('div');
            tEl.className = 'task' + (t.completed ? ' completed' : '') + (t.priority === 'High' ? ' high-priority' : '');
            tEl.textContent = t.title + (t.completed ? ` (done)` : '');
            // toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = t.completed ? 'Unmark' : 'Done';
            toggleBtn.addEventListener('click', () => {
                // find project in manager and toggle
                const p = manager.projects.find(pr => pr.id === proj.id);
                if (!p) return;
                // tasks may be instances
                const tasksLocal = getTasksFromProject(p);
                const taskObj = tasksLocal.find(tt => tt.id === t.id);
                if (taskObj && typeof taskObj.toggle === 'function') {
                    taskObj.toggle();
                    Storage.save(manager.projects);
                    renderAll();
                }
            });
            tEl.appendChild(toggleBtn);
            list.appendChild(tEl);
        });
        projEl.appendChild(list);

        // Add task form
        const addInput = document.createElement('input');
        addInput.placeholder = 'Новая задача';
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Добавить задачу';
        addBtn.addEventListener('click', () => {
            const title = addInput.value.trim();
            if (!title) return;
            manager.addTaskToProject(proj.id, title, 'Normal');
            renderAll();
        });
        projEl.appendChild(addInput);
        projEl.appendChild(addBtn);

        container.appendChild(projEl);
    });

    if (statsContainer && typeof manager.statistic === 'object' || typeof manager.statistic === 'function') {
        const stats = typeof manager.statistic === 'function' ? manager.statistic() : manager.statistic;
        renderStats(statsContainer, stats);
    } else if (statsContainer) {
        renderStats(statsContainer, manager.statistic);
    }
}

// Initial render after load
if (typeof renderAll === 'function') renderAll();