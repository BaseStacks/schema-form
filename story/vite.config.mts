import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

// Use a dynamic import for ESM-only packages
export default defineConfig(async () => {
    return {
        plugins: [
            tailwindcss(),
            react({
                tsDecorators: true,
            }),
        ]
    };
});
