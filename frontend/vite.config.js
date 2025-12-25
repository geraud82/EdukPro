import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',          // ✅ OBLIGATOIRE EN PROD
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
