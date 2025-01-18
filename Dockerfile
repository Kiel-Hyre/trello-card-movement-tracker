# Use the official Node.js 20.10.0 Alpine image
FROM node:20.10.0-alpine

# Set working directory
WORKDIR /usr/src/node-app

# Copy only the package.json and package-lock.json first
COPY package.json package-lock.json ./

# Switch to a non-root user for better security
RUN addgroup -S nodegroup && adduser -S node -G nodegroup
USER node

# Install dependencies using npm
RUN npm install --only=production

# Copy the rest of the application code
COPY --chown=node:node . .

# Expose the application port
EXPOSE 3000

# Default command to run the application
CMD ["npm", "run", "dev"]
