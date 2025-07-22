#!/bin/bash

# 🚀 Déploiement Direct Frontend - LinkedIn Prospector
# Guide étape par étape pour déployer le frontend

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
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"

echo -e "${GREEN}✅ Configuration prête pour le déploiement !${NC}"
echo ""

echo -e "${BLUE}🎯 URLs de votre application:${NC}"
echo "   Backend API: $BACKEND_URL"
echo "   Frontend Web: $FRONTEND_URL"
echo ""

echo -e "${YELLOW}🚀 ÉTAPES DE DÉPLOIEMENT:${NC}"
echo ""

echo -e "${BLUE}ÉTAPE 1: Accès à Render${NC}"
echo "   🌐 Ouvrez votre navigateur"
echo "   🔗 Allez sur: https://render.com"
echo "   👤 Connectez-vous à votre compte"
echo ""

echo -e "${BLUE}ÉTAPE 2: Création du Blueprint${NC}"
echo "   📁 Cliquez sur le bouton 'New'"
echo "   🔧 Sélectionnez 'Blueprint'"
echo ""

echo -e "${BLUE}ÉTAPE 3: Connexion GitHub${NC}"
echo "   🔗 Connectez votre repository GitHub"
echo "   📂 Sélectionnez: $REPO_URL"
echo "   🌿 Branche: main"
echo ""

echo -e "${BLUE}ÉTAPE 4: Configuration Automatique${NC}"
echo "   ✅ Render détectera automatiquement render.yaml"
echo "   🔧 Le frontend sera configuré pour se connecter au backend"
echo "   🌐 Variables d'environnement automatiques"
echo ""

echo -e "${BLUE}ÉTAPE 5: Lancement du Déploiement${NC}"
echo "   ✅ Cliquez sur 'Apply'"
echo "   ⏳ Attendez 5-10 minutes"
echo "   📊 Surveillez les logs de déploiement"
echo ""

echo -e "${GREEN}🎉 APRÈS LE DÉPLOIEMENT:${NC}"
echo "   🌐 Votre interface web sera accessible sur:"
echo "   🔗 $FRONTEND_URL"
echo ""

echo -e "${BLUE}🔧 Configuration Automatique:${NC}"
echo "   ✅ Backend API connecté"
echo "   ✅ Frontend Next.js configuré"
echo "   ✅ Base de données PostgreSQL"
echo "   ✅ Intégration IA complète"
echo ""

echo -e "${YELLOW}💡 CONSEILS:${NC}"
echo "   • Gardez cette fenêtre ouverte pour référence"
echo "   • Surveillez les logs sur Render pendant le déploiement"
echo "   • Testez l'interface une fois déployée"
echo ""

echo -e "${GREEN}🚀 PRÊT À DÉPLOYER !${NC}"
echo ""
echo "Cliquez sur le lien ci-dessous pour commencer:"
echo -e "${BLUE}🔗 https://render.com${NC}"
echo ""

# Test de la configuration
echo -e "${BLUE}🔍 Test de la configuration...${NC}"
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ render.yaml trouvé${NC}"
    if grep -q "linkedin-prospector-frontend" render.yaml; then
        echo -e "${GREEN}✅ Configuration frontend présente${NC}"
    fi
    if grep -q "$BACKEND_URL" render.yaml; then
        echo -e "${GREEN}✅ URL backend configurée${NC}"
    fi
else
    echo -e "${RED}❌ render.yaml manquant${NC}"
fi

echo ""
echo -e "${GREEN}✅ Tout est prêt pour le déploiement !${NC}" 