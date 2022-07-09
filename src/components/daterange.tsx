import { useTaskStore } from "../hooks"

export default function DateRange({id}:{id: string }){
    const getTask = useTaskStore(state => state.getTask)
    const task = getTask(id)



    if (!task){
        return <p>404</p>
    } else {
        const { start, end, progress } = task
            return (
                <div className='flex flex-row w-full md:w-3/4 lg:w-1/2 justify-between text-center items-center text-black '>
                <h1 className=' text-left'>
                {start.toLocaleString({
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h23'
                })}
                </h1>
                <div className="w-1/4 m-2 h-0 border-b-2 border-pico-dark-blue rounded-full "></div>
                {<h1 className="text-pico-black  text-center ">{Math.round(progress*100)}%</h1>}
                <div className="w-1/4 m-2 h-0 border-b-2 border-pico-dark-blue rounded-full"></div>
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
            )

    }
    

}