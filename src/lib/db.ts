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
            .execute();

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
};
