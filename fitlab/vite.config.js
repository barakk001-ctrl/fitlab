import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Resolve extensions explicitly so Rollup picks up .jsx from index.html
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4173', 10),
    // Railway needs the deployed domain whitelisted for `vite preview`
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Explicit entry — avoids ambiguity around the script tag in index.html
      input: path.resolve(__dirname, 'index.html'),
    },
  },
});
