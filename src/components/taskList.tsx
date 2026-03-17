import { useTasksContext } from "../contexts/TasksContext";
import { useDebounce } from "../hooks/useDebounce";
import { TaskItem } from "./taskItem";
import { useState, useMemo } from "react";

export function TaskList(){ 
  const { tasks, toggleTask , deleteTask } = useTasksContext();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const debouncedSearch = useDebounce(search, 300);

  const filteredtasks = useMemo(()=> {
    return tasks
    .filter(t => filter === 'all' || t.completed === (filter === 'completed'))
    .filter(t => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  },[tasks, filter, debouncedSearch])

  const stats = useMemo(() => ({
    total: tasks.length,
    completd: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  }),[tasks]);

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