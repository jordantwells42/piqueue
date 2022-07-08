import create, { GetState, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
const { DateTime, Duration } = require('luxon')
import { nanoid } from 'nanoid'
import { z } from 'zod'
import datetime, { Options, RRule, RRuleSet, rrulestr } from 'rrule'
import { useState, useEffect } from 'react'
import superjson from 'superjson'

function clamp (n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(''),
  start: z.instanceof(DateTime),
  end: z.instanceof(DateTime),
  priority: z
    .number()
    .transform(n => clamp(n, 0, 1))
    .default(0.5),
  progress: z
    .number()
    .transform(n => clamp(n, 0, 1))
    .default(0),
  duration: z
    .instanceof(Duration)
    .default(undefined)
    .nullish(),
  recurrence: z.optional(z.instanceof(datetime))
})

export type Task = z.infer<typeof TaskSchema>

const SerializedTask = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(''),
  start: z.instanceof(Date),
  end: z.instanceof(Date),
  priority: z.number(),
  progress: z.number(),
  duration: z.string(),
  recurrence: z.any()
})

type SerializedTask = z.infer<typeof SerializedTask>

export type Event = {
  id: number
  title: string
  description: string
  time: typeof DateTime
  duration: typeof Duration
}

type TaskState = {
  tasks: Task[]
  addTask: (task: Task) => void
  deleteTask: (id: string) => void
  updateTask: (task: Task) => void
  getTask: (id: string) => Task | undefined
  getTaskStats: (id: string) => { progress: number, durationPercent: number, progressPercent: number, balancePercent: number, durationExists: boolean } | undefined
}

function serialize (tasks: Task[]): string {
  const storedTasks = tasks.map(task => {
    const { start, end, duration, ...rest } = task
    return {
      ...rest,
      start: start.toJSDate(),
      end: end.toJSDate(),
      duration: duration ? duration.toISO() : undefined,
      recurrence: task.recurrence?.toString()
    }
  })
  return superjson.stringify(storedTasks)
}

function deserialize (storedString: string): Task[] {
  const storedTasks = superjson.parse<SerializedTask[]>(storedString)
  if (storedTasks.length > 0) {
    console.log(storedTasks)
    return storedTasks.map(task => {
      console.log(task)
      const { start, end, duration, recurrence, ...rest } = task

      return {
        ...rest,
        start: DateTime.fromJSDate(start),
        end: DateTime.fromJSDate(end),
        duration: Duration.fromISO(duration),
        recurrence: task.recurrence ? RRule.fromString(recurrence) : undefined
      }
    })
  }
  return []
}

function load (): Task[] {
  if (typeof window !== 'undefined') {
    const storedString = localStorage.getItem('tasks')
    if (storedString) {
      return deserialize(storedString)
    }
    return []
  }
  return []
}

function save (tasks: Task[]) {
  console.log('TRYING TO SAVE')
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', serialize(tasks))
    console.log('SAVED')
  }
  console.log('NOT SAVED')
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: load(),
  addTask: (task: Task) => {
    const validatedTask = TaskSchema.parse(task)
    set(state => ({
      tasks: [...state.tasks, validatedTask]
    }))
    save(get().tasks)
  },
  deleteTask: (taskId: string) => {
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== taskId)
    }))
    save(get().tasks)
  },
  updateTask: (task: Task) => {
    const validatedTask = TaskSchema.parse(task)

    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === validatedTask.id ? validatedTask : t
      )
    }))
    save(get().tasks)
  },
  getTask: (id: string) => {
    return TaskSchema.parse(get().tasks.find(task => task.id === id))
  },
  getTaskStats: (id: string) => {
    const task = get().tasks.find(task => task.id === id)
    if (task) {
      const { start, end, duration, progress } = task
      let balancePercent
      let durationPercent
      let progressPercent

      if (duration) {
        const diff = end.diff(start).toMillis()
        const durationMillis = duration.toMillis()
        const progressMillis = progress * durationMillis

        progressPercent = Math.max(Math.floor((progressMillis / diff) * 100), 0)
        durationPercent = Math.floor(
          (durationMillis / diff - progressPercent / 100) * 100
        )
        balancePercent = 100 - progressPercent - durationPercent
      } else {
        progressPercent = Math.max(Math.floor(progress * 100), 0)
        durationPercent = 0
        balancePercent = 100 - progressPercent
      }
      return { progress, 
        progressPercent, durationPercent, balancePercent, durationExists: !!duration }
    }
    return undefined

  }
}))

export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}
