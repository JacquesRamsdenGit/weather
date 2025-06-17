import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/weather/',
  build: {
    outDir: 'docs',
  },
  server: {
    port: 3000,
  },
});
