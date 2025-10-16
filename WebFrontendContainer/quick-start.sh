#!/bin/bash

# Quick Start Script for WebFrontendContainer
# This script automates the setup and verification process

set -e

echo "========================================="
echo "  Notes App Frontend - Quick Start"
echo "========================================="
echo ""

# Step 1: Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✓ Dependencies installed"
  echo ""
else
  echo "✓ Dependencies already installed"
  echo ""
fi

# Step 2: Check if .env exists
if [ ! -f ".env" ]; then
  echo "⚙️  Creating .env file from template..."
  cp .env.example .env
  echo "✓ .env file created"
  echo ""
  echo "⚠️  Default backend URL set to: http://localhost:3001/api/v1"
  echo "   If your backend runs elsewhere, edit .env file"
  echo ""
else
  echo "✓ .env file exists"
  echo ""
fi

# Step 3: Verify backend connectivity
echo "🔍 Verifying backend connectivity..."
if node verify-backend.js 2>/dev/null; then
  echo ""
  echo "========================================="
  echo "✅ Setup complete! Starting dev server..."
  echo "========================================="
  echo ""
  echo "Frontend will run at: http://localhost:3000"
  echo ""
  echo "Next steps:"
  echo "1. Open http://localhost:3000 in your browser"
  echo "2. Click 'Register' to create an account"
  echo "3. Login and start creating notes!"
  echo ""
  echo "Press Ctrl+C to stop the server"
  echo ""
  
  # Start the dev server
  npm start
else
  echo ""
  echo "========================================="
  echo "⚠️  Backend connectivity check failed"
  echo "========================================="
  echo ""
  echo "The backend API is not responding at the expected URL."
  echo ""
  echo "Please ensure:"
  echo "1. Backend is running (check BackendAPIContainer)"
  echo "2. Backend is accessible at: http://localhost:3001"
  echo "3. Backend health endpoint responds: curl http://localhost:3001/health"
  echo ""
  echo "After fixing, you can:"
  echo "- Run this script again: ./quick-start.sh"
  echo "- Or manually verify: npm run verify"
  echo "- Or just start anyway: npm start"
  echo ""
  read -p "Start frontend anyway? (y/N) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm start
  else
    echo "Exiting. Fix backend connectivity and try again."
    exit 1
  fi
fi
