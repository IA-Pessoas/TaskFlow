import { createContext,useContext } from "react";
import type { ReactNode } from "react";
import { useTasks } from "../hooks/useTasks"

type TaskContextType = ReturnType<typeof useTasks>;

const TaskContext = createContext<TaskContextType | null>( null );

function TasksProvider({ children } : {children: ReactNode}) {
    const tasksData = useTasks();

    return(
        <TaskContext.Provider value={tasksData}>
            {children}
        </TaskContext.Provider>
    );
}

function useTasksContext(){
    const ctx = useContext(TaskContext);

    if(!ctx){
        throw new Error ("useTasksContext deve ser usado dentro de TasksProvider");
    }

    return ctx;
}

export { TasksProvider, useTasksContext}