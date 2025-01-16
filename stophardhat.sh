#!/bin/bash

# Stop Next.js app
echo "Stopping Next.js app..."
pkill -f "next dev"

# Stop Hardhat node
echo "Stopping Hardhat node..."
pkill -f "hardhat node"

echo "All services stopped."
