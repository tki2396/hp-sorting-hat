import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  assetsInclude: ['**/*.glb'],  // Handle 3D model files
  json: {
    stringify: true  // Properly handle JSON imports
  }
}) 