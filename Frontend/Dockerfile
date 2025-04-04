FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# # Build the application
# RUN npm run build

# Build the frontend inside the container using env variables from Kubernetes
# RUN VITE_BASE_URL=$VITE_BASE_URL VITE_API_URL=$VITE_API_URL npm run build

# Expose the port the app runs on
# EXPOSE 5173

# Command to run the application
# CMD ["npm", "run", "dev", "--", "--host"] 
RUN npm install -g serve
# CMD ["serve", "-s", "dist", "-l", "80"]
CMD ["sh", "-c", "VITE_BASE_URL=$VITE_BASE_URL VITE_API_URL=$VITE_API_URL npm run build && serve -s dist -l 80"]