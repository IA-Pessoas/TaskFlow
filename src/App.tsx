import { useState } from 'react';
import type { Task } from './types/tasks';


function App(){
  const[tasks,setTasks] = useState<Task[]>([]);
  const[newTask, setNewTask] = useState("");
  const pendingCount = tasks.filter(t => !t.completed).length
  
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

  function remove(id:string){
    setTasks(
      tasks.filter( task =>
        task.id !== id
      )
    )
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

      {tasks.map((task) =>(
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