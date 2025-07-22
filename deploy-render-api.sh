#!/bin/bash

# 🚀 Déploiement Automatique via API Render
# Ce script déploie automatiquement le frontend via l'API Render

set -e

echo "🚀 Déploiement Automatique via API Render"
echo "========================================"

# Configuration
REPO_URL="https://github.com/pablogoffinet/setterai.git"
BACKEND_URL="https://setterai-729q.onrender.com"
FRONTEND_NAME="linkedin-prospector-frontend"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Repository: $REPO_URL"
echo "   Backend API: $BACKEND_URL"
echo "   Frontend Name: $FRONTEND_NAME"
echo ""

# Vérifier si RENDER_API_TOKEN est défini
if [ -z "$RENDER_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  RENDER_API_TOKEN non défini${NC}"
    echo ""
    echo -e "${BLUE}🔑 Pour déployer automatiquement, vous devez:${NC}"
    echo "   1. Aller sur https://render.com/account/api-keys"
    echo "   2. Créer un nouveau token API"
    echo "   3. Exporter la variable: export RENDER_API_TOKEN='votre_token'"
    echo ""
    echo -e "${YELLOW}💡 Ou utilisez le déploiement manuel:${NC}"
    echo "   ./deploy-frontend-auto.sh"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Token API Render détecté${NC}"
echo ""

# Vérifier la connexion au backend
echo -e "${BLUE}🔍 Test de connexion au backend...${NC}"
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend non accessible${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend connecté${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Déploiement automatique en cours...${NC}"

# Créer le blueprint via API Render
echo -e "${YELLOW}📁 Création du blueprint...${NC}"

BLUEPRINT_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"repository\": \"$REPO_URL\",
    \"name\": \"linkedin-prospector-full\",
    \"branch\": \"main\"
  }" \
  "https://api.render.com/v1/blueprints" || echo "ERROR")

if [[ "$BLUEPRINT_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Erreur lors de la création du blueprint${NC}"
    echo -e "${YELLOW}💡 Vérifiez votre token API et les permissions${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Blueprint créé avec succès${NC}"

# Extraire l'ID du blueprint
BLUEPRINT_ID=$(echo "$BLUEPRINT_RESPONSE" | jq -r '.id' 2>/dev/null || echo "ERROR")

if [[ "$BLUEPRINT_ID" == "ERROR" || "$BLUEPRINT_ID" == "null" ]]; then
    echo -e "${RED}❌ Impossible d'extraire l'ID du blueprint${NC}"
    echo "Response: $BLUEPRINT_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ ID du blueprint: $BLUEPRINT_ID${NC}"

# Déployer le blueprint
echo -e "${YELLOW}🚀 Déploiement du blueprint...${NC}"

DEPLOY_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.render.com/v1/blueprints/$BLUEPRINT_ID/deploy" || echo "ERROR")

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
      "https://api.render.com/v1/blueprints/$BLUEPRINT_ID" || echo "ERROR")
    
    STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status' 2>/dev/null || echo "ERROR")
    
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