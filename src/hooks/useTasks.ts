import type { Task } from "../types/tasks";
import { useLocalStorage } from "./useLocalStorage";

function useTasks(){
    
    const[tasks,setTasks] = useLocalStorage<Task[]>('tasks',[]);
    
    const addTask = (title : string) =>{
        const trimmedTitle = title.trim();

            if(trimmedTitle === ""){
                return;
            }

            setTasks(prev =>[...prev, {
                id : crypto.randomUUID(),
                title : trimmedTitle,
                completed : false,
                createdAt : Date.now(),
            }]);
    };

    const deleteTask = (id : string) =>{
        setTasks(prev => prev.filter(t=> t.id !==id));
    };

    const toggleTask = (id : string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? {...t, completed: !t.completed} : t
        ));
    };

    const pendingCount = tasks.filter(t => !t.completed).length;

    return {tasks, addTask, deleteTask, toggleTask, pendingCount};
}

export{useTasks}