#!/bin/bash

# Install Node.js and npm
apt-get update
apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install dependencies for both client and server
cd client && npm install
cd ../server && npm install

# Build the client
cd ../client && npm run build

# Start the server
cd ../server && npm start