import { useState } from 'react';
import type { Task } from './types/tasks';


function App(){
  const[tasks,setTasks] = useState<Map<String, Task>>(new Map());
  const[newTask, setNewTask] = useState("");
  const pendingCount = [...tasks.values()].filter(t=> !t.completed).length;
  
  function addTask(){
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
    setNewTask("")
  }

  function toggled(id:string){
    setTasks((prev) => {
      const next = new Map(prev);
      const task = next.get(id);
      if (!task) return prev;

      next.set(id,{...task, completed: !task.completed});
      return next;  
  
    });
  }

  function remove(id:string){
    setTasks((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
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