import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/dev/crgarcia12/liliput-boxing-ring/liliput-task-18498454/'
    : '/',
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8080')
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8080')
  }
})
