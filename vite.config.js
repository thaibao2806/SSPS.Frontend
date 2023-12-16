import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  "@fullcalendar/react/dist/vdom",],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
