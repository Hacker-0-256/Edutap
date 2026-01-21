#!/bin/bash

# Script to add missing required environment variables to existing .env file

ENV_FILE=".env"

echo "🔍 Checking and adding missing required variables to .env..."

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Add MONGODB_URI if missing
if ! grep -q "^MONGODB_URI=" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# Database Configuration" >> "$ENV_FILE"
    echo "MONGODB_URI=mongodb://localhost:27017/school-attendance" >> "$ENV_FILE"
    echo "✅ Added MONGODB_URI"
else
    echo "✓ MONGODB_URI already exists"
fi

# Add JWT_SECRET if missing
if ! grep -q "^JWT_SECRET=" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# JWT Authentication (REQUIRED)" >> "$ENV_FILE"
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    echo "JWT_SECRET=$JWT_SECRET" >> "$ENV_FILE"
    echo "✅ Added JWT_SECRET (auto-generated)"
else
    echo "✓ JWT_SECRET already exists"
fi

# Add PORT if missing (optional, but good to have)
if ! grep -q "^PORT=" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# Server Configuration" >> "$ENV_FILE"
    echo "PORT=3000" >> "$ENV_FILE"
    echo "✅ Added PORT"
else
    echo "✓ PORT already exists"
fi

echo ""
echo "✅ Done! Your .env file has been updated."
echo ""
echo "📝 Please review and update:"
echo "   - MONGODB_URI: Set to your MongoDB connection string"
echo "   - JWT_SECRET: Already generated (keep it secret!)"
echo "   - PORT: Set to your preferred port (default: 3000)"









