import { defineConfig } from 'vite';
import path from 'path';
import sass from 'vite-plugin-sass';

export default defineConfig({
  root: './',
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
  plugins: [sass()],
});
