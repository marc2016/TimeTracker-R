import { create } from 'zustand';
import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

interface TaskState {
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    init: () => Promise<void>;
}

const saveTasks = async (tasks: Task[]) => {
    try {
        if (!await exists('', { baseDir: BaseDirectory.AppConfig })) {
            await mkdir('', { baseDir: BaseDirectory.AppConfig });
        }
        await writeTextFile('tasks.json', JSON.stringify({ tasks }), {
            baseDir: BaseDirectory.AppConfig,
            create: true,
        });
    } catch (error) {
        console.error('Failed to save tasks:', error);
    }
};

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    addTask: (text: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now(),
        };
        const updatedTasks = [...get().tasks, newTask];
        set({ tasks: updatedTasks });
        saveTasks(updatedTasks);
    },
    toggleTask: (id: string) => {
        const updatedTasks = get().tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        set({ tasks: updatedTasks });
        saveTasks(updatedTasks);
    },
    deleteTask: (id: string) => {
        const updatedTasks = get().tasks.filter(task => task.id !== id);
        set({ tasks: updatedTasks });
        saveTasks(updatedTasks);
    },
    init: async () => {
        try {
            if (await exists('tasks.json', { baseDir: BaseDirectory.AppConfig })) {
                const tasksText = await readTextFile('tasks.json', {
                    baseDir: BaseDirectory.AppConfig,
                });
                const data = JSON.parse(tasksText);
                if (data.tasks) {
                    set({ tasks: data.tasks });
                }
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    },
}));
