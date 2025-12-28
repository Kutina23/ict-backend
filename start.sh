#!/bin/bash

# Install Node.js and npm
apt-get update
apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install dependencies for both client and server
cd client && npm install || { echo "Failed to install client dependencies"; exit 1; }
cd ../server && npm install || { echo "Failed to install server dependencies"; exit 1; }

# Build the client with the correct environment variables
cd ../client && VITE_API_BASE_URL=https://ict-backend-production.up.railway.app npm run build || { echo "Failed to build client"; exit 1; }

# Build the server
cd ../server && npm run build || { echo "Failed to build server"; exit 1; }

# Start the server
cd ../server && npm start || { echo "Failed to start server"; exit 1; }