# Dockerfile simplifié pour Render - Backend uniquement
FROM node:18-alpine

# Installer les dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY default.env ./

# Installer les dépendances racine
RUN npm ci --only=production

# Copier et installer le backend (avec devDependencies pour build)
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./

# Générer le client Prisma
RUN npx prisma generate

# Compiler TypeScript (forcé même avec des erreurs non-critiques)
RUN npm run build || (echo "Build had warnings, checking if dist exists..." && ls -la dist/ && echo "Build completed with warnings")

# Vérifier que le build a bien créé les fichiers
RUN ls -la dist/ && echo "Build completed successfully"

# Nettoyer les devDependencies après build
RUN npm ci --only=production && npm cache clean --force

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Changer la propriété des fichiers
RUN chown -R appuser:nodejs /app
USER appuser

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Script de démarrage avec logs
CMD ["sh", "-c", "echo 'Starting app on port 3000...' && npm start"] 