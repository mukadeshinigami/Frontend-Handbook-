class Entity {
    static #isCounter = 0;
    constructor() {
        this.id = ++Entity.#isCounter;
        this.createdAt = new Date();        
    }

    static setIdCounter(value) {
        Entity.#isCounter = value;
    }
}

class Task extends Entity {
    constructor(title, priority = 'Normal') {
        super();

        this.title = title;
        this.ptiotiy = priority;
        this.completed = false;
        this.completedAt = null;
    }

    toggle() { //
        this.completed = !this.completed;
        this.completedAt = this.completed ? new Date() : null;
    }

    get ptiotiyColor() {
        const colors = {
            'Low': 'green',
            'Normal': 'blue',
            'High': 'red'
        };

        return colors[this.ptiotiy];
    }

    toJSON() {
        return {
        __type: 'Task',
        id: this.id,
        createdAt: this.createdAt.toISOString(),
        title: this.title,
        ptiotiy: this.ptiotiy,
        completed: this.completed,
        completedAt: this.completedAt ? this.completedAt.toISOString() : null

    };
    }

    static fromJSON(json) {
        const task = new Task(json.title, json.ptiotiy);
        task.id = json.id;
        task.createdAt = new Date(json.createdAt);
        task.completed = json.completed;
        task.completedAt = json.completedAt ? new Date(json.completedAt) : null;``
        return task;
    }
}