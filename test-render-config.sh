#!/bin/bash

# Script de test de configuration pour Render (sans Docker)
echo "🧪 Test de configuration Render..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Vous devez être dans le répertoire racine du projet"
    exit 1
fi

# Vérifier les fichiers de configuration
echo "📋 Vérification des fichiers de configuration..."

files=("render.yaml" "Dockerfile.render" "default.env" "backend/package.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

# Vérifier la syntaxe du render.yaml
echo "🔍 Vérification de render.yaml..."
if command -v yq &> /dev/null; then
    if yq eval '.' render.yaml > /dev/null 2>&1; then
        echo "✅ render.yaml syntaxe valide"
    else
        echo "❌ render.yaml syntaxe invalide"
        exit 1
    fi
else
    echo "⚠️  yq non installé, skip validation YAML"
fi

# Vérifier les variables d'environnement requises
echo "🔧 Vérification des variables d'environnement..."
required_vars=("NODE_ENV" "PORT" "DATABASE_URL" "REDIS_URL" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if grep -q "$var" render.yaml; then
        echo "✅ $var configuré"
    else
        echo "❌ $var manquant dans render.yaml"
    fi
done

# Vérifier la structure du backend
echo "📦 Vérification de la structure backend..."
backend_files=("backend/src/server.ts" "backend/package.json" "backend/prisma/schema.prisma")
for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

# Vérifier les dépendances
echo "📚 Vérification des dépendances..."
if [ -f "backend/package.json" ]; then
    if grep -q '"start"' backend/package.json; then
        echo "✅ Script start présent"
    else
        echo "❌ Script start manquant dans backend/package.json"
    fi
    
    if grep -q '"build"' backend/package.json; then
        echo "✅ Script build présent"
    else
        echo "❌ Script build manquant dans backend/package.json"
    fi
fi

# Vérifier le health check
echo "🏥 Vérification du health check..."
if grep -q "/health" backend/src/server.ts; then
    echo "✅ Route /health présente"
else
    echo "❌ Route /health manquante dans server.ts"
fi

echo ""
echo "🎉 Configuration validée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Poussez ce code sur GitHub :"
echo "   git add ."
echo "   git commit -m 'Fix Render deployment - simplified configuration'"
echo "   git push origin main"
echo ""
echo "2. Sur Render.com :"
echo "   - Créez un nouveau Web Service"
echo "   - Connectez votre repo GitHub"
echo "   - Configurez les variables d'environnement :"
echo "     * OPENAI_API_KEY"
echo "     * CLAUDE_API_KEY"
echo "     * MISTRAL_API_KEY"
echo "     * UNIPILE_API_KEY"
echo "     * UNIPILE_WEBHOOK_SECRET"
echo ""
echo "3. Déployez !"
echo ""
echo "🔗 URLs après déploiement :"
echo "- API: https://linkedin-prospector-api.onrender.com"
echo "- Health: https://linkedin-prospector-api.onrender.com/health"
echo "- Test: https://linkedin-prospector-api.onrender.com/test" 