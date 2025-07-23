#!/bin/bash
FRONTEND_URL="https://setterai-ui.onrender.com"
echo "🔍 Test d'urgence du frontend..."
echo "URL testée: $FRONTEND_URL"
echo ""

RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
if [[ "$RESPONSE" != "ERROR" && "$RESPONSE" != "Not Found" ]]; then
    echo "🎉 SUCCÈS ! Frontend accessible !"
    echo "🌐 URL: $FRONTEND_URL"
else
    echo "❌ Frontend non accessible"
    echo "Response: $RESPONSE"
fi
