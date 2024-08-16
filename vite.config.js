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
  resolve: {
    extension: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
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
  build: {
    outDir: 'build/',
    sourcemap: true,
  },
  define: {
    'process.env': process.env,
  },
})
