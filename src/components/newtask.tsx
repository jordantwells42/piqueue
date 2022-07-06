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
  const [task, setTask] = useState<Task | undefined>({} as Task)
  const [strInput, setStrInput] = useState<string>('')

  const newTaskButton = (
    <button className='rounded-2xl p-2 m-2 bg-blue-400'>New Task</button>
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
      <div className='p-2 m-2'>
        <h1>New Task</h1>
        <div className='flex flex-col gap-2 justify-content items-center'>
          {/*<input
            value={task?.title}
            onChange={e => setTask({ ...task, title: e.target.value })}
            placeholder='Task...'
          />
          <input
            value={task?.description}
            onChange={e => setTask({ ...task, description: e.target.value })}
            placeholder='Description...'
          />*/}
          <input value={strInput} onChange={e => {setStrInput(e.target.value);setTask(parseInput(e.target.value))}} placeholder="Do taxes"></input>
          {task && 
            <div>
              <h1>{task.title}</h1>
              <h2>{task.description}</h2>
              <h3>{task.start && task.start.toLocaleString()}</h3>
              <h3>{task.end && task.end.toLocaleString()}</h3>
              <h3>{task.duration && task.duration.toISO()}</h3>
              <h3>{task.progress}</h3>
              <h3>{task.priority}</h3>
              <h3>{task.recurrence && task.recurrence?.toText()}</h3>
            </div>
          }
        </div>
      </div>
    </Modal>
  )
}
