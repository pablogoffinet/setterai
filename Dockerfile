# Dockerfile optimisé pour Render - Version 1.0.1
FROM node:18-alpine AS base

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

# Stage pour le backend
FROM base AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage pour l'AI engine
FROM base AS ai-builder
WORKDIR /app/ai-engine
COPY ai-engine/package*.json ./
RUN npm ci
COPY ai-engine/ ./
RUN npm run build

# Stage pour le queue service
FROM base AS queue-builder
WORKDIR /app/queue-service
COPY queue-service/package*.json ./
RUN npm ci
COPY queue-service/ ./
RUN npm run build

# Stage de production
FROM node:18-alpine AS production

# Installer curl pour les health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copier les fichiers de configuration
COPY default.env ./
COPY package*.json ./

# Copier les builds depuis les stages précédents
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

COPY --from=ai-builder /app/ai-engine/dist ./ai-engine/dist
COPY --from=ai-builder /app/ai-engine/package*.json ./ai-engine/

COPY --from=queue-builder /app/queue-service/dist ./queue-service/dist
COPY --from=queue-builder /app/queue-service/package*.json ./queue-service/

# Réinstaller les dépendances en production
WORKDIR /app/backend
RUN npm ci --only=production

WORKDIR /app/ai-engine
RUN npm ci --only=production

WORKDIR /app/queue-service
RUN npm ci --only=production

WORKDIR /app

# Script de démarrage
COPY start.sh ./
RUN chmod +x start.sh

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Changer la propriété des fichiers
RUN chown -R appuser:nodejs /app
USER appuser

# Exposer le port principal (backend)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["./start.sh"] 