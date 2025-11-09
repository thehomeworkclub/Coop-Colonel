#!/bin/bash

# Coop Camera Dashboard - Quick Start Script

echo "🐔 Coop Camera Dashboard - Quick Start"
echo "======================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Node.js dependencies"
        exit 1
    fi
fi

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "🔨 Building React frontend..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build frontend"
        exit 1
    fi
fi

# Check if Python dependencies are installed
echo "🐍 Checking Python dependencies..."
pip3 show Flask > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "📦 Installing Python dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Python dependencies"
        exit 1
    fi
fi

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🚀 Starting Flask Dashboard..."
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📡 Dashboard: http://localhost:5000"
echo ""
echo "⚠️  IMPORTANT: coopcam.py must be running on port 5001!"
echo "   Without it, camera will show: 'Stream unavailable'"
echo ""
echo "   To start coopcam.py (in another terminal):"
echo "   $ cd /path/to/Coop-Colonel"
echo "   $ python3 coopcam.py"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

python3 app.py
