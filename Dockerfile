FROM mcr.microsoft.com/azurelinux/base/nodejs:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production || npm install --only=production

# Copy source and build files
COPY . .

# Build the application
RUN npm run build

# The application will be served by the built-in Vite preview server
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
