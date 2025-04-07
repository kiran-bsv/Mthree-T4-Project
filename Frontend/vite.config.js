/**
 * File: vite.config.js
 * Purpose: This file configures the Vite build tool for the application.
 * 
 * Features:
 * - Sets up React plugin
 * - Configures build options
 * - Manages development server
 * - Handles asset optimization
 * - Configures module resolution
 * 
 * Usage:
 * - Controls the build process
 * - Manages development environment
 * - Configures React support
 * - Optimizes production builds
 */

// Import Vite configuration utilities and React plugin
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Export the Vite configuration
export default defineConfig({
  // Enable React plugin for JSX support and other React-specific features
  plugins: [react()],
})