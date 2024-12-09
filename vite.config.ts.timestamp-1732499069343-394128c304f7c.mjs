// vite.config.ts
import { defineConfig } from "file:///home/projects/sb1-q4hcmz/node_modules/vite/dist/node/index.js";
import react from "file:///home/projects/sb1-q4hcmz/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "flow-vendor": ["reactflow"],
          "chart-vendor": ["chart.js", "react-chartjs-2"],
          "utils-vendor": ["date-fns", "crypto-js", "localforage"]
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "reactflow", "chart.js", "react-chartjs-2"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0cy9zYjEtcTRoY216XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0cy9zYjEtcTRoY216L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3RzL3NiMS1xNGhjbXovdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgJ2Zsb3ctdmVuZG9yJzogWydyZWFjdGZsb3cnXSxcbiAgICAgICAgICAnY2hhcnQtdmVuZG9yJzogWydjaGFydC5qcycsICdyZWFjdC1jaGFydGpzLTInXSxcbiAgICAgICAgICAndXRpbHMtdmVuZG9yJzogWydkYXRlLWZucycsICdjcnlwdG8tanMnLCAnbG9jYWxmb3JhZ2UnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3RmbG93JywgJ2NoYXJ0LmpzJywgJ3JlYWN0LWNoYXJ0anMtMiddXG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsU0FBUyxvQkFBb0I7QUFDMVIsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixnQkFBZ0IsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUNyQyxlQUFlLENBQUMsV0FBVztBQUFBLFVBQzNCLGdCQUFnQixDQUFDLFlBQVksaUJBQWlCO0FBQUEsVUFDOUMsZ0JBQWdCLENBQUMsWUFBWSxhQUFhLGFBQWE7QUFBQSxRQUN6RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGFBQWEsWUFBWSxpQkFBaUI7QUFBQSxFQUM1RTtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
