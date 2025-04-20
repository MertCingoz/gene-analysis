import { app } from './api.ts';
import { initializeDb } from './db.ts';

await initializeDb();
const server = Bun.serve({ fetch: app.fetch, port: Number(process.env.PORT) });
console.log(`Server running at port: ${server.port}`);
