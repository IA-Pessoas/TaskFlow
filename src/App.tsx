import TaskForm from "./components/taskForm";
import ThemeToggle  from "./components/themeToggle";
import { TaskList } from "./components/taskList";
import { useTasksContext } from "./contexts/TasksContext";
import { useTaskTitle } from "./hooks/useTaskTitle";

function App() {
  const {pendingCount} = useTasksContext();

  useTaskTitle(pendingCount);
  
  return (
    <div>
      <header>
        <h1>Lista de Tarefas</h1>
        <p>Pendentes: {pendingCount}</p>
      </header>

      <TaskForm />
      <TaskList />
      <ThemeToggle/>
    </div>
  );
}

export default App;