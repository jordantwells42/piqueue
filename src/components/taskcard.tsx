import { useEffect, useState } from 'react'
import { useTaskStore, TaskSchema } from '../hooks';
import { Task } from '../hooks'
import { importanceToColor } from '../utils/colors'
import Timeline from './timeline'

export default function TaskCard ({ id }: { id: string }) {
  const getTask = useTaskStore(state => state.getTask)
  const updateTask = useTaskStore(state => state.updateTask)
  const deleteTask = useTaskStore(state => state.deleteTask)

  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const task = getTask(id)
    if (!task) throw 'task with that id does not exist'
    setTask(task)
  }, [id, getTask])

  function handleAdd () {
    if (!task) throw 'cannot update nonexistant task'
    const newTask = TaskSchema.parse({ ...task, progress: task.progress + 0.1 })
    setTask(newTask)
    updateTask(newTask)
  }

  function handleDelete () {
    if (!task) throw 'cannot delete nonexistant task'
    deleteTask(task.id)
  }

  if (!task) return <p>Loading...</p>

  return (
    <div
      className={
        importanceToColor(task.progress) +
        '  aspect-[0.7143] rounded-xl border-4 md:border-8 border-slate-900 flex flex-col justify-content items-center text-slate-900 font-mono'
      }
    >
      <h1 className='border-b-2  md:border-b-4 border-slate-900 w-full font-bold text-center p-2 font-bold text-2xl'>
        {task.title}
      </h1>
      <div className=' w-full h-full border-slate-900 flex flex-col items-center justify-start pt-10 '>
        
        <h1>{Math.round(task.progress*100)}%</h1>
        <h2>{task.start.toLocaleString()}</h2>
        
        <Timeline 
            end={task.end}
            start={task.start}
            duration={task.duration}
            progress={task.progress}/>
          <div className="flex-row justify-center items-end">
        <button onClick={handleAdd} className='border-slate-900 border-2 m-1 p-1'>
          Update Progress
        </button>
        <button onClick={handleDelete} className='border-slate-900 border-2 m-1 p-1'>
          Delete Me
        </button>
        </div>
      </div>
    </div>
  )
}
