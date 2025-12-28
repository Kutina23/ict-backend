#!/bin/bash

# Install dependencies for both client and server
cd client && npm install
cd ../server && npm install

# Build the client
cd ../client && npm run build

# Start the server
cd ../server && npm start