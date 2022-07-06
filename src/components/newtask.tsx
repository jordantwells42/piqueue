import { useState } from 'react'
import { Task, useTaskStore } from '../hooks'
import 'react-datetime/css/react-datetime.css'
import Modal from './modal'
const { DateTime, Duration } = require('luxon')

export default function NewTask ({
  setOpen
}: {
  setOpen: (open: boolean) => void
}) {
  const addTask = useTaskStore(state => state.addTask)
  const [task, setTask] = useState<Task>({} as Task)
  const [value, setValue] = useState<Date | null>(
    new DateTime('2014-08-18T21:11:54')
  )

  const newTaskButton = (
    <button className='rounded-2xl p-2 m-2 bg-blue-400'>New Task</button>
  )

  function handleSubmit () {
    console.log('submitting')
    //addTask({})
    setTask({} as Task)
  }

  const handleChange = (newValue: Date | null) => {
    setValue(newValue)
  }


  return (
    <Modal
      onSubmit={handleSubmit}
      button={newTaskButton}
      setOpen={setOpen}
    >
      <div className='p-2 m-2'>
        <h1>New Task</h1>
        <div className='flex flex-col gap-2 justify-content items-center'>
          <input
            value={task?.title}
            onChange={e => setTask({ ...task, title: e.target.value })}
            placeholder='Task...'
          />
          <input
            value={task?.description}
            onChange={e => setTask({ ...task, description: e.target.value })}
            placeholder='Description...'
          />
          <h1>{JSON.stringify(task)}</h1>
          {JSON.stringify(value)}
        </div>
      </div>
    </Modal>
  )
}
