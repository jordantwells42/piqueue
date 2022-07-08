import { useHasHydrated, useTaskStore } from '../hooks'
import TaskCard from './taskcard'

export default function TaskStack () {
  const tasks = useTaskStore(state => state.tasks)
  const hasHydrated = useHasHydrated()

  return (
    <>
      {hasHydrated && (
        <div className='w-3/4 h-full md:h-3/4 lg:h-2/3 flex flex-col relative top-0 items-center justify-start flex-wrap'>
          {tasks.map((task, idx) => (
            <TaskCard key={task.id} id={task.id} idx={idx} />
          ))}
        </div>
      )}
    </>
  )
}
