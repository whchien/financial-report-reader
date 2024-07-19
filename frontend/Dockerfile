# frontend/Dockerfile
FROM node:14-alpine

LABEL authors="willchien"

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port the React app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]