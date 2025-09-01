# === 🏗️ WILL FINANCE 5.0 - FRONTEND DOCKERFILE ENTERPRISE === #
# Multi-stage production-ready React/Vite container

# Stage 1: Build application
FROM node:20-alpine AS builder

# Build arguments
ARG VITE_API_URL=http://localhost:3001
ARG VITE_APP_NAME="Will Finance 5.0"
ARG VITE_APP_VERSION="5.0.0"

# Metadata
LABEL maintainer="Will Finance Team" \
      version="5.0" \
      description="Will Finance 5.0 Frontend - Enterprise Financial Management System"

WORKDIR /app

# Install system dependencies
RUN apk --no-cache add \
    curl \
    git \
    && apk upgrade --no-cache

# Copy package files for better caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY *.config.* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set build environment variables
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV NODE_ENV=production

# Build application
RUN npm run build

# Stage 2: Production runtime with Nginx
FROM nginx:1.25-alpine AS production

# Install additional packages for production
RUN apk --no-cache add \
    curl \
    bash \
    tini

# Create nginx user and directories
RUN mkdir -p /var/www/html && \
    chown -R nginx:nginx /var/www/html && \
    mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Copy built application
COPY --from=builder /app/dist /var/www/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create custom nginx config for SPA
RUN echo 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /var/www/html;\n\
    index index.html;\n\
    \n\
    # Security headers\n\
    add_header X-Frame-Options "SAMEORIGIN" always;\n\
    add_header X-Content-Type-Options "nosniff" always;\n\
    add_header X-XSS-Protection "1; mode=block" always;\n\
    \n\
    # Handle SPA routing\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    # Static assets caching\n\
    location /assets {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    \n\
    # Health check\n\
    location /health {\n\
        access_log off;\n\
        return 200 "healthy\\n";\n\
        add_header Content-Type text/plain;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.bak

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Expose port
EXPOSE 80

# Use tini as init system
ENTRYPOINT ["tini", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
