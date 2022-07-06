const { DateTime, Duration } = require('luxon')

export default function Timeline ({
  end,
  duration,
  progress,
  start = DateTime.now()
}: {
  end: typeof DateTime
  duration: typeof Duration
  progress: number
  start?: typeof DateTime
}) {
  const diff = end.diff(start).toMillis()
  const durationMillis = duration.toMillis()
  const progressMillis = progress * durationMillis

  const progressPercent = Math.floor((progressMillis / diff) * 100)
  const durationPercent = Math.floor(
    ((durationMillis - progressMillis) / diff) * 100
  )
  const balancePercent = 100 - progressPercent - durationPercent

  console.log(progressPercent, durationPercent, balancePercent)
  console.log(`w-[${balancePercent}%]`)
  return (
    <div className='flex flex-col w-full h-20 justify-end items-center text-sm md:text-base gap-2 md:gap-4 font-bold'>
      <div className="flex flex-row justify-between text-center gap-20 px-5">
      <h1 className=' text-left'>
        {start.toLocaleString({ month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
      </h1>
      <h1 className='text-right'>
        {end.toLocaleString({ month: 'short', day: '2-digit' , hour: '2-digit', minute: '2-digit', hourCycle: 'h23'})}
      </h1>
      </div>
      <div className='w-5/6 flex flex-row border-2 border-slate-900 rounded-full h-10 '>
        <div className="w-full flex rounded-full flex-row bg-white bg-opacity-20">
        <div style={{width: `${balancePercent}%`}}
          className={`rounded-l-full h-full bg-white bg-opacity-40`}
        ></div>
        <div style={{width: `${progressPercent}%`}} 
          className={`h-full rounded-r-full bg-black border-2 border-slate-900 bg-opacity-20`}
        ></div>
        <div style={{width: `${durationPercent}%`}}
          className={`rounded-r-full h-full border-slate-900`}
        ></div>
        </div>
      </div>

    </div>
  )
}
