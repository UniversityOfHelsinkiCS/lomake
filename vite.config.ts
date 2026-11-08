import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import { AliasOptions, defineConfig } from 'vite'
const root = path.resolve(import.meta.dirname, './');

export default defineConfig({
  plugins: [react(), sentryVitePlugin({})],
  base: process.env.NODE_ENV === 'production' ? '/tilannekuva' : '/',
  resolve: {
    alias: {
      '@': root,
    } as AliasOptions,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
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
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    global: {},
  },
})
