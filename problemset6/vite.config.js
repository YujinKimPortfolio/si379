import { defineConfig } from 'vite';

export default defineConfig({
  // Path to your project within the repository
  base: '/si379/ps_6/',
  
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: true,
    
    // Optimize output
    minify: 'terser',
    
    // Configure output directory (default is 'dist')
    outDir: 'dist',
    
    // Configure asset handling
    assetsDir: 'assets',
    
    rollupOptions: {
      output: {
        // Chunk your CSS separately
        manualChunks: undefined,
      },
    },
  },
  
  // Configure the development server
  server: {
    port: 3000,
    open: true,
  },
});