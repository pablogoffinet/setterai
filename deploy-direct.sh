#!/bin/bash
echo "🚀 Déploiement Direct en cours..."

# Ouvrir Render automatiquement
if command -v open >/dev/null 2>&1; then
    echo "🌐 Ouverture de Render..."
    open "https://render.com/create?type=web"
elif command -v xdg-open >/dev/null 2>&1; then
    echo "🌐 Ouverture de Render..."
    xdg-open "https://render.com/create?type=web"
else
    echo "🌐 Allez sur: https://render.com/create?type=web"
fi

echo ""
echo "📋 Configuration à utiliser:"
echo "Repository: https://github.com/pablogoffinet/setterai.git"
echo "Build Command: cd frontend && npm install && npm run build"
echo "Start Command: cd frontend && npm start"
echo ""
echo "🔑 Variables d'environnement:"
echo "NODE_ENV=production"
echo "PORT=3000"
echo "NEXT_PUBLIC_API_URL=https://setterai-729q.onrender.com"
