import { useTasksContext } from "../contexts/TasksContext";
import { TaskItem } from "./taskItem";

export function TaskList(){ 
  const { tasks, toggleTask , deleteTask } = useTasksContext();
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      ))}
    </ul>
  );
}