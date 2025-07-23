#!/bin/bash

# ⚡ Test Rapide - LinkedIn Prospector
# Vérifie rapidement l'état de votre application

set -e

echo "⚡ Test Rapide - LinkedIn Prospector"
echo "==================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
BACKEND_URL="https://setterai-729q.onrender.com"

echo -e "${BLUE}🔍 Test rapide en cours...${NC}"
echo ""

# Test du backend
echo -e "${BLUE}1. Test du Backend API...${NC}"
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend: Non accessible${NC}"
    BACKEND_STATUS="❌"
else
    echo -e "${GREEN}✅ Backend: Fonctionnel${NC}"
    echo "   Response: $BACKEND_RESPONSE"
    BACKEND_STATUS="✅"
fi
echo ""

# Test du frontend
echo -e "${BLUE}2. Test du Frontend Web...${NC}"
FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
if [[ "$FRONTEND_RESPONSE" == "ERROR" || "$FRONTEND_RESPONSE" == "Not Found" ]]; then
    echo -e "${YELLOW}⏳ Frontend: Non déployé ou en cours de déploiement${NC}"
    FRONTEND_STATUS="⏳"
else
    echo -e "${GREEN}✅ Frontend: Accessible${NC}"
    FRONTEND_STATUS="✅"
fi
echo ""

# Résumé
echo -e "${BLUE}📊 Résumé:${NC}"
echo "   Backend API: $BACKEND_STATUS"
echo "   Frontend Web: $FRONTEND_STATUS"
echo ""

# Recommandations
if [[ "$BACKEND_STATUS" == "✅" && "$FRONTEND_STATUS" == "⏳" ]]; then
    echo -e "${YELLOW}💡 Le backend fonctionne, le frontend est en cours de déploiement${NC}"
    echo "   Attendez 5-10 minutes ou utilisez: ./monitor-deployment.sh"
elif [[ "$BACKEND_STATUS" == "✅" && "$FRONTEND_STATUS" == "✅" ]]; then
    echo -e "${GREEN}🎉 Tout fonctionne parfaitement !${NC}"
    echo "   Votre application est complètement déployée"
elif [[ "$BACKEND_STATUS" == "❌" ]]; then
    echo -e "${RED}⚠️  Le backend ne fonctionne pas${NC}"
    echo "   Vérifiez le déploiement du backend sur Render"
fi

echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "   Backend: $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo "" 