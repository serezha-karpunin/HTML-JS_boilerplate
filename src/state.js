class Task {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.creationDate = new Date();
    this.isDone = false;
    this.dueDate = null;
  }
}

export class State {
  constructor() {
    this.openTasks = [];
    this.doneTasks = [];
    this.taskCounter = 0;
    this.searchQuery = '';
    this.openTasksSortOption = 'creation-date-asc';
    this.doneTasksSortOption = 'due-date-asc';
  }

  addTask(text) {
    let task = new Task(this.taskCounter++, text);
    this.openTasks.push(task);
  }

  doneTask(task) {
    this.removeTask(task);
    task.isDone = true;
    task.dueDate = new Date();
    this.doneTasks.push(task);
  }

  undoneTask(task) {
    this.removeTask(task);
    task.isDone = false;
    task.dueDate = null;
    this.openTasks.push(task);
  }

  updateTaskName(id, text) {
    this.openTasks.filter(t => t.id === id).forEach(t => (t.text = text));
    this.doneTasks.filter(t => t.id === id).forEach(t => (t.text = text));
  }

  removeTask(task) {
    if (task.isDone) {
      this.doneTasks = this.doneTasks.filter(t => t.id !== task.id);
    } else {
      this.openTasks = this.openTasks.filter(t => t.id !== task.id);
    }
  }

  clearOpenTasks() {
    this.openTasks = [];
  }

  clearDoneTasks() {
    this.doneTasks = [];
  }

  static fromJSON(json) {
    return Object.assign(new State(), JSON.parse(json));
  }
}

export const getState = () => {
  let stateJson = localStorage.getItem('state');
  if (stateJson) {
    return State.fromJSON(stateJson);
  } else {
    return new State();
  }
};

export const saveState = state => {
  localStorage.setItem('state', JSON.stringify(state));
};
