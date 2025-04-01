import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443, // Ensures Hot Module Reloading (HMR) works with Ngrok
    },
    allowedHosts: ['.ngrok-free.app'], // Allow all Ngrok subdomains
  },
});
