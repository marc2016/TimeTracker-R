import Database from '@tauri-apps/plugin-sql';
import { Kysely, Generated } from 'kysely';
import { TauriSqliteDialect } from 'kysely-dialect-tauri';

export interface TasksTable {
    id: Generated<string>;
    title: string;
    description: string;
    completed: number; // SQLite uses 0/1 for booleans
    created_at: number;
    updated_at: number;
    accumulated_duration: number;
    last_start_time?: number | null;
    project_id?: string | null;
}

export interface ProjectsTable {
    id: Generated<string>;
    title: string;
    description: string;
    color: string;
    completed: number;
    created_at: number;
    updated_at: number;
}

export interface DatabaseSchema {
    tasks: TasksTable;
    projects: ProjectsTable;
}

export const db = new Kysely<DatabaseSchema>({
    dialect: new TauriSqliteDialect({
        database: async () => await Database.load('sqlite:timetracker.db'),
    }),
});

// Migration function to ensure tables exist
export const initDb = async () => {
    try {
        await db.schema
            .createTable('tasks')
            .ifNotExists()
            .addColumn('id', 'text', (col) => col.primaryKey()) // UUIDs are text
            .addColumn('title', 'text', (col) => col.notNull())
            .addColumn('description', 'text')
            .addColumn('completed', 'integer', (col) => col.notNull().defaultTo(0))
            .addColumn('created_at', 'integer', (col) => col.notNull())
            .addColumn('updated_at', 'integer', (col) => col.notNull())
            .addColumn('accumulated_duration', 'integer', (col) => col.notNull().defaultTo(0))
            .addColumn('last_start_time', 'integer')
            .addColumn('project_id', 'text')
            .execute();

        // Projects Table
        await db.schema
            .createTable('projects')
            .ifNotExists()
            .addColumn('id', 'text', (col) => col.primaryKey())
            .addColumn('title', 'text', (col) => col.notNull())
            .addColumn('description', 'text')
            .addColumn('color', 'text', (col) => col.notNull())
            .addColumn('completed', 'integer', (col) => col.notNull().defaultTo(0))
            .addColumn('created_at', 'integer', (col) => col.notNull())
            .addColumn('updated_at', 'integer', (col) => col.notNull())
            .execute();

        // Alter tasks for existing DBs
        try {
            await db.schema.alterTable('tasks').addColumn('accumulated_duration', 'integer', (col) => col.notNull().defaultTo(0)).execute();
        } catch (error) { /* ignore */ }

        try {
            await db.schema.alterTable('tasks').addColumn('last_start_time', 'integer').execute();
        } catch (error) { /* ignore */ }

        try {
            await db.schema.alterTable('tasks').addColumn('project_id', 'text').execute();
        } catch (error) { /* ignore */ }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
};
