import {v4 as uuidV4} from "../_snowpack/pkg/uuid.js";
import confetti from "../_snowpack/pkg/canvas-confetti.js";
const list = document.querySelector("#list");
const form = document.querySelector("#add-task-form");
const input = document.querySelector("#add-item");
const clear = document.querySelector("#button-clear");
const tasks = loadTasks();
tasks.forEach(addListItem);
clear?.addEventListener("click", (e) => {
  console.log("clear all");
  let blank = Array();
  localStorage.setItem("TASKS", blank);
});
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input?.value == "" || input?.value == null)
    return;
  const newTask = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  };
  tasks.push(newTask);
  addListItem(newTask);
  input.value = "";
});
function addListItem(task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  item.setAttribute("class", "list-group-item d-flex justify-content-between align-items-start");
  item.setAttribute("id", task.id);
  checkbox.setAttribute("class", "form-check-input check");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
    if (checkbox.checked == true) {
      popConfetti();
      item.setAttribute("class", "list-group-item bg-light d-flex justify-content-between align-items-start text-muted");
    }
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  if (task.completed == true)
    item.setAttribute("class", "list-group-item bg-light d-flex justify-content-between align-items-start text-muted");
  const remove = document.createElement("span");
  remove.innerHTML = "x";
  remove.setAttribute("class", "badge bg-dark rounded-pill");
  remove.addEventListener("click", () => {
    removeTask(task);
  });
  label.append(checkbox, task.title);
  item.append(label);
  item.append(remove);
  list?.append(item);
  saveTasks();
}
function popConfetti() {
  confetti({
    particleCount: 200,
    spread: 200
  });
}
function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}
function loadTasks() {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null || taskJSON.length === 0)
    return [];
  let JSONarray = JSON.parse(taskJSON);
  JSONarray.sort(function(a, b) {
    return b.completed - a.completed;
  });
  JSONarray.reverse();
  return JSONarray;
}
function removeTask(task) {
  console.log(task);
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null)
    return false;
  var items = JSON.parse(taskJSON);
  console.log(taskJSON);
  for (var i = 0; i < items.length; i++) {
    if (items[i].id == task.id) {
      items.splice(i, 1);
    }
  }
  items = JSON.stringify(items);
  localStorage.setItem("TASKS", items);
  removeTaskList(task.id);
  return true;
}
function removeTaskList(id) {
  document.getElementById(id)?.remove();
}
