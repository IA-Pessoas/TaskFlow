import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';

function App(){
const [newTask, setNewTask] = useState("");
const { tasks, addTask, deleteTask, toggleTask, pendingCount } = useTasks();
  
  useEffect(() => {
    document.title = pendingCount > 0 ? `(${pendingCount})TaskFlow` : 'Taskflow' ;
  }, [pendingCount]);

  function handleAddTask(){
    if(newTask.trim() === ""){
      return;
    }
    
  addTask(newTask.trim());
  setNewTask("");

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
      <button onClick={handleAddTask}>Adicionar</button>
    
    <ul>

      {tasks.map((task) =>(
        <li key={task.id} >

          <span onClick={() => toggleTask(task.id)}>{task.title}</span>
          
          <span>{task.completed ? "✓ " : ""}</span>

          <button onClick={()=> deleteTask(task.id)}>
            🗑     
          </button>
      
        </li>
       ))}

   </ul>

  </div>
  )
}
export default App