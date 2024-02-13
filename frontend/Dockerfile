# Load the node image
FROM node:20-bookworm-slim

# Set the working directory
WORKDIR /app

# Copy the rest of the files
COPY . .

# Install the dependencies
RUN yarn install

# Expose the port
EXPOSE 5173