import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import fs from 'fs';
import path from 'path';

// Get current dir
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataDir = path.resolve(__dirname, '../data');
// Ensure the folder exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const dbPath = path.resolve(dataDir, 'db.sqlite');
const tsvPath = path.resolve(dataDir, 'simple_demo.tsv');

const sqlite = new Database(dbPath);
// drizzle-kit can be used for schema migrations https://orm.drizzle.team/docs/kit-overview
sqlite.exec(` CREATE TABLE IF NOT EXISTS gene_expression(
    gene TEXT NOT NULL,
    exper_rep1 REAL NOT NULL,
    exper_rep2 REAL NOT NULL,
    exper_rep3 REAL NOT NULL,
    control_rep1 REAL NOT NULL,
    control_rep2 REAL NOT NULL,
    control_rep3 REAL NOT NULL
);`);

export const geneExpression = sqliteTable('gene_expression', {
    gene: text('gene').notNull(),
    exper_rep1: real('exper_rep1').notNull(),
    exper_rep2: real('exper_rep2').notNull(),
    exper_rep3: real('exper_rep3').notNull(),
    control_rep1: real('control_rep1').notNull(),
    control_rep2: real('control_rep2').notNull(),
    control_rep3: real('control_rep3').notNull(),
});

export const db = drizzle(sqlite, { schema: { geneExpression } });

// Function to populate DB
export const initializeDb = async () => {
    try {
        const existing = db.select().from(geneExpression).all();
        if (existing.length > 0) {
            console.log('Sample data already populated');
            return;
        }

        if (!fs.existsSync(tsvPath)) {
            console.warn('Sample data does not exist in the system');
            return;
        }

        const content = fs.readFileSync(tsvPath, 'utf-8');
        const rows = content.trim().split('\n').slice(1); // Skip the header line

        const insertValues = rows.map((row) => {
            const [gene = '', _, e1 = '0', e2 = '0', e3 = '0', c1 = '0', c2 = '0', c3 = '0'] = row.split('\t');
            return {
                gene,
                exper_rep1: parseFloat(e1),
                exper_rep2: parseFloat(e2),
                exper_rep3: parseFloat(e3),
                control_rep1: parseFloat(c1),
                control_rep2: parseFloat(c2),
                control_rep3: parseFloat(c3),
            };
        });

        // Insert in batches
        const BATCH_SIZE = 1000;
        for (let i = 0; i < insertValues.length; i += BATCH_SIZE) {
            const batch = insertValues.slice(i, i + BATCH_SIZE);
            db.insert(geneExpression).values(batch).run();
            console.log(`${batch.length} rows inserted`);
        }
        console.log(`Data import complete: Successfully inserted ${insertValues.length} records into the database`);
    } catch (err) {
        console.error('Error initializing DB:', err);
    }
}
