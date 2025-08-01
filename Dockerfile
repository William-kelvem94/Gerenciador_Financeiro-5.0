# Dockerfile unificado para Will Finance 5.0
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /app/client
COPY client/package.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force
COPY client/ ./
RUN rm -rf src/tests src/__tests__
RUN npm run build

FROM node:20-bookworm-slim AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma/
RUN npm install --legacy-peer-deps && npm cache clean --force
COPY server/ ./
RUN npm run build

FROM node:20-bookworm-slim AS production
WORKDIR /app
COPY --from=backend-builder /app/server/dist ./dist
COPY --from=backend-builder /app/server/node_modules ./node_modules
COPY --from=backend-builder /app/server/package.json ./package.json
COPY --from=backend-builder /app/server/prisma ./prisma
COPY --from=frontend-builder /app/client/dist ./public
RUN apt-get update && apt-get install -y dumb-init && apt-get clean && rm -rf /var/lib/apt/lists/*
EXPOSE 8080
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
