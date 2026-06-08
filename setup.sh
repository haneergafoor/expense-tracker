#!/bin/bash
# Expense Tracker Setup Script

echo "╔════════════════════════════════════════╗"
echo "║   Personal Expense Tracker - Setup    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✓ Python 3 is available"
    
    # Check if Flask is installed
    if python3 -c "import flask" 2>/dev/null; then
        echo "✓ Flask is installed"
        echo ""
        echo "🚀 Starting Flask server..."
        python3 server.py
    else
        echo "⚠ Flask not installed. Running with Python HTTP server..."
        echo ""
        echo "📍 Visit: http://localhost:8000"
        python3 -m http.server 8000
    fi
else
    echo "⚠ Python not found. Please install Python 3."
    echo "   Falling back to direct file access..."
    echo ""
    echo "📝 To use the app:"
    echo "   1. Open 'index.html' in your web browser"
    echo "   2. Or use any HTTP server to serve the files"
fi
