import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import path from 'path'

// Simple configuration that works with Internet Computer
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 12000,
    allowedHosts: true,
    cors: true
  },
  build: {
    outDir: 'dist'
  },
  esbuild: {
    jsx: 'automatic'
  },
  define: {
    // Set up global variables
    global: 'globalThis',
    // Allow environment variables to be accessible
    // Note: Vite automatically loads variables from .env prefixed with VITE_
  },
  resolve: {
    alias: {
      // Essential aliases for Internet Computer
      'node-fetch': 'isomorphic-fetch',
      // Use absolute path for process to avoid warning
      process: path.resolve(__dirname, 'node_modules/process/browser.js'),
      buffer: 'buffer',
      events: 'events',
      stream: 'stream-browserify',
      util: 'util'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    // Only include essential packages
    include: [
      'buffer',
      '@dfinity/agent',
      '@dfinity/principal',
      '@dfinity/auth-client',
      '@dfinity/identity'
    ]
  }
})
