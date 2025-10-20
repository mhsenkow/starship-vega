import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Conditionally import VitePWA to handle missing dependency gracefully
function getPlugins() {
  const plugins: any[] = [react()];
  
  try {
    const { VitePWA } = require('vite-plugin-pwa');
    plugins.push(VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Starship Vega',
        short_name: 'Starship Vega',
        description: 'Interactive data visualization gallery and editor',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }));
  } catch (error) {
    console.warn('vite-plugin-pwa not available, PWA features disabled');
  }
  
  return plugins;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: getPlugins(),
  esbuild: {
    // Force esbuild version compatibility
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  preview: {
    port: 4173,
    host: true
  },
  server: {
    port: 5173,
    host: true
  },
  base: '/', // Default base path for web deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'vega-vendor': ['vega', 'vega-lite', 'vega-embed'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'editor-vendor': ['@monaco-editor/react'],
          'utils-vendor': ['papaparse', 'tesseract.js', 'uuid']
        }
      }
    }
  }
})