#!/bin/sh

# Script de démarrage simplifié pour Render
# Lance uniquement le backend API

echo "🚀 Starting LinkedIn Prospector API on Render..."

# Ce script n'est plus nécessaire avec Docker, mais gardé pour compatibilité
# Le Dockerfile.render gère maintenant le démarrage

# Si nous ne sommes pas dans un conteneur Docker, démarrer le backend
if [ ! -f /.dockerenv ]; then
    echo "📦 Generating Prisma client..."
    cd backend && npx prisma generate
    
    echo "🔧 Starting backend service..."
    npm start
else
    echo "🐳 Running in Docker container, using Docker CMD"
fi 