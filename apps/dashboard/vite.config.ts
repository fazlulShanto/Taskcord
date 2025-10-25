import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
    }),
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    open: true,
    host: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@queries': resolve(__dirname, './src/queries'),
      '@stores': resolve(__dirname, './src/stores'),
      '@ui': resolve(__dirname, './src/components/ui'),
    },
  },
});
