import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy any requests starting with /api to your backend
      '/api': {
        target: 'https://ctd-backend-new-dshdckh0a2e9fxd4.centralindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: true, // set to false if your backend uses self-signed cert
      }
    }
  }
})
