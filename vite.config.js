import { defineConfig } from 'vite';

// three.js is bundled whole (~830 kB); that is expected for this demo.
export default defineConfig({
  // GitHub Pages はリポジトリ名のサブパスで配信される
  base: process.env.GITHUB_ACTIONS ? '/threejs-glass/' : '/',
  build: { chunkSizeWarningLimit: 1000 },
});
