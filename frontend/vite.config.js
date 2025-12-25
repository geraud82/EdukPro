import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Get API URL from environment or use default
  const apiUrl = env.VITE_API_URL || 'http://localhost:4000'
  
  return {
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173,
      // Proxy configuration for local development
      // This helps avoid CORS issues during development
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          // Uncomment below to rewrite the path if needed
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
        '/uploads': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        // WebSocket proxy for Socket.IO
        '/socket.io': {
          target: apiUrl,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      port: 4173,
    },
    // Define environment variables available at build time
    define: {
      // Make sure the app knows about the environment
      __DEV__: mode === 'development',
    },
  }
})
