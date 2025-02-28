# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose backend port
EXPOSE 3000

# Start the NestJS server
CMD ["npm", "run", "start"]
