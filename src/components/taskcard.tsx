import { useEffect, useState } from "react";
import { useTaskStore } from "../hooks";
import { Task } from "../hooks";

export default function TaskCard({id}:{id:number}){
    const getTask = useTaskStore(state => state.getTask);
    const updateTask = useTaskStore(state => state.updateTask);
    const deleteTask = useTaskStore(state => state.deleteTask);

    const [task, setTask] = useState<Task | null>(null);

    useEffect( () => {
        const task = getTask(id);
        if (!task) throw "task with that id does not exist"
        setTask(task);
    }, [id, getTask]);



    function handleAdd(){
        if (!task) throw "cannot update nonexistant task"
        const newTask = {...task, progress: task.progress + 1};
        setTask(newTask);
        updateTask(newTask);
    }

    function handleDelete(){
        if (!task) throw "cannot delete nonexistant task"
        deleteTask(task.id);
    }


    
    if (!task) return <p>Loading...</p>;


    return (
        <div className="border p-5 flex flex-col justify-content items-center ">
            <h1>{task.title}</h1>
            <h1>{task.progress}</h1>
            <h2>{task.createdAt.toLocaleString()}</h2>
            <button onClick={handleAdd} className="border m-1 p-1">Update Progress</button>
            <button onClick={handleDelete} className="border m-1 p-1">Delete Me</button>
        </div>
    )
}