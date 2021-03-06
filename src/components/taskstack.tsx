import { useHasHydrated, useTaskStore, useImportance, Task } from '../hooks';
import TaskCard from './taskcard'
import { useEffect, useState } from 'react';

export default function TaskStack () {
  let sortTasks = useTaskStore(state => state.sortTasks)
  let tasks = useTaskStore(state => state.tasks)
  let [renderCount, setRenderCount] = useState<number>(0)
  const hasHydrated = useHasHydrated()

  
  
  useEffect(() => {
    setRenderCount(0)
  }, [])

  function handleSort(){
    sortTasks("lmao")
    setRenderCount(count => count + 1)
  }
  
  if (!tasks) { return <p> Whoops </p>}

 //<button className='fixed bottom-5 lg:static rounded-2xl p-2 m-2 bg-pink-500' onClick={handleSort}>Sort Tasks</button>

  return (
    <>
      {hasHydrated && (
        <div className='w-5/6 bg-pico-mid-blue p-3 rounded-2xl h-full md:h-3/4 lg:h-2/3 flex flex-col relative top-0 items-center justify-start flex-wrap py-3 md:py-10'>
          {tasks.map((task, idx) => (
            <TaskCard key={task.id} id={task.id} idx={idx} />
          ))}
        </div>
        
      )}
      <button className='fixed border-2 border-pico-dark-blue left-5 bottom-16 lg:bottom-24 lg:left-64 rounded-2xl p-2 m-2  text-pico-white bg-pico-pink' onClick={handleSort}>sort tasks</button>
    </>
  )
}
