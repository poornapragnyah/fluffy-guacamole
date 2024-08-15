# Use a base image with Node.js installed
FROM node:21.7.3

# Create the server directory if it doesn't exist
RUN mkdir -p /app/server
# Set the working directory for the server
WORKDIR /app/server

# Copy the server package.json and package-lock.json files
COPY ./package*.json ./

# Install server dependencies
RUN npm install

# Set the working directory back to the root
WORKDIR /app

# Copy the client and server code
COPY . ./server

# Expose any necessary ports
EXPOSE 9000

WORKDIR /app/server
# Start the application
CMD ["npm", "run", "dev"]