import { serve } from '@hono/node-server';

import { app } from './api.js';
import { initializeDb } from './db.js';

await initializeDb();
serve({ fetch: app.fetch, port: process.env.PORT }, (info) => {
    console.log(`Server running at port: ${info.port}`);
});
