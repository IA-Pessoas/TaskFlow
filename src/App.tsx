import { useState } from 'react';
import type { Task } from './types/tasks';


function App(){
  const[tasks,setTasks] = useState<Map<string, Task>>(new Map());
  const[newTask, setNewTask] = useState("");
  const[pendingCount, setpendingCount] = useState(0)
  
  function addTask(){
    if(newTask === "") {
      alert("title nao pode ser em branco.");
      return;
    }

    const taskToAdd: Task = {
      id: crypto.randomUUID(),
      title: newTask,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => {
      const next = new Map(prev);
      next.set(taskToAdd.id, taskToAdd);
      return next;
    });
    
    setpendingCount(p => p + 1) 
    setNewTask("")
  }

  function toggled(id:string){
      const task = tasks.get(id)
      if(!task) return;

    setTasks((prev) => {
      const next = new Map(prev);
      const t = next.get(id);
      if (!t) return prev;

      next.set(id,{...t, completed: !t.completed});
      return next;  
  
    });
    setpendingCount(p => p +(!task.completed? 1: -1))
  }

  function remove(id:string){
      const task = tasks.get(id)
      if(!task) return;

    setTasks((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    if(!task.completed) setpendingCount( p => p - 1);
  }

  return(
    <div>
      <header>
        <h1>Lista de Tarefas</h1>
        <br/>
        <p>Pendentes : {pendingCount} </p>
      </header>

      <input value ={newTask} onChange={(e) => setNewTask(e.target.value)}/>
      <br/>
      <button onClick={addTask}>Adicionar</button>
    
    <ul>

      {[...tasks.values()].map((task) =>(
        <li key={task.id} >

          <span onClick={() => toggled(task.id)}>{task.title}</span>
          
          <span>{task.completed ? "✓ " : ""}</span>

          <button onClick={()=> remove(task.id)}>
            🗑     
          </button>
      
        </li>

       ))}
   </ul>
  </div>
  )
}
export default App