#!/bin/bash

# Script pour vérifier le statut du déploiement Render
echo "🔍 Vérification du statut de linkedin-prospector-api.onrender.com..."
echo ""

URLs=(
    "https://linkedin-prospector-api.onrender.com/health"
    "https://linkedin-prospector-api.onrender.com/test"
    "https://linkedin-prospector-api.onrender.com/"
)

for url in "${URLs[@]}"; do
    echo "🌐 Test de : $url"
    
    response=$(curl -s -w "%{http_code}" "$url" -o /tmp/response.txt)
    content=$(cat /tmp/response.txt)
    
    if [[ "$response" == "200" ]]; then
        echo "✅ Succès (200) - Contenu : $content"
    elif [[ "$response" == "404" ]]; then
        echo "❌ Non trouvé (404) - Contenu : $content"
    else
        echo "⚠️  Code HTTP : $response - Contenu : $content"
    fi
    echo ""
done

echo "📊 Résumé :"
echo "- Si tous les tests échouent : Le service n'est pas encore déployé"
echo "- Si /health fonctionne : ✅ Déploiement réussi !"
echo "- Si seulement / échoue : Configuration des routes à vérifier"
echo ""
echo "🔗 Dashboard Render : https://dashboard.render.com"
echo "📋 Vérifiez les logs de déploiement pour plus de détails" 