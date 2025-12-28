import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://ict-backend-sandy.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://ict-backend-sandy.vercel.app',
        changeOrigin: true,
      },
      '/default-avatar.svg': {
        target: 'https://ict-backend-sandy.vercel.app',
        changeOrigin: true,
      },
    },
  },
})