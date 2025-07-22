#!/bin/bash

# 🚀 Déploiement Direct via API Render
# Déploie automatiquement le frontend sans intervention manuelle

set -e

echo "🚀 Déploiement Direct via API Render"
echo "==================================="

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

echo -e "${BLUE}🔍 Vérification des prérequis...${NC}"

# Vérifier si RENDER_API_TOKEN est défini
if [ -z "$RENDER_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  RENDER_API_TOKEN non défini${NC}"
    echo ""
    echo -e "${BLUE}🔑 Pour déployer automatiquement:${NC}"
    echo "   1. Allez sur https://render.com/account/api-keys"
    echo "   2. Créez un nouveau token API"
    echo "   3. Exécutez: export RENDER_API_TOKEN='votre_token'"
    echo "   4. Relancez ce script"
    echo ""
    echo -e "${YELLOW}💡 Ou utilisez le déploiement manuel:${NC}"
    echo "   ./deploy-frontend-now.sh"
    exit 1
fi

echo -e "${GREEN}✅ Token API Render détecté${NC}"

# Vérifier le backend
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend non accessible${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend fonctionnel${NC}"
fi

echo -e "${YELLOW}🚀 Déploiement automatique en cours...${NC}"

# Créer le service web via API
echo -e "${BLUE}📁 Création du service web...${NC}"

SERVICE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$FRONTEND_NAME\",
    \"type\": \"web_service\",
    \"env\": \"node\",
    \"plan\": \"starter\",
    \"region\": \"oregon\",
    \"repo\": \"$REPO_URL\",
    \"branch\": \"main\",
    \"buildCommand\": \"cd frontend && npm install && npm run build\",
    \"startCommand\": \"cd frontend && npm start\",
    \"healthCheckPath\": \"/\",
    \"envVars\": [
      {
        \"key\": \"NODE_ENV\",
        \"value\": \"production\"
      },
      {
        \"key\": \"PORT\",
        \"value\": \"3000\"
      },
      {
        \"key\": \"NEXT_PUBLIC_API_URL\",
        \"value\": \"$BACKEND_URL\"
      }
    ]
  }" \
  "https://api.render.com/v1/services" || echo "ERROR")

if [[ "$SERVICE_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Erreur lors de la création du service${NC}"
    echo -e "${YELLOW}💡 Vérifiez votre token API et les permissions${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Service créé avec succès${NC}"

# Extraire l'ID du service
SERVICE_ID=$(echo "$SERVICE_RESPONSE" | jq -r '.id' 2>/dev/null || echo "ERROR")

if [[ "$SERVICE_ID" == "ERROR" || "$SERVICE_ID" == "null" ]]; then
    echo -e "${RED}❌ Impossible d'extraire l'ID du service${NC}"
    echo "Response: $SERVICE_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ ID du service: $SERVICE_ID${NC}"

# Déployer le service
echo -e "${YELLOW}🚀 Déploiement du service...${NC}"

DEPLOY_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.render.com/v1/services/$SERVICE_ID/deploys" || echo "ERROR")

if [[ "$DEPLOY_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Déploiement lancé avec succès${NC}"

# Attendre et vérifier le statut
echo -e "${YELLOW}⏳ Attente du déploiement...${NC}"

for i in {1..30}; do
    STATUS_RESPONSE=$(curl -s \
      -H "Authorization: Bearer $RENDER_API_TOKEN" \
      "https://api.render.com/v1/services/$SERVICE_ID" || echo "ERROR")
    
    STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.service.status' 2>/dev/null || echo "ERROR")
    
    if [[ "$STATUS" == "live" ]]; then
        echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
        break
    elif [[ "$STATUS" == "failed" ]]; then
        echo -e "${RED}❌ Déploiement échoué${NC}"
        exit 1
    else
        echo -e "${YELLOW}⏳ Statut: $STATUS (tentative $i/30)${NC}"
        sleep 30
    fi
done

echo ""
echo -e "${GREEN}🎉 Déploiement automatique terminé !${NC}"
echo ""
echo -e "${BLUE}🌐 URLs de votre application:${NC}"
echo "   Backend API: $BACKEND_URL"
echo "   Frontend Web: https://$FRONTEND_NAME.onrender.com"
echo ""
echo -e "${BLUE}🔧 Test de connexion:${NC}"
echo "   curl $BACKEND_URL/health"
echo "   curl https://$FRONTEND_NAME.onrender.com"
echo ""

echo -e "${GREEN}✅ Votre interface web est maintenant accessible !${NC}" 