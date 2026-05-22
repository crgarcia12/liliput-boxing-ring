# Use Microsoft Azure Linux base image to avoid Docker Hub rate limits
FROM mcr.microsoft.com/azurelinux/base/nodejs:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application with the Liliput base path
RUN npm run build

# Production stage
FROM mcr.microsoft.com/azurelinux/base/nodejs:20

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist /app/dist

# The Liliput gateway sets PORT environment variable
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Serve the static files on all interfaces (0.0.0.0)
# The -l flag binds to the specified port
# The -s flag serves SPAs (single page apps) properly
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT}"]
