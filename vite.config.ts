import { defineConfig } from 'vite'

export default defineConfig({
  base: '/dev/crgarcia12/liliput-boxing-ring/liliput-task-63265132/',
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
