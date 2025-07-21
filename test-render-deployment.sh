#!/bin/bash

# Script de test pour le déploiement Render
echo "🧪 Test de la configuration de déploiement Render..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    error "Vous devez être dans le répertoire racine du projet"
    exit 1
fi

success "Répertoire racine détecté"

# Vérifier les fichiers requis
echo -e "\n🔍 Vérification des fichiers requis..."

required_files=("render.yaml" "Dockerfile.render" "default.env" "backend/package.json")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "Fichier trouvé: $file"
    else
        error "Fichier manquant: $file"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    error "Fichiers manquants détectés. Arrêt du test."
    exit 1
fi

# Vérifier la configuration render.yaml
echo -e "\n🔧 Vérification de render.yaml..."

if grep -q "dockerfilePath: ./Dockerfile.render" render.yaml; then
    success "Configuration Docker correcte dans render.yaml"
else
    error "dockerfilePath manquant ou incorrect dans render.yaml"
    exit 1
fi

if grep -q "healthCheckPath: /health" render.yaml; then
    success "Health check configuré"
else
    warning "Health check non configuré"
fi

# Vérifier le Dockerfile.render
echo -e "\n🐳 Vérification de Dockerfile.render..."

if grep -q "FROM node:18-alpine AS builder" Dockerfile.render; then
    success "Multi-stage build configuré"
else
    error "Multi-stage build non configuré"
    exit 1
fi

if grep -q "HEALTHCHECK" Dockerfile.render; then
    success "Health check Docker configuré"
else
    warning "Health check Docker non configuré"
fi

# Vérifier les variables d'environnement critiques
echo -e "\n🔑 Vérification des variables d'environnement..."

critical_vars=("UNIPILE_API_KEY" "UNIPILE_API_URL" "OPENAI_API_KEY")
for var in "${critical_vars[@]}"; do
    if grep -q "^${var}=" default.env; then
        success "Variable trouvée: $var"
    else
        error "Variable manquante: $var"
    fi
done

# Test de construction Docker local
echo -e "\n🔨 Test de construction Docker..."

if docker build -f Dockerfile.render -t linkedin-prospector-test . > build.log 2>&1; then
    success "Construction Docker réussie"
    rm -f build.log
else
    error "Échec de la construction Docker"
    echo "Logs d'erreur:"
    cat build.log
    rm -f build.log
    exit 1
fi

# Test de démarrage du conteneur
echo -e "\n🚀 Test de démarrage du conteneur..."

# Arrêter et supprimer le conteneur s'il existe
docker stop linkedin-prospector-test-run 2>/dev/null || true
docker rm linkedin-prospector-test-run 2>/dev/null || true

# Démarrer le conteneur
if docker run -d --name linkedin-prospector-test-run -p 3000:3000 \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -e DATABASE_URL=postgresql://test:test@localhost:5432/test \
    -e REDIS_URL=redis://localhost:6379 \
    -e JWT_SECRET=test-secret-for-testing-only \
    linkedin-prospector-test > /dev/null 2>&1; then
    success "Conteneur démarré"
else
    error "Échec du démarrage du conteneur"
    exit 1
fi

# Attendre que le service soit prêt
echo "⏳ Attente du démarrage du service..."
sleep 10

# Test du health check
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    success "Health check réussi"
else
    error "Health check échoué"
    docker logs linkedin-prospector-test-run
    docker stop linkedin-prospector-test-run
    docker rm linkedin-prospector-test-run
    exit 1
fi

# Test de l'endpoint de test
if curl -f http://localhost:3000/test > /dev/null 2>&1; then
    success "Endpoint /test accessible"
else
    warning "Endpoint /test non accessible"
fi

# Nettoyage
docker stop linkedin-prospector-test-run > /dev/null 2>&1
docker rm linkedin-prospector-test-run > /dev/null 2>&1
docker rmi linkedin-prospector-test > /dev/null 2>&1

echo -e "\n🎉 Tous les tests sont passés !"
echo -e "\n📋 Étapes suivantes pour le déploiement sur Render:"
echo "1. git add ."
echo "2. git commit -m 'Fix Render deployment configuration'"
echo "3. git push origin main"
echo "4. Créer un nouveau Web Service sur Render"
echo "5. Connecter votre repository GitHub"
echo "6. Render détectera automatiquement render.yaml"
echo "7. Configurer les variables d'environnement dans Render:"
echo "   - OPENAI_API_KEY (obligatoire)"
echo "   - UNIPILE_API_KEY (obligatoire)"
echo "   - UNIPILE_WEBHOOK_SECRET (obligatoire)"
echo "   - CLAUDE_API_KEY (optionnel)"
echo "   - MISTRAL_API_KEY (optionnel)"
echo "8. Déployer !"

echo -e "\n🔗 URLs après déploiement:"
echo "- API: https://linkedin-prospector-api.onrender.com"
echo "- Health: https://linkedin-prospector-api.onrender.com/health"
echo "- Test: https://linkedin-prospector-api.onrender.com/test" 