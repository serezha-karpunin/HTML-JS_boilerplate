import './style.css';
import { State, saveState, getState } from './state.js';
import { sortTasks, formatDate } from './util.js';

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
    .sort((t1, t2) => sortTasks(t1, t2, state.openTasksSortOption))
    .map(task => createTaskElement(task))
    .forEach(elem => openList.append(elem));

  let doneList = document.getElementById('done-tasks');
  doneList.innerHTML = '';
  state.doneTasks
    .filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((t1, t2) => sortTasks(t1, t2, state.doneTasksSortOption))
    .map(task => createTaskElement(task))
    .forEach(elem => doneList.append(elem));
};

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
        refreshTasks();
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

const toggleTask = task => {
  let state = getState();
  if (task.isDone) {
    state.undoneTask(task);
  } else {
    state.doneTask(task);
  }
  saveState(state);
  refreshTasks();
};

const removeTask = task => {
  let state = getState();
  state.removeTask(task);
  saveState(state);
  refreshTasks();
};

const updateSearchQuery = event => {
  let searchQuery = document.getElementById('search-box-input').value;
  let state = getState();
  state.searchQuery = searchQuery;
  saveState(state);
  refreshTasks();
};

const createNewTask = () => {
  let state = getState();
  let text = document.getElementById('create-task-input').value;
  if (text) {
    document.getElementById('create-task-input').value = '';
    state.addTask(text);
    saveState(state);
    refreshTasks();
  }
};

const clearOpenTasks = () => {
  let state = getState();
  state.clearOpenTasks();
  saveState(state);
  refreshTasks();
};

const clearDoneTasks = () => {
  let state = getState();
  state.clearDoneTasks();
  saveState(state);
  refreshTasks();
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
  refreshTasks();
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
