import create, { GetState, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
const { DateTime, Duration } = require('luxon')
import { nanoid } from 'nanoid'
import { z } from 'zod'
import datetime, { Options, RRule, RRuleSet, rrulestr } from 'rrule'
import { useState, useEffect } from 'react'
import superjson from 'superjson'

function clamp (n: number, min: number, max: number): number {
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
  sortTasks: (method: string) => void
  getTaskStats: (
    id: string
  ) =>
    | {
        progress: number
        priority: number
        durationPercent: number
        progressPercent: number
        balancePercent: number
        durationExists: boolean
      }
    | undefined
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
    return storedTasks.map(task => {
      const { start, end, duration, recurrence, ...rest } = task

      return {
        ...rest,
        start: DateTime.fromJSDate(start),
        end: DateTime.fromJSDate(end),
        duration: duration ? Duration.fromISO(duration) : undefined,
        recurrence: recurrence ? RRule.fromString(recurrence) : undefined
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
  } else {
  console.log('NOT SAVED')
  }
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
  sortTasks(method: string){
    console.log("sorting")
    set(state => ({
      tasks: state.tasks.sort((a, b)=>{ 
      const aImportance = calculateImportance(a)
      const bImportance = calculateImportance(b) 
      
      if (aImportance > bImportance ){
        return -1
      } else if (aImportance < bImportance){
        return 1
      }
      return 0
  
      })
    }))
    save(get().tasks)
  },
  getTaskStats: (id: string) => {
    const task = get().tasks.find(task => task.id === id) as Task
    return calculateTaskStats(task)
  }
}))

export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}

export function useImportance (id: string): number {
  const getTask = useTaskStore(state => state.getTask)
  const task = getTask(id)
  if (task){
    return calculateImportance(task)
  } else {
    return 0
  }
  
}


export function calculateImportance(task: Task){
  const taskStats = calculateTaskStats(task)
  if (taskStats) {
    const {
      progressPercent,
      durationPercent,
      balancePercent,
      progress,
      priority,
      durationExists
    } = taskStats
    if (durationExists) {

      const effectiveProgressLeft =
        (100 - (durationPercent + progressPercent + progressPercent)) / 100
      const importance = priority * effectiveProgressLeft
      return clamp(effectiveProgressLeft * priority, 0, 1)
    } else {
      const effectiveProgressLeft = (100 - progressPercent) / 100
      const importance = priority * effectiveProgressLeft
      return clamp(importance, 0, 1)
    }
    
  } else {
    return 0
  }
}

export function calculateTaskStats(task: Task){
  if (task) {
    const { start, end, duration, progress, priority } = task
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
    return {
      progress,
      priority,
      progressPercent,
      durationPercent,
      balancePercent,
      durationExists: !!duration
    }
  }
  return undefined
}