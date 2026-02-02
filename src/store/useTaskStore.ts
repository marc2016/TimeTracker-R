import { create } from 'zustand';
import { db, initDb } from '../lib/db';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
}

interface TaskState {
    tasks: Task[];
    addTask: (title: string, description: string) => Promise<void>;
    updateTask: (id: string, title: string, description: string, completed: boolean) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    init: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    addTask: async (title: string, description: string) => {
        const now = Date.now();
        const newId = crypto.randomUUID();

        const newTask = {
            id: newId,
            title,
            description,
            completed: 0,
            created_at: now,
            updated_at: now,
        };

        try {
            await db.insertInto('tasks').values(newTask).execute();

            // Optimistic update or reload? Reload is safer for consistency, optimistic is faster.
            // Let's do optimistic for UI responsiveness.
            const uiTask: Task = {
                id: newId,
                title,
                description,
                completed: false,
                createdAt: now,
                updatedAt: now
            };
            set({ tasks: [...get().tasks, uiTask] });
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    },
    updateTask: async (id: string, title: string, description: string, completed: boolean) => {
        const now = Date.now();
        const completedVal = completed ? 1 : 0;
        try {
            await db.updateTable('tasks')
                .set({ title, description, completed: completedVal, updated_at: now })
                .where('id', '=', id)
                .execute();

            set({
                tasks: get().tasks.map(task =>
                    task.id === id ? { ...task, title, description, completed, updatedAt: now } : task
                )
            });
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    },
    toggleTask: async (id: string) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const now = Date.now();
        const newCompleted = !task.completed;

        try {
            await db.updateTable('tasks')
                .set({ completed: newCompleted ? 1 : 0, updated_at: now })
                .where('id', '=', id)
                .execute();

            set({
                tasks: get().tasks.map(t =>
                    t.id === id ? { ...t, completed: newCompleted, updatedAt: now } : t
                )
            });
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    },
    deleteTask: async (id: string) => {
        try {
            await db.deleteFrom('tasks').where('id', '=', id).execute();
            set({ tasks: get().tasks.filter(task => task.id !== id) });
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    },
    init: async () => {
        await initDb();
        try {
            const rows = await db.selectFrom('tasks').selectAll().execute();
            const tasks: Task[] = rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description || '',
                completed: row.completed === 1,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }));
            set({ tasks });
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    },
}));
