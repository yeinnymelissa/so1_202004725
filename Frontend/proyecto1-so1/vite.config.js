import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/so1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()),
        "/usr/src/node_modules/primeicons"]
    },
    host: true
  },
  plugins: [react()],
})
