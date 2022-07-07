const { DateTime, Duration } = require('luxon')

export default function Timeline ({
  end,
  duration,
  progress,
  start = DateTime.now()
}: {
  end: typeof DateTime
  duration?: typeof Duration | undefined
  progress: number
  start?: typeof DateTime
}) {
  let balancePercent
  let durationPercent
  let progressPercent

  if (duration) {
    const diff = end.diff(start).toMillis()
    const durationMillis = duration.toMillis()
    const progressMillis = progress * durationMillis

    progressPercent = Math.max(Math.floor((progressMillis / diff) * 100), 0)
    durationPercent = Math.floor(
      (durationMillis/diff - progressPercent/100) * 100
    )
    balancePercent = 100 - progressPercent - durationPercent
  } else {
    progressPercent = Math.max(Math.floor(progress * 100), 0)
    durationPercent = 0
    balancePercent = 100 - progressPercent
  }
  return (
    <div className='flex flex-col w-full justify-end items-center text-sm md:text-base gap-2 md:gap-4 font-bold'>
      <div className='flex flex-row w-full md:w-3/4 justify-between text-center items-center text-black font-bold'>
        <h1 className=' text-left'>
          {start.toLocaleString({
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
          })}
        </h1>
        <div className="w-1/4 m-2 h-0 border-b-2 border-white"></div>
        {<h1 className="text-white font-bold text-center ">{Math.round(progress*100)}%</h1>}
        <div className="w-1/4 m-2 h-0 border-b-2 border-white"></div>
        <h1 className='text-right'>
          {end.toLocaleString({
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
          })}
        </h1>
      </div>
        <div className='w-full h-10 flex border-4 border-slate-900 rounded-full p-1 flex-row bg-white bg-opacity-40'>
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full border-[3px] border-slate-900  bg-black bg-opacity-60 flex justify-center items-center`}
          ></div>
          {duration && durationPercent > 0.01 && (
            <div
              style={{ width: `${durationPercent}%` }}
              className={`h-full rounded-full border-[3px] border-slate-900 bg-white bg-opacity-60`}
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
