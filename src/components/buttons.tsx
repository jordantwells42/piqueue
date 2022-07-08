import { Task, TaskSchema, useTaskStore } from '../hooks';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
const { DateTime, Duration } = require('luxon')

export default function Buttons({id}:{id:string}){
    const getTask = useTaskStore(state => state.getTask)
    const [task, setTask] = useState<Task | null>(null)
    const addTask = useTaskStore(state => state.addTask)
    const updateTask = useTaskStore(state => state.updateTask)
    const deleteTask = useTaskStore(state => state.deleteTask)
  
    useEffect(() => {
        const gotTask = getTask(id)
        if (!gotTask) throw 'task with that id does not exist'
        setTask(gotTask)
      }, [id, getTask])
    
      function handleAdd () {
        if (!task) throw 'cannot update nonexistant task'
        const newTask = TaskSchema.parse({ ...task, progress: task.progress + 0.05 })
        setTask(newTask)
        updateTask(newTask)
      }
    
      function handleDelete () {
        if (!task) throw 'cannot delete nonexistant task'
        deleteTask(task.id)
      }
    
      function handleFinish () {
        if (!task) throw 'cannot finish nonexistant task'
        if (task.recurrence) {
          const newTask = TaskSchema.parse({
            ...task,
            progress: 0,
            id: nanoid(),
            start: DateTime.now(),
            end: DateTime.fromJSDate(task.recurrence.after(task.end.toJSDate()))
          })
          addTask(newTask)
        }
        deleteTask(task.id)
      }
    


    if (!task){
        return <p>404</p>
    } else {
        return (
            <div className='py-2 flex-row justify-center items-center'>
            <button
              onClick={handleAdd}
              className='rounded border-slate-900 border-2 m-1 p-1'
            >
              Progress
            </button>
            <button
              onClick={handleDelete}
              className='rounded border-slate-900 border-2 m-1 p-1'
            >
              Delete
            </button>
            <button
              onClick={handleFinish}
              className='rounded border-slate-900 border-2 m-1 p-1'
            >
              Finish
            </button>
          </div>
        )
        }
}