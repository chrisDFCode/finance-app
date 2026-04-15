#!/bin/bash

# Quick Setup Script for Finance App
# This script automates the initial setup process

echo "🚀 Finance App - Quick Setup"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from template"
    echo ""
    echo "⚠️  Please edit .env.local and add your Supabase credentials:"
    echo "   VITE_SUPABASE_URL=your_url_here"
    echo "   VITE_SUPABASE_ANON_KEY=your_key_here"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
