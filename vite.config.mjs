import react from '@vitejs/plugin-react'
import vitePluginSocketIO from 'vite-plugin-socket-io'
import { defineConfig } from 'vite'
import { inStaging } from './config/common'

export default defineConfig({
  plugins: [react(), vitePluginSocketIO()],
  base: inStaging ? '/tilannekuva' : '/',
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
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
