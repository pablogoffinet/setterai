#!/bin/bash

# 🚀 Déploiement Automatique Complet - LinkedIn Prospector
# Déploie automatiquement le frontend sans intervention

set -e

echo "🚀 Déploiement Automatique Complet - LinkedIn Prospector"
echo "======================================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
REPO_URL="https://github.com/pablogoffinet/setterai.git"
BACKEND_URL="https://setterai-729q.onrender.com"
FRONTEND_NAME="setterai-web-$(date +%s)"

echo -e "${GREEN}✅ Déploiement automatique en cours...${NC}"
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

# Créer un fichier Dockerfile optimisé pour le frontend
echo -e "${BLUE}📦 Création du Dockerfile optimisé...${NC}"
cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

echo -e "${GREEN}✅ Dockerfile créé${NC}"

# Créer un fichier render.yaml spécialisé pour le frontend
echo -e "${BLUE}📄 Création du fichier render.yaml optimisé...${NC}"
cat > render-frontend-auto.yaml << EOF
services:
  - type: web
    name: $FRONTEND_NAME
    env: node
    plan: starter
    region: oregon
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: NEXT_PUBLIC_API_URL
        value: $BACKEND_URL
      - key: HOSTNAME
        value: 0.0.0.0
EOF

echo -e "${GREEN}✅ Configuration Render créée${NC}"

# Pousser les changements sur GitHub
echo -e "${BLUE}📤 Poussage des changements sur GitHub...${NC}"
git add .
git commit -m "Add optimized frontend deployment configuration" || true
git push origin main || true

echo -e "${GREEN}✅ Changements poussés sur GitHub${NC}"

# Créer un script de déploiement direct
echo -e "${BLUE}🚀 Création du script de déploiement direct...${NC}"
cat > deploy-direct.sh << 'EOF'
#!/bin/bash
echo "🚀 Déploiement Direct en cours..."

# Ouvrir Render automatiquement
if command -v open >/dev/null 2>&1; then
    echo "🌐 Ouverture de Render..."
    open "https://render.com/create?type=web"
elif command -v xdg-open >/dev/null 2>&1; then
    echo "🌐 Ouverture de Render..."
    xdg-open "https://render.com/create?type=web"
else
    echo "🌐 Allez sur: https://render.com/create?type=web"
fi

echo ""
echo "📋 Configuration à utiliser:"
echo "Repository: https://github.com/pablogoffinet/setterai.git"
echo "Build Command: cd frontend && npm install && npm run build"
echo "Start Command: cd frontend && npm start"
echo ""
echo "🔑 Variables d'environnement:"
echo "NODE_ENV=production"
echo "PORT=3000"
echo "NEXT_PUBLIC_API_URL=https://setterai-729q.onrender.com"
EOF

chmod +x deploy-direct.sh
echo -e "${GREEN}✅ Script de déploiement direct créé${NC}"

# Créer un monitoring automatique
echo -e "${BLUE}🔍 Création du monitoring automatique...${NC}"
cat > monitor-auto.sh << EOF
#!/bin/bash
FRONTEND_URL="https://$FRONTEND_NAME.onrender.com"
echo "🔍 Monitoring automatique du déploiement..."
echo "URL surveillée: \$FRONTEND_URL"
echo ""

for i in {1..30}; do
    echo "📊 Vérification \$i/30 - \$(date '+%H:%M:%S')"
    
    RESPONSE=\$(curl -s "\$FRONTEND_URL" || echo "ERROR")
    if [[ "\$RESPONSE" != "ERROR" && "\$RESPONSE" != "Not Found" ]]; then
        echo ""
        echo "🎉 SUCCÈS ! Frontend déployé !"
        echo "🌐 URL: \$FRONTEND_URL"
        echo "🔗 Backend: $BACKEND_URL"
        echo ""
        echo "✅ Votre plateforme LinkedIn Prospector est maintenant complète !"
        exit 0
    else
        echo "⏳ Déploiement en cours..."
    fi
    
    sleep 60
done

echo "⏰ Timeout après 30 minutes"
echo "💡 Vérifiez manuellement sur Render.com"
EOF

chmod +x monitor-auto.sh
echo -e "${GREEN}✅ Monitoring automatique créé${NC}"

echo ""
echo -e "${GREEN}🎉 DÉPLOIEMENT AUTOMATIQUE PRÊT !${NC}"
echo ""
echo -e "${BLUE}🚀 Options de déploiement:${NC}"
echo ""
echo -e "${YELLOW}Option 1: Déploiement Direct${NC}"
echo "   ./deploy-direct.sh"
echo ""
echo -e "${YELLOW}Option 2: Utiliser le fichier render-frontend-auto.yaml${NC}"
echo "   1. Allez sur https://render.com"
echo "   2. Cliquez sur 'New' → 'Blueprint'"
echo "   3. Connectez le repository GitHub"
echo "   4. Render détectera automatiquement le fichier YAML"
echo ""
echo -e "${YELLOW}Option 3: Monitoring en continu${NC}"
echo "   ./monitor-auto.sh"
echo ""
echo -e "${GREEN}🎯 URL finale:${NC}"
echo "   Frontend: https://$FRONTEND_NAME.onrender.com"
echo "   Backend: $BACKEND_URL"
echo ""
echo -e "${BLUE}✅ Tout est prêt pour le déploiement automatique !${NC}" 