#!/bin/bash
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
echo "🔍 Vérification du frontend..."
for i in {1..20}; do
    RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
    if [[ "$RESPONSE" != "ERROR" && "$RESPONSE" != "Not Found" ]]; then
        echo "✅ Frontend déployé avec succès!"
        echo "🌐 URL: $FRONTEND_URL"
        break
    else
        echo "⏳ Tentative $i/20 - Déploiement en cours..."
        sleep 30
    fi
done
