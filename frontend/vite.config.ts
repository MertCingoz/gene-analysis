import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,
        port: Number(process.env.PORT),
        watch: { usePolling: true },
        cors: true,
    },
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 1500,
    },
});
