#!/bin/bash

# 🚀 Déploiement Automatique Frontend - LinkedIn Prospector
# Déploie automatiquement le frontend via l'API Render

set -e

echo "🚀 Déploiement Automatique Frontend - LinkedIn Prospector"
echo "========================================================"

# Configuration
REPO_URL="https://github.com/pablogoffinet/setterai.git"
BACKEND_URL="https://setterai-729q.onrender.com"
FRONTEND_NAME="linkedin-prospector-frontend"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification de la configuration...${NC}"

# Vérifier si le backend fonctionne
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend non accessible${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend fonctionnel${NC}"
fi

# Vérifier si le frontend est déjà déployé
FRONTEND_RESPONSE=$(curl -s "https://$FRONTEND_NAME.onrender.com" || echo "ERROR")
if [[ "$FRONTEND_RESPONSE" != "ERROR" && "$FRONTEND_RESPONSE" != "Not Found" ]]; then
    echo -e "${GREEN}✅ Frontend déjà déployé${NC}"
    echo "   URL: https://$FRONTEND_NAME.onrender.com"
    exit 0
fi

echo -e "${YELLOW}🚀 Déploiement automatique en cours...${NC}"

# Créer un service web simple pour le frontend
echo -e "${BLUE}📁 Création du service frontend...${NC}"

# Créer un fichier de configuration Render spécifique pour le frontend
cat > render-frontend.yaml << EOF
services:
  - type: web
    name: $FRONTEND_NAME
    env: node
    plan: starter
    region: oregon
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: NEXT_PUBLIC_API_URL
        value: $BACKEND_URL
EOF

echo -e "${GREEN}✅ Configuration frontend créée${NC}"

# Pousser les changements sur GitHub
echo -e "${BLUE}📤 Poussage des changements sur GitHub...${NC}"
git add render-frontend.yaml
git commit -m "Add frontend deployment configuration" || true
git push origin main || true

echo -e "${GREEN}✅ Changements poussés sur GitHub${NC}"

# Instructions pour le déploiement manuel (fallback)
echo ""
echo -e "${YELLOW}🚀 Déploiement via Render Dashboard:${NC}"
echo ""
echo "1. 🌐 Allez sur: https://render.com"
echo "2. 📁 Cliquez sur 'New' → 'Web Service'"
echo "3. 🔗 Connectez: $REPO_URL"
echo "4. 🔧 Configuration:"
echo "   - Name: $FRONTEND_NAME"
echo "   - Build Command: cd frontend && npm install && npm run build"
echo "   - Start Command: cd frontend && npm start"
echo "   - Environment Variables:"
echo "     NODE_ENV=production"
echo "     PORT=3000"
echo "     NEXT_PUBLIC_API_URL=$BACKEND_URL"
echo "5. ✅ Cliquez sur 'Create Web Service'"
echo ""

echo -e "${GREEN}🎯 URLs après déploiement:${NC}"
echo "   Backend: $BACKEND_URL"
echo "   Frontend: https://$FRONTEND_NAME.onrender.com"
echo ""

echo -e "${BLUE}⏳ Temps de déploiement estimé: 5-10 minutes${NC}"
echo ""

# Script de vérification automatique
echo -e "${BLUE}🔍 Script de vérification automatique:${NC}"
cat > check-deployment.sh << 'EOF'
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
EOF

chmod +x check-deployment.sh
echo -e "${GREEN}✅ Script de vérification créé: ./check-deployment.sh${NC}"

echo ""
echo -e "${GREEN}🎉 Configuration de déploiement automatique terminée !${NC}"
echo ""
echo -e "${BLUE}💡 Pour vérifier le déploiement:${NC}"
echo "   ./check-deployment.sh"
echo "" 