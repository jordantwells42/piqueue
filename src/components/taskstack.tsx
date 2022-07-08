import { useHasHydrated, useTaskStore, useImportance, Task } from '../hooks';
import TaskCard from './taskcard'
import { useEffect, useState } from 'react';

export default function TaskStack () {
  let sortTasks = useTaskStore(state => state.sortTasks)
  let tasks = useTaskStore(state => state.tasks)
  let [statefulTasks, setStatefulTasks] = useState<Task[]>([])
  const hasHydrated = useHasHydrated()

  useEffect(() => {
    setStatefulTasks([...tasks])
  }, [])

  function handleSort(){
    sortTasks("lmao")
    setStatefulTasks([...tasks])
  }
  
  if (!tasks) { return <p> Whoops </p>}

 //<button className='fixed bottom-5 lg:static rounded-2xl p-2 m-2 bg-pink-500' onClick={handleSort}>Sort Tasks</button>

  return (
    <>
      {hasHydrated && (
        <div className='w-3/4 h-full md:h-3/4 lg:h-2/3 flex flex-col relative top-0 items-center justify-start flex-wrap'>
          {statefulTasks.map((task, idx) => (
            <TaskCard key={task.id} id={task.id} idx={idx} />
          ))}
        </div>
        
      )}
      <button className='fixed bottom-5 lg:static rounded-2xl p-2 m-2 bg-pink-500' onClick={handleSort}>Sort</button>
    </>
  )
}
