export interface Task{
    id : string;
    title: string;
    completed: boolean;
    createdAt: number; //timestamp - use Date.now()
}