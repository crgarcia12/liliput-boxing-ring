# Use Microsoft Container Registry Node.js base image (avoiding Docker Hub rate limits)
FROM mcr.microsoft.com/azurelinux/base/nodejs:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the application with the Liliput base path
ENV BASE_PATH=/dev/crgarcia12/liliput-boxing-ring/liliput-task-68c092ff
RUN npm run build

# Expose port (will be set by Liliput via PORT env var)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
