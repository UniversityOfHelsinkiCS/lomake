import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, '.'),
      '@controllers': path.resolve(__dirname, 'server/controllers'),
      '@middleware': path.resolve(__dirname, 'server/middleware'),
      '@models': path.resolve(__dirname, 'server/models'),
      '@util': path.resolve(__dirname, 'server/util'),
      Utilities: path.resolve(__dirname, 'client/util'),
      Components: path.resolve(__dirname, 'client/components'),
      Assets: path.resolve(__dirname, 'client/assets'),
    },
  },
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
  },
})
