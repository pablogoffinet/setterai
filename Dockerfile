# Dockerfile minimal pour Render - Test basique
FROM node:18-alpine

WORKDIR /app

# Copier seulement le backend
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./

# Build
RUN npm run build

# Vérifier que le build a marché
RUN ls -la dist/

# Exposer le port
EXPOSE 3000

# Variables d'environnement de base
ENV NODE_ENV=production
ENV PORT=3000

# Démarrer l'application
CMD ["npm", "start"] 