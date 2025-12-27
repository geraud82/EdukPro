import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');

  // URL du backend local (utilisé uniquement en dev via le proxy)
  const localBackendUrl = 'http://localhost:4000';

  return {
    base: '/',
    plugins: [react()],

    build: {
      outDir: 'dist',
    },

    server: {
      host: true, // Écoute sur toutes les interfaces réseau (0.0.0.0)
      port: 3000, // Port utilisé en développement (compatible Dokploy)
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
        '/socket.io': {
          target: localBackendUrl,
          changeOrigin: true,
          ws: true,
        },
      },
    },

    preview: {
      host: true,
      port: 3000, // Même port que le dev pour uniformité (compatible Dokploy)
      allowedHosts: ['educkpro.com', 'www.educkpro.com', 'localhost'],
    },

    define: {
      __DEV__: mode === 'development',
    },
  };
});
