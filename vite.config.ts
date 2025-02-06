import { defineConfig } from 'vite'
import sass from 'vite-plugin-sass'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('a-'),
        },
      },
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
})
