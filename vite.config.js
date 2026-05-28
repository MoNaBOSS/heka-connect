import { defineConfig } from 'vite'
export default defineConfig({
  base: '/heka-connect/',
  build: {
    outDir: 'dist',
    target: 'es2020',
    rollupOptions: {
      input: 'index.html'
    }
  }
})
