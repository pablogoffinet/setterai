#!/bin/bash

# Script de déploiement simplifié pour Render
echo "🚀 Déploiement LinkedIn Prospector sur Render..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Vous devez être dans le répertoire racine du projet"
    exit 1
fi

# Vérifier que le fichier render.yaml existe
if [ ! -f "render.yaml" ]; then
    echo "❌ Erreur: render.yaml manquant"
    exit 1
fi

# Vérifier que le fichier default.env existe
if [ ! -f "default.env" ]; then
    echo "❌ Erreur: default.env manquant"
    exit 1
fi

echo "✅ Configuration vérifiée"

# Construire l'image Docker localement pour tester
echo "🔨 Construction de l'image Docker..."
docker build -f Dockerfile.render -t linkedin-prospector-render .

if [ $? -eq 0 ]; then
    echo "✅ Image Docker construite avec succès"
else
    echo "❌ Erreur lors de la construction de l'image Docker"
    exit 1
fi

# Tester l'image localement
echo "🧪 Test de l'image Docker..."
docker run -d --name test-render -p 3000:3000 \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -e DATABASE_URL=postgresql://test:test@localhost:5432/test \
    -e REDIS_URL=redis://localhost:6379 \
    -e JWT_SECRET=test-secret \
    linkedin-prospector-render

# Attendre que le service démarre
sleep 10

# Tester le health check
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check réussi"
    docker stop test-render
    docker rm test-render
else
    echo "❌ Health check échoué"
    docker logs test-render
    docker stop test-render
    docker rm test-render
    exit 1
fi

echo "🎉 Prêt pour le déploiement sur Render !"
echo ""
echo "📋 Étapes suivantes :"
echo "1. Poussez ce code sur GitHub : git push origin main"
echo "2. Connectez votre repo à Render"
echo "3. Configurez les variables d'environnement dans Render :"
echo "   - OPENAI_API_KEY"
echo "   - CLAUDE_API_KEY" 
echo "   - MISTRAL_API_KEY"
echo "   - UNIPILE_API_KEY"
echo "   - UNIPILE_WEBHOOK_SECRET"
echo "4. Déployez !"
echo ""
echo "🔗 URLs après déploiement :"
echo "- API: https://linkedin-prospector-api.onrender.com"
echo "- Health: https://linkedin-prospector-api.onrender.com/health"
echo "- Docs: https://linkedin-prospector-api.onrender.com/api/docs" 