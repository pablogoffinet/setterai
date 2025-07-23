#!/bin/bash

# 🚀 Déploiement Direct Frontend - LinkedIn Prospector
# Déploie le frontend directement sur Render

set -e

echo "🚀 Déploiement Direct Frontend - LinkedIn Prospector"
echo "==================================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
REPO_URL="https://github.com/pablogoffinet/setterai.git"
BACKEND_URL="https://setterai-729q.onrender.com"
FRONTEND_NAME="linkedin-prospector-frontend"

echo -e "${GREEN}✅ Configuration prête !${NC}"
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

echo ""
echo -e "${BLUE}🚀 DÉPLOIEMENT DIRECT:${NC}"
echo ""
echo -e "${YELLOW}ÉTAPE 1: Accès à Render${NC}"
echo "   🌐 Ouvrez: https://render.com"
echo "   👤 Connectez-vous à votre compte"
echo ""

echo -e "${YELLOW}ÉTAPE 2: Création du Service Web${NC}"
echo "   📁 Cliquez sur 'New' → 'Web Service'"
echo ""

echo -e "${YELLOW}ÉTAPE 3: Connexion GitHub${NC}"
echo "   🔗 Connectez: $REPO_URL"
echo "   🌿 Branche: main"
echo ""

echo -e "${YELLOW}ÉTAPE 4: Configuration du Service${NC}"
echo "   📝 Nom: $FRONTEND_NAME"
echo "   🔧 Runtime: Node"
echo "   📦 Build Command: cd frontend && npm install && npm run build"
echo "   🚀 Start Command: cd frontend && npm start"
echo ""

echo -e "${YELLOW}ÉTAPE 5: Variables d'Environnement${NC}"
echo "   🔑 Ajoutez ces variables:"
echo "   - NODE_ENV = production"
echo "   - PORT = 3000"
echo "   - NEXT_PUBLIC_API_URL = $BACKEND_URL"
echo ""

echo -e "${YELLOW}ÉTAPE 6: Lancement${NC}"
echo "   ✅ Cliquez sur 'Create Web Service'"
echo "   ⏳ Attendez 5-10 minutes"
echo ""

echo -e "${GREEN}🎯 RÉSULTAT:${NC}"
echo "   🌐 Interface web: https://$FRONTEND_NAME.onrender.com"
echo "   🔗 API Backend: $BACKEND_URL"
echo ""

echo -e "${BLUE}🔧 Configuration automatique:${NC}"
echo "   ✅ Next.js 15.4.1"
echo "   ✅ Tailwind CSS"
echo "   ✅ Connexion API backend"
echo "   ✅ Variables d'environnement"
echo ""

echo -e "${GREEN}🚀 PRÊT À DÉPLOYER !${NC}"
echo ""
echo "Cliquez sur le lien ci-dessous:"
echo -e "${BLUE}🔗 https://render.com${NC}"
echo ""

# Créer un script de vérification rapide
echo -e "${BLUE}🔍 Script de vérification:${NC}"
cat > check-frontend-quick.sh << 'EOF'
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
EOF

chmod +x check-frontend-quick.sh
echo -e "${GREEN}✅ Script de vérification créé: ./check-frontend-quick.sh${NC}"

echo ""
echo -e "${GREEN}🎉 Instructions de déploiement prêtes !${NC}"
echo ""
echo -e "${BLUE}💡 Pour vérifier le déploiement:${NC}"
echo "   ./check-frontend-quick.sh"
echo "" 