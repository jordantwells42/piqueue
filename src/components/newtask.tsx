import { useState } from 'react'
import { Task, useTaskStore, TaskSchema } from '../hooks';
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
    <button className='fixed border-2 border-pico-dark-blue bottom-16 right-5 lg:bottom-24 lg:right-64 rounded-2xl p-2 m-2 text-pico-white  bg-pico-mid-blue'>new task</button>
  )

  function handleSubmit () {
    console.log('submitting')
    if (task) {
      const toAddTask = TaskSchema.parse({...task, priority: priorityInput})
      addTask(toAddTask)
    }
  }

  function clearState(){
    setTask(undefined)
    setStrInput("")
    setPriorityInput(0.2)
  }

  function updateTaskWithPriority(){
    setTask((ptask)=>{
      return TaskSchema.parse({...ptask, priority: priorityInput})
    })
  }


  return (
    <Modal
      onSubmit={handleSubmit}
      clearState={clearState}
      button={newTaskButton}
      setOpen={setOpen}
    >
      <div className='font-main overflow-y-scroll  scrollbar-hide w-full p-2 h-full flex flex-col gap-6 justify-start items-center'>
        <p className='text-2xl '>new task</p>
        <div className="flex flex-col justify-center items-center">
        <p className='text-sm text-pico-dark-grey'>create simple tasks <i className="text-green-600">today&nbsp;</i> powered by NLP</p>
        <p className='text-sm text-pico-dark-grey'>create new recurring tasks <i className="text-blue-400">every&nbsp;</i> day, <i className='text-red-400'>takes&nbsp;</i> 5 seconds</p>
        </div>
        <div className='w-full h-full flex flex-col justify-start items-center'>
          <input className="border-slate-500 border-2 block w-5/6 p-2 rounded-xl" value={strInput} onChange={e => {setStrInput(e.target.value);setTask(parseInput(e.target.value))}} placeholder="..."></input>
          {task && 
            <div className="w-5/6 p-2 flex-col flex justify-center text-left text-sm text-pico-dark-grey">
              <Slider value = {priorityInput} setValue={setPriorityInput}/>
              
              <p><i className='text-pico-black'>Title:&nbsp;</i> {task.title}</p>
              <p><i className='text-pico-black'>From:&nbsp;</i> {task.start ? task.start.toLocaleString() : "Now"} to {task.end.toLocaleString()}</p>
              {task.recurrence && <p><i className='text-pico-black'>Recurring:&nbsp;</i> {task.recurrence.toText()}</p>}
              {task.duration && <p><i className='text-pico-black'>Duration:&nbsp;</i> {task.duration.toHuman()}</p>}
            </div>
          }
        </div>
      </div>
    </Modal>
  )
}
