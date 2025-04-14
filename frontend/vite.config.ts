import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // эта настройка позволяет заходить напрямую на /login и другие маршруты
    fs: {
      allow: ['.']
    }
  }
})
