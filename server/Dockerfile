# === 🚀 WILL FINANCE 5.0 PRO - ENTERPRISE BACKEND DOCKERFILE === #
# Multi-stage Docker build para máxima otimização e segurança enterprise

# === STAGE 1: BUILD ENVIRONMENT === #
FROM node:20-alpine AS builder

# Install build dependencies + security tools
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl \
    bash \
    git \
    openssh-client \
    ca-certificates

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client with optimizations
RUN npx prisma generate --no-engine

# Build TypeScript to JavaScript with full optimization
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --production

# === STAGE 2: PRODUCTION ENVIRONMENT === #
FROM node:20-alpine AS production

# Install production system dependencies + security
RUN apk add --no-cache \
    dumb-init \
    curl \
    bash \
    tzdata \
    tini && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Copy startup scripts
COPY --chown=nestjs:nodejs scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create logs directory
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app/logs

# Environment variables for production
ENV NODE_ENV=production
ENV PORT=3001
ENV TZ=America/Sao_Paulo

# Security: Switch to non-root user
USER nestjs

# Health check with retry logic
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:3001/health || \
        curl -f http://localhost:3001/api/health || \
        curl -f http://localhost:3001 || exit 1

# Expose port
EXPOSE 3001

# Use dumb-init as PID 1 for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application with proper startup script
CMD ["docker-entrypoint.sh"]
