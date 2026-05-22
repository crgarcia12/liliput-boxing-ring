import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dev/crgarcia12/liliput-boxing-ring/liliput-task-159123ca/',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
