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
}

export interface DatabaseSchema {
    tasks: TasksTable;
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
            .execute();

        // Attempt to add new columns for existing databases (sqlite doesn't support IF NOT EXISTS for columns in alter table easily)
        // We'll just try and catch the error if they exist.
        try {
            await db.schema.alterTable('tasks').addColumn('accumulated_duration', 'integer', (col) => col.notNull().defaultTo(0)).execute();
        } catch (error) {
            // Check if error is because column exists, if so ignore, else log
            // Console log might be too noisy, so maybe valid to just ignore for now in this context
        }

        try {
            await db.schema.alterTable('tasks').addColumn('last_start_time', 'integer').execute();
        } catch (error) {
            // Ignore if column exists
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
};
