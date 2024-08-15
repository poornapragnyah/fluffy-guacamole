# Use a base image with Node.js installed
FROM node:21.7.3

RUN mkdir -p /app/client
# Set the working directory for the client
WORKDIR /app/client

# Copy the client package.json and package-lock.json files
COPY ./package*.json ./

# Install client dependencies
RUN npm install

# Set the working directory back to the root
WORKDIR /app

# Copy the client and server code
COPY . ./client

EXPOSE 5173

WORKDIR /app/client
# Start the application
CMD ["npm", "run", "dev"]