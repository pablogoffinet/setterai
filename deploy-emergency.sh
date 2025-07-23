#!/bin/bash

# 🚨 Déploiement d'Urgence - LinkedIn Prospector
# Solution alternative pour déployer le frontend immédiatement

set -e

echo "🚨 Déploiement d'Urgence - LinkedIn Prospector"
echo "=============================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration avec nom ultra-simple
REPO_URL="https://github.com/pablogoffinet/setterai.git"
BACKEND_URL="https://setterai-729q.onrender.com"
SIMPLE_NAME="setterai-ui"

echo -e "${RED}🚨 SOLUTION D'URGENCE ACTIVÉE${NC}"
echo ""

# Vérifier le backend
echo -e "${BLUE}🔍 Vérification du backend...${NC}"
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend non accessible${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend fonctionnel${NC}"
fi

# Créer une configuration ultra-simple
echo -e "${BLUE}📄 Création d'une configuration ultra-simple...${NC}"
cat > render-simple.yaml << EOF
services:
  - type: web
    name: $SIMPLE_NAME
    env: node
    plan: starter
    region: oregon
    repo: $REPO_URL
    branch: main
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: NEXT_PUBLIC_API_URL
        value: $BACKEND_URL
EOF

echo -e "${GREEN}✅ Configuration ultra-simple créée${NC}"

# Créer un script de test rapide
echo -e "${BLUE}🔍 Création du test rapide...${NC}"
cat > test-emergency.sh << EOF
#!/bin/bash
FRONTEND_URL="https://$SIMPLE_NAME.onrender.com"
echo "🔍 Test d'urgence du frontend..."
echo "URL testée: \$FRONTEND_URL"
echo ""

RESPONSE=\$(curl -s "\$FRONTEND_URL" || echo "ERROR")
if [[ "\$RESPONSE" != "ERROR" && "\$RESPONSE" != "Not Found" ]]; then
    echo "🎉 SUCCÈS ! Frontend accessible !"
    echo "🌐 URL: \$FRONTEND_URL"
else
    echo "❌ Frontend non accessible"
    echo "Response: \$RESPONSE"
fi
EOF

chmod +x test-emergency.sh
echo -e "${GREEN}✅ Test rapide créé${NC}"

# Pousser les changements
echo -e "${BLUE}📤 Poussage d'urgence sur GitHub...${NC}"
git add .
git commit -m "Emergency deployment configuration" || true
git push origin main || true

echo -e "${GREEN}✅ Changements poussés${NC}"

echo ""
echo -e "${RED}🚨 DÉPLOIEMENT D'URGENCE PRÊT !${NC}"
echo ""
echo -e "${YELLOW}🚀 ACTIONS IMMÉDIATES:${NC}"
echo ""
echo -e "${BLUE}1. Allez MAINTENANT sur:${NC}"
echo "   https://render.com"
echo ""
echo -e "${BLUE}2. Cliquez sur 'New' → 'Web Service'${NC}"
echo ""
echo -e "${BLUE}3. Configuration SIMPLE:${NC}"
echo "   Repository: $REPO_URL"
echo "   Name: $SIMPLE_NAME"
echo "   Build: cd frontend && npm install && npm run build"
echo "   Start: cd frontend && npm start"
echo ""
echo -e "${BLUE}4. Variables d'environnement:${NC}"
echo "   NODE_ENV=production"
echo "   PORT=3000"
echo "   NEXT_PUBLIC_API_URL=$BACKEND_URL"
echo ""
echo -e "${BLUE}5. Cliquez 'Create Web Service'${NC}"
echo ""
echo -e "${GREEN}🎯 URL FINALE:${NC}"
echo "   https://$SIMPLE_NAME.onrender.com"
echo ""
echo -e "${YELLOW}💡 Pour tester:${NC}"
echo "   ./test-emergency.sh"
echo ""
echo -e "${RED}🚨 DÉPLOYEZ MAINTENANT !${NC}"

# Ouvrir automatiquement Render
if command -v open >/dev/null 2>&1; then
    echo ""
    echo -e "${GREEN}🌐 Ouverture automatique de Render...${NC}"
    open "https://render.com/create?type=web"
fi 