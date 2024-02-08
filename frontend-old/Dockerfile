# Load the node image
FROM node:20-bookworm-slim

# Set the working directory
WORKDIR /app

COPY package.json yarn.lock .

# Install the dependencies
RUN yarn install

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 5173