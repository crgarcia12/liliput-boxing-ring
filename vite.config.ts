import { defineConfig } from 'vite';

const base = process.env.BASE_PATH || '/dev/crgarcia12/liliput-boxing-ring/liliput-task-68c092ff';

export default defineConfig({
  base,
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
});
