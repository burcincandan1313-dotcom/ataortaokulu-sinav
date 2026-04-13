import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/ataortaokulu-sinav/' : './',
    plugins: [viteSingleFile()],
    server: {
      port: 5173,
      strictPort: false,
      host: '127.0.0.1',
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
  };
});