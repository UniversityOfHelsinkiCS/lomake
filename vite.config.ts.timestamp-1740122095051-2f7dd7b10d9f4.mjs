// vite.config.ts
import react from "file:///usr/src/app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///usr/src/app/node_modules/vite/dist/node/index.js";
import { sentryVitePlugin } from "file:///usr/src/app/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/usr/src/app";
var root = path.resolve(__vite_injected_original_dirname, "./");
var vite_config_default = defineConfig({
  plugins: [react(), sentryVitePlugin()],
  base: process.env.NODE_ENV === "production" ? "/tilannekuva" : "/",
  resolve: {
    alias: {
      "@": root
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/socket.io": {
        target: "http://localhost:8001",
        changeOrigin: true,
        ws: true
      }
    },
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 8e3
  },
  build: {
    outDir: "build/",
    sourcemap: true
  },
  define: {
    "process.env": process.env,
    global: {}
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvdXNyL3NyYy9hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi91c3Ivc3JjL2FwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vdXNyL3NyYy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBBbGlhc09wdGlvbnMsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSAnQHNlbnRyeS92aXRlLXBsdWdpbidcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5jb25zdCByb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBzZW50cnlWaXRlUGx1Z2luKCldLFxuICBiYXNlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJy90aWxhbm5la3V2YScgOiAnLycsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByb290LFxuICAgIH0gYXMgQWxpYXNPcHRpb25zLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAnL3NvY2tldC5pbyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDAxJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB3czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICB9LFxuICAgIGhvc3Q6IHRydWUsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBwb3J0OiA4MDAwLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2J1aWxkLycsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICAncHJvY2Vzcy5lbnYnOiBwcm9jZXNzLmVudixcbiAgICBnbG9iYWw6IHt9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc04sT0FBTyxXQUFXO0FBQ3hPLFNBQXVCLG9CQUFvQjtBQUMzQyxTQUFTLHdCQUF3QjtBQUNqQyxPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTSxPQUFPLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBRXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUM7QUFBQSxFQUNyQyxNQUFNLFFBQVEsSUFBSSxhQUFhLGVBQWUsaUJBQWlCO0FBQUEsRUFDL0QsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLElBQ1A7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxNQUNBLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLElBQUk7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxRQUFRO0FBQUEsSUFDdkIsUUFBUSxDQUFDO0FBQUEsRUFDWDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
