#!/bin/sh

# Script de démarrage pour Render
# Lance tous les microservices en parallèle

echo "🚀 Starting LinkedIn Prospector on Render..."

# Générer le client Prisma
echo "📦 Generating Prisma client..."
cd backend && npx prisma generate && cd ..

# Démarrer les services en parallèle
echo "🔧 Starting microservices..."

# Backend (port 3000)
cd backend && npm start &
BACKEND_PID=$!

# AI Engine (port 3001)
cd ../ai-engine && npm start &
AI_PID=$!

# Queue Service (port 3002)
cd ../queue-service && npm start &
QUEUE_PID=$!

# Frontend (port 3003) - DISABLED for Render deployment
# cd ../frontend && npm start &
# FRONTEND_PID=$!

# Fonction de nettoyage
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $AI_PID $QUEUE_PID 2>/dev/null
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup SIGTERM SIGINT

# Attendre que tous les services soient prêts
echo "⏳ Waiting for services to be ready..."
sleep 15

# Vérifier que les services sont en cours d'exécution
echo "🔍 Checking service health..."

# Vérifier que le backend répond
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Attendre indéfiniment
echo "✅ All services started successfully!"
wait 