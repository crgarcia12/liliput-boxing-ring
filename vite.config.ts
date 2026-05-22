import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dev/crgarcia12/liliput-boxing-ring/liliput-task-6e17d389/',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
