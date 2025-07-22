#!/bin/bash

# 🔧 Script de Diagnostic et Correction Frontend
# Résout les problèmes de déploiement du frontend

set -e

echo "🔧 Diagnostic et Correction Frontend - LinkedIn Prospector"
echo "========================================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="https://setterai-729q.onrender.com"
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
REPO_URL="https://github.com/pablogoffinet/setterai.git"

echo -e "${BLUE}🔍 Diagnostic en cours...${NC}"
echo ""

# Test 1: Backend API
echo -e "${BLUE}1. Test du Backend API...${NC}"
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend non accessible${NC}"
    echo "   URL: $BACKEND_URL"
else
    echo -e "${GREEN}✅ Backend fonctionnel${NC}"
    echo "   Response: $BACKEND_RESPONSE"
fi
echo ""

# Test 2: Frontend
echo -e "${BLUE}2. Test du Frontend...${NC}"
FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
if [[ "$FRONTEND_RESPONSE" == "ERROR" || "$FRONTEND_RESPONSE" == "Not Found" ]]; then
    echo -e "${RED}❌ Frontend non déployé ou inaccessible${NC}"
    echo "   URL: $FRONTEND_URL"
    echo -e "${YELLOW}💡 Le frontend doit être déployé sur Render${NC}"
else
    echo -e "${GREEN}✅ Frontend accessible${NC}"
fi
echo ""

# Test 3: Configuration render.yaml
echo -e "${BLUE}3. Vérification de la configuration...${NC}"
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ Fichier render.yaml trouvé${NC}"
    
    # Vérifier la configuration du frontend
    if grep -q "linkedin-prospector-frontend" render.yaml; then
        echo -e "${GREEN}✅ Configuration frontend présente${NC}"
    else
        echo -e "${RED}❌ Configuration frontend manquante${NC}"
    fi
    
    # Vérifier l'URL du backend
    if grep -q "$BACKEND_URL" render.yaml; then
        echo -e "${GREEN}✅ URL backend configurée${NC}"
    else
        echo -e "${RED}❌ URL backend non configurée${NC}"
    fi
else
    echo -e "${RED}❌ Fichier render.yaml manquant${NC}"
fi
echo ""

# Test 4: Fichiers frontend
echo -e "${BLUE}4. Vérification des fichiers frontend...${NC}"
if [ -d "frontend" ]; then
    echo -e "${GREEN}✅ Dossier frontend trouvé${NC}"
    
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✅ package.json trouvé${NC}"
    else
        echo -e "${RED}❌ package.json manquant${NC}"
    fi
    
    if [ -f "frontend/next.config.ts" ]; then
        echo -e "${GREEN}✅ next.config.ts trouvé${NC}"
    else
        echo -e "${RED}❌ next.config.ts manquant${NC}"
    fi
else
    echo -e "${RED}❌ Dossier frontend manquant${NC}"
fi
echo ""

# Diagnostic et solutions
echo -e "${BLUE}🔧 Solutions:${NC}"
echo ""

if [[ "$FRONTEND_RESPONSE" == "ERROR" || "$FRONTEND_RESPONSE" == "Not Found" ]]; then
    echo -e "${YELLOW}🚀 Le frontend n'est pas encore déployé.${NC}"
    echo ""
    echo -e "${BLUE}📋 Étapes pour déployer:${NC}"
    echo "   1. 🌐 Allez sur https://render.com"
    echo "   2. 📁 Cliquez sur 'New' → 'Blueprint'"
    echo "   3. 🔗 Connectez: $REPO_URL"
    echo "   4. ✅ Cliquez sur 'Apply'"
    echo "   5. ⏳ Attendez 5-10 minutes"
    echo ""
    echo -e "${GREEN}🎯 URLs après déploiement:${NC}"
    echo "   Backend: $BACKEND_URL"
    echo "   Frontend: $FRONTEND_URL"
    echo ""
    
    # Vérifier si le repository est à jour
    echo -e "${BLUE}📤 Vérification du repository GitHub...${NC}"
    if git remote -v | grep -q "github.com"; then
        echo -e "${GREEN}✅ Repository GitHub configuré${NC}"
        echo "   URL: $REPO_URL"
    else
        echo -e "${RED}❌ Repository GitHub non configuré${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Diagnostic terminé !${NC}"
echo ""
echo -e "${BLUE}💡 Prochaines étapes:${NC}"
echo "   1. Déployez le frontend sur Render"
echo "   2. Testez l'interface web"
echo "   3. Configurez les variables d'environnement si nécessaire"
echo "" 