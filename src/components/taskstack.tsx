import { useHasHydrated, useTaskStore } from '../hooks'
import TaskCard from './taskcard'

export default function TaskStack () {
  const tasks = useTaskStore(state => state.tasks)
  const hasHydrated = useHasHydrated()

  return (
    <>
      {hasHydrated && (
        <div className='w-3/4 h-full flex flex-col relative top-0 items-center justify-center flex-wrap'>
          {tasks.map((task, idx) => (
            <TaskCard key={task.id} id={task.id} idx={idx} />
          ))}
        </div>
      )}
    </>
  )
}
