import { useState } from 'react'
import { Task, useTaskStore } from '../hooks'
import { parseInput } from '../utils/nlp'
import Modal from './modal'
import Slider from './slider';
const { DateTime, Duration } = require('luxon')

export default function NewTask ({
  setOpen
}: {
  setOpen: (open: boolean) => void
}) {
  const addTask = useTaskStore(state => state.addTask)
  const [task, setTask] = useState<Task | undefined>(undefined)
  const [strInput, setStrInput] = useState<string>('')
  const [priorityInput, setPriorityInput] = useState<number>(0)

  const newTaskButton = (
    <button className='fixed bottom-5 right-5 lg:static rounded-2xl p-2 m-2 bg-blue-500'>New Task</button>
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
      <div className='overflow-y-scroll scrollbar-hide w-full p-2 h-full flex flex-col gap-6 justify-start items-center'>
        <h1 className='text-2xl font-bold'>New Task</h1>
        <p className='italic'>Create new tasks <b className="text-blue-400">every</b> day, <b className='text-red-400'>takes</b> 5 seconds</p>
        <div className='w-full h-full flex flex-col justify-start items-center'>
          <input className="border-slate-500 border-2 block w-5/6 p-2 rounded-xl" value={strInput} onChange={e => {setStrInput(e.target.value);setTask(parseInput(e.target.value))}} placeholder="..."></input>
          {task && 
            <div className="w-full p-2">
              <Slider />
            </div>
          }
        </div>
      </div>
    </Modal>
  )
}
