import { useTasksContext } from "../contexts/TasksContext";
import { useDebounce } from "../hooks/useDebounce";
import { TaskItem } from "./taskItem";
import { useState, useMemo, useCallback } from "react";

export function TaskList(){ 
  const { tasks, toggleTask , deleteTask } = useTasksContext();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  const debouncedSearch = useDebounce(search, 300);

  const filteredTasks = useMemo(()=> {
    return tasks
    .filter(
      (t) => filter === 'all' || t.completed === (filter === 'completed'))
    .filter(
      (t) => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  },[tasks, filter, debouncedSearch]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  }),[tasks]);

  const handleToggle = useCallback((id: string) => {
    toggleTask(id);
  }, [toggleTask]);

  const handleDelete = useCallback((id: string) => {
    deleteTask(id);
  }, [deleteTask]);

  return (
    <div>

      <input
        type="text"
        value={search}
        onChange={(e)=> setSearch(e.target.value)}
        placeholder="Buscar tarefa"
      />

      <select
        value={filter}
        onChange={(e)=> 
          setFilter(e.target.value as 'all' | 'completed' | 'pending')
        }
      >
        <option value ="all">Todas</option>
        <option value="completed">Concluídas</option>
        <option value="pending">Pendentes</option>
      </select>

        <p>Total: {stats.total}</p>
        <p>Completas: {stats.completed}</p>
        <p>Pendentes: {stats.pending}</p>

      <ul>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}