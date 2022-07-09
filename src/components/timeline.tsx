import { useTaskStore } from "../hooks"

const { DateTime, Duration } = require('luxon')

export default function Timeline ({
  id
}: {
  id: string
}) {
  
  const getTaskStats = useTaskStore(state => state.getTaskStats)

  let durationPercent, progressPercent, balancePercent, progress, durationExists;
  const taskStats = getTaskStats(id)
  if (taskStats){
    durationPercent = taskStats.durationPercent
    progressPercent = taskStats.progressPercent
    balancePercent = taskStats.balancePercent
    progress = taskStats.progress
    durationExists = taskStats.durationExists
  } else {
    return <p>404</p>
  }

  return (
    <div className='flex flex-col w-full justify-end items-center text-sm md:text-base py-5 gap-2 md:gap-4 '>
      
        <div className='w-full max-w-lg h-10 flex border-4 border-pico-dark-blue rounded-full p-1 flex-row bg-white bg-opacity-40'>
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full border-[3px] border-pico-dark-blue  bg-black bg-opacity-60 flex justify-center items-center`}
          ></div>
          {durationExists && durationPercent > 0.01 && (
            <div
              style={{ width: `${durationPercent}%` }}
              className={`h-full rounded-full border-[3px] border-pico-dark-blue bg-white bg-opacity-60`}
            ></div>
          )}
          <div
          style={{ width: `${balancePercent}%` }}
          className={`rounded-r-full h-full `}
        ></div>
        
        
      </div>
    </div>
  )
}
