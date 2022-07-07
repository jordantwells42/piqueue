import { useState } from 'react'
import { Task, useTaskStore } from '../hooks'
import { parseInput } from '../utils/nlp'
import Modal from './modal'
const { DateTime, Duration } = require('luxon')

export default function NewTask ({
  setOpen
}: {
  setOpen: (open: boolean) => void
}) {
  const addTask = useTaskStore(state => state.addTask)
  const [task, setTask] = useState<Task | undefined>(undefined)
  const [strInput, setStrInput] = useState<string>('')

  const newTaskButton = (
    <button className='rounded-2xl p-2 m-2 bg-blue-500'>New Task</button>
  )

  function handleSubmit () {
    console.log('submitting')
    if (task) {addTask(task)}
  }

  function clearState(){
    setTask(undefined)
    setStrInput("")
  }


  return (
    <Modal
      onSubmit={handleSubmit}
      clearState={clearState}
      button={newTaskButton}
      setOpen={setOpen}
    >
      <div className='w-full p-2 h-full flex flex-col gap-6 justify-start items-center'>
        <h1 className='text-2xl font-bold'>New Task</h1>
        <p className='italic'>Create new tasks <b className="text-blue-400">every</b> day, <b className='text-red-400'>takes</b> 5 seconds</p>
        <div className='w-full h-full flex flex-col justify-start items-center'>
          <input className="border-slate-500 border-2 block w-5/6 p-2 rounded-xl" value={strInput} onChange={e => {setStrInput(e.target.value);setTask(parseInput(e.target.value))}} placeholder="..."></input>
          {task && 
            <div className="text-left p-2">
              <h1><b>Title</b>: {task.title}</h1>
              <h2><b>Desc</b>: {task.description}</h2>
              <h3><b>Start</b>: {task.start && task.start.toLocaleString()}</h3>
              <h3><b>End</b>: {task.end && task.end.toLocaleString()}</h3>
              <h3><b>Duration</b>: {task.duration && JSON.stringify(task.duration.toObject())}</h3>
              <h3><b>Progress</b>: {task.progress}</h3>
              <h3><b>Priority</b>: {task.priority}</h3>
              <h3><b>Recurrence</b>: {task.recurrence && task.recurrence?.toText()}</h3>
            </div>
          }
        </div>
      </div>
    </Modal>
  )
}