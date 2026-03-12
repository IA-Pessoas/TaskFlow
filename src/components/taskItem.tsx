type Task = {
    id: string;
    title : string;
    completed : boolean;
};

type TaskItemProps = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export function TaskItem ({ task, onToggle, onDelete}: TaskItemProps) {
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
    )
}

