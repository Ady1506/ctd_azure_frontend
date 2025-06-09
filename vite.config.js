import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // ✅ Required for Docker port mapping
    port: 80,          // Optional: can be customized
    strictPort: true,    // Optional: ensures it fails if port is unavailable
    proxy: {
      '/api': {
        target: 'https://ctd-backend-new-dshdckh0a2e9fxd4.centralindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
