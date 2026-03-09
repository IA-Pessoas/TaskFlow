import { useState, useEffect } from 'react';
import type { Task } from './types/tasks';


function App(){
  const[tasks,setTasks] = useState<Map<string, Task>>(new Map());
  const[newTask, setNewTask] = useState("");
  const[pendingCount, setpendingCount] = useState(0)

    useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const data = JSON.parse(saved);
      const map = new Map<string,Task>(data);
      setTasks(map);

      const inicial = [...map.values()].filter(t => !t.completed).length;
      setpendingCount(inicial);
    };
  }, []); // se não tiver array, ela vai ser chamada sempre que a página for renderizada
    
    // O bug acontecia devido a como tasks está sempre chamando o setTasks o effect é ativado o tempo todo, causando o ciclo infinito.
    // Como o estado sempre está sendo modificado, o ciclo continua a ser re-renderizado
    // Para corrigir é preciso tirar o valor de dentro [], que é a condição. Sendo vazio renderiza apenas uma vez.
    
    useEffect(() => {
      if (tasks.size >= 0) {
    localStorage.setItem('tasks', JSON.stringify([...tasks]));
  }
    },[tasks])

    useEffect(()=>{
      const pending = [...tasks.values()].filter(t => !t.completed).length;
      document.title = pending > 0 ? `(${pending}) TaskFlow` : 'TaskFlow';
    },[tasks]);
    
    function addTask(){
    if(newTask.trim() === "") {
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
    setpendingCount(p => p +(task.completed? 1: -1))
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