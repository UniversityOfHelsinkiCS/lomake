import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { inStaging } from './config/common'

export default defineConfig({
  plugins: [react()],
  base: inStaging ? '/tilannekuva' : '/',
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 3000,
  },
  build: {
    outDir: 'build/',
    sourcemap: true,
  },
  define: {
    'process.env': process.env,
    global: {},
  },
})
