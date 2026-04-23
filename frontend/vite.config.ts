import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: {
      'ignored-directive': 'silent',
    },
  },
  logLevel: 'info',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-toastify'],
          'vendor-radix': ['@radix-ui/themes'],
        },
      },
      onwarn(warning, warn) {
        // ignore certain harmless warnings
        if (
          warning.message.includes('Module level directives') ||
          warning.message.includes('"use client"') ||
          warning.message.includes('"was ignored"')
        ) {
          return;
        }

        // FAIL build on unresolved imports
        if (warning.code === 'UNRESOLVED_IMPORT') {
          throw new Error(`Build failed due to unresolved import:\n${warning.message}`);
        }

        // FAIL build on missing exports
        if (warning.code === 'PLUGIN_WARNING' && /is not exported/.test(warning.message)) {
          throw new Error(`Build failed due to missing export:\n${warning.message}`);
        }

        // other warnings: log normally
        warn(warning);
      },
    },
  },
});