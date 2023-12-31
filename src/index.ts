import { v4 as uuidV4 } from "uuid"
import confetti from "canvas-confetti"

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.querySelector<HTMLFormElement>("#add-task-form")
const input = document.querySelector<HTMLInputElement>("#add-item")
const clear = document.querySelector<HTMLInputElement>("#button-clear")
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

clear?.addEventListener("click", e=>{
  console.log('clear all')
  let blank:any = Array() 
  localStorage.setItem("TASKS", blank)

})

form?.addEventListener("submit", e=>{
  e.preventDefault()

  if(input?.value == "" || input?.value == null) return

  const newTask = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)

  addListItem(newTask)
  input.value = ""
})



function addListItem(task: Task){
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  item.setAttribute("class","list-group-item d-flex justify-content-between align-items-start")
  item.setAttribute("id",task.id)
  checkbox.setAttribute("class","form-check-input check")
  checkbox.addEventListener("change", ()=>{
    task.completed = checkbox.checked
    saveTasks()
    if(checkbox.checked == true){
      popConfetti()
      item.setAttribute("class","list-group-item bg-light d-flex justify-content-between align-items-start text-muted")
    }
    
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  if(task.completed == true)
    item.setAttribute("class","list-group-item bg-light d-flex justify-content-between align-items-start text-muted")
  const remove = document.createElement("span")
  remove.innerHTML = "x"
  remove.setAttribute("class","badge bg-dark rounded-pill")
  remove.addEventListener("click", ()=>{
    removeTask(task)

  })
 
  label.append(checkbox, task.title)
  item.append(label)
  item.append(remove)
  list?.append(item)
  saveTasks()
 
}

function popConfetti(){
  confetti({
    particleCount: 200,
    spread:200
  })

}


function saveTasks(){
  localStorage.setItem("TASKS",JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null || taskJSON.length===0) return []
  let JSONarray = JSON.parse(taskJSON)
  JSONarray.sort(function(a:Array<String|boolean|Date>,b:Array<String|boolean|Date>){return b.completed -a.completed});
  JSONarray.reverse()
  return JSONarray
}

function removeTask(task: Task){
  console.log(task)
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return false
  var items = JSON.parse(taskJSON)
  console.log(taskJSON)
  for (var i =0; i< items.length; i++) {
    //var items = JSON.parse(items[i])
    if (items[i].id == task.id) {
        items.splice(i, 1)
    }
  }
  items = JSON.stringify(items)
  localStorage.setItem("TASKS", items)

  removeTaskList(task.id)
  return true
}
function removeTaskList(id: string){
  document.getElementById(id)?.remove()
}
