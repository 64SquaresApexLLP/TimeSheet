import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindConfig from './tailwind.config'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindConfig,
  ],

  // ✅ Output build to backend/client
  build: {
    outDir: path.resolve(__dirname, '../backend/client'),
    emptyOutDir: true,
  },

  // ✅ Support React Router (SPA)
  server: {
    historyApiFallback: true,
    port: 3000,
  }
})
