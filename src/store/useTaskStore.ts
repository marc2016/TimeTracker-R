import { create } from 'zustand';
import { db, initDb } from '../lib/db';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
    accumulatedDuration: number;
    lastStartTime: number | null;
    projectId: string | null;
}

interface TaskState {
    tasks: Task[];
    lastActiveTaskId: string | null;
    addTask: (title: string, description: string, projectId?: string | null) => Promise<void>;
    updateTask: (id: string, title: string, description: string, completed: boolean, projectId?: string | null) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    toggleTaskTimer: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    init: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    lastActiveTaskId: null,
    addTask: async (title: string, description: string, projectId: string | null = null) => {
        const now = Date.now();
        const newId = crypto.randomUUID();

        const newTask = {
            id: newId,
            title,
            description,
            completed: 0,
            created_at: now,
            updated_at: now,
            accumulated_duration: 0,
            last_start_time: null,
            project_id: projectId
        };

        try {
            await db.insertInto('tasks').values(newTask).execute();

            // Optimistic update
            const uiTask: Task = {
                id: newId,
                title,
                description,
                completed: false,
                createdAt: now,
                updatedAt: now,
                accumulatedDuration: 0,
                lastStartTime: null,
                projectId
            };
            set({ tasks: [...get().tasks, uiTask] });
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    },
    updateTask: async (id: string, title: string, description: string, completed: boolean, projectId: string | null = null) => {
        const now = Date.now();
        const completedVal = completed ? 1 : 0;
        try {
            await db.updateTable('tasks')
                .set({ title, description, completed: completedVal, updated_at: now, project_id: projectId })
                .where('id', '=', id)
                .execute();

            set({
                tasks: get().tasks.map(task =>
                    task.id === id ? { ...task, title, description, completed, updatedAt: now, projectId } : task
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
    toggleTaskTimer: async (id: string) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const now = Date.now();
        const isRunning = !!task.lastStartTime;
        let newAccumulatedDuration = task.accumulatedDuration;
        let newLastStartTime: number | null = null;

        if (isRunning && task.lastStartTime) {
            // Stop logic
            newAccumulatedDuration += (now - task.lastStartTime);
            newLastStartTime = null;
        } else {
            // Start logic
            newLastStartTime = now;
            set({ lastActiveTaskId: id });
            localStorage.setItem('lastActiveTaskId', id);

            // Pause other tasks
            const otherRunningTasks = get().tasks.filter(t => t.id !== id && t.lastStartTime);
            for (const other of otherRunningTasks) {
                // Pause other
                if (other.lastStartTime) {
                    const otherDuration = other.accumulatedDuration + (now - other.lastStartTime);
                    // update db for other
                    await db.updateTable('tasks')
                        .set({ accumulated_duration: otherDuration, last_start_time: null, updated_at: now })
                        .where('id', '=', other.id)
                        .execute();
                }
            }
            set({
                tasks: get().tasks.map(t => {
                    if (t.id !== id && t.lastStartTime) {
                        return { ...t, accumulatedDuration: t.accumulatedDuration + (now - t.lastStartTime!), lastStartTime: null, updatedAt: now };
                    }
                    return t;
                })
            });
        }

        try {
            await db.updateTable('tasks')
                .set({
                    accumulated_duration: newAccumulatedDuration,
                    last_start_time: newLastStartTime,
                    updated_at: now
                })
                .where('id', '=', id)
                .execute();

            set({
                tasks: get().tasks.map(t =>
                    t.id === id ? {
                        ...t,
                        accumulatedDuration: newAccumulatedDuration,
                        lastStartTime: newLastStartTime,
                        updatedAt: now
                    } : t
                )
            });
        } catch (error) {
            console.error('Failed to toggle task timer:', error);
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
                updatedAt: row.updated_at,
                accumulatedDuration: row.accumulated_duration,
                lastStartTime: row.last_start_time ?? null,
                projectId: row.project_id ?? null
            }));

            // Restore last active task ID
            const storedLastActiveId = localStorage.getItem('lastActiveTaskId');

            set({ tasks, lastActiveTaskId: storedLastActiveId });
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    },
}));
