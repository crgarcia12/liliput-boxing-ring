# Use Microsoft Container Registry base image to avoid Docker Hub rate limits
FROM mcr.microsoft.com/azurelinux/base/nodejs:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application with the correct base path
RUN npm run build

# Production stage
FROM mcr.microsoft.com/azurelinux/base/nodejs:20

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist /app/dist

# Expose the port
EXPOSE 8080

# Start the server
# serve will listen on 0.0.0.0 by default
CMD ["serve", "-s", "dist", "-l", "8080"]
