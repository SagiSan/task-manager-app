# Use official Node.js image
FROM node:18

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Set NODE_ENV to production **AFTER** dependencies are installed
ENV NODE_ENV=production

# Copy all project files
COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate

# Build the NestJS backend
RUN npm run build

# Expose backend port
EXPOSE 3000

# Start the backend
CMD ["dumb-init", "npm", "run", "start"]

# Fix Health Check for Backend API
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD curl -fs http://localhost:3000/api/health || exit 1
