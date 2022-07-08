import { useEffect, useState } from 'react'
import { useTaskStore, TaskSchema, useImportance } from '../hooks'
import { Task } from '../hooks'
import { importanceToColor } from '../utils/colors'
import Timeline from './timeline'
import { nanoid } from 'nanoid'
import DateRange from './daterange'
import Buttons from './buttons'
import { useSpring, animated, config } from 'react-spring'

export default function TaskCard ({ id, idx }: { id: string; idx: number }) {
  const getTask = useTaskStore(state => state.getTask)
  const task = getTask(id)
  const importance = useImportance(id)
  console.log("hello?", importance)
  const stackSize = 3

  const styles = useSpring({
    to: { marginTop: Math.min(idx, stackSize-1) * 10, zIndex: stackSize + 1 - idx },
    from: { marginTop: -50  , zIndex: stackSize + 1 - idx},
    config: config.wobbly
  })

  useEffect(() => {
    const gotTask = getTask(id)
    if (!gotTask) throw 'task with that id does not exist'
  }, [id, getTask, importance])

  if (!task) {
    return <p>Loading...</p>
  }

  return (
    <animated.div
      style={styles}
      className='absolute w-full h-auto flex flex-col justify-start items-center'
      key={task.id}
    >
      <div
        className={
          importanceToColor(importance) +
          ' w-full max-w-4xl aspect-[0.7143] m-2 md:w-full md:min-h-96 h-auto md:aspect-auto rounded-xl ' +
          ' border-4 border-slate-900 flex flex-col justify-content items-center text-slate-900 font-mono'
        }
      >
        <div className='w-full flex flex-col'>
          <div className='border-b-4 border-slate-900 w-full font-bold text-center'>
            <h1 className='p-2 text-2xl max-w-prose'>{task.title}</h1>
          </div>
          <div className=' w-full p-5 flex flex-col items-center justify-between pt-5 pb-3 '>
            <h2 className='italic h-10'>
              {task.recurrence ? task.recurrence.toText() : "single time"}
            </h2>
            <DateRange id={task.id} />
            <Timeline id={task.id} />
            <Buttons id={task.id} />
            <h1>Priority: {Math.round(task.priority* 100)}</h1>
          </div>
        </div>
      </div>
    </animated.div>
  )
}
