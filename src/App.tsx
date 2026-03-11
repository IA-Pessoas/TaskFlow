import TaskForm from "./components/taskForm";
import { useTasks } from "./hooks/useTasks";
import { useTaskTitle } from "./hooks/useTaskTitle";

function App() {
  const { tasks, addTask, deleteTask, toggleTask, pendingCount } = useTasks();

  useTaskTitle(pendingCount);

  return (
    <div>
      <header>
        <h1>Lista de Tarefas</h1>
        <p>Pendentes: {pendingCount}</p>
      </header>

      <TaskForm onAdd={addTask} />

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span onClick={() => toggleTask(task.id)}>{task.title}</span>
            <span>{task.completed ? "✓ " : ""}</span>
            <button onClick={() => deleteTask(task.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;