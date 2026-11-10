import { defineConfig } from 'vite';

// three.js is bundled whole (~830 kB); that is expected for this demo.
export default defineConfig({
  build: { chunkSizeWarningLimit: 1000 },
});
