import TaskForm from "./components/taskForm";
import { TaskList } from "./components/taskList";
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

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;