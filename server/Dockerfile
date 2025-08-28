# Stage 1: Build the application
FROM node:${NODE_VERSION}-alpine AS builder

# Build arguments for flexible configuration
ARG NODE_VERSION=20
ARG DEBIAN_VERSION=alpine
ARG USER_ID=1001
ARG GROUP_ID=1001

# Labels for metadata
LABEL maintainer="Will Finance Team" \
      version="6.0" \
      description="Will Finance 6.0 Backend - Enterprise Financial Management System" \
      org.opencontainers.image.source="https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0" \
      org.opencontainers.image.documentation="https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0/blob/main/README.md"

# Environment variables for optimized Node.js execution
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g ${GROUP_ID} appgroup && \
    adduser -S -u ${USER_ID} -G appgroup appuser \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Install system dependencies and create non-root user
RUN apk add --no-cache dumb-init git && \
    addgroup -g ${GROUP_ID} appgroup && \
    adduser -S -u ${USER_ID} -G appgroup appuser && \
    npm config set user ${USER_ID} && \
    npm config set unsafe-perm true

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --silent && npm cache clean --force

COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:${NODE_VERSION}-alpine AS production

# Environment variables for optimized Node.js execution
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g ${GROUP_ID} appgroup && \
    adduser -S -u ${USER_ID} -G appgroup appuser

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

EXPOSE 8080

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/main"]
