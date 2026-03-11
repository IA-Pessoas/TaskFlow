import { useEffect } from "react";

function useTaskTitle(pendingCount : number) {
    useEffect(() => {
       document.title = pendingCount > 0 ? `(${pendingCount}) TaskFLow` : "TaskFlow";
    },[pendingCount]);
}

export {useTaskTitle };