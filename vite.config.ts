import { defineConfig } from 'vite'
import path from 'path'
import sass from 'vite-plugin-sass'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: './',
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [sass()],
  server: {
    watch: {
      usePolling: true,
    },
  },
})
