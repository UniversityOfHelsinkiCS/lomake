import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { inStaging } from './config/common'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [react(), sentryVitePlugin()],
  base: inStaging ? '/tilannekuva' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        ws: true,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 8000,
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
