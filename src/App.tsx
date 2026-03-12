import TaskForm from "./components/taskForm";
import { TaskItem } from "./components/taskItem";
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
          <TaskItem
            key={task.id}
            task ={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;