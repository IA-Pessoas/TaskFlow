import { useState } from 'react';
import type { Task } from './types/tasks';
import "./App.css";

function App(){
  const[tasks,setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  
  function addTask(){
    const taskToAdd: Task = {
      id: crypto.randomUUID(),
      title: newTask,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([...tasks,taskToAdd]),
    setNewTask("")
  }

   function toggled(id:string){
      setTasks(
        tasks.map(task =>
          task.id === id
          ?{...task,completed:!task.completed}
          :task
      )
    )
  }

  return(
    <div>
      <input value ={newTask} onChange={(e) => setNewTask(e.target.value)}/>
      <br/>
      <button onClick={addTask}>Adicionar</button>

      <ul>
        {tasks.map(task=>(
          <li key={task.id}>
            {task.completed ?"✓" :""}{task.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App