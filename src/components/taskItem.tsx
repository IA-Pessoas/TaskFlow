import React from "react";
import type { Task } from "../types/tasks";

type TaskItemProps = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

const TaskItem = React.memo(function TaskItem({
task,
    onDelete,
    onToggle,
    }: TaskItemProps){
      console.log("🔄 TaskItem render", task.title);
    
    return(
        <li>
        <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
        />

        <span>{task.title}</span>

        <button onClick={() => onDelete(task.id)}>🗑</button>
        </li>
    );
});

export {TaskItem}