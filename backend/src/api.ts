import { asc, eq, like, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

import { db, geneExpression } from './db.ts';

export const app = new Hono();
app.use('*', cors());

// Health check
app.get('/api/health-check', (c) => c.text('OK'));

// Data Retrieval
app.post('/api/fetch', async (c) => {
    const body = await c.req.json();
    const schema = z.object({ geneIDs: z.array(z.string()) });
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: 'Invalid input' }, 400);
    }

    const data = db
        .select()
        .from(geneExpression)
        .where(inArray(geneExpression.gene, parsed.data.geneIDs))
        .all();

    return c.json(data);
});

// Data Analysis
app.post('/api/analyze', async (c) => {
    const body = await c.req.json();
    const schema = z.object({ geneID: z.string() });
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: 'Invalid input' }, 400);
    }

    const { geneID } = parsed.data;
    const result = db
        .select()
        .from(geneExpression)
        .where(eq(geneExpression.gene, geneID))
        .get();

    if (!result) {
        return c.json({ error: 'Gene not found' }, 404);
    }
    const values = [result.exper_rep1, result.exper_rep2, result.exper_rep3];
    const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(values.length / 2)];
    const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
    return c.json({ geneID, mean, median, variance });
});

// Search by gene
app.get('/api/search', async (c) => {
    const geneID = c.req.query('geneID');
    if (!geneID) {
        return c.json({ error: 'geneID query param required' }, 400);
    }

    const results = db
        .select({ gene: geneExpression.gene })
        .from(geneExpression)
        .where(like(geneExpression.gene, `%${geneID}%`))
        .orderBy(asc(geneExpression.gene))
        .all();

    if (results.length === 0) {
        return c.json({ error: 'Gene not found' }, 404);
    }

    return c.json(results.map((r) => r.gene));
});
