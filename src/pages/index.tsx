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
import Swipeable from '../components/swipeable'

/*
TODO:

Swipeable components using useGesture and react-spring
Ignore task (temporary importance detriment....?, (add as property, resort with detriment, whenever stored make sure to get rid of detriment...?))

*/

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
  //
  return (
    <>
      <Head>
        <title>piqueue</title>
        <meta name='description' content='a simple task manager' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='font-main w-screen h-screen bg-pico-lavender'>
      <div
        style={{ filter: modalOpen ? 'brightness(0.4)' : 'brightness(1.0)' }}
        className='w-full h-full flex flex-col justify-start items-center py-10 overflow-x-hidden
          '
      >
        <h1 className='text-5xl font-bold text-pico-white bg-pico-lavender w-2/3 lg:w-1/3 text-center rounded-full  bg-pico-mid-blue p-3'>piqueue</h1>
        
        {/*<div className="h-20 w-full flex flex-row">{[0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05].map(score => (<div key={score} className={importanceToColor(score) + " h-30 w-full"}><p className="text-pico-white">White</p><p className="text-black">Black </p></div>))}</div>
         */}
        <TaskStack />
        <NewTask setOpen={setModalOpen} />    
      </div>
      </div>
    </>
  )
}

export default Home
