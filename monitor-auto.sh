#!/bin/bash
FRONTEND_URL="https://setterai-web-1753269773.onrender.com"
echo "🔍 Monitoring automatique du déploiement..."
echo "URL surveillée: $FRONTEND_URL"
echo ""

for i in {1..30}; do
    echo "📊 Vérification $i/30 - $(date '+%H:%M:%S')"
    
    RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
    if [[ "$RESPONSE" != "ERROR" && "$RESPONSE" != "Not Found" ]]; then
        echo ""
        echo "🎉 SUCCÈS ! Frontend déployé !"
        echo "🌐 URL: $FRONTEND_URL"
        echo "🔗 Backend: https://setterai-729q.onrender.com"
        echo ""
        echo "✅ Votre plateforme LinkedIn Prospector est maintenant complète !"
        exit 0
    else
        echo "⏳ Déploiement en cours..."
    fi
    
    sleep 60
done

echo "⏰ Timeout après 30 minutes"
echo "💡 Vérifiez manuellement sur Render.com"
