import { create } from 'zustand';
import { db, initDb } from '../lib/db';

export interface Project {
    id: string;
    title: string;
    description: string;
    color: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
}

interface ProjectState {
    projects: Project[];
    addProject: (title: string, description: string, color: string) => Promise<void>;
    updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    toggleProjectCompletion: (id: string) => Promise<void>;
    init: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    addProject: async (title: string, description: string, color: string) => {
        const now = Date.now();
        const newId = crypto.randomUUID();

        const newProject = {
            id: newId,
            title,
            description,
            color,
            completed: 0,
            created_at: now,
            updated_at: now,
        };

        try {
            await db.insertInto('projects').values(newProject).execute();

            const uiProject: Project = {
                id: newId,
                title,
                description,
                color,
                completed: false,
                createdAt: now,
                updatedAt: now,
            };
            set({ projects: [...get().projects, uiProject] });
        } catch (error) {
            console.error('Failed to add project:', error);
        }
    },
    updateProject: async (id: string, updates) => {
        const now = Date.now();
        const { title, description, color, completed } = updates;
        const dbUpdates: any = { updated_at: now };

        if (title !== undefined) dbUpdates.title = title;
        if (description !== undefined) dbUpdates.description = description;
        if (color !== undefined) dbUpdates.color = color;
        if (completed !== undefined) dbUpdates.completed = completed ? 1 : 0;

        try {
            await db.updateTable('projects')
                .set(dbUpdates)
                .where('id', '=', id)
                .execute();

            set({
                projects: get().projects.map(p =>
                    p.id === id ? { ...p, ...updates, updatedAt: now } : p
                )
            });
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    },
    toggleProjectCompletion: async (id: string) => {
        const project = get().projects.find(p => p.id === id);
        if (!project) return;

        const newCompleted = !project.completed;
        await get().updateProject(id, { completed: newCompleted });
    },
    deleteProject: async (id: string) => {
        try {
            await db.deleteFrom('projects').where('id', '=', id).execute();
            // Also need to unassign tasks from this project? 
            // Or just leave them hanging (project_id will reference non-existent project).
            // Better to set project_id to null for tasks.
            await db.updateTable('tasks')
                .set({ project_id: null })
                .where('project_id', '=', id)
                .execute();

            set({ projects: get().projects.filter(p => p.id !== id) });
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    },
    init: async () => {
        // initDb called in TaskStore usually, but harmless to call ensure here or just assume app init calls it
        // actually initDb IS called in useTaskStore.init(). Application should probably call one init or both.
        // Safe to call initDb multiple times as it catches errors.
        await initDb();
        try {
            const rows = await db.selectFrom('projects').selectAll().execute();
            const projects: Project[] = rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description || '',
                color: row.color,
                completed: row.completed === 1,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
            set({ projects });
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    },
}));
