import './style.css';

class Task {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.creationDate = new Date();
    this.isDone = false;
    this.dueDate = null;
  }
}

class State {
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

const refreshTasks = () => {
  let state = getState();

  let searchQuery = state.searchQuery;
  document.getElementById('search-box-input').value = searchQuery;
  document.getElementById('open-tasks-selector').value =
    state.openTasksSortOption;
  document.getElementById('done-tasks-selector').value =
    state.doneTasksSortOption;

  let openList = document.getElementById('open-tasks');
  openList.innerHTML = '';
  state.openTasks
    .filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((t1, t2) => sortOpenTasks(t1, t2))
    .map(task => createTaskElement(task))
    .forEach(elem => openList.append(elem));

  let doneList = document.getElementById('done-tasks');
  doneList.innerHTML = '';
  state.doneTasks
    .filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((t1, t2) => sortDoneTasks(t1, t2))
    .map(task => createTaskElement(task))
    .forEach(elem => doneList.append(elem));
};

const getState = () => {
  let stateJson = localStorage.getItem('state');
  if (stateJson) {
    return State.fromJSON(stateJson);
  } else {
    return new State();
  }
};

const sortOpenTasks = (t1, t2) => {
  let sortOption = document.getElementById('open-tasks-selector').value;
  switch (sortOption) {
    case 'creation-date-asc':
      return compareAsc(t1.creationDate, t2.creationDate);
    case 'creation-date-desc':
      return compareDesc(t1.creationDate, t2.creationDate);
    case 'text-asc':
      return compareAsc(t1.text, t2.text);
    case 'text-desc':
      return compareDesc(t1.text, t2.text);
  }
};

const sortDoneTasks = (t1, t2) => {
  let sortOption = document.getElementById('done-tasks-selector').value;
  switch (sortOption) {
    case 'due-date-asc':
      return compareAsc(t1.dueDate, t2.dueDate);
    case 'due-date-desc':
      return compareDesc(t1.dueDate, t2.dueDate);
    case 'text-asc':
      return compareAsc(t1.text, t2.text);
    case 'text-desc':
      return compareDesc(t1.text, t2.text);
  }
};

const compareAsc = (v1, v2) => (v1 > v2 ? 1 : v1 < v2 ? -1 : 0);
const compareDesc = (v1, v2) => (v1 < v2 ? 1 : v1 > v2 ? -1 : 0);

const createTaskElement = task => {
  let checkbox = document.createElement('input');
  checkbox.className = 'task-checkbox';
  checkbox.type = 'checkbox';
  checkbox.checked = task.isDone;
  checkbox.addEventListener('click', event => toggleTask(task));

  let taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.innerHTML = task.text;

  let leftWrapper = document.createElement('div');
  leftWrapper.append(checkbox);
  leftWrapper.append(taskText);
  taskText.addEventListener('dblclick', event => {
    let input = document.createElement('input');
    input.value = task.text;
    input.className = 'task-input';
    input.addEventListener('keydown', event => {
      if (event.code === 'Enter') {
        let state = getState();
        state.updateTaskName(task.id, input.value);
        saveState(state);
      } else if (event.code === 'Escape') {
        refreshTasks();
      }
    });
    input.addEventListener('blur', refreshTasks);

    leftWrapper.replaceChild(input, taskText);
  });

  let dateWrapper = document.createElement('div');
  let createDate = document.createElement('span');
  createDate.innerHTML = formatDate(task.creationDate);
  dateWrapper.className = 'task-date-wrapper';
  dateWrapper.append(createDate);

  if (task.dueDate) {
    let dueDate = document.createElement('span');
    dueDate.className = 'task-due-date';
    dueDate.append(formatDate(task.dueDate));
    dateWrapper.append(dueDate);
  }

  let remove = document.createElement('button');
  remove.className = 'task-remove-button';
  remove.innerHTML = 'X';
  remove.addEventListener('click', event => removeTask(task));

  let rightWrapper = document.createElement('div');
  rightWrapper.append(dateWrapper);
  rightWrapper.append(remove);

  let taskWrapper = document.createElement('div');
  taskWrapper.className = 'task-wrapper';
  taskWrapper.append(leftWrapper);
  taskWrapper.append(rightWrapper);

  let li = document.createElement('li');
  li.append(taskWrapper);
  return li;
};

const formatDate = date => {
  date = new Date(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let suffix = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${suffix}`;
};

const toggleTask = task => {
  let state = getState();
  if (task.isDone) {
    state.undoneTask(task);
  } else {
    state.doneTask(task);
  }
  saveState(state);
};

const removeTask = task => {
  let state = getState();
  state.removeTask(task);
  saveState(state);
};

const updateSearchQuery = event => {
  let searchQuery = document.getElementById('search-box-input').value;
  let state = getState();
  state.searchQuery = searchQuery;
  saveState(state);
};

const saveState = state => {
  localStorage.setItem('state', JSON.stringify(state));
  refreshTasks();
};

const createNewTask = () => {
  let state = getState();
  let text = document.getElementById('create-task-input').value;
  if (text) {
    document.getElementById('create-task-input').value = '';
    state.addTask(text);
    saveState(state);
  }
};

const clearOpenTasks = () => {
  let state = getState();
  state.clearOpenTasks();
  saveState(state);
};

const clearDoneTasks = () => {
  let state = getState();
  state.clearDoneTasks();
  saveState(state);
};

const handleCreateTaskInput = event => {
  if (event.code === 'Enter') {
    createNewTask();
  }
};

const updateSortOptions = () => {
  let state = getState();
  state.openTasksSortOption = document.getElementById(
    'open-tasks-selector',
  ).value;
  state.doneTasksSortOption = document.getElementById(
    'done-tasks-selector',
  ).value;

  saveState(state);
};

window.onload = refreshTasks;
document
  .getElementById('search-box-input')
  .addEventListener('keyup', updateSearchQuery);
document
  .getElementById('open-tasks-selector')
  .addEventListener('change', updateSortOptions);
document
  .getElementById('done-tasks-selector')
  .addEventListener('change', updateSortOptions);
document
  .getElementById('create-task-input')
  .addEventListener('keydown', handleCreateTaskInput);
document
  .getElementById('clear-open-tasks-button')
  .addEventListener('click', clearOpenTasks);
document
  .getElementById('clear-done-tasks-button')
  .addEventListener('click', clearDoneTasks);
document
  .getElementById('create-task-button')
  .addEventListener('click', createNewTask);
