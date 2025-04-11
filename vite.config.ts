import react from '@vitejs/plugin-react'
import { AliasOptions, defineConfig } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from "path";
const root = path.resolve(__dirname, './');

export default defineConfig({
  plugins: [react(), sentryVitePlugin()],
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
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    'process.env': process.env,
    global: {},
  },
})
