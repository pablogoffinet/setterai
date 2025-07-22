# Dockerfile optimisé pour Render
# Multi-stage build pour réduire la taille de l'image finale

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration du backend
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

# Installer les dépendances
WORKDIR /app/backend
RUN npm install

# Copier le code source du backend
COPY backend/src ./src/
COPY backend/prisma ./prisma/

# Générer Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Installer dumb-init et les dépendances OpenSSL pour Prisma
RUN apk add --no-cache dumb-init openssl1.1-compat

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copier les fichiers de production
COPY --from=builder --chown=nodejs:nodejs /app/backend/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/backend/dist ./dist/
COPY --from=builder --chown=nodejs:nodejs /app/backend/prisma ./prisma/
COPY --from=builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules/

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Exposer le port
EXPOSE 3000

# Utiliser l'utilisateur non-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Démarrer l'application avec dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"] 