import { useEffect } from "react";

function useTaskTitle(pendingCount : number) {
    useEffect(() => {
       document.title = pendingCount > 0 ? `(${pendingCount}) TaskFlow` : "TaskFlow";
    },[pendingCount]);
}

export { useTaskTitle };