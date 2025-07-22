#!/bin/bash
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
echo "🔍 Vérification du déploiement..."
for i in {1..30}; do
    RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
    if [[ "$RESPONSE" != "ERROR" && "$RESPONSE" != "Not Found" ]]; then
        echo "✅ Frontend déployé avec succès!"
        echo "🌐 URL: $FRONTEND_URL"
        break
    else
        echo "⏳ Tentative $i/30 - Déploiement en cours..."
        sleep 30
    fi
done
