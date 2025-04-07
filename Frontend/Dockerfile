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

# Install serve globally for production deployment
RUN npm install -g serve

# Build and serve the application with environment variables
# This command:
# 1. Builds the application with the provided environment variables
# 2. Serves the built application on port 80
CMD ["sh", "-c", "VITE_BASE_URL=$VITE_BASE_URL VITE_API_URL=$VITE_API_URL npm run build && serve -s dist -l 80"]