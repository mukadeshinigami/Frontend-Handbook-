// Получаем элементы из HTML
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Массив для хранения наших задач
let tasks = [];

function init() {
    loadTasks();
    renderTasks();
    setupEventListeners();
}

function addTask() { // Функция для добавления новой задачи
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Пожалуйста, введите задачу.');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask); // Добавляем новую задачу в массив

    taskInput.value = ''; // Очищаем поле ввода

    renderTasks(); // Обновляем отображение задач

    saveTasks(); // Сохраняем задачи в localStorage
}

function renderTasks() { //
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);
        
        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Удалить</button>
        `;
        
        taskList.appendChild(taskItem);
    });
}

function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    taskList.addEventListener('click', function(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return; // Если клик не по задаче, выходим

        const taskId = parseInt(taskItem.getAttribute('data-id'));
        if (e.target.type === 'checkbox') {
            toggleTask(taskId);
        }

        if (e.target.classList.contains('delete-btn')) {    
            deleteTask(taskId);
        }
    });
}


function toggleTask(taskId) {
    // Находим задачу по ID
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        saveTasks();
    }
}

function deleteTask(taskId) {
    // Фильтруем массив, оставляя все задачи кроме удаляемой
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    saveTasks();
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}



init();

