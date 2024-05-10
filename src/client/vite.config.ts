import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
        '/ws': {
            target: 'ws://localhost:8080',
            ws: true,
            changeOrigin: true,
            secure: false
        }
    }
  }
})
