// Import Vite configuration utilities and React plugin
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Export the Vite configuration
export default defineConfig({
  // Enable React plugin for JSX support and other React-specific features
  plugins: [react()],
})