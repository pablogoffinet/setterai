#!/bin/bash
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
echo "🔍 Vérification rapide du frontend..."
RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
if [[ "$RESPONSE" != "ERROR" && "$RESPONSE" != "Not Found" ]]; then
    echo "✅ Frontend déployé avec succès!"
    echo "🌐 URL: $FRONTEND_URL"
else
    echo "⏳ Frontend non encore déployé"
fi
