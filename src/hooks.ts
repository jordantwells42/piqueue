import create from 'zustand'
const { DateTime, Duration} = require("luxon");

export type Task = {
    id: number,
    title: string,
    description: string,
    status: "todo" | "in-progress" | "done",
    createdAt: typeof DateTime,
    deadline: typeof DateTime,
    duration: typeof Duration,
    priority: number,
    progress: number
}

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
    deleteTask: (id: number) => void
    updateTask: (task: Task) => void
    getTask: (id: number) => Task | undefined
}

export const useTaskStore=create<TaskState>((set, get) => ({
    tasks: [],
    addTask: (task: Task) => {
        set(state => ({
            tasks: [...state.tasks, task]
        }))
    },
    deleteTask: (taskId: number) => {
        set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId)
        }))
    },
    updateTask: (task: Task) => {
        set(state => ({
            tasks: state.tasks.map(t => t.id === task.id ? task : t)
        }))
    },
    getTask: (id: number) => { 
        return get().tasks.find(task => task.id === id)
    }
}));