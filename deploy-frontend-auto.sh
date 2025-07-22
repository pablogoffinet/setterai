#!/bin/bash

# 🚀 Script de Déploiement Automatique Frontend - LinkedIn Prospector
# Ce script déploie automatiquement le frontend sur Render

set -e

echo "🌐 Déploiement Automatique Frontend - LinkedIn Prospector"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/pablogoffinet/setterai.git"
BACKEND_URL="https://setterai-729q.onrender.com"
FRONTEND_NAME="linkedin-prospector-frontend"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Repository: $REPO_URL"
echo "   Backend API: $BACKEND_URL"
echo "   Frontend Name: $FRONTEND_NAME"
echo ""

# Vérifier si curl est installé
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl n'est pas installé. Veuillez l'installer.${NC}"
    exit 1
fi

# Vérifier si jq est installé
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq n'est pas installé. Installation...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install jq
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y jq
    else
        echo -e "${RED}❌ Impossible d'installer jq automatiquement. Veuillez l'installer manuellement.${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}🔍 Vérification du backend...${NC}"

# Tester la connexion au backend
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Impossible de se connecter au backend: $BACKEND_URL${NC}"
    echo -e "${YELLOW}💡 Vérifiez que le backend est déployé et fonctionnel${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend connecté avec succès${NC}"
    echo "   Response: $BACKEND_RESPONSE"
fi

echo ""
echo -e "${BLUE}🚀 Instructions de déploiement automatique:${NC}"
echo ""

echo -e "${YELLOW}1. 🌐 Accédez à Render.com${NC}"
echo "   Ouvrez: https://render.com"
echo ""

echo -e "${YELLOW}2. 📁 Créez un nouveau Blueprint${NC}"
echo "   - Cliquez sur 'New' → 'Blueprint'"
echo "   - Connectez votre repository GitHub: $REPO_URL"
echo ""

echo -e "${YELLOW}3. 🔧 Configuration automatique${NC}"
echo "   Render détectera automatiquement le fichier render.yaml"
echo "   Le frontend sera configuré pour se connecter à: $BACKEND_URL"
echo ""

echo -e "${YELLOW}4. ✅ Lancement du déploiement${NC}"
echo "   - Cliquez sur 'Apply'"
echo "   - Attendez 5-10 minutes"
echo ""

echo -e "${BLUE}🎯 URLs après déploiement:${NC}"
echo "   Backend API: $BACKEND_URL"
echo "   Frontend Web: https://$FRONTEND_NAME.onrender.com"
echo ""

echo -e "${BLUE}🔧 Variables d'environnement automatiques:${NC}"
echo "   NODE_ENV=production"
echo "   PORT=3000"
echo "   NEXT_PUBLIC_API_URL=$BACKEND_URL"
echo ""

echo -e "${GREEN}✅ Configuration prête pour le déploiement automatique !${NC}"
echo ""
echo -e "${BLUE}📝 Prochaines étapes:${NC}"
echo "   1. Allez sur https://render.com"
echo "   2. Créez un nouveau Blueprint"
echo "   3. Connectez le repository GitHub"
echo "   4. Cliquez sur 'Apply'"
echo "   5. Attendez le déploiement"
echo ""
echo -e "${GREEN}🎉 Votre interface web sera accessible sur: https://$FRONTEND_NAME.onrender.com${NC}"

# Test de la configuration render.yaml
echo ""
echo -e "${BLUE}🔍 Vérification de la configuration...${NC}"
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ Fichier render.yaml trouvé${NC}"
    
    # Vérifier que l'URL du backend est correcte
    if grep -q "$BACKEND_URL" render.yaml; then
        echo -e "${GREEN}✅ URL du backend configurée correctement${NC}"
    else
        echo -e "${RED}❌ URL du backend non trouvée dans render.yaml${NC}"
    fi
    
    # Vérifier la configuration du frontend
    if grep -q "linkedin-prospector-frontend" render.yaml; then
        echo -e "${GREEN}✅ Configuration frontend trouvée${NC}"
    else
        echo -e "${RED}❌ Configuration frontend manquante${NC}"
    fi
else
    echo -e "${RED}❌ Fichier render.yaml manquant${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Prêt pour le déploiement automatique !${NC}" 