#!/bin/bash

# 🔍 Monitoring en Temps Réel - LinkedIn Prospector
# Surveille le déploiement du frontend en temps réel

set -e

echo "🔍 Monitoring en Temps Réel - LinkedIn Prospector"
echo "================================================"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
BACKEND_URL="https://setterai-729q.onrender.com"

echo -e "${BLUE}🎯 URLs surveillées:${NC}"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend: $BACKEND_URL"
echo ""

echo -e "${YELLOW}🔍 Démarrage du monitoring...${NC}"
echo "   Appuyez sur Ctrl+C pour arrêter"
echo ""

# Compteur de tentatives
ATTEMPT=1
MAX_ATTEMPTS=60  # 30 minutes max

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo -e "${BLUE}📊 Tentative $ATTEMPT/$MAX_ATTEMPTS - $(date '+%H:%M:%S')${NC}"
    
    # Test du backend
    BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
    if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
        echo -e "${RED}❌ Backend: Non accessible${NC}"
    else
        echo -e "${GREEN}✅ Backend: Fonctionnel${NC}"
    fi
    
    # Test du frontend
    FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
    if [[ "$FRONTEND_RESPONSE" == "ERROR" || "$FRONTEND_RESPONSE" == "Not Found" ]]; then
        echo -e "${YELLOW}⏳ Frontend: Déploiement en cours...${NC}"
    else
        echo -e "${GREEN}🎉 Frontend: DÉPLOYÉ AVEC SUCCÈS !${NC}"
        echo ""
        echo -e "${GREEN}🌐 Votre interface web est maintenant accessible !${NC}"
        echo "   URL: $FRONTEND_URL"
        echo ""
        echo -e "${BLUE}🔧 Test de connexion:${NC}"
        echo "   curl $FRONTEND_URL"
        echo ""
        echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
        exit 0
    fi
    
    echo ""
    
    # Attendre 30 secondes avant la prochaine vérification
    sleep 30
    ATTEMPT=$((ATTEMPT + 1))
done

echo -e "${RED}⏰ Timeout: Déploiement non terminé après 30 minutes${NC}"
echo ""
echo -e "${YELLOW}💡 Suggestions:${NC}"
echo "   1. Vérifiez les logs sur Render.com"
echo "   2. Relancez le déploiement si nécessaire"
echo "   3. Contactez le support Render si le problème persiste"
echo "" 