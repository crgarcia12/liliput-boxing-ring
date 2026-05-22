import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dev/crgarcia12/liliput-boxing-ring/liliput-task-66f3694e/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
