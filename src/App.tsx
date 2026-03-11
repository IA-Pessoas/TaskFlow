import { useTasks } from './hooks/useTasks';
import { useTaskTitle } from './hooks/useTaskTitle';

function App(){

const { tasks, addTask, deleteTask, toggleTask, pendingCount } = useTasks();
useTaskTitle(pendingCount);

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const title = String(formData.get("task") || "");

  addTask(title);

  e.currentTarget.reset();
}
  return(
    <div>
      <header>
        <h1>Lista de Tarefas</h1>
        <br/>
        <p>Pendentes : {pendingCount} </p>
      </header>

      <form onSubmit={handleSubmit}>
        <input name="task" />
        <button type="submit">Adicionar</button>
      </form>
    
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