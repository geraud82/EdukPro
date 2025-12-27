import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // For the vite dev server proxy, ALWAYS use localhost backend
  // This prevents the recursive /api/api/api... issue when VITE_API_URL 
  // points to production and nginx doesn't have /api location configured
  const localBackendUrl = 'http://localhost:4000'
  
  return {
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173,
      host: true,    // Listen on all network interfaces (0.0.0.0)
      // Proxy configuration for local development ONLY
      // Always proxy to local backend - never to production URL
      proxy: {
        '/api': {
          target: localBackendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: localBackendUrl,
          changeOrigin: true,
          secure: false,
        },
        // WebSocket proxy for Socket.IO
        '/socket.io': {
          target: localBackendUrl,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
      allowedHosts: ['educkpro.com', 'www.educkpro.com', 'localhost'],
    },
    // Define environment variables available at build time
    define: {
      // Make sure the app knows about the environment
      __DEV__: mode === 'development',
    },
  }
})
