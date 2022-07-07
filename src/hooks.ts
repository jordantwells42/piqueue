import create from 'zustand'
const { DateTime, Duration} = require("luxon");
import { nanoid } from 'nanoid'
import { z } from 'zod';
import datetime, { RRule, RRuleSet, rrulestr } from 'rrule'

function clamp(n: number, min: number, max: number){
    return Math.max(min, Math.min(max, n));
}

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().default(""),
    start: z.instanceof(DateTime),
    end: z.instanceof(DateTime),
    priority: z.number().transform(n => clamp(n, 0, 1)).default(0.5),
    progress: z.number().transform(n => clamp(n, 0, 1)).default(0),
    duration: z.optional(z.instanceof(Duration)),
    recurrence: z.optional(z.instanceof(datetime)),
})

export type Task = z.infer<typeof TaskSchema>

export type Event = {
    id: number,
    title: string,
    description: string,
    time: typeof DateTime,
    duration: typeof Duration,
}

type TaskState = {
    tasks: Task[]
    addTask: (task: Task) => void
    deleteTask: (id: string) => void
    updateTask: (task: Task) => void
    getTask: (id: string) => Task | undefined
}

export const useTaskStore=create<TaskState>((set, get) => ({
    tasks: [],
    addTask: (task: Task) => {
        const validatedTask = TaskSchema.parse(task)
        set(state => ({
            tasks: [...state.tasks, validatedTask]
        }))
    },
    deleteTask: (taskId: string) => {
        set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId)
        }))
    },
    updateTask: (task: Task) => {
        const validatedTask = TaskSchema.parse(task)
        set(state => ({
            tasks: state.tasks.map(t => t.id === validatedTask.id ? validatedTask : t)
        }))
    },
    getTask: (id: string) => { 
        return get().tasks.find(task => task.id === id)
    }
}));