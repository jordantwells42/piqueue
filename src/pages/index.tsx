import { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '../utils/trpc'
import { useTaskStore } from './../hooks'
import TaskCard from '../components/taskcard'
import { Task } from './../hooks'
import { useEffect, useState } from 'react'
import NewTask from '../components/newtask'
import { importanceToColor } from '../utils/colors'
const { DateTime, Duration } = require('luxon')
import { parseInput } from '../utils/nlp'
import { nanoid } from 'nanoid'
import TaskStack from '../components/taskstack'


const Home: NextPage = () => {

  const sortTasks = useTaskStore(state => state.sortTasks)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const addTask = useTaskStore(state => state.addTask)

  function addDummyTask () {
    const exampleTask: Task = {
      id: nanoid(),
      title: 'Example Task',
      description: 'This is an example task',
      start: DateTime.now(),
      end: DateTime.now().plus({ days: 14 }),
      duration: Duration.fromObject({ days: 7 }),
      priority: 1,
      progress: 0.0
    }
    addTask(exampleTask)
  }
  //<button className='fixed bottom-5 lg:static rounded-2xl p-2 m-2 bg-pink-500' onClick={() => sortTasks("s")}>Sort</button>
  return (
    <>
      <Head>
        <title>Prior</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='w-screen h-screen bg-slate-700'>
      <div
        style={{ filter: modalOpen ? 'brightness(0.4)' : 'brightness(1.0)' }}
        className='w-full h-full flex flex-col justify-start items-center py-10
         text-white border-white'
      >
        <h1 className='text-4xl font-bold'>Tasks</h1>
        
        {/*<div className="h-20 w-full flex flex-row">{[0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05].map(score => (<div key={score} className={importanceToColor(score) + " h-30 w-full"}><p className="text-white">White</p><p className="text-black">Black </p></div>))}</div>
         */}
        <TaskStack />
        <div>
        <button className='fixed bottom-5 left-5 lg:static rounded-2xl p-2 m-2 bg-pink-500' onClick={addDummyTask}>Add task</button>
        <NewTask setOpen={setModalOpen} />
        
        </div>
      </div>
      </div>
    </>
  )
}

export default Home
