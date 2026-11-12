import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
const API_URL_POR_DEFECTO = 'https://yanethm-cromoverso-api.fly.dev/api/v1';

export default defineConfig(({ mode }) => {
    const entorno = loadEnv(mode, process.cwd(), 'VITE_');
    const apiUrl = process.env.VITE_API_URL || entorno.VITE_API_URL || API_URL_POR_DEFECTO;

    return {
        plugins: [react()],
        define: {
            'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
        },
    };
});
