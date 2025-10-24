import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@queries': path.resolve(__dirname, './src/queries'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
    },
  },
  preview: {
    port: 5173,
  },
});
