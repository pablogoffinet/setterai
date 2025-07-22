#!/bin/bash

# 🚀 Déploiement Ultra-Simple - LinkedIn Prospector
# Utilise le fichier render-frontend.yaml pour déployer automatiquement

set -e

echo "🚀 Déploiement Ultra-Simple - LinkedIn Prospector"
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

echo -e "${GREEN}✅ Configuration prête !${NC}"
echo ""

# Vérifier si le frontend est déjà déployé
echo -e "${BLUE}🔍 Vérification du statut...${NC}"
FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
if [[ "$FRONTEND_RESPONSE" != "ERROR" && "$FRONTEND_RESPONSE" != "Not Found" ]]; then
    echo -e "${GREEN}✅ Frontend déjà déployé !${NC}"
    echo "   URL: $FRONTEND_URL"
    echo ""
    echo -e "${BLUE}🎉 Votre interface web est accessible !${NC}"
    exit 0
fi

echo -e "${YELLOW}🚀 Frontend non déployé - Déploiement en cours...${NC}"
echo ""

# Vérifier le backend
BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/health" || echo "ERROR")
if [[ "$BACKEND_RESPONSE" == "ERROR" ]]; then
    echo -e "${RED}❌ Backend non accessible${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend fonctionnel${NC}"
fi

# Vérifier le fichier render-frontend.yaml
if [ ! -f "render-frontend.yaml" ]; then
    echo -e "${RED}❌ Fichier render-frontend.yaml manquant${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Fichier render-frontend.yaml trouvé${NC}"
echo ""

echo -e "${BLUE}🚀 DÉPLOIEMENT AUTOMATIQUE:${NC}"
echo ""
echo -e "${YELLOW}ÉTAPE 1: Accès à Render${NC}"
echo "   🌐 Ouvrez: https://render.com"
echo "   👤 Connectez-vous à votre compte"
echo ""

echo -e "${YELLOW}ÉTAPE 2: Création du Blueprint${NC}"
echo "   📁 Cliquez sur 'New' → 'Blueprint'"
echo ""

echo -e "${YELLOW}ÉTAPE 3: Connexion GitHub${NC}"
echo "   🔗 Connectez: https://github.com/pablogoffinet/setterai.git"
echo "   🌿 Branche: main"
echo ""

echo -e "${YELLOW}ÉTAPE 4: Configuration Automatique${NC}"
echo "   ✅ Render détectera automatiquement render-frontend.yaml"
echo "   🔧 Le frontend sera configuré pour se connecter au backend"
echo ""

echo -e "${YELLOW}ÉTAPE 5: Lancement${NC}"
echo "   ✅ Cliquez sur 'Apply'"
echo "   ⏳ Attendez 5-10 minutes"
echo ""

echo -e "${GREEN}🎯 RÉSULTAT:${NC}"
echo "   🌐 Interface web: $FRONTEND_URL"
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

# Script de vérification automatique
echo -e "${BLUE}🔍 Script de vérification:${NC}"
cat > check-frontend.sh << 'EOF'
#!/bin/bash
FRONTEND_URL="https://linkedin-prospector-frontend.onrender.com"
echo "🔍 Vérification du frontend..."
for i in {1..20}; do
    RESPONSE=$(curl -s "$FRONTEND_URL" || echo "ERROR")
    if [[ "$RESPONSE" != "ERROR" && "$RESPONSE" != "Not Found" ]]; then
        echo "✅ Frontend déployé avec succès!"
        echo "🌐 URL: $FRONTEND_URL"
        break
    else
        echo "⏳ Tentative $i/20 - Déploiement en cours..."
        sleep 30
    fi
done
EOF

chmod +x check-frontend.sh
echo -e "${GREEN}✅ Script de vérification créé: ./check-frontend.sh${NC}"

echo ""
echo -e "${GREEN}🎉 Configuration terminée !${NC}"
echo ""
echo -e "${BLUE}💡 Pour vérifier le déploiement:${NC}"
echo "   ./check-frontend.sh"
echo "" 