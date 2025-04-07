# File: Dockerfile
# Purpose: This file defines the Docker container configuration for the frontend application.
# 
# Features:
# - Uses Node.js 18 Alpine as the base image
# - Sets up the application environment
# - Installs dependencies
# - Configures the build process
# - Sets up the production server
# - Handles environment variables
# 
# Usage:
# - Builds the Docker image for the frontend
# - Configures the production environment
# - Sets up the application server
# - Manages environment variables

# Use Node.js 18 Alpine as the base image for a smaller footprint
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# # Build the application
# RUN npm run build

# Build the frontend inside the container using env variables from Kubernetes
# RUN VITE_BASE_URL=$VITE_BASE_URL VITE_API_URL=$VITE_API_URL npm run build

# Expose the port the app runs on
# EXPOSE 5173

# Command to run the application
# CMD ["npm", "run", "dev", "--", "--host"] 
# Install serve globally for production deployment
RUN npm install -g serve

# Build and serve the application with environment variables
# This command:
# 1. Builds the application with the provided environment variables
# 2. Serves the built application on port 80
CMD ["sh", "-c", "VITE_BASE_URL=$VITE_BASE_URL VITE_API_URL=$VITE_API_URL npm run build && serve -s dist -l 80"]