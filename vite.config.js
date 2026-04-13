import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  server: {
    port: 5173,
    strictPort: false,
  },
  publicDir: 'public',
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    rollupOptions: {
      input: 'index.html'
    },
  },
});