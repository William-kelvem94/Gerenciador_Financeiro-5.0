# === 🏗️ WILL FINANCE 6.0 - CLIENT DOCKERFILE ENTERPRISE === #
# Multi-stage build optimized for production deployment
# Following security best practices and performance optimization

# === BUILD STAGE === #
FROM node:20-alpine AS builder

WORKDIR /app

# Install required packages in a single RUN layer for efficiency
RUN apk --no-cache add \
    curl \
    dumb-init \
    git \
    && apk upgrade --no-cache

# Copy package files and build configuration for optimal Docker layer caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY *.config.* ./

# Install dependencies with clean cache in one step
RUN npm ci --legacy-peer-deps --silent && \
    npm cache clean --force

# Copy source files (separate layer for better caching)
COPY src ./src
COPY public ./public
COPY index.html .

# Build the application for production with optimizations
RUN npm run build && \
    npm run build:analyze

# === PRODUCTION STAGE === #
FROM nginx:1.25-alpine AS production

# Metadata for enterprise tracking
LABEL maintainer="Will Finance Team <team@willfinance.com>" \
      version="6.0.0" \
      description="Will Finance 6.0 Client - Enterprise Financial Management System" \
      org.opencontainers.image.source="https://github.com/willfinance/will-finance-5.0"

# Install required packages and security updates
RUN apk --no-cache add \
    curl \
    ca-certificates \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

# Copy optimized nginx configuration
COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY nginx/conf.d /etc/nginx/conf.d

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user and set secure permissions
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup \
        /var/cache/nginx \
        /var/run \
        /var/log/nginx \
        /usr/share/nginx/html \
        /etc/nginx/conf.d && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user for security
USER appuser

# Expose port 3000
EXPOSE 80

# Health check with improved configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -fsS --max-time 5 http://localhost:80/health || exit 1

# Start nginx with optimized configuration
CMD ["nginx", "-g", "daemon off;"]
